const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const emailService = require('../services/emailService');
const crypto = require('crypto');

const router = express.Router();

// Create new order (Checkout)
router.post('/', [
  body('user.name').trim().notEmpty().withMessage('Name is required'),
  body('user.email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('user.phone').trim().notEmpty().withMessage('Phone is required'),
  body('user.address.street').trim().notEmpty().withMessage('Street address is required'),
  body('user.address.city').trim().notEmpty().withMessage('City is required'),
  body('user.address.state').trim().notEmpty().withMessage('State is required'),
  body('user.address.pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Valid quantity is required'),
  body('paymentMethod').isIn(['COD', 'UPI', 'CARD', 'NET_BANKING']).withMessage('Valid payment method is required'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Valid total amount is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { user, items, paymentMethod, totalAmount, deliveryInstructions } = req.body;

    // Validate products and check stock
    const validatedItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.product} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }

      const itemTotal = product.price * item.quantity;
      calculatedTotal += itemTotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
    }

    // Verify total amount
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Total amount mismatch'
      });
    }

    // Find or create user account
    let userAccount = await User.findOne({ email: user.email.toLowerCase() });
    let isNewUser = false;
    let temporaryPassword = null;

    if (!userAccount) {
      // Create new user account for guest checkout
      temporaryPassword = crypto.randomBytes(8).toString('hex'); // Generate random password
      userAccount = new User({
        email: user.email.toLowerCase(),
        name: user.name,
        password: temporaryPassword,
        role: 'user',
        authProvider: 'local',
        isVerified: false
      });
      await userAccount.save();
      isNewUser = true;
      console.log('Created new user account for:', user.email);
    }

    // Generate unique order ID
    const count = await Order.countDocuments();
    const orderId = `E_${Date.now()}_${String(count + 1).padStart(4, '0')}`;

    // Create order
    console.log('Creating order with data:', {
      orderId,
      userId: userAccount._id,
      user,
      items: validatedItems,
      totalAmount: calculatedTotal,
      paymentMethod,
      deliveryInstructions
    });
    
    const order = new Order({
      orderId,
      userId: userAccount._id,
      user,
      items: validatedItems,
      totalAmount: calculatedTotal,
      paymentMethod,
      deliveryInstructions,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    console.log('Order object created, attempting to save...');
    await order.save();
    console.log('Order saved successfully:', order.orderId);

    // Update product stock
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Generate PDF invoice
    // const invoicePath = await generateInvoice(order);

    // Send email notifications
    const emailResults = await emailService.sendOrderEmails(order, isNewUser ? temporaryPassword : null);
    console.log('Email sending results:', emailResults);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        order,
        invoiceUrl: `/api/orders/${order._id}/invoice`,
        emailNotifications: emailResults,
        accountCreated: isNewUser,
        accountDetails: isNewUser ? {
          email: user.email,
          message: 'A new account has been created for you. Check your email for login credentials.'
        } : null
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Get all orders (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, paymentMethod, page = 1, limit = 10 } = req.query;
    let query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.product', 'name price image');

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Get orders for logged-in user
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name price image');

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your orders'
    });
  }
});

// Test admin email notification endpoint (must come before /:id route)
router.get('/test-admin-email', async (req, res) => {
  try {
    // Create a test order object
    const testOrder = {
      orderId: 'TEST_ORDER_123',
      user: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '1234567890',
        address: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456',
          country: 'India'
        }
      },
      items: [
        {
          name: 'Test Product',
          quantity: 1,
          price: 299
        }
      ],
      totalAmount: 299,
      paymentMethod: 'COD',
      orderStatus: 'pending',
      deliveryInstructions: 'Test delivery instructions',
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };

    console.log('Sending test admin email to:', process.env.ADMIN_EMAIL || 'eroots2025@gmail.com');
    const result = await emailService.sendAdminOrderNotification(testOrder);
    
    res.json({
      success: true,
      message: 'Test admin email sent',
      result,
      adminEmail: 'eroots2025@gmail.com'
    });
  } catch (error) {
    console.error('Test admin email failed:', error);
    res.status(500).json({
      success: false,
      message: 'Test admin email failed',
      error: error.message
    });
  }
});

// Test email configuration endpoint (must come before /:id route)
router.get('/test-email', async (req, res) => {
  try {
    const result = await emailService.testEmailConfig();
    res.json({
      success: true,
      message: 'Email configuration test completed',
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email configuration test failed',
      error: error.message
    });
  }
});

// Get order by ID (with validation to ensure it's a valid ObjectId)
router.get('/:id', async (req, res) => {
  try {
    // Check if the ID is a valid MongoDB ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name price image description');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// Update order status (Admin only)
router.put('/:id/status', [
  adminAuth,
  body('orderStatus').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  body('paymentStatus').isIn(['pending', 'paid', 'failed', 'refunded']).optional(),
  body('trackingNumber').trim().optional(),
  body('notes').trim().optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Get the current order to track old status
    const currentOrder = await Order.findById(req.params.id);
    
    if (!currentOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const oldStatus = currentOrder.orderStatus;
    const newStatus = req.body.orderStatus;

    const updateData = { orderStatus: newStatus };
    
    if (req.body.paymentStatus) {
      updateData.paymentStatus = req.body.paymentStatus;
    }
    
    if (req.body.trackingNumber) {
      updateData.trackingNumber = req.body.trackingNumber;
    }
    
    if (req.body.notes) {
      updateData.notes = req.body.notes;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Send email notification to customer if status changed
    if (oldStatus !== newStatus) {
      console.log(`Order ${order.orderId}: Status changed from ${oldStatus} to ${newStatus}`);
      console.log('Sending status update email to:', order.user.email);
      
      try {
        const emailResult = await emailService.sendOrderStatusUpdate(order, oldStatus, newStatus);
        console.log('Status update email result:', emailResult);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// Download invoice
router.get('/:id/invoice', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name price image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('Generating invoice for order:', order.orderId);

    // Set response headers before generating
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderId}.pdf`);

    // Generate and stream PDF directly to response
    await generateInvoiceStream(order, res);
    
  } catch (error) {
    console.error('Error generating invoice:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate invoice',
        error: error.message
      });
    }
  }
});

// Helper function to stream PDF invoice directly to response
async function generateInvoiceStream(order, res) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margin: 50, 
        bufferPages: true,
        size: 'A4'
      });

      // Pipe the PDF directly to the response
      doc.pipe(res);

      // Header Section
      doc.fontSize(24)
         .font('Helvetica-Bold')
         .text('E_ROOTS TECHNOLOGY', 50, 50);
      
      doc.fontSize(18)
         .font('Helvetica-Bold')
         .text('INVOICE', 50, 85);
      
      // Add a line separator
      doc.moveTo(50, 110).lineTo(550, 110).stroke();

      // Order Information Section
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text('ORDER INFORMATION', 50, 130);
      
      let orderY = 150;
      doc.fontSize(10).font('Helvetica');
      
      doc.text(`Order ID: ${order.orderId}`, 50, orderY);
      orderY += 18;
      
      doc.text(`Order Date: ${order.createdAt.toLocaleDateString('en-IN')}`, 50, orderY);
      orderY += 18;
      
      doc.text(`Payment Method: ${order.paymentMethod}`, 50, orderY);
      orderY += 18;
      
      doc.text(`Order Status: ${order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}`, 50, orderY);

      // Customer Information Section
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text('BILL TO', 350, 130);
      
      let customerY = 150;
      doc.fontSize(10).font('Helvetica');
      
      doc.text(order.user.name, 350, customerY);
      customerY += 18;
      
      doc.text(order.user.email, 350, customerY);
      customerY += 18;
      
      doc.text(order.user.phone, 350, customerY);
      customerY += 18;
      
      doc.text(order.user.address.street, 350, customerY);
      customerY += 18;
      
      doc.text(`${order.user.address.city}, ${order.user.address.state}`, 350, customerY);
      customerY += 18;
      
      doc.text(order.user.address.pincode, 350, customerY);

      // Items Table Section - Position based on customer info height
      let yPosition = Math.max(260, customerY + 30);
      
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text('ORDER ITEMS', 50, yPosition);
      
      yPosition += 25;

      // Table Header
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Product Name', 50, yPosition)
         .text('Qty', 350, yPosition)
         .text('Unit Price', 400, yPosition)
         .text('Total', 480, yPosition);
      
      // Draw header line
      doc.moveTo(50, yPosition + 12).lineTo(530, yPosition + 12).stroke();
      yPosition += 20;

      // Items
      doc.fontSize(10).font('Helvetica');
      order.items.forEach(item => {
        // Product name with word wrapping
        doc.text(item.name, 50, yPosition, { 
          width: 280,
          align: 'left'
        });
        
        doc.text(item.quantity.toString(), 350, yPosition)
           .text(`₹${item.price}`, 400, yPosition)
           .text(`₹${item.price * item.quantity}`, 480, yPosition);
        
        yPosition += 20;
      });

      // Total Section
      yPosition += 10;
      doc.moveTo(50, yPosition).lineTo(530, yPosition).stroke();
      yPosition += 15;
      
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text(`TOTAL AMOUNT: ₹${order.totalAmount}`, 400, yPosition);

      // Footer Section
      yPosition += 50;
      doc.fontSize(10)
         .font('Helvetica')
         .text('Thank you for your business!', 50, yPosition)
         .text('For any queries or support, please contact us at:', 50, yPosition + 15)
         .text('eroots2025@gmail.com', 50, yPosition + 30);

      // Add company info at bottom
      doc.fontSize(8)
         .text('E_ROOTS TECHNOLOGY - Your trusted electronics partner', 50, yPosition + 50);

      // Finalize the PDF
      doc.end();

      doc.on('end', () => {
        console.log('Invoice PDF streamed successfully for order:', order.orderId);
        resolve();
      });

      doc.on('error', (err) => {
        console.error('Error generating PDF:', err);
        reject(err);
      });

    } catch (error) {
      console.error('Error in generateInvoiceStream:', error);
      reject(error);
    }
  });
}

module.exports = router;

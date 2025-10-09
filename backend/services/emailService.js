const nodemailer = require('nodemailer');

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'eroots2025@gmail.com',
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD,
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service error:', error);
  } else {
    console.log('Email service ready: Successfully connected to SMTP server');
  }
});

// Email templates
const emailTemplates = {
  adminOrderNotification: (order) => {
    const itemsList = order.items.map(item => 
      `<tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${item.price}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>`
    ).join('');

    return {
      subject: `🛒 New Order Received - ${order.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Order Notification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .order-info { background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px; }
            .customer-info { background: #e8f4f8; padding: 20px; border-radius: 6px; margin-bottom: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th { background: #667eea; color: white; padding: 12px; text-align: left; }
            .items-table td { padding: 8px; border: 1px solid #ddd; }
            .total { background: #667eea; color: white; padding: 15px; border-radius: 6px; text-align: center; font-size: 18px; font-weight: bold; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            .btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            .alert { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛒 New Order Received</h1>
              <p>Order ID: ${order.orderId}</p>
            </div>
            
            <div class="content">
              <div class="alert">
                <strong>📧 New Order Alert!</strong><br>
                A customer has just placed a new order on E_roots Technology website.
              </div>

              <div class="order-info">
                <h3 style="margin-top: 0; color: #667eea;">📋 Order Information</h3>
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                <p><strong>Order Status:</strong> <span style="color: #28a745; font-weight: bold;">${order.orderStatus.toUpperCase()}</span></p>
                <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}</p>
              </div>

              <div class="customer-info">
                <h3 style="margin-top: 0; color: #667eea;">👤 Customer Information</h3>
                <p><strong>Name:</strong> ${order.user.name}</p>
                <p><strong>Email:</strong> <a href="mailto:${order.user.email}">${order.user.email}</a></p>
                <p><strong>Phone:</strong> <a href="tel:${order.user.phone}">${order.user.phone}</a></p>
                <p><strong>Address:</strong><br>
                  ${order.user.address.street}<br>
                  ${order.user.address.city}, ${order.user.address.state}<br>
                  ${order.user.address.pincode}, ${order.user.address.country}
                </p>
                ${order.deliveryInstructions ? `<p><strong>Delivery Instructions:</strong> ${order.deliveryInstructions}</p>` : ''}
              </div>

              <h3 style="color: #667eea;">🛍️ Order Items (${order.items.length} items)</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>

              <div class="total">
                Total Amount: ₹${order.totalAmount.toLocaleString('en-IN')}
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.ADMIN_PANEL_URL || 'http://localhost:3000/admin'}" class="btn">View in Admin Panel</a>
                <a href="mailto:${order.user.email}" class="btn" style="background: #28a745;">Contact Customer</a>
              </div>
            </div>

            <div class="footer">
              <p>This is an automated notification from E_roots Technology Order Management System.</p>
              <p>Please log into the admin panel to manage this order.</p>
              <p style="margin-top: 15px; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} E_roots Technology. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  },

  customerOrderConfirmation: (order) => {
    const itemsList = order.items.map(item => 
      `<tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${item.price}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>`
    ).join('');

    return {
      subject: `✅ Order Confirmed - ${order.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .order-info { background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th { background: #28a745; color: white; padding: 12px; text-align: left; }
            .items-table td { padding: 8px; border: 1px solid #ddd; }
            .total { background: #28a745; color: white; padding: 15px; border-radius: 6px; text-align: center; font-size: 18px; font-weight: bold; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Order Confirmed!</h1>
              <p>Thank you for choosing E_roots Technology</p>
            </div>
            
            <div class="content">
              <div class="success">
                <strong>🎉 Your order has been successfully placed!</strong><br>
                We'll start processing your order and send you updates via email.
              </div>

              <div class="order-info">
                <h3 style="margin-top: 0; color: #28a745;">📋 Order Details</h3>
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}</p>
              </div>

              <h3 style="color: #28a745;">🛍️ Your Order Items</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>

              <div class="total">
                Total Amount: ₹${order.totalAmount.toLocaleString('en-IN')}
              </div>

              <div style="background: #e8f4f8; padding: 20px; border-radius: 6px; margin-top: 20px;">
                <h4 style="margin-top: 0; color: #28a745;">📧 What's Next?</h4>
                <ul style="margin-bottom: 0;">
                  <li>You'll receive order updates via email</li>
                  <li>We'll start processing your order within 24 hours</li>
                  <li>You'll get tracking information once your order ships</li>
                  <li>For any questions, contact us at eroots2025@gmail.com</li>
                </ul>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for choosing E_roots Technology!</p>
              <p style="margin-top: 15px; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} E_roots Technology. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  },

  accountCredentials: (email, password, orderInfo) => {
    return {
      subject: `🔐 Your Eroots Account Credentials - Order ${orderInfo.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Credentials</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .credentials-box { background: #f8f9fa; padding: 20px; border-radius: 6px; border: 2px solid #667eea; margin: 20px 0; }
            .credential-item { background: white; padding: 12px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #667eea; }
            .btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Eroots!</h1>
              <p>Your Account Has Been Created</p>
            </div>
            
            <div class="content">
              <p>Hi ${orderInfo.user.name},</p>
              
              <p>Thank you for your order <strong>${orderInfo.orderId}</strong>!</p>
              
              <p>We've automatically created an account for you so you can track your orders and manage your profile.</p>

              <div class="credentials-box">
                <h3 style="margin-top: 0; color: #667eea;">🔑 Your Login Credentials</h3>
                
                <div class="credential-item">
                  <strong>Email:</strong> ${email}
                </div>
                
                <div class="credential-item">
                  <strong>Temporary Password:</strong> <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 16px;">${password}</code>
                </div>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/my-orders" class="btn">View Your Orders</a>
              </div>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong><br>
                This is a temporary password. For your security, we recommend changing it after your first login.
                You can change your password in your account settings.
              </div>

              <div style="background: #e8f4f8; padding: 20px; border-radius: 6px; margin-top: 20px;">
                <h4 style="margin-top: 0; color: #667eea;">✨ With Your Account, You Can:</h4>
                <ul style="margin-bottom: 0;">
                  <li>Track your current orders in real-time</li>
                  <li>View your complete order history</li>
                  <li>Save delivery addresses for faster checkout</li>
                  <li>Manage your profile and preferences</li>
                  <li>Get exclusive updates and offers</li>
                </ul>
              </div>

              <p style="margin-top: 30px;">
                If you have any questions or need assistance, please don't hesitate to contact us at 
                <a href="mailto:eroots2025@gmail.com">eroots2025@gmail.com</a>
              </p>
            </div>

            <div class="footer">
              <p>Welcome to the Eroots Technology family!</p>
              <p style="margin-top: 15px; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} Eroots Technology. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  },

  orderStatusUpdate: (order, oldStatus, newStatus) => {
    const statusEmojis = {
      pending: '⏳',
      confirmed: '✅',
      processing: '📦',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };

    const statusMessages = {
      confirmed: 'Your order has been confirmed and will be processed soon.',
      processing: 'We are currently processing your order.',
      shipped: 'Great news! Your order has been shipped and is on its way to you.',
      delivered: 'Your order has been delivered successfully. Thank you for shopping with us!',
      cancelled: 'Your order has been cancelled. If you have any questions, please contact us.'
    };

    return {
      subject: `${statusEmojis[newStatus]} Order Status Update - ${order.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .status-card { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #667eea; }
            .status-change { display: flex; align-items: center; justify-content: center; gap: 15px; margin: 20px 0; }
            .status-badge { padding: 10px 20px; border-radius: 20px; font-weight: bold; text-transform: uppercase; font-size: 14px; }
            .status-old { background: #e0e0e0; color: #666; }
            .status-new { background: #667eea; color: white; }
            .arrow { font-size: 24px; color: #667eea; }
            .order-info { background: #e8f4f8; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #d0e8f0; }
            .info-row:last-child { border-bottom: none; }
            .info-label { color: #666; }
            .info-value { font-weight: bold; color: #333; }
            .btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            .tracking { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 Order Status Update</h1>
              <p>Your order status has been updated</p>
            </div>
            
            <div class="content">
              <p>Hi ${order.user.name},</p>
              
              <p>We wanted to let you know that your order status has been updated.</p>

              <div class="status-change">
                <span class="status-badge status-old">${oldStatus}</span>
                <span class="arrow">→</span>
                <span class="status-badge status-new">${newStatus}</span>
              </div>

              <div class="status-card">
                <h3 style="margin-top: 0; color: #667eea;">Current Status: ${statusEmojis[newStatus]} ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</h3>
                <p style="margin-bottom: 0;">${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
              </div>

              <div class="order-info">
                <h3 style="margin-top: 0; color: #667eea;">📋 Order Information</h3>
                <div class="info-row">
                  <span class="info-label">Order ID:</span>
                  <span class="info-value">${order.orderId}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Order Date:</span>
                  <span class="info-value">${new Date(order.createdAt).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Total Amount:</span>
                  <span class="info-value">₹${order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                ${order.trackingNumber ? `
                <div class="info-row">
                  <span class="info-label">Tracking Number:</span>
                  <span class="info-value">${order.trackingNumber}</span>
                </div>
                ` : ''}
                ${order.estimatedDelivery ? `
                <div class="info-row">
                  <span class="info-label">Estimated Delivery:</span>
                  <span class="info-value">${new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}</span>
                </div>
                ` : ''}
              </div>

              ${newStatus === 'shipped' && order.trackingNumber ? `
              <div class="tracking">
                <strong>📍 Track Your Order</strong><br>
                Your order has been shipped with tracking number: <strong>${order.trackingNumber}</strong><br>
                You can track your package using this number.
              </div>
              ` : ''}

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/my-orders" class="btn">View Order Details</a>
              </div>

              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                If you have any questions about your order, please don't hesitate to contact us at 
                <a href="mailto:eroots2025@gmail.com">eroots2025@gmail.com</a>
              </p>
            </div>

            <div class="footer">
              <p>Thank you for shopping with Eroots Technology!</p>
              <p style="margin-top: 15px; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} Eroots Technology. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }
};

// Email service functions
const emailService = {
  // Send admin notification for new order
  sendAdminOrderNotification: async (order) => {
    try {
      const adminEmail = 'eroots2025@gmail.com';
      const template = emailTemplates.adminOrderNotification(order);
      
      const mailOptions = {
        from: `"E_roots Technology" <${emailConfig.auth.user}>`,
        to: adminEmail,
        subject: template.subject,
        html: template.html,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Admin notification email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending admin notification email:', error);
      return { success: false, error: error.message };
    }
  },

  // Send customer order confirmation
  sendCustomerOrderConfirmation: async (order) => {
    try {
      const template = emailTemplates.customerOrderConfirmation(order);
      
      const mailOptions = {
        from: `"E_roots Technology" <${emailConfig.auth.user}>`,
        to: order.user.email,
        subject: template.subject,
        html: template.html,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Customer confirmation email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending customer confirmation email:', error);
      return { success: false, error: error.message };
    }
  },

  // Send account credentials email
  sendAccountCredentials: async (email, password, orderInfo) => {
    try {
      const template = emailTemplates.accountCredentials(email, password, orderInfo);
      
      const mailOptions = {
        from: `"Eroots Technology" <${emailConfig.auth.user}>`,
        to: email,
        subject: template.subject,
        html: template.html,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Account credentials email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending account credentials email:', error);
      return { success: false, error: error.message };
    }
  },

  // Send both admin notification and customer confirmation
  sendOrderEmails: async (order, temporaryPassword = null) => {
    try {
      const emailPromises = [
        emailService.sendAdminOrderNotification(order),
        emailService.sendCustomerOrderConfirmation(order)
      ];

      // If a temporary password is provided (new account), send credentials email
      if (temporaryPassword) {
        emailPromises.push(emailService.sendAccountCredentials(order.user.email, temporaryPassword, order));
      }

      const results = await Promise.allSettled(emailPromises);

      return {
        adminEmail: results[0].status === 'fulfilled' ? results[0].value : { success: false, error: results[0].reason },
        customerEmail: results[1].status === 'fulfilled' ? results[1].value : { success: false, error: results[1].reason },
        credentialsEmail: temporaryPassword && results[2] ? 
          (results[2].status === 'fulfilled' ? results[2].value : { success: false, error: results[2].reason }) : 
          null
      };
    } catch (error) {
      console.error('Error sending order emails:', error);
      return {
        adminEmail: { success: false, error: error.message },
        customerEmail: { success: false, error: error.message },
        credentialsEmail: null
      };
    }
  },

  // Send order status update notification
  sendOrderStatusUpdate: async (order, oldStatus, newStatus) => {
    try {
      const template = emailTemplates.orderStatusUpdate(order, oldStatus, newStatus);
      
      const mailOptions = {
        from: `"Eroots Technology" <${emailConfig.auth.user}>`,
        to: order.user.email,
        subject: template.subject,
        html: template.html,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Order status update email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending order status update email:', error);
      return { success: false, error: error.message };
    }
  },

  // Test email configuration
  testEmailConfig: async () => {
    try {
      await transporter.verify();
      return { success: true, message: 'Email configuration is valid' };
    } catch (error) {
      console.error('Email configuration test failed:', error);
      return { success: false, error: error.message };
    }
  }
};

// Email templates for contact/project requests
const contactRequestTemplates = {
  adminNotification: (request) => ({
    subject: `🔔 New Project Request from ${request.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Project Request</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .info-box { background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px; }
          .info-row { margin-bottom: 15px; }
          .info-label { font-weight: bold; color: #667eea; display: inline-block; width: 120px; }
          .description-box { background: #e8f4f8; padding: 20px; border-radius: 6px; margin-bottom: 20px; }
          .btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .alert { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Project Request</h1>
            <p>Someone is interested in your services!</p>
          </div>
          
          <div class="content">
            <div class="alert">
              <strong>📬 New Inquiry Alert!</strong><br>
              A potential client has submitted a project request through your website.
            </div>

            <div class="info-box">
              <h3 style="margin-top: 0; color: #667eea;">👤 Contact Information</h3>
              <div class="info-row">
                <span class="info-label">Name:</span>
                <span>${request.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span><a href="mailto:${request.email}" style="color: #667eea;">${request.email}</a></span>
              </div>
              ${request.phone ? `
              <div class="info-row">
                <span class="info-label">Phone:</span>
                <span><a href="tel:${request.phone}" style="color: #667eea;">${request.phone}</a></span>
              </div>
              ` : ''}
              <div class="info-row">
                <span class="info-label">Service Type:</span>
                <span><strong style="color: #764ba2;">${request.serviceType}</strong></span>
              </div>
              <div class="info-row">
                <span class="info-label">Submitted:</span>
                <span>${new Date(request.createdAt || Date.now()).toLocaleString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>

            <div class="description-box">
              <h3 style="margin-top: 0; color: #667eea;">📝 Project Description</h3>
              <p style="white-space: pre-wrap;">${request.description}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${request.email}" class="btn">Reply to Client</a>
              ${request.phone ? `<a href="tel:${request.phone}" class="btn" style="background: #28a745;">Call Client</a>` : ''}
            </div>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 6px;">
              <strong>⏰ Action Required:</strong><br>
              Please respond to this inquiry within 24 hours to maintain customer satisfaction.
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0; color: #999; font-size: 12px;">
              This email was automatically generated by Eroots Technology Contact System
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  customerConfirmation: (request) => ({
    subject: `Thank you for contacting Eroots Technology - We've received your request`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Request Received</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .success-box { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 20px; border-radius: 6px; margin-bottom: 20px; text-align: center; }
          .info-box { background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px; }
          .info-row { margin-bottom: 10px; }
          .info-label { font-weight: bold; color: #667eea; }
          .next-steps { background: #e8f4f8; padding: 20px; border-radius: 6px; margin-bottom: 20px; }
          .next-steps ul { margin: 10px 0; padding-left: 20px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .contact-info { background: #fff; border: 2px solid #667eea; padding: 20px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Request Received Successfully!</h1>
            <p>Thank you for reaching out to us</p>
          </div>
          
          <div class="content">
            <div class="success-box">
              <h2 style="margin: 0 0 10px 0; color: #155724;">🎉 Great News!</h2>
              <p style="margin: 0; font-size: 16px;">
                We've received your project request and our team is excited to work with you!
              </p>
            </div>

            <p style="font-size: 16px;">Dear <strong>${request.name}</strong>,</p>
            
            <p>
              Thank you for your interest in <strong>Eroots Technology</strong>. We've successfully received your inquiry regarding <strong>${request.serviceType}</strong> and we're thrilled to have the opportunity to help bring your project to life.
            </p>

            <div class="info-box">
              <h3 style="margin-top: 0; color: #667eea;">📋 Your Request Summary</h3>
              <div class="info-row">
                <span class="info-label">Service Type:</span> ${request.serviceType}
              </div>
              <div class="info-row">
                <span class="info-label">Submitted:</span> ${new Date(request.createdAt || Date.now()).toLocaleString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            <div class="next-steps">
              <h3 style="margin-top: 0; color: #667eea;">🚀 What Happens Next?</h3>
              <ul>
                <li><strong>Review:</strong> Our technical team will carefully review your project requirements</li>
                <li><strong>Response:</strong> We'll get back to you within 24 business hours</li>
                <li><strong>Consultation:</strong> We may schedule a call to discuss your project in detail</li>
                <li><strong>Proposal:</strong> You'll receive a detailed proposal with timeline and costs</li>
              </ul>
            </div>

            <div class="contact-info">
              <h3 style="margin-top: 0; color: #667eea;">📞 Need Immediate Assistance?</h3>
              <p style="margin-bottom: 15px;">If your project is urgent, feel free to contact us directly:</p>
              <p style="margin: 5px 0;"><strong>📧 Email:</strong> <a href="mailto:eroots2025@gmail.com" style="color: #667eea;">eroots2025@gmail.com</a></p>
              <p style="margin: 5px 0;"><strong>📱 Phone:</strong> <a href="tel:+917350059825" style="color: #667eea;">+91 7350059825</a></p>
              <p style="margin: 5px 0;"><strong>🕐 Hours:</strong> Mon - Fri, 9:00 AM - 6:00 PM IST</p>
            </div>

            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <strong>💡 Pro Tip:</strong> Keep this email for your records. You can reply directly to this email if you need to add any additional information.
            </div>

            <p style="margin-top: 30px;">
              We look forward to working with you and helping transform your ideas into reality!
            </p>

            <p style="margin-top: 20px;">
              Best regards,<br>
              <strong>Team Eroots Technology</strong><br>
              <em>Engineering Excellence, Delivered</em>
            </p>
          </div>

          <div class="footer">
            <p style="margin: 0 0 10px 0;">
              <strong>Eroots Technology</strong><br>
              Pune, Maharashtra, India
            </p>
            <p style="margin: 0; color: #999; font-size: 12px;">
              © 2025 Eroots Technology. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send contact/project request emails
emailService.sendContactRequestEmails = async (request) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'eroots2025@gmail.com';
    
    // Send notification to admin
    const adminTemplate = contactRequestTemplates.adminNotification(request);
    await transporter.sendMail({
      from: '"Eroots Technology" <eroots2025@gmail.com>',
      to: adminEmail,
      subject: adminTemplate.subject,
      html: adminTemplate.html
    });

    // Send confirmation to customer
    const customerTemplate = contactRequestTemplates.customerConfirmation(request);
    await transporter.sendMail({
      from: '"Eroots Technology" <eroots2025@gmail.com>',
      to: request.email,
      subject: customerTemplate.subject,
      html: customerTemplate.html
    });

    console.log(`✅ Contact request emails sent successfully to admin and ${request.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending contact request emails:', error);
    return { success: false, error: error.message };
  }
};

module.exports = emailService;

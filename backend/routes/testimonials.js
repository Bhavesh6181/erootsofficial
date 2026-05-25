const express = require('express');
const { body, validationResult } = require('express-validator');
const Testimonial = require('../models/Testimonial');
const { adminAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();
const allowedStatuses = ['pending', 'approved', 'rejected'];
const approvedStatusFilter = [{ status: 'approved' }, { status: { $exists: false } }];

const normalizeTestimonial = (testimonial) => {
  const data = testimonial?.toObject ? testimonial.toObject() : testimonial;
  return {
    ...data,
    status: data.status || 'approved',
  };
};

// Get testimonials
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { featured, status } = req.query;
    const isAdmin = req.user?.role === 'admin';
    const query = {};

    if (featured === 'true') {
      query.featured = true;
    }

    if (isAdmin) {
      if (typeof status === 'string' && allowedStatuses.includes(status)) {
        if (status === 'approved') {
          query.$or = approvedStatusFilter;
        } else {
          query.status = status;
        }
      }
    } else {
      query.$or = approvedStatusFilter;
    }

    const testimonials = await Testimonial.find(query).sort({ featured: -1, createdAt: -1 });
    res.json({
      success: true,
      data: testimonials.map(normalizeTestimonial)
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials'
    });
  }
});

// Submit testimonial for review (Public)
router.post('/submit', [
  body('name').trim().notEmpty().isLength({ max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('content').trim().notEmpty().isLength({ max: 500 }),
  body('rating').isInt({ min: 1, max: 5 }),
  body('company').trim().isLength({ max: 100 }).optional(),
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

    const testimonial = new Testimonial({
      name: req.body.name,
      email: req.body.email,
      company: req.body.company,
      content: req.body.content,
      rating: req.body.rating,
      status: 'pending',
      featured: false,
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully. It will appear once approved.',
      data: normalizeTestimonial(testimonial)
    });
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
});

// Get testimonial by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    const isAdmin = req.user?.role === 'admin';
    const normalizedTestimonial = testimonial ? normalizeTestimonial(testimonial) : null;

    if (!normalizedTestimonial || (normalizedTestimonial.status !== 'approved' && !isAdmin)) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      data: normalizedTestimonial
    });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonial'
    });
  }
});

// Create new testimonial (Admin only)
router.post('/', [
  adminAuth,
  body('name').trim().notEmpty().isLength({ max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('content').trim().notEmpty().isLength({ max: 500 }),
  body('rating').isInt({ min: 1, max: 5 }),
  body('company').trim().isLength({ max: 100 }).optional(),
  body('featured').isBoolean().optional(),
  body('status').isIn(allowedStatuses).optional(),
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

    const testimonial = new Testimonial({
      ...req.body,
      status: req.body.status || 'approved',
    });
    await testimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: normalizeTestimonial(testimonial)
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create testimonial'
    });
  }
});

// Update testimonial (Admin only)
router.put('/:id', [
  adminAuth,
  body('name').trim().notEmpty().isLength({ max: 100 }).optional(),
  body('email').isEmail().normalizeEmail().optional(),
  body('content').trim().notEmpty().isLength({ max: 500 }).optional(),
  body('rating').isInt({ min: 1, max: 5 }).optional(),
  body('company').trim().isLength({ max: 100 }).optional(),
  body('featured').isBoolean().optional(),
  body('avatar').optional({ values: 'falsy' }).isURL(),
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

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: normalizeTestimonial(testimonial)
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonial'
    });
  }
});

// Update testimonial approval status (Admin only)
router.patch('/:id/status', [
  adminAuth,
  body('status').isIn(allowedStatuses),
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

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: `Testimonial ${req.body.status} successfully`,
      data: normalizeTestimonial(testimonial)
    });
  } catch (error) {
    console.error('Error updating testimonial status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonial status'
    });
  }
});

// Delete testimonial (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial'
    });
  }
});

module.exports = router;

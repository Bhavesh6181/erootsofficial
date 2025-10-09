const express = require('express');
const { body, validationResult } = require('express-validator');
const Testimonial = require('../models/Testimonial');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    let query = {};

    if (featured === 'true') {
      query.featured = true;
    }

    const testimonials = await Testimonial.find(query).sort({ featured: -1, createdAt: -1 });
    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials'
    });
  }
});

// Get testimonial by ID
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    res.json({
      success: true,
      data: testimonial
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
  body('content').trim().notEmpty().isLength({ max: 500 }),
  body('rating').isInt({ min: 1, max: 5 }),
  body('company').trim().isLength({ max: 100 }).optional(),
  body('featured').isBoolean().optional(),
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

    const testimonial = new Testimonial(req.body);
    await testimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial
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
  body('content').trim().notEmpty().isLength({ max: 500 }).optional(),
  body('rating').isInt({ min: 1, max: 5 }).optional(),
  body('company').trim().isLength({ max: 100 }).optional(),
  body('featured').isBoolean().optional(),
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
      data: testimonial
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonial'
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

const express = require('express');
const { body, validationResult } = require('express-validator');
const ProjectRequest = require('../models/ProjectRequest');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all project requests (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, sort = '-createdAt' } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const requests = await ProjectRequest.find(query).sort(sort);
    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requests'
    });
  }
});

// Get request by ID (Admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const request = await ProjectRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }
    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch request'
    });
  }
});

// Create new project request (Public)
router.post('/', [
  body('name').trim().notEmpty().isLength({ max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('serviceType').isIn([
    'Embedded Systems',
    'IoT Development',
    'PCB Design',
    'Antenna Simulation',
    'Web/App Development',
    'Electronic Components',
    'Other'
  ]),
  body('description').trim().notEmpty().isLength({ min: 20, max: 1000 }),
  body('phone').trim().optional(),
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

    const request = new ProjectRequest(req.body);
    await request.save();

    // Send email notifications (admin + customer confirmation)
    try {
      await require('../services/emailService').sendContactRequestEmails(request);
    } catch (emailError) {
      console.error('Failed to send contact emails:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Project request submitted successfully',
      data: request
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit request'
    });
  }
});

// Update request status (Admin only)
router.put('/:id', [
  adminAuth,
  body('status').isIn(['pending', 'in-review', 'approved', 'rejected']).optional(),
  body('notes').trim().isLength({ max: 500 }).optional(),
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

    const request = await ProjectRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      message: 'Request updated successfully',
      data: request
    });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update request'
    });
  }
});

// Delete request (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const request = await ProjectRequest.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete request'
    });
  }
});

module.exports = router;

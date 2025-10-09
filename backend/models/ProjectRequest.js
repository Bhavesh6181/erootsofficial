const mongoose = require('mongoose');

const projectRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  serviceType: {
    type: String,
    required: true,
    enum: [
      'Embedded Systems',
      'IoT Development',
      'PCB Design',
      'Antenna Simulation',
      'Web/App Development',
      'Electronic Components',
      'Other'
    ],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  status: {
    type: String,
    enum: ['pending', 'in-review', 'approved', 'rejected'],
    default: 'pending',
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

// Index for better search performance
projectRequestSchema.index({ email: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('ProjectRequest', projectRequestSchema);

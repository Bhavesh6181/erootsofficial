const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  icon: {
    type: String,
    required: true,
    trim: true,
  },
  features: [{
    type: String,
    trim: true,
    maxlength: 100,
  }],
}, {
  timestamps: true,
});

// Index for better search performance
serviceSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Service', serviceSchema);

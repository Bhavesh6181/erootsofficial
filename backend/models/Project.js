const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
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
    maxlength: 1000,
  },
  image: {
    type: String,
  },
  technologies: [{
    type: String,
    trim: true,
    maxlength: 50,
  }],
  category: {
    type: String,
    required: true,
    enum: ['Embedded', 'IoT', 'PCB', 'Antenna', 'Web', 'App', 'Other'],
    default: 'Other',
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'completed',
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for better search performance
projectSchema.index({ title: 'text', description: 'text', category: 1, status: 1 });

module.exports = mongoose.model('Project', projectSchema);

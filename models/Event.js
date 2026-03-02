const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  venue: {
    type: String,
    required: [true, 'Event venue is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['All Departments', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Business Administration', 'Arts & Humanities', 'Science', 'Law', 'Medicine'],
    default: 'All Departments'
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
eventSchema.index({ date: 1 });
eventSchema.index({ department: 1 });

module.exports = mongoose.model('Event', eventSchema);

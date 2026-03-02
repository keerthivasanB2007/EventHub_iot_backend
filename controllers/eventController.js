const Event = require('../models/Event');

// @desc  Get all events
// @route GET /api/events
// @access Public
const getEvents = async (req, res) => {
  try {
    const { department, search, upcoming } = req.query;

    let query = {};

    // Filter upcoming events by default
    if (upcoming !== 'false') {
      query.date = { $gte: new Date() };
    }

    // Filter by department
    if (department && department !== 'All Departments') {
      query.department = department;
    }

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const events = await Event.find(query).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single event
// @route GET /api/events/:id
// @access Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Create event
// @route POST /api/events
// @access Private (Admin)
const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue, department, image } = req.body;

    if (!title || !description || !date || !time || !venue || !department) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    const event = await Event.create({ title, description, date, time, venue, department, image });

    res.status(201).json({ success: true, message: 'Event created successfully', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update event
// @route PUT /api/events/:id
// @access Private (Admin)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, message: 'Event updated successfully', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete event
// @route DELETE /api/events/:id
// @access Private (Admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };

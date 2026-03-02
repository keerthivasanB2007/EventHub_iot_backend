const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc  Admin login
// @route POST /api/admin/login
// @access Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Register admin (run once to seed)
// @route POST /api/admin/register
// @access Public (disable after first use)
const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }
    const admin = await Admin.create({ username, email, password });
    res.status(201).json({ success: true, message: 'Admin registered', data: { id: admin._id, username: admin.username, email: admin.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get admin profile
// @route GET /api/admin/me
// @access Private
const getAdminProfile = async (req, res) => {
  res.status(200).json({ success: true, data: req.admin });
};

module.exports = { loginAdmin, registerAdmin, getAdminProfile };

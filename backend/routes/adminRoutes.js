const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin, getAdminProfile } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.post('/register', registerAdmin); // Disable after first admin is created
router.get('/me', protect, getAdminProfile);

module.exports = router;

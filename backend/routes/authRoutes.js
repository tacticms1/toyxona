const express = require('express');
const router = express.Router();
const { register, login, verifyOTP, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.get('/me', protect, getMe);

module.exports = router;

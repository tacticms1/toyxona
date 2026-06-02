const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Owner specific profile or settings can go here
router.use(protect);
router.use(authorize('owner'));

module.exports = router;

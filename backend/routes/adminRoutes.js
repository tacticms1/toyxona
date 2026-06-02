const express = require('express');
const router = express.Router();
const { addOwner, getOwners, getDashboardStats, seedSampleData, assignOwnerToHall } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.post('/add-owner', addOwner);
router.post('/assign-owner', assignOwnerToHall);
router.get('/owners', getOwners);
router.get('/stats', getDashboardStats);
router.post('/seed', seedSampleData);

module.exports = router;

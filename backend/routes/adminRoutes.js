const express = require('express');
const router = express.Router();
const { addOwner, getOwners, getDashboardStats, seedSampleData, assignOwnerToHall, resetBookings } = require('../controllers/adminController');
const { getAllVerifications, approveVerification, rejectVerification } = require('../controllers/verificationController');
const { getAdminHalls, updateHallStatus } = require('../controllers/hallController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.post('/add-owner', addOwner);
router.post('/assign-owner', assignOwnerToHall);
router.get('/owners', getOwners);
router.get('/stats', getDashboardStats);
router.post('/seed', seedSampleData);
router.post('/reset-bookings', resetBookings);

// Hall boshqaruvi
router.get('/halls', getAdminHalls);
router.put('/halls/:id/status', updateHallStatus);

// Verifikatsiya boshqaruvi
router.get('/verifications', getAllVerifications);
router.put('/verifications/:id/approve', approveVerification);
router.put('/verifications/:id/reject', rejectVerification);

module.exports = router;

const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getMyBookings, 
  getOwnerBookings, 
  getAllBookings, 
  cancelBooking,
  getHallBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my', protect, authorize('customer'), getMyBookings);
router.get('/owner', protect, authorize('owner'), getOwnerBookings);
router.get('/all', protect, authorize('admin'), getAllBookings);
router.get('/hall/:hallId', getHallBookings);

router.post('/', protect, authorize('customer'), createBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;

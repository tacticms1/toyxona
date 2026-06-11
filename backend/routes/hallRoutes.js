const express = require('express');
const router = express.Router();
const {
  createHall,
  getAllHalls,
  getHallById,
  updateHall,
  deleteHall,
  getOwnerHalls,
  getAvailableHalls
} = require('../controllers/hallController');
const { protect, authorize, requireOwnerApproved } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllHalls);
router.get('/available', getAvailableHalls);
router.get('/owner', protect, authorize('owner'), getOwnerHalls);
router.get('/:id', getHallById);

// Hall yaratish va tahrirlash — faqat tasdiqlangan ownerlar
router.post('/', protect, authorize('owner', 'admin'), requireOwnerApproved, upload.array('images', 5), createHall);
router.put('/:id', protect, authorize('owner', 'admin'), requireOwnerApproved, upload.array('images', 5), updateHall);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteHall);

module.exports = router;

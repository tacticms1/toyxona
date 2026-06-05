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
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllHalls);
router.get('/available', getAvailableHalls);
router.get('/owner', protect, authorize('owner'), getOwnerHalls);
router.get('/:id', getHallById);

router.post('/', protect, authorize('owner', 'admin'), upload.array('images', 5), createHall);
router.put('/:id', protect, authorize('owner', 'admin'), upload.array('images', 5), updateHall);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteHall);

module.exports = router;

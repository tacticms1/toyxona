const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { submitVerification, getMyVerification } = require('../controllers/verificationController');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);
router.use(authorize('owner'));

router.get('/verification', getMyVerification);
router.post(
  '/verification',
  upload.fields([
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'hallDoc', maxCount: 1 },
    { name: 'selfieWithPassport', maxCount: 1 }
  ]),
  submitVerification
);

module.exports = router;

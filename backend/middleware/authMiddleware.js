const jwt = require('jsonwebtoken');
const { OwnerVerification } = require('../models');

exports.protect = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'User role not authorized' });
    }
    next();
  };
};

// Owner faqat admin tasdiqlagan bo'lsa hall qo'sha oladi
exports.requireOwnerApproved = async (req, res, next) => {
  if (req.user.role === 'admin') return next();

  try {
    const verification = await OwnerVerification.findOne({ where: { ownerId: req.user.id } });

    if (!verification) {
      return res.status(403).json({
        message: 'Hujjatlaringizni yubormagansiz. Kabinетingizdan hujjatlarni yuboring.',
        code: 'NOT_SUBMITTED'
      });
    }

    if (verification.status === 'submitted') {
      return res.status(403).json({
        message: 'Hujjatlaringiz admin tomonidan tekshirilmoqda. Iltimos kuting.',
        code: 'PENDING'
      });
    }

    if (verification.status === 'rejected') {
      return res.status(403).json({
        message: `Hujjatlaringiz rad etildi: ${verification.adminNote}. Qayta yuboring.`,
        code: 'REJECTED',
        note: verification.adminNote
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

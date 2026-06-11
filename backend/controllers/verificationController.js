const path = require('path');
const { OwnerVerification, User } = require('../models');

const PLACEHOLDER = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80';

// Owner: hujjatlarni yuborish
exports.submitVerification = async (req, res) => {
  try {
    const { pinfl, phone } = req.body;
    const ownerId = req.user.id;

    if (!pinfl || !phone) {
      return res.status(400).json({ message: 'PINFL va telefon raqami majburiy' });
    }

    // Fayl yuklangan bo'lsa ishlatamiz, bo'lmasa placeholder
    const getFile = (field) => {
      if (req.files && req.files[field] && req.files[field][0]) {
        return `/uploads/${path.basename(req.files[field][0].path)}`;
      }
      return PLACEHOLDER;
    };

    const passportPhoto      = getFile('passportPhoto');
    const hallDoc            = getFile('hallDoc');
    const selfieWithPassport = getFile('selfieWithPassport');

    const existing = await OwnerVerification.findOne({ where: { ownerId } });

    if (existing) {
      if (existing.status === 'approved') {
        return res.status(400).json({ message: 'Siz allaqachon tasdiqlangansiz' });
      }
      await existing.update({
        pinfl, phone, passportPhoto, hallDoc, selfieWithPassport,
        status: 'submitted', adminNote: null
      });
      return res.json({ message: "Hujjatlar qayta yuborildi", verification: existing });
    }

    const verification = await OwnerVerification.create({
      ownerId, pinfl, phone, passportPhoto, hallDoc, selfieWithPassport
    });

    res.status(201).json({
      message: "Hujjatlar yuborildi, admin tasdig'ini kuting",
      verification
    });
  } catch (error) {
    console.error('submitVerification error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Owner: o'z verifikatsiya holatini ko'rish
exports.getMyVerification = async (req, res) => {
  try {
    const verification = await OwnerVerification.findOne({ where: { ownerId: req.user.id } });
    res.json(verification || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: barcha verifikatsiyalarni ko'rish
exports.getAllVerifications = async (req, res) => {
  try {
    const verifications = await OwnerVerification.findAll({
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'firstName', 'lastName', 'email', 'username', 'district']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(verifications);
  } catch (error) {
    console.error('getAllVerifications error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Admin: tasdiqlash
exports.approveVerification = async (req, res) => {
  try {
    const verification = await OwnerVerification.findByPk(req.params.id);
    if (!verification) return res.status(404).json({ message: 'Topilmadi' });
    await verification.update({ status: 'approved', adminNote: null });
    res.json({ message: 'Tasdiqlandi', verification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: rad etish
exports.rejectVerification = async (req, res) => {
  try {
    const { note } = req.body;
    const verification = await OwnerVerification.findByPk(req.params.id);
    if (!verification) return res.status(404).json({ message: 'Topilmadi' });
    await verification.update({ status: 'rejected', adminNote: note || 'Rad etildi' });
    res.json({ message: 'Rad etildi', verification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

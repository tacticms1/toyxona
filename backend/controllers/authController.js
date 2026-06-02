const { User, OTP } = require('../models');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../utils/mailer');
const { Op } = require('sequelize');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, role, district } = req.body;
    
    let user = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });
    if (user) return res.status(400).json({ message: 'Ushbu email yoki username bilan foydalanuvchi allaqachon mavjud' });

    user = await User.create({ firstName, lastName, username, email, password, role, district });
    
    if (role === 'owner') {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      await OTP.create({ email, otp: otpCode });
      await sendOTP(email, otpCode);
    } else {
      user.isVerified = true;
      await user.save();
    }

    res.status(201).json({ message: 'Foydalanuvchi muvaffaqiyatli ro’yxatdan o’tdi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { [Op.or]: [{ email }, { username: email }] } });
    if (!user) return res.status(400).json({ message: 'Login yoki parol noto’g’ri' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Login yoki parol noto’g’ri' });

    if (user.role === 'owner' && !user.isVerified) {
      return res.status(401).json({ message: 'Iltimos, avval hisobingizni tasdiqlang', unverified: true });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({ where: { email, otp, expiresAt: { [Op.gt]: new Date() } } });
    
    if (!otpRecord) return res.status(400).json({ message: 'Kod noto’g’ri yoki muddati o’tgan' });

    const user = await User.findOne({ where: { email } });
    user.isVerified = true;
    await user.save();
    
    await otpRecord.destroy();

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

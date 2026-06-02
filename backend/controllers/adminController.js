const { User, Hall, Booking } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

exports.addOwner = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, district } = req.body;
    let user = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = await User.create({ 
      firstName, 
      lastName, 
      username,
      email, 
      password, 
      role: 'owner', 
      district, 
      isVerified: true 
    });

    res.status(201).json({ message: 'Owner added successfully', user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOwners = async (req, res) => {
  try {
    const owners = await User.findAll({ 
      where: { role: 'owner' },
      attributes: { exclude: ['password'] }
    });
    res.json(owners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignOwnerToHall = async (req, res) => {
  try {
    const { hallId, ownerId } = req.body;
    const hall = await Hall.findByPk(hallId);
    if (!hall) return res.status(404).json({ message: 'To\'yxona topilmadi' });
    
    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== 'owner') return res.status(404).json({ message: 'Ega topilmadi' });
    
    await hall.update({ ownerId });
    res.json({ message: 'Ega muvaffaqiyatli biriktirildi', hall });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalOwners = await User.count({ where: { role: 'owner' } });
    const totalCustomers = await User.count({ where: { role: 'customer' } });
    const totalHalls = await Hall.count();
    const totalBookings = await Booking.count();

    res.json({
      totalUsers,
      totalOwners,
      totalCustomers,
      totalHalls,
      totalBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.seedSampleData = async (req, res) => {
  try {
    // Check if owner already exists
    let owner = await User.findOne({ where: { email: 'owner@example.com' } });
    if (!owner) {
      owner = await User.create({
        firstName: 'Ali',
        lastName: 'Valiyev',
        username: 'owner1',
        email: 'owner@example.com',
        password: 'password123',
        role: 'owner',
        isVerified: true,
        district: 'Yunusobod'
      });
    }

    const halls = [
      {
        name: 'Versal To\'yxonasi',
        description: 'Toshkentning eng hashamatli to\'yxonalaridan biri. Klassik uslubda bezatilgan, keng zal va ajoyib akustika.',
        address: 'Yunusobod tumani, Amir Temur ko\'chasi',
        district: 'Yunusobod',
        capacity: 500,
        price: 150000,
        phone: '+998 90 123 45 67',
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'],
        singers: [{ name: 'Ozodbek Nazarbekov', price: 2000000 }, { name: 'Yulduz Usmonova', price: 3000000 }],
        karnaySurnay: { available: true, price: 500000 },
        menus: [{ name: 'Milliy Menu' }, { name: 'Yevropa Menu' }],
        cars: [{ brand: 'Mercedes-Benz S-Class', price: 1000000 }],
        ownerId: owner.id,
        status: 'tasdiqlangan'
      },
      {
        name: 'Zarafshon Restaurant',
        description: 'Zamonaviy dizayn va yuqori sifatli xizmat. Kichik va o\'rta hajmdagi tadbirlar uchun ideal.',
        address: 'Mirobod tumani, Nukus ko\'chasi',
        district: 'Mirobod',
        capacity: 300,
        price: 120000,
        phone: '+998 91 222 33 44',
        images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80'],
        singers: [{ name: 'Munisa Rizayeva', price: 2500000 }],
        karnaySurnay: { available: true, price: 400000 },
        menus: [{ name: 'To\'y Menu' }],
        cars: [{ brand: 'Rolls Royce', price: 5000000 }],
        ownerId: owner.id,
        status: 'tasdiqlangan'
      }
    ];

    for (const hallData of halls) {
      await Hall.create(hallData);
    }

    res.json({ message: 'Ma\'lumotlar muvaffaqiyatli qo\'shildi!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

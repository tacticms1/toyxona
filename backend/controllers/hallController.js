const { Hall, User, Booking } = require('../models');
const { Op } = require('sequelize');
const path = require('path');

exports.createHall = async (req, res) => {
  try {
    const { 
      name, description, address, district, capacity, price, phone, 
      singers, karnaySurnay, menus, cars, ownerId 
    } = req.body;
    
    const images = req.files ? req.files.map(file => `/uploads/${path.basename(file.path)}`) : [];
    
    const hall = await Hall.create({
      name,
      description,
      address,
      district,
      capacity: Number(capacity),
      price: Number(price),
      phone,
      images,
      singers: singers ? JSON.parse(singers) : [],
      karnaySurnay: karnaySurnay ? JSON.parse(karnaySurnay) : { available: false, price: 0 },
      menus: menus ? JSON.parse(menus) : [],
      cars: cars ? JSON.parse(cars) : [],
      ownerId: (req.user.role === 'admin' && ownerId) ? ownerId : req.user.id,
      status: req.user.role === 'admin' ? 'tasdiqlangan' : 'tasdiqlanmagan'
    });

    res.status(201).json(hall);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllHalls = async (req, res) => {
  try {
    const { district, status, sort, search, minPrice, maxPrice, minCapacity } = req.query;
    let where = {};

    if (req.user?.role === 'admin') {
      // Admin barcha hall'larni ko'radi, status filter ixtiyoriy
      if (status) where.status = status;
    } else {
      // Oddiy foydalanuvchi faqat tasdiqlangan hall'larni ko'radi
      where.status = 'tasdiqlangan';
    }

    if (district) where.district = district;
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }
    
    if (minCapacity) where.capacity = { [Op.gte]: Number(minCapacity) };

    let order = [];
    if (sort === 'price_asc') order.push(['price', 'ASC']);
    if (sort === 'price_desc') order.push(['price', 'DESC']);
    if (sort === 'capacity_asc') order.push(['capacity', 'ASC']);
    if (sort === 'capacity_desc') order.push(['capacity', 'DESC']);
    if (sort === 'hall_asc') order.push(['name', 'ASC']);
    if (sort === 'hall_desc') order.push(['name', 'DESC']);
    if (sort === 'district_asc') order.push(['district', 'ASC']);
    if (sort === 'district_desc') order.push(['district', 'DESC']);
    if (sort === 'status_asc') order.push(['status', 'ASC']);
    if (sort === 'status_desc') order.push(['status', 'DESC']);

    const halls = await Hall.findAll({
      where,
      order
    });
    
    // Add owner data manually if needed
    const hallsWithOwner = await Promise.all(halls.map(async (hall) => {
      const owner = await User.findByPk(hall.ownerId, { attributes: ['firstName', 'lastName', 'email'] });
      return { ...hall.toJSON(), owner };
    }));

    res.json(hallsWithOwner);
  } catch (error) {
    console.error('getAllHalls Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getHallById = async (req, res) => {
  try {
    const hall = await Hall.findByPk(req.params.id, {
      include: [{ model: User, as: 'owner', attributes: ['firstName', 'lastName', 'email'] }]
    });
    if (!hall) return res.status(404).json({ message: 'To’yxona topilmadi' });
    res.json(hall);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateHall = async (req, res) => {
  try {
    const { 
      name, description, address, district, capacity, price, phone, 
      singers, karnaySurnay, menus, cars, status, ownerId 
    } = req.body;
    
    let hall = await Hall.findByPk(req.params.id);
    if (!hall) return res.status(404).json({ message: 'To’yxona topilmadi' });

    if (req.user.role !== 'admin' && hall.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Ruxsat berilmagan' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (address) updateData.address = address;
    if (district) updateData.district = district;
    if (capacity) updateData.capacity = Number(capacity);
    if (price) updateData.price = Number(price);
    if (phone) updateData.phone = phone;
    
    if (singers) updateData.singers = JSON.parse(singers);
    if (karnaySurnay) updateData.karnaySurnay = JSON.parse(karnaySurnay);
    if (menus) updateData.menus = JSON.parse(menus);
    if (cars) updateData.cars = JSON.parse(cars);
    
    if (status && req.user.role === 'admin') updateData.status = status;
    if (ownerId && req.user.role === 'admin') updateData.ownerId = ownerId;

    if (req.body.images) {
      updateData.images = JSON.parse(req.body.images);
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${path.basename(file.path)}`);
      updateData.images = [...(updateData.images || hall.images || []), ...newImages];
    }

    await hall.update(updateData);
    res.json(hall);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteHall = async (req, res) => {
  try {
    const hall = await Hall.findByPk(req.params.id);
    if (!hall) return res.status(404).json({ message: 'Hall not found' });

    if (req.user.role !== 'admin' && hall.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await hall.destroy();
    res.json({ message: 'Hall removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOwnerHalls = async (req, res) => {
  try {
    const halls = await Hall.findAll({ where: { ownerId: req.user.id } });
    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAvailableHalls = async (req, res) => {
  try {
    const { date, excludeId } = req.query;
    if (!date) return res.status(400).json({ message: 'Sana kiritilishi shart' });

    const selectedDate = new Date(date);
    
    // 1. Get all bookings for that date
    const bookings = await Booking.findAll({
      where: {
        date: selectedDate,
        status: { [Op.ne]: 'cancelled' }
      },
      attributes: ['hallId']
    });

    const bookedHallIds = bookings.map(b => b.hallId);
    if (excludeId) bookedHallIds.push(excludeId);

    // 2. Find halls that are NOT in bookedHallIds
    const availableHalls = await Hall.findAll({
      where: {
        id: { [Op.notIn]: bookedHallIds },
        status: 'tasdiqlangan'
      },
      limit: 4
    });

    res.json(availableHalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

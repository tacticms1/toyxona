const { Booking, Hall, User } = require('../models');
const { Op } = require('sequelize');

exports.createBooking = async (req, res) => {
  try {
    const { 
      hallId, date, seatsCount, customerFirstName, customerLastName, customerPhone,
      selectedServices, totalPrice 
    } = req.body;
    
    const existingBooking = await Booking.findOne({ 
      where: {
        hallId, 
        date: new Date(date), 
        status: { [Op.ne]: 'cancelled' } 
      }
    });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'Ushbu sana uchun to’yxona allaqachon band qilingan' });
    }

    const advancePaid = totalPrice * 0.20;

    const booking = await Booking.create({
      hallId,
      customerId: req.user ? req.user.id : null,
      customerFirstName,
      customerLastName,
      customerPhone,
      date: new Date(date),
      seatsCount: Number(seatsCount),
      selectedServices,
      totalPrice,
      advancePaid,
      status: 'upcoming'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ 
      where: { customerId: req.user.id },
      include: [{ model: Hall, as: 'hall' }]
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOwnerBookings = async (req, res) => {
  try {
    const { sort, district, status, hallId } = req.query;
    
    let where = {};
    if (hallId) where.hallId = hallId;
    if (status) where.status = status;

    let include = [
      { 
        model: Hall, 
        as: 'hall', 
        where: { ownerId: req.user.id },
        attributes: ['name', 'district', 'address']
      },
      { model: User, as: 'customer', attributes: ['firstName', 'lastName', 'email'] }
    ];

    if (district) {
      include[0].where.district = district;
    }

    let order = [];
    if (sort === 'date_asc') order.push(['date', 'ASC']);
    if (sort === 'date_desc') order.push(['date', 'DESC']);
    if (sort === 'hall_asc') order.push([{ model: Hall, as: 'hall' }, 'name', 'ASC']);
    if (sort === 'hall_desc') order.push([{ model: Hall, as: 'hall' }, 'name', 'DESC']);
    if (sort === 'rayon_asc') order.push([{ model: Hall, as: 'hall' }, 'district', 'ASC']);
    if (sort === 'rayon_desc') order.push([{ model: Hall, as: 'hall' }, 'district', 'DESC']);
    if (sort === 'status_asc') order.push(['status', 'ASC']);
    if (sort === 'status_desc') order.push(['status', 'DESC']);

    const bookings = await Booking.findAll({ where, include, order });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const { sort, district, status, hallId } = req.query;
    
    let where = {};
    if (hallId) where.hallId = hallId;
    if (status) where.status = status;

    let include = [
      { model: Hall, as: 'hall', attributes: ['name', 'district', 'address'] },
      { model: User, as: 'customer', attributes: ['firstName', 'lastName', 'email'] }
    ];

    if (district) {
      include[0].where = { district };
    }

    let order = [];
    if (sort === 'date_asc') order.push(['date', 'ASC']);
    if (sort === 'date_desc') order.push(['date', 'DESC']);
    if (sort === 'hall_asc') order.push([{ model: Hall, as: 'hall' }, 'name', 'ASC']);
    if (sort === 'hall_desc') order.push([{ model: Hall, as: 'hall' }, 'name', 'DESC']);
    if (sort === 'rayon_asc') order.push([{ model: Hall, as: 'hall' }, 'district', 'ASC']);
    if (sort === 'rayon_desc') order.push([{ model: Hall, as: 'hall' }, 'district', 'DESC']);
    if (sort === 'status_asc') order.push(['status', 'ASC']);
    if (sort === 'status_desc') order.push(['status', 'DESC']);

    const bookings = await Booking.findAll({ where, include, order });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Hall, as: 'hall' }]
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const isOwner = booking.hall.ownerId === req.user.id;
    const isCustomer = booking.customerId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && !isOwner && !isCustomer) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await booking.update({ status: 'cancelled' });
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHallBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ 
      where: { 
        hallId: req.params.hallId, 
        status: { [Op.ne]: 'cancelled' } 
      },
      attributes: ['id', 'date', 'customerFirstName', 'customerLastName', 'customerPhone', 'seatsCount', 'totalPrice']
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

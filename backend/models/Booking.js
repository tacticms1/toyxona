const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  customerFirstName: { type: DataTypes.STRING, allowNull: false },
  customerLastName: { type: DataTypes.STRING, allowNull: false },
  customerPhone: { type: DataTypes.STRING, allowNull: false },
  
  date: { type: DataTypes.DATE, allowNull: false },
  seatsCount: { type: DataTypes.INTEGER, allowNull: false },
  
  selectedServices: { type: DataTypes.JSONB, defaultValue: {} },
  
  totalPrice: { type: DataTypes.INTEGER, allowNull: false },
  advancePaid: { type: DataTypes.INTEGER, allowNull: false },
  
  status: { 
    type: DataTypes.ENUM('completed', 'upcoming', 'cancelled'), 
    defaultValue: 'upcoming' 
  },
  hallId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: true
  }
});

module.exports = Booking;

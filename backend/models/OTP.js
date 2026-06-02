const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const OTP = sequelize.define('OTP', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: { type: DataTypes.STRING, allowNull: false },
  otp: { type: DataTypes.STRING, allowNull: false },
  expiresAt: { 
    type: DataTypes.DATE, 
    defaultValue: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  }
});

module.exports = OTP;

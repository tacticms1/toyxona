const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const OwnerVerification = sequelize.define('OwnerVerification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  pinfl: {
    type: DataTypes.STRING(14),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  passportPhoto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hallDoc: {
    type: DataTypes.STRING,
    allowNull: false
  },
  selfieWithPassport: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('submitted', 'approved', 'rejected'),
    defaultValue: 'submitted'
  },
  adminNote: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = OwnerVerification;

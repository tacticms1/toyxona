const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Hall = sequelize.define('Hall', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  district: { 
    type: DataTypes.ENUM(
      'Yunusobod', 'Chilonzor', 'Mirzo Ulugbek', 'Mirobod', 'Yakkasaroy', 
      'Shayxontohur', 'Olmazor', 'Sergeli', 'Uchtepa', 'Bektemir', 'Yashnobod', 'Yangihayot'
    ),
    allowNull: false
  },
  capacity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  images: { type: DataTypes.JSONB, defaultValue: [] },
  
  singers: { type: DataTypes.JSONB, defaultValue: [] },
  karnaySurnay: { type: DataTypes.JSONB, defaultValue: { available: false, price: 0 } },
  menus: { type: DataTypes.JSONB, defaultValue: [] },
  cars: { type: DataTypes.JSONB, defaultValue: [] },

  status: { 
    type: DataTypes.ENUM('tasdiqlangan', 'tasdiqlanmagan'), 
    defaultValue: 'tasdiqlanmagan' 
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

module.exports = Hall;

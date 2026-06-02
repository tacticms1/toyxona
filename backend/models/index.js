const User = require('./User');
const Hall = require('./Hall');
const Booking = require('./Booking');
const OTP = require('./OTP');

// User & Hall
User.hasMany(Hall, { foreignKey: 'ownerId', as: 'halls' });
Hall.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Hall & Booking
Hall.hasMany(Booking, { foreignKey: 'hallId', as: 'bookings' });
Booking.belongsTo(Hall, { foreignKey: 'hallId', as: 'hall' });

// User & Booking (Customer)
User.hasMany(Booking, { foreignKey: 'customerId', as: 'myBookings' });
Booking.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });

module.exports = { User, Hall, Booking, OTP };

const { Hall } = require('./models');
require('./config/db');
require('dotenv').config();

(async () => {
  try {
    const halls = await Hall.findAll({ attributes: ['name', 'status', 'images'] });
    console.log(`✅ Database: ${halls.length} ta hall topildi`);
    halls.slice(0, 5).forEach((hall, i) => {
      console.log(`${i+1}. ${hall.name} (Status: ${hall.status}, Images: ${hall.images?.length || 0})`);
    });
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();

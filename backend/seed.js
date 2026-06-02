const { sequelize } = require('./config/db');
const { User, Hall } = require('./models');

const seedData = async () => {
  try {
    await sequelize.sync({ force: true }); // Warning: This clears the database!
    console.log('Database synced.');

    // Create Admin
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'To’yXona',
      username: 'admin',
      email: 'admin@toyxona.uz',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });

    // Create Owner
    const owner = await User.create({
      firstName: 'Eshmat',
      lastName: 'Toshmatov',
      username: 'owner1',
      email: 'owner@toyxona.uz',
      password: 'owner123',
      role: 'owner',
      isVerified: true,
      district: 'Yunusobod'
    });

    // Create a Sample Hall
    await Hall.create({
      name: 'Oltin Vodiy',
      description: 'Eng hashamatli va zamonaviy to’yxona. Premium servis va mazali taomlar.',
      address: 'Amir Temur ko’chasi, 12',
      district: 'Yunusobod',
      capacity: 500,
      price: 250000,
      phone: '+998 90 123 45 67',
      status: 'tasdiqlangan',
      ownerId: owner.id,
      images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000'],
      singers: [{ name: 'Sherali Jo’rayev', price: 5000000 }],
      karnaySurnay: { available: true, price: 1000000 },
      menus: [{ name: 'Premium Menyu', price: 300000, items: ['Osh', 'Somsa', 'Shashlik'] }],
      cars: [{ name: 'Mercedes S-Class', price: 2000000 }]
    });

    console.log('Seed data inserted successfully.');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

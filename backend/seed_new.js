const { sequelize } = require('./config/db');
const { User, Hall, Booking } = require('./models');

const seedData = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('✅ Database synced.');

    // === ADMINLAR ===
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'System',
      username: 'admin',
      email: 'admin@toyxona.uz',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });
    console.log('✅ Admin created');

    // === OWNERLAR ===
    const owners = await Promise.all([
      User.create({
        firstName: 'Eshmat',
        lastName: 'Toshmatov',
        username: 'owner1',
        email: 'eshmat@toyxona.uz',
        password: 'owner123',
        role: 'owner',
        isVerified: true,
        district: 'Yunusobod'
      }),
      User.create({
        firstName: 'Nodira',
        lastName: 'Qurbanova',
        username: 'owner2',
        email: 'nodira@toyxona.uz',
        password: 'owner123',
        role: 'owner',
        isVerified: true,
        district: 'Chilonzor'
      }),
      User.create({
        firstName: 'Rustam',
        lastName: 'Aminov',
        username: 'owner3',
        email: 'rustam@toyxona.uz',
        password: 'owner123',
        role: 'owner',
        isVerified: true,
        district: 'Mirzo Ulugbek'
      }),
      User.create({
        firstName: 'Dilfuza',
        lastName: 'Hasanova',
        username: 'owner4',
        email: 'dilfuza@toyxona.uz',
        password: 'owner123',
        role: 'owner',
        isVerified: true,
        district: 'Mirobod'
      })
    ]);
    console.log('✅ 4 ta owner created');

    // === CUSTOMERLAR ===
    const customers = await Promise.all([
      User.create({
        firstName: 'Anvar',
        lastName: 'Ergashov',
        username: 'customer1',
        email: 'anvar@gmail.com',
        password: 'customer123',
        role: 'customer',
        isVerified: true,
        district: 'Yunusobod'
      }),
      User.create({
        firstName: 'Zarina',
        lastName: 'Karimova',
        username: 'customer2',
        email: 'zarina@gmail.com',
        password: 'customer123',
        role: 'customer',
        isVerified: true,
        district: 'Chilonzor'
      }),
      User.create({
        firstName: 'Javlon',
        lastName: 'Saidov',
        username: 'customer3',
        email: 'javlon@gmail.com',
        password: 'customer123',
        role: 'customer',
        isVerified: true,
        district: 'Sergeli'
      })
    ]);
    console.log('✅ 3 ta customer created');

    // === HALLLAR ===
    const halls = await Promise.all([
      Hall.create({
        name: 'Oltin Vodiy',
        description: 'Eng hashamatli va zamonaviy to\'yxona. Premium servis va mazali taomlar. 500 kishilik sig\'im.',
        address: 'Amir Temur ko\'chasi, 12',
        district: 'Yunusobod',
        capacity: 500,
        price: 250000,
        phone: '+998 90 123 4567',
        status: 'tasdiqlangan',
        ownerId: owners[0].id,
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [
          { name: 'Sherali Jorayev', price: 5000000 },
          { name: 'Yulduz Usmonova', price: 4500000 }
        ],
        karnaySurnay: { available: true, price: 1000000 },
        menus: [
          { name: 'Premium Menyu', price: 300000, items: ['Osh', 'Somsa', 'Shashlik', 'Lagmon'] },
          { name: 'Oddiy Menyu', price: 150000, items: ['Osh', 'Somsa', 'Qozon kabob'] }
        ],
        cars: [
          { name: 'Mercedes S-Class', price: 2000000 },
          { name: 'BMW 7 Series', price: 1800000 }
        ]
      }),
      Hall.create({
        name: 'Crystal Palace',
        description: 'Zamonaviy va elegan to\'yxona. 300 kishilik sig\'im. WiFi va parking bor.',
        address: 'Bobur ko\'chasi, 45',
        district: 'Chilonzor',
        capacity: 300,
        price: 180000,
        phone: '+998 91 234 5678',
        status: 'tasdiqlangan',
        ownerId: owners[1].id,
        images: [
          'https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1519671482677-26ae3d4ae0d7?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [
          { name: 'Nilufar Usmonova', price: 4000000 }
        ],
        karnaySurnay: { available: true, price: 800000 },
        menus: [
          { name: 'VIP Menyu', price: 400000, items: ['Plov', 'Kabob', 'Manti', 'Shorva'] }
        ],
        cars: [
          { name: 'Toyota Camry', price: 1200000 }
        ]
      }),
      Hall.create({
        name: 'Saroy Toyxona',
        description: 'Anaviy uslubda yasalgan hashamatli to\'yxona. 200 kishilik sig\'im.',
        address: 'Abdulla Kodiri ko\'chasi, 78',
        district: 'Mirzo Ulugbek',
        capacity: 200,
        price: 120000,
        phone: '+998 93 456 7890',
        status: 'tasdiqlangan',
        ownerId: owners[2].id,
        images: [
          'https://images.unsplash.com/photo-1585183453141-f5ee4e9b1b73?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [
          { name: 'Mehridor Tohiri', price: 3500000 }
        ],
        karnaySurnay: { available: false, price: 0 },
        menus: [
          { name: 'Standart Menyu', price: 120000, items: ['Plov', 'Kabob', 'Somsa'] }
        ],
        cars: [
          { name: 'Chevrolet Malibu', price: 1000000 }
        ]
      }),
      Hall.create({
        name: 'Royal Garden',
        description: 'Ochiq havoda to\'yxona. 150 kishilik sig\'im. Bahor-yozda juda chiroyli.',
        address: 'Nukus ko\'chasi, 34',
        district: 'Mirobod',
        capacity: 150,
        price: 100000,
        phone: '+998 94 567 8901',
        status: 'tasdiqlangan',
        ownerId: owners[3].id,
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [],
        karnaySurnay: { available: true, price: 600000 },
        menus: [
          { name: 'Oqaida Menyu', price: 100000, items: ['Osh', 'Kabob'] }
        ],
        cars: []
      }),
      Hall.create({
        name: 'Modern Studio',
        description: 'Kichik va intim to\'yxona. 100 kishilik sig\'im. Poyezd qurollari mavjud.',
        address: 'Turon ko\'chasi, 56',
        district: 'Yakkasaroy',
        capacity: 100,
        price: 80000,
        phone: '+998 95 678 9012',
        status: 'tasdiqlanmagan',
        ownerId: owners[0].id,
        images: [
          'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [],
        karnaySurnay: { available: false, price: 0 },
        menus: [
          { name: 'Chuchvara Menyu', price: 80000, items: ['Chuchvara', 'Kabob', 'Somsa'] }
        ],
        cars: []
      })
    ]);
    console.log('✅ 5 ta hall created');

    // === BOOKINGLAR ===
    const bookings = await Promise.all([
      Booking.create({
        customerFirstName: 'Anvar',
        customerLastName: 'Ergashov',
        customerPhone: '+998 90 111 2222',
        date: new Date('2026-06-15'),
        seatsCount: 150,
        selectedServices: {
          singer: { name: 'Sherali Jorayev', price: 5000000 },
          karnaySurnay: true,
          menu: { name: 'Premium Menyu', price: 300000 }
        },
        totalPrice: 35000000,
        advancePaid: 10000000,
        status: `upcoming`,
        hallId: halls[0].id,
        customerId: customers[0].id
      }),
      Booking.create({
        customerFirstName: 'Zarina',
        customerLastName: 'Karimova',
        customerPhone: '+998 91 222 3333',
        date: new Date('2026-07-20'),
        seatsCount: 100,
        selectedServices: {
          singer: { name: 'Nilufar Usmonova', price: 4000000 },
          menu: { name: 'VIP Menyu', price: 400000 }
        },
        totalPrice: 24000000,
        advancePaid: 8000000,
        status: `upcoming`,
        hallId: halls[1].id,
        customerId: customers[1].id
      }),
      Booking.create({
        customerFirstName: 'Javlon',
        customerLastName: 'Saidov',
        customerPhone: '+998 92 333 4444',
        date: new Date('2026-05-20'),
        seatsCount: 80,
        selectedServices: {
          menu: { name: 'Standart Menyu', price: 120000 }
        },
        totalPrice: 10000000,
        advancePaid: 5000000,
        status: `completed`,
        hallId: halls[2].id,
        customerId: customers[2].id
      }),
      Booking.create({
        customerFirstName: 'Karim',
        customerLastName: 'Abdullayev',
        customerPhone: '+998 93 444 5555',
        date: new Date('2026-08-10'),
        seatsCount: 120,
        selectedServices: {
          karnaySurnay: true,
          menu: { name: 'Oqaida Menyu', price: 100000 }
        },
        totalPrice: 16000000,
        advancePaid: 0,
        status: `cancelled`,
        hallId: halls[3].id,
        customerId: null
      })
    ]);
    console.log('✅ 4 ta booking created');

    console.log('\n========================================');
    console.log('🎉 DATABASE GA HAMMASINI MA\'LUMOT QO\'SHILDI!');
    console.log('========================================\n');
    
    console.log('📊 STATISTIKA:');
    console.log('   • Adminlar: 1');
    console.log('   • Ownerlar: 4');
    console.log('   • Customerlar: 3');
    console.log('   • Halllar: 5 (tasdiqlangan: 4, tasdiqlanmagan: 1)');
    console.log('   • Bookinglar: 4\n');

    console.log('========================================');
    console.log('🔐 TEST ACCOUNTLAR');
    console.log('========================================\n');
    
    console.log('👨‍💼 ADMIN:');
    console.log('   Email: admin@toyxona.uz');
    console.log('   Password: admin123\n');
    
    console.log('🏢 OWNERLAR:');
    owners.forEach((owner, i) => {
      console.log(`   ${i + 1}. ${owner.email} (password: owner123)`);
    });
    console.log('');
    
    console.log('👤 CUSTOMERLAR:');
    customers.forEach((customer, i) => {
      console.log(`   ${i + 1}. ${customer.email} (password: customer123)`);
    });

    console.log('\n========================================');
    console.log('✅ Tayyor! Web siteni ochasiz almashtiring');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Xatolik:', error.message);
    process.exit(1);
  }
};

seedData();

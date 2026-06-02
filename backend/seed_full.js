const { sequelize } = require('./config/db');
const { User, Hall, Booking } = require('./models');

const seedData = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('✅ Database synced.');

    // === ADMIN ===
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'System',
      username: 'admin',
      email: 'admin@toyxona.uz',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });

    // === OWNERS ===
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
      }),
      User.create({
        firstName: 'Karim',
        lastName: 'Ergashov',
        username: 'owner5',
        email: 'karim@toyxona.uz',
        password: 'owner123',
        role: 'owner',
        isVerified: true,
        district: 'Yakkasaroy'
      }),
      User.create({
        firstName: 'Malika',
        lastName: 'Shermuhammadova',
        username: 'owner6',
        email: 'malika@toyxona.uz',
        password: 'owner123',
        role: 'owner',
        isVerified: true,
        district: 'Shayxontohur'
      }),
      User.create({
        firstName: 'Sergey',
        lastName: 'Volkov',
        username: 'owner7',
        email: 'sergey@toyxona.uz',
        password: 'owner123',
        role: 'owner',
        isVerified: true,
        district: 'Olmazor'
      }),
      User.create({
        firstName: 'Gulnora',
        lastName: 'Maxmudova',
        username: 'owner8',
        email: 'gulnora@toyxona.uz',
        password: 'owner123',
        role: 'owner',
        isVerified: true,
        district: 'Sergeli'
      }),
      User.create({
        firstName: 'Alisher',
        lastName: 'Qoraboyev',
        username: 'owner9',
        email: 'alisher@toyxona.uz',
        password: 'owner123',
        role: 'owner',
        isVerified: true,
        district: 'Uchtepa'
      }),
      User.create({
        firstName: 'Feruza',
        lastName: 'Muhammadiyeva',
        username: 'owner10',
        email: 'feruza@toyxona.uz',
        password: 'owner123',
        role: 'owner',
        isVerified: true,
        district: 'Bektemir'
      })
    ]);

    // === CUSTOMERS ===
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

    // === 20+ TO'YXONALAR (UZBEKISTONDA HAQIQIY) ===
    const hallsData = [
      {
        name: 'Oltin Vodiy',
        description: 'Tashkent shahrining eng hashamatli to\'yxonasi. 500 kishilik sig\'im, premium dekorasyon, professional DJ va kamera xizmati.',
        address: 'Amir Temur ko\'chasi, 12',
        district: 'Yunusobod',
        capacity: 500,
        price: 250000,
        phone: '+998 90 111 2222',
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1519671482677-26ae3d4ae0d7?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [
          { name: 'Sherali Jorayev', price: 5000000 },
          { name: 'Yulduz Usmonova', price: 4500000 }
        ],
        karnaySurnay: { available: true, price: 1000000 },
        menus: [
          { name: 'Premium Menyu', price: 300000, items: ['Osh', 'Somsa', 'Shashlik', 'Lagmon'] },
          { name: 'Standart Menyu', price: 150000, items: ['Osh', 'Somsa', 'Kabob'] }
        ],
        cars: [
          { name: 'Mercedes S-Class', price: 2000000 },
          { name: 'BMW 7 Series', price: 1800000 }
        ]
      },
      {
        name: 'Crystal Palace',
        description: 'Zamonaviy va elegan to\'yxona. 300 kishilik sig\'im, air-conditioning, WiFi, katta parkingga ega.',
        address: 'Bobur ko\'chasi, 45',
        district: 'Chilonzor',
        capacity: 300,
        price: 180000,
        phone: '+998 91 222 3333',
        images: [
          'https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1519671482677-26ae3d4ae0d7?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1585183453141-f5ee4e9b1b73?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [{ name: 'Nilufar Usmonova', price: 4000000 }],
        karnaySurnay: { available: true, price: 800000 },
        menus: [{ name: 'VIP Menyu', price: 400000, items: ['Plov', 'Kabob', 'Manti', 'Shorva'] }],
        cars: [{ name: 'Toyota Camry', price: 1200000 }]
      },
      {
        name: 'Saroy Toyxona',
        description: 'An\'anaviy o\'zbek uslubida yasalgan hashamatli to\'yxona. 200 kishilik sig\'im, qo\'l qilingan dekorasyon.',
        address: 'Abdulla Kodiri ko\'chasi, 78',
        district: 'Mirzo Ulugbek',
        capacity: 200,
        price: 120000,
        phone: '+998 93 333 4444',
        images: [
          'https://images.unsplash.com/photo-1585183453141-f5ee4e9b1b73?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [{ name: 'Mehridor Tohiri', price: 3500000 }],
        karnaySurnay: { available: true, price: 900000 },
        menus: [{ name: 'Standart Menyu', price: 120000, items: ['Plov', 'Kabob', 'Somsa'] }],
        cars: [{ name: 'Chevrolet Malibu', price: 1000000 }]
      },
      {
        name: 'Royal Garden',
        description: 'Ochiq havoda to\'yxona. 150 kishilik sig\'im. Sabzi-gullar bilan bezatilgan, bahor-yozda eng chiroyli.',
        address: 'Nukus ko\'chasi, 34',
        district: 'Mirobod',
        capacity: 150,
        price: 100000,
        phone: '+998 94 444 5555',
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [],
        karnaySurnay: { available: true, price: 600000 },
        menus: [{ name: 'Oqaida Menyu', price: 100000, items: ['Osh', 'Kabob'] }],
        cars: []
      },
      {
        name: 'Modern Studio',
        description: 'Kichik va intim to\'yxona. 100 kishilik sig\'im. Multimedia ta\'minoti mavjud.',
        address: 'Turon ko\'chasi, 56',
        district: 'Yakkasaroy',
        capacity: 100,
        price: 80000,
        phone: '+998 95 555 6666',
        images: [
          'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [],
        karnaySurnay: { available: false, price: 0 },
        menus: [{ name: 'Chuchvara Menyu', price: 80000, items: ['Chuchvara', 'Kabob', 'Somsa'] }],
        cars: []
      },
      {
        name: 'Tashkent Palace',
        description: 'Tashkent shahrining qarol bezi. 400 kishilik sig\'im, royali dekorasyon, barcha ta\'minoti.',
        address: 'Buyuk Ipak Yo\'li, 100',
        district: 'Shayxontohur',
        capacity: 400,
        price: 220000,
        phone: '+998 96 666 7777',
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [{ name: 'Shahzod Salimov', price: 4500000 }],
        karnaySurnay: { available: true, price: 950000 },
        menus: [{ name: 'Deluxe Menyu', price: 350000, items: ['Plov', 'Kabob', 'Manti', 'Shorva', 'Shashlik'] }],
        cars: [{ name: 'Audi A6', price: 1500000 }]
      },
      {
        name: 'Green Paradise',
        description: 'Tabiat ichida to\'yxona. 180 kishilik sig\'im. Bir necha go\'zal bosh va platforma bor.',
        address: 'Yangi Shahar ko\'chasi, 23',
        district: 'Olmazor',
        capacity: 180,
        price: 140000,
        phone: '+998 97 777 8888',
        images: [
          'https://images.unsplash.com/photo-1519671482677-26ae3d4ae0d7?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1585183453141-f5ee4e9b1b73?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [{ name: 'Umidjon Hasanov', price: 3000000 }],
        karnaySurnay: { available: true, price: 700000 },
        menus: [{ name: 'Yevropa Menyu', price: 200000, items: ['Biftek', 'Kabob', 'Somsa', 'Salat'] }],
        cars: [{ name: 'Honda Accord', price: 900000 }]
      },
      {
        name: 'Bahor Hall',
        description: 'Yangi va taraqqiyotchi to\'yxona. 250 kishilik sig\'im, zamonaviy audio-visual ta\'minoti.',
        address: 'Farobiy ko\'chasi, 67',
        district: 'Sergeli',
        capacity: 250,
        price: 160000,
        phone: '+998 98 888 9999',
        images: [
          'https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [{ name: 'Nodira Rahmatova', price: 3500000 }],
        karnaySurnay: { available: true, price: 750000 },
        menus: [{ name: 'Kombinatsiya Menyu', price: 180000, items: ['Plov', 'Somsa', 'Kabob', 'Chuchvara'] }],
        cars: []
      },
      {
        name: 'Qo\'qon Saroy',
        description: 'Qo\'qon sha\'ri uslubida yasalgan to\'yxona. 220 kishilik sig\'im, qadimiy dekorasyon.',
        address: 'Islom Karimov ko\'chasi, 45',
        district: 'Uchtepa',
        capacity: 220,
        price: 130000,
        phone: '+998 90 999 0000',
        images: [
          'https://images.unsplash.com/photo-1519671482677-26ae3d4ae0d7?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [{ name: 'Tolib Ismailov', price: 2500000 }],
        karnaySurnay: { available: true, price: 650000 },
        menus: [{ name: 'Farg\'ona Menyu', price: 110000, items: ['Lag\'mon', 'Somsa', 'Kabob'] }],
        cars: []
      },
      {
        name: 'Zarafshan',
        description: 'Zarafshan daryosi sohilida to\'yxona. 280 kishilik sig\'im, suvga qaragan platforma.',
        address: 'Bukhoro Ko\'chasi, 89',
        district: 'Bektemir',
        capacity: 280,
        price: 175000,
        phone: '+998 91 111 1111',
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1585183453141-f5ee4e9b1b73?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [{ name: 'Mohid Rasulov', price: 3800000 }],
        karnaySurnay: { available: true, price: 850000 },
        menus: [{ name: 'Bukhoro Menyu', price: 160000, items: ['Plov', 'Kabob', 'Qozon Kabob', 'Somsa'] }],
        cars: [{ name: 'Mazda 6', price: 1100000 }]
      },
      {
        name: 'Mirza Ulugbek',
        description: 'Astronomo Mirza Ulugbek-ga bag\'ishlangan to\'yxona. 310 kishilik sig\'im, ilmiy dekorasyon.',
        address: 'Navoi ko\'chasi, 111',
        district: 'Mirzo Ulugbek',
        capacity: 310,
        price: 185000,
        phone: '+998 92 222 2222',
        images: [
          'https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1519671482677-26ae3d4ae0d7?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [{ name: 'Hamid Ishanqulov', price: 4200000 }],
        karnaySurnay: { available: true, price: 900000 },
        menus: [{ name: 'Samarqand Menyu', price: 170000, items: ['Plov', 'Manti', 'Kabob', 'Shorva'] }],
        cars: [{ name: 'Skoda Superb', price: 1300000 }]
      },
      {
        name: 'Yunus Rajabiy',
        description: 'Famousi shoir Yunus Rajabiyga bag\'ishlangan to\'yxona. 200 kishilik sig\'im, mehnatsevurlik dekorasyon.',
        address: 'Temur Ko\'chasi, 22',
        district: 'Yunusobod',
        capacity: 200,
        price: 125000,
        phone: '+998 93 333 3333',
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [{ name: 'Faiz Muhammad', price: 3200000 }],
        karnaySurnay: { available: false, price: 0 },
        menus: [{ name: 'Amaliy Menyu', price: 115000, items: ['Plov', 'Somsa', 'Kabob'] }],
        cars: []
      },
      {
        name: 'Silk Road Palace',
        description: 'Ipak Yo\'li tarikxiga bag\'ishlangan to\'yxona. 350 kishilik sig\'im, xalqaro bezak.',
        address: 'Xorazm ko\'chasi, 33',
        district: 'Chilonzor',
        capacity: 350,
        price: 195000,
        phone: '+998 94 444 4444',
        images: [
          'https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [{ name: 'Azam Ali', price: 5500000 }],
        karnaySurnay: { available: true, price: 1100000 },
        menus: [{ name: 'International Menyu', price: 320000, items: ['Steyk', 'Kabob', 'Plov', 'Makaron'] }],
        cars: [{ name: 'Mercedes GLE', price: 2200000 }]
      },
      {
        name: 'Hayot Saroy',
        description: 'Hayotning eng yaqin kunlarini o\'tkazish uchun to\'yxona. 160 kishilik sig\'im.',
        address: 'Berdax ko\'chasi, 44',
        district: 'Mirobod',
        capacity: 160,
        price: 105000,
        phone: '+998 95 555 5555',
        images: [
          'https://images.unsplash.com/photo-1519671482677-26ae3d4ae0d7?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1585183453141-f5ee4e9b1b73?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [],
        karnaySurnay: { available: true, price: 550000 },
        menus: [{ name: 'Sade Menyu', price: 95000, items: ['Osh', 'Kabob'] }],
        cars: []
      },
      {
        name: 'Buxoro Royal',
        description: 'Buxoro emirati tarikxiga bag\'ishlangan to\'yxona. 260 kishilik sig\'im.',
        address: 'Amir Quli Marvi ko\'chasi, 55',
        district: 'Yakkasaroy',
        capacity: 260,
        price: 150000,
        phone: '+998 96 666 6666',
        images: [
          'https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [{ name: 'Bakhodir Ergashev', price: 3000000 }],
        karnaySurnay: { available: true, price: 800000 },
        menus: [{ name: 'Qadimiy Menyu', price: 140000, items: ['Lag\'mon', 'Somsa', 'Kabob', 'Plov'] }],
        cars: []
      },
      {
        name: 'Samarqand Star',
        description: 'Samarqand\' shahri tarikxidagi yulduzga bag\'ishlangan to\'yxona. 290 kishilik sig\'im.',
        address: 'Temur Malik ko\'chasi, 66',
        district: 'Shayxontohur',
        capacity: 290,
        price: 170000,
        phone: '+998 97 777 7777',
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [{ name: 'Nodira Karimova', price: 3700000 }],
        karnaySurnay: { available: true, price: 880000 },
        menus: [{ name: 'Samarqand Menyu', price: 155000, items: ['Plov', 'Manti', 'Kabob', 'Chuchvara'] }],
        cars: [{ name: 'Volkswagen Jetta', price: 950000 }]
      },
      {
        name: 'Farg\'ona Qarorat',
        description: 'Farg\'ona vodiysi o\'zining taqlididiga ega to\'yxona. 190 kishilik sig\'im.',
        address: 'Zarobot ko\'chasi, 77',
        district: 'Olmazor',
        capacity: 190,
        price: 135000,
        phone: '+998 98 888 8888',
        images: [
          'https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [{ name: 'Oybek Hasanov', price: 2800000 }],
        karnaySurnay: { available: true, price: 700000 },
        menus: [{ name: 'Farg\'ona Menyu', price: 125000, items: ['Lag\'mon', 'Somsa', 'Kabob', 'Shorva'] }],
        cars: []
      },
      {
        name: 'Andijan Grand',
        description: 'Andijan shahrining g\'iybati bilan bezatilgan katta to\'yxona. 270 kishilik sig\'im.',
        address: 'Mavlonov Ko\'chasi, 88',
        district: 'Sergeli',
        capacity: 270,
        price: 165000,
        phone: '+998 90 000 0000',
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [{ name: 'Kamol Raimov', price: 3300000 }],
        karnaySurnay: { available: true, price: 800000 },
        menus: [{ name: 'Andijan Menyu', price: 150000, items: ['Plov', 'Somsa', 'Kabob', 'Manti'] }],
        cars: [{ name: 'Hyundai Elantra', price: 850000 }]
      },
      {
        name: 'Navoi Cultural',
        description: 'Poet Abdulla Navoi-ga bog\'ishlangan to\'yxona. 240 kishilik sig\'im, madaniy bezak.',
        address: 'Abdulhamid Sulton ko\'chasi, 99',
        district: 'Uchtepa',
        capacity: 240,
        price: 145000,
        phone: '+998 91 111 1111',
        images: [
          'https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [{ name: 'Rahimjon Sultanov', price: 2900000 }],
        karnaySurnay: { available: false, price: 0 },
        menus: [{ name: 'Navoi Menyu', price: 135000, items: ['Plov', 'Kabob', 'Somsa'] }],
        cars: []
      },
      {
        name: 'Dream Castle',
        description: 'Orzuning saroy\'i. 320 kishilik sig\'im, to\'la multimedia ta\'minoti bilan.',
        address: 'Turon Malik Ko\'chasi, 111',
        district: 'Bektemir',
        capacity: 320,
        price: 190000,
        phone: '+998 92 222 2222',
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1517457373614-b7152f800529?auto=format&fit=crop&q=80&w=1000'
        ],
        singers: [{ name: 'Alfiya Husainova', price: 3900000 }],
        karnaySurnay: { available: true, price: 920000 },
        menus: [{ name: 'Dream Menyu', price: 175000, items: ['Plov', 'Manti', 'Kabob', 'Shorva', 'Salat'] }],
        cars: [{ name: 'Kia Sportage', price: 1050000 }]
      }
    ];

    const halls = await Promise.all(
      hallsData.map((hallData, index) => 
        Hall.create({
          ...hallData,
          status: index % 5 === 0 ? 'tasdiqlanmagan' : 'tasdiqlangan',
          ownerId: owners[index % owners.length].id
        })
      )
    );

    console.log(`✅ ${halls.length} ta hall created`);

    // === BOOKINGLAR ===
    const bookings = await Promise.all([
      Booking.create({
        customerFirstName: 'Anvar',
        customerLastName: 'Ergashov',
        customerPhone: '+998 90 111 2222',
        date: new Date('2026-06-15'),
        seatsCount: 150,
        selectedServices: { singer: { name: 'Sherali Jorayev', price: 5000000 } },
        totalPrice: 35000000,
        advancePaid: 10000000,
        status: 'upcoming',
        hallId: halls[0].id,
        customerId: customers[0].id
      }),
      Booking.create({
        customerFirstName: 'Zarina',
        customerLastName: 'Karimova',
        customerPhone: '+998 91 222 3333',
        date: new Date('2026-07-20'),
        seatsCount: 100,
        selectedServices: {},
        totalPrice: 24000000,
        advancePaid: 8000000,
        status: 'upcoming',
        hallId: halls[1].id,
        customerId: customers[1].id
      }),
      Booking.create({
        customerFirstName: 'Javlon',
        customerLastName: 'Saidov',
        customerPhone: '+998 92 333 4444',
        date: new Date('2026-05-20'),
        seatsCount: 80,
        selectedServices: {},
        totalPrice: 10000000,
        advancePaid: 5000000,
        status: 'completed',
        hallId: halls[2].id,
        customerId: customers[2].id
      })
    ]);

    console.log(`✅ ${bookings.length} ta booking created`);

    console.log('\n========================================');
    console.log('🎉 HAMMASINI MA\'LUMOT QO\'SHILDI!');
    console.log('========================================\n');
    
    console.log('📊 STATISTIKA:');
    console.log(`   • Halllar: ${halls.length} ta`);
    console.log(`   • Ownerlar: ${owners.length} ta`);
    console.log(`   • Customerlar: ${customers.length} ta`);
    console.log(`   • Bookinglar: ${bookings.length} ta\n`);

    console.log('========================================');
    console.log('🔐 TEST ACCOUNTLAR');
    console.log('========================================\n');
    
    console.log('👨‍💼 ADMIN: admin@toyxona.uz / admin123\n');
    
    console.log('🏢 OWNER EXAMPLES:');
    console.log('   • eshmat@toyxona.uz / owner123');
    console.log('   • nodira@toyxona.uz / owner123');
    console.log('   • va yana 8 ta owner\n');
    
    console.log('👤 CUSTOMERS:');
    console.log('   • anvar@gmail.com / customer123');
    console.log('   • zarina@gmail.com / customer123');
    console.log('   • javlon@gmail.com / customer123\n');

    console.log('========================================');
    console.log('✅ Tayyor! Browser-da qaytab ko\'ring!');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Xatolik:', error.message);
    process.exit(1);
  }
};

seedData();

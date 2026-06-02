const fs = require('fs');
const path = require('path');
const { sequelize } = require('./config/db');
const { Hall } = require('./models');
require('dotenv').config();

const assignImagesToHalls = async () => {
  try {
    // Get all image files from uploads folder
    const uploadsDir = path.join(__dirname, 'uploads');
    const imageFiles = fs.readdirSync(uploadsDir)
      .filter(file => /\.(jfif|jpg|jpeg|png|webp)$/i.test(file))
      .map(file => `/uploads/${file}`);

    console.log(`✅ ${imageFiles.length} ta rasm topildi`);

    // Get all halls
    const halls = await Hall.findAll();
    console.log(`✅ ${halls.length} ta hall topildi`);

    // Assign random images to each hall
    for (const hall of halls) {
      // Random 1-3 ta rasm tanlash
      const numImages = Math.floor(Math.random() * 3) + 1;
      const selectedImages = [];
      
      for (let i = 0; i < numImages; i++) {
        const randomIndex = Math.floor(Math.random() * imageFiles.length);
        selectedImages.push(imageFiles[randomIndex]);
      }

      // Hall-ni yangilash
      await hall.update({ images: selectedImages });
      console.log(`✅ ${hall.name}: ${numImages} ta rasm biriktildi`);
    }

    console.log('\n========================================');
    console.log('🎉 BARCHA HALLGA RASMLAR BIRIKTILDI!');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Xatolik:', error.message);
    process.exit(1);
  }
};

assignImagesToHalls();

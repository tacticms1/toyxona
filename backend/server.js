require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');

const app = express();

const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

require('./models');

app.get('/health', (req, res) => res.status(200).send('OK'));

app.get('/test-email', async (req, res) => {
  const { sendOTP } = require('./utils/mailer');
  try {
    await sendOTP('ibrohimbaxtiyorov440@gmail.com', '123456');
    res.json({ success: true, message: 'Email yuborildi' });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/owner', require('./routes/ownerRoutes'));
app.use('/api/halls', require('./routes/hallRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

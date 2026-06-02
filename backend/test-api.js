const axios = require('axios');

axios.get('http://localhost:5000/api/halls')
  .then(res => {
    console.log(`✅ API response: ${res.data.length} ta hall`);
    res.data.slice(0, 3).forEach((hall, i) => {
      console.log(`${i+1}. ${hall.name} (Status: ${hall.status}, Images: ${hall.images?.length || 0})`);
    });
  })
  .catch(err => {
    console.error('❌ API Error:', err.response?.data || err.message);
    process.exit(1);
  });

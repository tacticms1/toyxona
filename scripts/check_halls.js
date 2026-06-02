const fs = require('fs');

(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/halls');
    const data = await res.json();
    console.log('COUNT:', Array.isArray(data) ? data.length : (data ? Object.keys(data).length : 0));
    const path = require('path');
    const out = path.join(__dirname, '..', 'frontend', 'halls_sample.json');
    fs.writeFileSync(out, JSON.stringify(data, null, 2));
    console.log('Saved', out);
  } catch (e) {
    console.error('Fetch failed:', e);
    process.exit(1);
  }
})();

# DigitalOcean'ga Backend Deploy Qilish - TO'LIQ GUIDE

## 📋 Qadamlar:

### **QODAM 1: GitHub'da Repo Yaratish**

1. https://github.com ga kiring
2. "New repository" bosing
3. Repository nomi: `wedding-hall-booking` (yoki boshqa ism)
4. "Create repository" bosing
5. Terminal'da quyidagini yozing:

```bash
cd c:\Users\admin\Desktop\Новая папка (7)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wedding-hall-booking.git
git push -u origin main
```

⚠️ **Eslatma**: `YOUR_USERNAME` o'zingizning GitHub usernameingiz bilan almashtiring!

---

### **QODAM 2: DigitalOcean Account Yaratish**

1. https://www.digitalocean.com/ ga kiring
2. Sign Up bosing
3. Email orqali ro'yxatdan o'ting
4. Credit card qo'shing (pay-as-you-go model)
5. Create Account bosing

---

### **QODAM 3: PostgreSQL Database Yaratish**

1. DigitalOcean Dashboard'ga kiring
2. Chap tarafda "Databases" bosing
3. "Create Database" bosing
4. Database tanlang:
   - **Engine**: PostgreSQL
   - **Version**: 15
   - **Region**: Sizga eng yaqin region (masalan, Frankfurt)
   - **Size**: Basic ($15/month) yoki shared cluster ($9-12/month)
5. "Create Database Cluster" bosing

**Kutish**: 3-5 minut ketadi...

✅ Tayyorlanganidan so'ng:
- Connection string nusxalang
- DB HOST, NAME, USER, PASSWORD yozib qo'ying

---

### **QODAM 4: Backend Environment Variables o'rnatish**

1. Terminal'da quyidagini yozing:

```bash
cd c:\Users\admin\Desktop\Новая папка (7)\backend
```

2. `.env` fayl yarating (yoki `.env.example`ni `.env` qilib nusxalang)
3. Fayl ichiga quyidagini yozing:

```env
DB_HOST=your-db-host.ondigitalocean.com
DB_PORT=25060
DB_NAME=defaultdb
DB_USER=doadmin
DB_PASS=your-password-here

PORT=8080
NODE_ENV=production

EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_SERVICE=gmail
EMAIL_FROM=noreply@yourdomain.com

JWT_SECRET=your-very-secure-random-string-min-32-chars
```

⚠️ **Muhim**: 
- `DB_HOST`, `DB_USER`, `DB_PASS` - DigitalOcean'dan nusxalang
- `EMAIL_PASS` - Gmail App Password qo'llanish (2FA yoqilgan bo'lsa)
- `JWT_SECRET` - Kuchli random string yarating

---

### **QODAM 5: Backend Code Push Qilish**

```bash
cd c:\Users\admin\Desktop\Новая папка (7)
git add .
git commit -m "Add deployment configuration"
git push
```

---

### **QODAM 6: DigitalOcean App Platform'ga Deploy Qilish**

1. DigitalOcean Dashboard'da "App Platform" bosing
2. "Create App" bosing
3. GitHub'dan connect qilish:
   - "GitHub" tanlang
   - "Authorize" bosing
   - Repoinizni tanlang (`wedding-hall-booking`)
   - "Next" bosing
4. App configuration:
   - **Name**: `wedding-hall-api`
   - **Environment**: Production
   - Branch: `main`
   - **Build command**: `npm install`
   - **Run command**: `npm start`
5. "Next" bosing
6. Environment variables o'rnatish:
   - "Edit" bosing
   - Quyidagi o'zgaruvchilarni qo'shing:
   ```
   DB_HOST=...
   DB_PORT=25060
   DB_NAME=...
   DB_USER=...
   DB_PASS=...
   EMAIL_USER=...
   EMAIL_PASS=...
   EMAIL_SERVICE=gmail
   JWT_SECRET=...
   NODE_ENV=production
   PORT=8080
   ```
7. "Save" bosing
8. "Next" bosing
9. "Create Resources" bosing

**Kutish**: 5-10 minut...

✅ Deploy tayyorlanganidan so'ng:
- Backend URL ko'rinadi: `https://wedding-hall-api.ondigitalocean.app`
- Bu URL'ni frontend-da REACT_APP_API_URL sifatida ishlatish kerak

---

### **QODAM 7: Frontend'ni Update Qilish**

Frontend'da `.env` faylni o'zgartirishingiz kerak:

```bash
cd c:\Users\admin\Desktop\Новая папка (7)\frontend
```

`.env` (yoki `.env.local`) fayl yarating:

```env
VITE_API_URL=https://wedding-hall-api.ondigitalocean.app
```

Keyin `src/api/axios.js`'da qo'llanish:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

export default api;
```

---

### **QODAM 8: Frontend'ni Deploy Qilish**

Agar frontend ham deploy qilmoqchi bo'lsangiz:

1. Frontend code'ni GitHub'ga push qilish
2. DigitalOcean App Platform'da yangi App yaratish:
   - **Build command**: `npm install && npm run build`
   - **Run command**: `npm run preview` (yoki nginx ishlat)
   - **HTTP port**: `5173` (yoki build outputi)
3. Environment variables: `VITE_API_URL`

---

## ✅ Test Qilish

Deploy tayyorlanganidan so'ng:

```bash
curl https://wedding-hall-api.ondigitalocean.app/api/halls
```

Agar JSON response ko'rsatsa - deployment muvaffaqiyatli! 🎉

---

## 🔗 Foydali Linklar

- [DigitalOcean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [GitHub + DigitalOcean Integration](https://docs.digitalocean.com/products/app-platform/how-to/github/)
- [PostgreSQL Connection Strings](https://docs.digitalocean.com/products/databases/postgresql/how-to/connect/)

---

## 💡 Tips

- **Production database credentials** - hech qaychon koda yozma, `.env` faylda qo'l
- **SSL sertifikat** - DigitalOcean avtomatik qo'ladi (https://...)
- **Scaling** - Agar more users bo'lsa, App'ni upgrade qiling (Resources tab'da)
- **Database backup** - DigitalOcean avtomatik backup qiladi

---

**Biror savol bo'lsa, xabarda qoldiring!** 🚀

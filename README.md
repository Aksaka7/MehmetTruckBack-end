# 🚚 Mehmet Truck Yemek Sipariş Sistemi - Backend API

Modern ve güvenli bir yemek sipariş sistemi REST API'si. JWT tabanlı kimlik doğrulama, Stripe ödeme entegrasyonu ve kapsamlı admin paneli ile donatılmıştır.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

## 📋 İçindekiler

- [Özellikler](#özellikler)
- [Teknoloji Stack](#teknoloji-stack)
- [Kurulum](#kurulum)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Production Deployment](#production-deployment)
- [Güvenlik](#güvenlik)

## ✨ Özellikler

### 👥 Kullanıcı Özellikleri
- ✅ Kullanıcı kaydı ve girişi
- ✅ JWT tabanlı kimlik doğrulama
- ✅ Profil ve adres yönetimi
- ✅ Yemek kategorilerine göre listeleme
- ✅ Sipariş oluşturma ve takip etme
- ✅ Stripe ile güvenli ödeme entegrasyonu
- ✅ Sipariş geçmişi ve detayları
- ✅ Popüler yemekleri görüntüleme

### 🔐 Admin Özellikleri
- ✅ Kategori yönetimi (CRUD işlemleri)
- ✅ Yemek yönetimi (CRUD işlemleri)
- ✅ Sipariş yönetimi ve durum güncelleme
- ✅ Sipariş istatistikleri ve raporlar
- ✅ Kullanıcı yönetimi
- ✅ Kullanıcı hesap durumu kontrolü

## 🛠 Teknoloji Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Payment:** Stripe API
- **Security:** bcryptjs, CORS
- **File Upload:** Multer
- **Deployment:** Vercel (Serverless)

## 🚀 Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- MongoDB (v7 veya üzeri)
- npm veya yarn
- Stripe hesabı (ödeme işlemleri için)

### Adımlar

1. **Repoyu klonlayın:**
```bash
git clone https://github.com/Aksaka7/MehmetTruckBack-end.git
cd MehmetTruckBack-end
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment variables oluşturun:**
`.env` dosyası oluşturun ve gerekli değişkenleri ekleyin (aşağıya bakın)

4. **MongoDB'yi başlatın:**
```bash
# Yerel kurulum için:
mongod

# Veya MongoDB Atlas kullanın (önerilen)
```

5. **Uygulamayı başlatın:**
```bash
# Production mode
npm start

# Development mode (auto-reload)
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5000` adresinde çalışacaktır.

## 🔐 Environment Variables

Aşağıdaki environment variables'ları `.env` dosyanızda tanımlamanız gerekmektedir:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food_delivery?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Stripe Payment (Production Keys)
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# CORS (Frontend URL)
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Environment Variables Açıklamaları:

| Değişken | Açıklama | Örnek |
|----------|----------|-------|
| `NODE_ENV` | Çalışma ortamı | `production` veya `development` |
| `PORT` | Sunucu portu | `5000` |
| `MONGODB_URI` | MongoDB bağlantı URL'i | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT token şifreleme anahtarı | Min. 32 karakter güçlü şifre |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` (production) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_live_...` (production) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |

⚠️ **Önemli:** Production ortamında mutlaka güçlü şifreler kullanın ve `.env` dosyasını `.gitignore`'a ekleyin!

## 📡 API Endpoints

Base URL: `https://your-api-domain.com/api`

### 🔑 Kimlik Doğrulama
| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/auth/register` | Yeni kullanıcı kaydı | ❌ |
| POST | `/auth/login` | Kullanıcı girişi | ❌ |

### 👤 Kullanıcı İşlemleri
| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/users/profile` | Profil bilgilerini getir | ✅ |
| PUT | `/users/profile` | Profil güncelle | ✅ |
| GET | `/users/addresses` | Adreslerimi getir | ✅ |
| POST | `/users/addresses` | Yeni adres ekle | ✅ |
| PUT | `/users/addresses/:id` | Adres güncelle | ✅ |
| DELETE | `/users/addresses/:id` | Adres sil | ✅ |

### 🍔 Yemek İşlemleri
| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/categories` | Kategorileri listele | ❌ |
| GET | `/foods` | Yemekleri listele (filtreli) | ❌ |
| GET | `/foods/:id` | Yemek detayı | ❌ |
| GET | `/foods/popular` | Popüler yemekler | ❌ |

### 📦 Sipariş İşlemleri
| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/orders` | Yeni sipariş oluştur | ✅ |
| GET | `/orders/my-orders` | Sipariş geçmişim | ✅ |
| GET | `/orders/:id` | Sipariş detayı | ✅ |
| PATCH | `/orders/:id/cancel` | Siparişi iptal et | ✅ |

### 💳 Ödeme İşlemleri
| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/payment/create-payment-intent` | Ödeme başlat | ✅ |
| POST | `/payment/webhook` | Stripe webhook | ❌ |

### 🔧 Admin - Kategori Yönetimi
| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/admin/categories` | Tüm kategoriler | 👑 Admin |
| POST | `/admin/categories` | Kategori oluştur | 👑 Admin |
| PUT | `/admin/categories/:id` | Kategori güncelle | 👑 Admin |
| DELETE | `/admin/categories/:id` | Kategori sil | 👑 Admin |

### 🔧 Admin - Yemek Yönetimi
| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/admin/foods` | Tüm yemekler | 👑 Admin |
| POST | `/admin/foods` | Yemek oluştur | 👑 Admin |
| GET | `/admin/foods/:id` | Yemek detayı | 👑 Admin |
| PUT | `/admin/foods/:id` | Yemek güncelle | 👑 Admin |
| DELETE | `/admin/foods/:id` | Yemek sil | 👑 Admin |

### 🔧 Admin - Sipariş Yönetimi
| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/admin/orders` | Tüm siparişler | 👑 Admin |
| GET | `/admin/orders/stats` | Sipariş istatistikleri | 👑 Admin |
| GET | `/admin/orders/:id` | Sipariş detayı | 👑 Admin |
| PATCH | `/admin/orders/:id/status` | Sipariş durumu güncelle | 👑 Admin |

### 🔧 Admin - Kullanıcı Yönetimi
| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/admin/users` | Tüm kullanıcıları listele | 👑 Admin |
| DELETE | `/admin/users/:id` | Kullanıcı sil | 👑 Admin |
| PATCH | `/admin/users/:id/toggle-status` | Kullanıcı durumunu değiştir | 👑 Admin |

## 📝 Örnek Kullanım

### Kullanıcı Kaydı
```bash
curl -X POST https://your-api-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "phone": "+905551234567"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Kullanıcı Girişi
```bash
curl -X POST https://your-api-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Profil Bilgilerini Getirme (Authentication Required)
```bash
curl -X GET https://your-api-domain.com/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Yemekleri Listeleme (Kategoriye Göre)
```bash
curl -X GET "https://your-api-domain.com/api/foods?category=Pizza&limit=10"
```

### Sipariş Oluşturma
```bash
curl -X POST https://your-api-domain.com/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "food": "60d5ec49f1b2c8b1f8e4e1a1",
        "quantity": 2,
        "price": 49.90
      }
    ],
    "deliveryAddress": {
      "street": "Atatürk Caddesi No:123",
      "city": "Istanbul",
      "district": "Kadıköy",
      "postalCode": "34710"
    },
    "paymentMethod": "card"
  }'
```

## 📁 Proje Yapısı

```
MehmetTruckBack-end/
├── 📂 config.js                    # Uygulama konfigürasyonu
├── 📂 server.js                    # Ana sunucu dosyası
├── 📂 vercel.json                  # Vercel deployment config
│
├── 📂 controllers/                 # İş mantığı kontrolcüleri
│   ├── authController.js          # Kimlik doğrulama
│   ├── userController.js          # Kullanıcı işlemleri
│   ├── foodController.js          # Yemek işlemleri
│   ├── categoryController.js      # Kategori işlemleri
│   ├── orderController.js         # Sipariş işlemleri
│   ├── paymentController.js       # Ödeme işlemleri
│   └── 📂 admin/                  # Admin kontrolcüleri
│       ├── userController.js
│       ├── foodController.js
│       ├── categoryController.js
│       └── orderController.js
│
├── 📂 models/                      # MongoDB Mongoose modelleri
│   ├── User.js                    # Kullanıcı modeli
│   ├── Food.js                    # Yemek modeli
│   ├── Category.js                # Kategori modeli
│   └── Order.js                   # Sipariş modeli
│
├── 📂 routes/                      # API route tanımlamaları
│   ├── authRoutes.js              # Auth endpoints
│   ├── userRoutes.js              # User endpoints
│   ├── foodRoutes.js              # Food endpoints
│   ├── categoryRoutes.js          # Category endpoints
│   ├── orderRoutes.js             # Order endpoints
│   ├── paymentRoutes.js           # Payment endpoints
│   ├── uploadRoutes.js            # File upload endpoints
│   └── 📂 admin/                  # Admin routes
│       ├── userRoutes.js
│       ├── foodRoutes.js
│       ├── categoryRoutes.js
│       └── orderRoutes.js
│
├── 📂 middleware/                  # Express middleware
│   ├── auth.js                    # JWT authentication
│   └── upload.js                  # Multer file upload
│
├── 📂 database/                    # Database connection
│   └── connection.js              # MongoDB bağlantı yönetimi
│
├── 📄 package.json                # NPM dependencies
├── 📄 .env                        # Environment variables (git'e eklenmez)
├── 📄 .gitignore                  # Git ignore rules
└── 📄 README.md                   # Bu dosya
```

## 🚀 Production Deployment

### Vercel Deployment (Önerilen)

Bu proje Vercel'de serverless function olarak çalışacak şekilde yapılandırılmıştır.

#### Adımlar:

1. **Vercel CLI'yi yükleyin:**
```bash
npm i -g vercel
```

2. **Vercel'e login olun:**
```bash
vercel login
```

3. **Projeyi deploy edin:**
```bash
vercel --prod
```

4. **Environment Variables'ları Vercel Dashboard'dan ekleyin:**
   - Vercel Dashboard'a gidin
   - Settings > Environment Variables
   - Tüm `.env` değişkenlerini ekleyin

#### vercel.json Konfigürasyonu:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### MongoDB Atlas Kurulumu

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)'a gidin
2. Ücretsiz cluster oluşturun
3. Database Access'ten kullanıcı oluşturun
4. Network Access'ten IP'nizi whitelist'e ekleyin (0.0.0.0/0 tüm IP'lere izin verir)
5. Connection string'i kopyalayıp `MONGODB_URI`'ye ekleyin

### Stripe Production Setup

1. [Stripe Dashboard](https://dashboard.stripe.com/)'a gidin
2. "Developers" > "API keys" bölümünden production key'leri alın
3. Webhook endpoint'i ekleyin: `https://your-domain.com/api/payment/webhook`
4. Webhook secret'ı `.env`'ye ekleyin

### Post-Deployment Checklist

- [ ] Tüm environment variables doğru şekilde ayarlandı
- [ ] MongoDB Atlas connection string güncellendi
- [ ] Stripe production keys eklendi
- [ ] CORS ayarları frontend domain'i ile güncellendi
- [ ] JWT_SECRET güçlü bir şifre ile değiştirildi
- [ ] Admin kullanıcısı oluşturuldu
- [ ] API endpoints test edildi
- [ ] Error logging aktif
- [ ] Rate limiting eklendi (opsiyonel ama önerilen)

## ⚙️ Konfigürasyon

## ⚙️ Konfigürasyon

`config.js` dosyasında aşağıdaki ayarları yönetebilirsiniz:

```javascript
module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
};
```

## 👨‍💼 Admin Kullanıcısı Oluşturma

İlk admin kullanıcısını oluşturmak için:

### Yöntem 1: MongoDB Compass veya Atlas UI
1. Normal kayıt işlemi yapın
2. MongoDB'de `users` koleksiyonunu açın
3. Kullanıcının `role` alanını `"admin"` olarak değiştirin

### Yöntem 2: MongoDB Shell
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Yöntem 3: Script ile (önerilen)
```javascript
// scripts/createAdmin.js dosyası oluşturun
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const admin = await User.create({
    username: "admin",
    email: "admin@mehmet-truck.com",
    password: "YourSecurePassword123!",
    phone: "+905551234567",
    role: "admin"
  });
  
  console.log('Admin created:', admin);
  process.exit(0);
}

createAdmin();
```

## 🔒 Güvenlik

Bu proje aşağıdaki güvenlik önlemlerini içermektedir:

### Implemented Security Features
- ✅ **Password Hashing:** bcryptjs ile güvenli şifre hashleme (10 rounds)
- ✅ **JWT Authentication:** Token tabanlı kimlik doğrulama
- ✅ **CORS Protection:** Cross-Origin Resource Sharing kontrolü
- ✅ **Role-Based Access Control:** Admin ve user yetkilendirme
- ✅ **Account Status Check:** Deaktif kullanıcılar giriş yapamaz
- ✅ **Input Validation:** Mongoose schema validation
- ✅ **Error Handling:** Global error handler
- ✅ **Secure Payment:** Stripe PCI-compliant payment processing

### Önerilen Ek Güvenlik Önlemleri

#### 1. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100 // maksimum 100 istek
});

app.use('/api/', limiter);
```

#### 2. Helmet.js (HTTP Headers Security)
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

#### 3. Express Validator
```bash
npm install express-validator
```

#### 4. MongoDB Injection Protection
```bash
npm install express-mongo-sanitize
```

### Güvenlik Best Practices

- 🔐 **Şifreler:** Minimum 8 karakter, büyük/küçük harf, rakam ve özel karakter
- 🔑 **JWT Secret:** Minimum 32 karakter, rastgele ve güçlü
- 🌐 **CORS:** Sadece güvendiğiniz domain'lere izin verin
- 📝 **Logging:** Tüm önemli işlemleri loglayın
- 🔄 **Updates:** Düzenli olarak npm paketlerini güncelleyin
- 🚫 **Environment:** `.env` dosyasını asla Git'e eklemeyin
- 📊 **Monitoring:** Production'da hata ve performans izleme sistemi kullanın

## 🧪 Test

```bash
# Test scriptleri eklenebilir
npm test
```

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: MongoDB connection failed
```
**Çözüm:** MongoDB URI'yi kontrol edin, Atlas'ta IP whitelist ayarlarını kontrol edin.

### JWT Token Invalid
```
Error: Invalid token
```
**Çözüm:** Token'ın doğru formatta gönderildiğinden emin olun: `Authorization: Bearer <token>`

### Stripe Webhook Failed
```
Error: Webhook signature verification failed
```
**Çözüm:** `STRIPE_WEBHOOK_SECRET` değişkenini kontrol edin.

## 📞 İletişim ve Destek

- **Repository:** [github.com/Aksaka7/MehmetTruckBack-end](https://github.com/Aksaka7/MehmetTruckBack-end)
- **Issues:** GitHub Issues üzerinden sorun bildirebilirsiniz

## 📄 License

ISC License

## 🙏 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📈 Roadmap

- [ ] Unit ve Integration testleri
- [ ] Rate limiting implementasyonu
- [ ] Redis cache entegrasyonu
- [ ] Email notification servisi
- [ ] SMS notification (Twilio)
- [ ] Real-time order tracking (Socket.io)
- [ ] GraphQL API
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] API documentation (Swagger/OpenAPI)

---

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!** 
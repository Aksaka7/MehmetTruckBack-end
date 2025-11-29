# 🚀 Mehmet Truck Backend - Production Deployment Guide

Bu rehber, backend API'nizi production ortamına deploy etmek için adım adım talimatları içermektedir.

## 📋 Pre-Deployment Checklist

Deployment öncesinde aşağıdaki kontrolleri yapın:

- [ ] MongoDB Atlas hesabı oluşturuldu
- [ ] Stripe hesabı production key'leri alındı
- [ ] Vercel hesabı oluşturuldu
- [ ] Tüm environment variables hazır
- [ ] Frontend domain bilgisi mevcut
- [ ] `.env` dosyası `.gitignore`'a eklendi
- [ ] Test yapıldı ve sorunsuz çalışıyor

---

## 1️⃣ MongoDB Atlas Setup

### Adım 1: Cluster Oluşturma

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)'a gidin ve hesap oluşturun
2. "Create a New Cluster" butonuna tıklayın
3. **FREE tier (M0)** seçin - ücretsizdir
4. Region olarak size en yakın bölgeyi seçin (örn: Frankfurt, EU-West-1)
5. Cluster Name: `mehmet-truck-cluster`
6. "Create Cluster" butonuna tıklayın (5-7 dakika sürebilir)

### Adım 2: Database User Oluşturma

1. Sol menüden **Database Access** seçin
2. "Add New Database User" butonuna tıklayın
3. Authentication Method: **Password**
4. Username: `mehmet-truck-admin`
5. Password: Güçlü bir şifre oluşturun ve kaydedin! (Bu şifreyi sonra kullanacaksınız)
6. Built-in Role: **Read and write to any database**
7. "Add User" butonuna tıklayın

### Adım 3: Network Access

1. Sol menüden **Network Access** seçin
2. "Add IP Address" butonuna tıklayın
3. **Allow Access from Anywhere** seçin (0.0.0.0/0)
   - Vercel serverless functions için gerekli
4. "Confirm" butonuna tıklayın

### Adım 4: Connection String Alma

1. Sol menüden **Database** > **Connect** butonuna tıklayın
2. "Connect your application" seçin
3. Driver: **Node.js** ve Version: **4.1 or later** seçin
4. Connection string'i kopyalayın:

```
mongodb+srv://mehmet-truck-admin:<password>@mehmet-truck-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

5. `<password>` kısmını gerçek şifrenizle değiştirin
6. Database ismini ekleyin (örn: `food_delivery`):

```
mongodb+srv://mehmet-truck-admin:YOUR_PASSWORD@mehmet-truck-cluster.xxxxx.mongodb.net/food_delivery?retryWrites=true&w=majority
```

✅ Bu connection string'i `.env` dosyanıza `MONGODB_URI` olarak kaydedin!

---

## 2️⃣ Stripe Production Setup

### Adım 1: Stripe Hesabı

1. [Stripe Dashboard](https://dashboard.stripe.com/register)'a gidin ve hesap oluşturun
2. Email doğrulaması yapın
3. İşletme bilgilerini doldurun

### Adım 2: API Keys

1. [API Keys](https://dashboard.stripe.com/apikeys) sayfasına gidin
2. **Test mode** kapalı olmalı (sağ üstte "Test mode" toggle'ı)
3. İki key'i kopyalayın:
   - **Publishable key** (pk_live_...)
   - **Secret key** (sk_live_...) - "Reveal test key" butonuna tıklayın

⚠️ **Önemli:** Secret key'i kimseyle paylaşmayın!

### Adım 3: Webhook Setup

1. [Webhooks](https://dashboard.stripe.com/webhooks) sayfasına gidin
2. "Add endpoint" butonuna tıklayın
3. Endpoint URL: `https://your-vercel-domain.vercel.app/api/payment/webhook`
   - ⚠️ Deploy ettikten sonra gerçek domain ile değiştirin
4. "Select events" bölümünde şunları seçin:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.succeeded`
5. "Add endpoint" butonuna tıklayın
6. Webhook signing secret'ı kopyalayın (whsec_...)

✅ Bu bilgileri `.env` dosyanıza kaydedin:
```env
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

---

## 3️⃣ Vercel Deployment

### Adım 1: GitHub'a Push

```bash
# Önce .env dosyanızın .gitignore'da olduğundan emin olun
git status

# Değişiklikleri commit edin
git add .
git commit -m "Production ready deployment"
git push origin main
```

### Adım 2: Vercel Setup

1. [Vercel](https://vercel.com)'e gidin ve GitHub ile giriş yapın
2. "Add New Project" butonuna tıklayın
3. GitHub repository'nizi seçin: `MehmetTruckBack-end`
4. "Import" butonuna tıklayın

### Adım 3: Configure Project

1. **Framework Preset:** Other (bırakın)
2. **Root Directory:** ./ (bırakın)
3. **Build Command:** Boş bırakın
4. **Output Directory:** Boş bırakın

### Adım 4: Environment Variables Ekleme

⚠️ **En önemli adım!** Tüm environment variables'ları ekleyin:

1. "Environment Variables" bölümünü açın
2. Her bir değişkeni ekleyin:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://mehmet-truck-admin:YOUR_PASSWORD@cluster.mongodb.net/food_delivery
JWT_SECRET=YOUR_STRONG_JWT_SECRET_MIN_32_CHARS
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

3. Her değişken için "Add" butonuna tıklayın

### Adım 5: Deploy

1. "Deploy" butonuna tıklayın
2. Deployment tamamlanmasını bekleyin (2-3 dakika)
3. Başarılı olursa "Congratulations!" mesajı göreceksiniz

✅ **Your backend is now live!**

Vercel size otomatik bir domain verecek:
```
https://your-project-name.vercel.app
```

---

## 4️⃣ Post-Deployment Tasks

### Test Endpoints

Deployment sonrası API'nin çalıştığını test edin:

```bash
# Health check
curl https://your-domain.vercel.app/health

# API root
curl https://your-domain.vercel.app/

# Test login (önce bir user oluşturun)
curl -X POST https://your-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "phone": "+905551234567"
  }'
```

### Stripe Webhook URL Güncelleme

1. Stripe Dashboard > Webhooks'a geri dönün
2. Webhook endpoint'i güncelleyin:
   - Yeni URL: `https://your-actual-domain.vercel.app/api/payment/webhook`

### Admin User Oluşturma

MongoDB Atlas UI üzerinden ilk admin kullanıcısını oluşturun:

1. Atlas Dashboard > Browse Collections
2. `users` collection'ına gidin
3. Bir user oluşturun veya mevcut user'ı güncelleyin
4. `role` field'ını `"admin"` yapın

---

## 5️⃣ Domain Configuration (Opsiyonel)

Kendi domain'inizi kullanmak isterseniz:

### Vercel'de Domain Ekleme

1. Vercel Dashboard > Project > Settings > Domains
2. "Add Domain" butonuna tıklayın
3. Domain'inizi girin: `api.your-domain.com`
4. Vercel size DNS records verecek

### DNS Ayarları

Domain sağlayıcınızda (GoDaddy, Namecheap vs.) şu ayarları yapın:

**A Record:**
```
Type: A
Name: api (veya @)
Value: 76.76.21.21
```

**CNAME Record:**
```
Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

Propagation 5-10 dakika sürebilir.

---

## 6️⃣ CORS Configuration

Frontend'iniz deploy edildikten sonra, CORS ayarlarını güncelleyin:

### server.js'de CORS güncelleme:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend-domain.com',
    'https://www.your-frontend-domain.com',
    'http://localhost:3000' // Development için
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Değişikliği push edin:
```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Vercel otomatik olarak yeniden deploy edecek.

---

## 7️⃣ Monitoring & Logs

### Vercel Logs

1. Vercel Dashboard > Your Project > Logs
2. Realtime logları görebilirsiniz
3. Hataları buradan takip edin

### MongoDB Atlas Monitoring

1. Atlas Dashboard > Metrics
2. Connection, Query, Performance metriklerini izleyin

---

## 🔒 Security Checklist

Production'da mutlaka kontrol edin:

- [ ] `.env` dosyası Git'e commit edilmedi
- [ ] JWT_SECRET güçlü ve benzersiz
- [ ] MongoDB user'ın güçlü şifresi var
- [ ] Stripe production keys kullanılıyor
- [ ] CORS sadece frontend domain'ine izin veriyor
- [ ] MongoDB Atlas'ta IP whitelist yapılandırıldı
- [ ] Tüm API endpoints test edildi
- [ ] Error handling çalışıyor

---

## 🐛 Troubleshooting

### "MongoDB connection failed"

- MongoDB URI'yi kontrol edin
- Password'de özel karakter varsa URL encode edin (`@` → `%40`)
- Network Access'te 0.0.0.0/0 olduğundan emin olun

### "Stripe webhook signature failed"

- Webhook secret'ı kontrol edin
- Webhook endpoint URL'i doğru mu?
- Stripe Dashboard'da webhook'un active olduğunu kontrol edin

### "CORS error"

- Frontend domain'i CORS ayarlarına ekleyin
- `credentials: true` olduğundan emin olun
- vercel.json'da CORS headers doğru yapılandırılmış mı?

### "Function timeout"

- MongoDB connection pool ayarlarını kontrol edin
- Vercel'de function timeout limiti 10 saniyedir (free plan)

---

## 📞 Support

Sorun yaşarsanız:

1. Vercel logs'u kontrol edin
2. MongoDB Atlas logs'u kontrol edin
3. GitHub Issues'da sorun açın

---

## 🎉 Congratulations!

Backend'iniz artık production'da çalışıyor! 🚀

**Next Steps:**
1. Frontend'i deploy edin
2. Domain'leri yapılandırın
3. SSL sertifikası kontrol edin (Vercel otomatik ekler)
4. Monitoring setup yapın
5. Backup stratejisi oluşturun

---

**Created by Aksaka7**
**Version 1.0.0**

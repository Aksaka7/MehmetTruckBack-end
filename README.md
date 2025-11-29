# Yemek Sipariş Sistemi

Bu proje, akış diyagramına göre oluşturulmuş kapsamlı bir yemek sipariş sistemi API'sidir.

## Özellikler

### Kullanıcı Özellikleri
- Kullanıcı kaydı ve girişi
- JWT tabanlı kimlik doğrulama
- Profil ve adres yönetimi
- Yemek kategorilerine göre listeleme
- Sipariş oluşturma ve takip etme
- Stripe ile ödeme entegrasyonu
- Sipariş geçmişi

### Admin Özellikleri
- Kategori yönetimi (ekleme, silme, düzenleme)
- Yemek yönetimi (CRUD işlemleri)
- Sipariş yönetimi ve durum güncelleme
- Sipariş istatistikleri
- Kullanıcı yönetimi

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. MongoDB'yi başlatın (yerel kurulum için):
```bash
mongod
```

3. Uygulamayı başlatın:
```bash
npm start
# veya geliştirme modu için:
npm run dev
```

## API Endpoints

### Kimlik Doğrulama
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi

### Kullanıcı İşlemleri
- `GET /api/users/profile` - Profil bilgilerini getir
- `PUT /api/users/profile` - Profil güncelle
- `GET /api/users/addresses` - Adreslerimi getir
- `POST /api/users/addresses` - Yeni adres ekle
- `PUT /api/users/addresses/:id` - Adres güncelle
- `DELETE /api/users/addresses/:id` - Adres sil

### Yemek İşlemleri
- `GET /api/foods/categories` - Kategorileri listele
- `GET /api/foods` - Yemekleri listele (kategori, arama filtreleri)
- `GET /api/foods/:id` - Yemek detayı
- `GET /api/foods/popular` - Popüler yemekler

### Sipariş İşlemleri
- `POST /api/orders` - Yeni sipariş oluştur
- `GET /api/orders/my-orders` - Sipariş geçmişim
- `GET /api/orders/:id` - Sipariş detayı
- `PATCH /api/orders/:id/cancel` - Siparişi iptal et

### Admin İşlemleri
#### Kategoriler
- `GET /api/admin/categories` - Tüm kategoriler
- `POST /api/admin/categories` - Kategori oluştur
- `PUT /api/admin/categories/:id` - Kategori güncelle
- `DELETE /api/admin/categories/:id` - Kategori sil

#### Yemekler
- `GET /api/admin/foods` - Tüm yemekler
- `POST /api/admin/foods` - Yemek oluştur
- `GET /api/admin/foods/:id` - Yemek detayı
- `PUT /api/admin/foods/:id` - Yemek güncelle
- `DELETE /api/admin/foods/:id` - Yemek sil

#### Siparişler
- `GET /api/admin/orders` - Tüm siparişler
- `GET /api/admin/orders/stats` - Sipariş istatistikleri
- `GET /api/admin/orders/:id` - Sipariş detayı
- `PATCH /api/admin/orders/:id/status` - Sipariş durumu güncelle

#### Kullanıcılar
- `GET /api/users/all` - Tüm kullanıcıları listele
- `DELETE /api/users/:id` - Kullanıcı sil
- `PATCH /api/users/:id/toggle-status` - Kullanıcı durumunu değiştir

## Örnek Kullanım

### Kullanıcı Kaydı
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "123456"
  }'
```

### Kullanıcı Girişi
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

### Profil Bilgilerini Getirme
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Proje Yapısı

```
├── models/
│   └── User.js              # Kullanıcı modeli
├── controllers/
│   ├── authController.js    # Kimlik doğrulama kontrolcüsü
│   └── userController.js    # Kullanıcı kontrolcüsü
├── routes/
│   ├── authRoutes.js        # Kimlik doğrulama rotaları
│   └── userRoutes.js        # Kullanıcı rotaları
├── middleware/
│   └── auth.js              # Kimlik doğrulama middleware
├── database/
│   └── connection.js        # MongoDB bağlantısı
├── config.js                # Konfigürasyon
├── server.js                # Ana sunucu dosyası
└── package.json
```

## Konfigürasyon

`config.js` dosyasında aşağıdaki ayarları değiştirebilirsiniz:

- `PORT`: Sunucu portu (varsayılan: 3000)
- `MONGODB_URI`: MongoDB bağlantı URL'i
- `JWT_SECRET`: JWT token için gizli anahtar

## Admin Kullanıcısı Oluşturma

İlk admin kullanıcısını oluşturmak için, normal kayıt işleminden sonra MongoDB'de kullanıcının `role` alanını `admin` olarak değiştirin.

## Güvenlik

- Şifreler bcrypt ile hashlenir
- JWT token'lar 24 saat geçerlidir
- Admin işlemleri için yetki kontrolü yapılır
- Deaktif kullanıcılar giriş yapamaz 
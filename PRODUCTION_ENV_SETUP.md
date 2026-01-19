# Production Environment Variables (.env) Yapılandırması

## 📋 Production Domain Yapılandırması

- **Backend Domain**: `api.dekoartizan.com`
- **Frontend Domain**: `dekoartizan.com` ve `www.dekoartizan.com`
- **Admin Panel Domain**: `admin.dekoartizan.com`

---

## 🔧 1. Backend `.env` Dosyası (`backend/.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=dekoartizan
DB_USER=your_db_user
DB_PASSWORD=your_production_db_password

# Database Pool Configuration
DB_POOL_MAX=15
DB_POOL_MIN=2
DB_POOL_ACQUIRE_MS=20000
DB_POOL_IDLE_MS=10000

# CORS Configuration - Tüm frontend ve admin domainlerini ekleyin
CORS_ORIGINS=https://dekoartizan.com,https://www.dekoartizan.com,https://admin.dekoartizan.com

# Admin Panel URL
ADMIN_URL=https://admin.dekoartizan.com

# Backend URL - Email verification linkleri için gerekli
BACKEND_URL=https://api.dekoartizan.com

# Frontend URL - Ana frontend domain
FRONTEND_URL=https://dekoartizan.com
SITE_URL=https://dekoartizan.com

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
GOOGLE_REDIRECT_URI=https://api.dekoartizan.com/api/auth/google/callback

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=dekoartizan@dekoartizan.com
SMTP_PASSWORD=your_app_password_here
SMTP_FROM=dekoartizan@dekoartizan.com
SMTP_FROM_NAME=dekoartizan

# JWT Secret (Production için güçlü bir secret kullanın)
JWT_SECRET=7781439ac5774d5628dd166fdbae1cfd309398f099a92b3a890fc8c305832ccbfe70f42166f19cf8678f8b8cc2cc4e077a56da934945e8d5a3d863bc308a9747
```

---

## 🌐 2. Frontend `.env` Dosyası (Ana Site - Root `.env`)

```env
# Production Environment
NODE_ENV=production

# Backend API URL - Production backend domain
NEXT_PUBLIC_BACKEND_URL=https://api.dekoartizan.com
NEXT_PUBLIC_API_URL=https://api.dekoartizan.com

# Frontend Base URL
NEXT_PUBLIC_BASE_URL=https://dekoartizan.com
SITE_URL=https://dekoartizan.com
```

---

## 🔐 3. Admin Panel `.env` Dosyası (`admin/.env`)

```env
# Production Environment
NODE_ENV=production

# Backend API URL - Production backend domain
NEXT_PUBLIC_BACKEND_URL=https://api.dekoartizan.com
NEXT_PUBLIC_API_URL=https://api.dekoartizan.com

# Admin Panel Base URL (opsiyonel - gerekirse kullanılır)
NEXT_PUBLIC_BASE_URL=https://admin.dekoartizan.com
```

---

## ⚠️ Önemli Notlar

1. **HTTPS Kullanımı**: Production'da mutlaka `https://` protokolünü kullanın.

2. **CORS Yapılandırması**: Backend'de `CORS_ORIGINS` değişkenine tüm domainler eklenmelidir:
   - `https://dekoartizan.com`
   - `https://www.dekoartizan.com`
   - `https://admin.dekoartizan.com`

3. **Google OAuth Redirect URI**: Google Cloud Console'da redirect URI'yi şu şekilde ayarlayın:
   ```
   https://api.dekoartizan.com/api/auth/google/callback
   ```

4. **JWT Secret**: Production için mutlaka güçlü ve rastgele bir JWT secret kullanın.

5. **Database**: Production veritabanı bilgilerinizi güvenli bir şekilde saklayın.

6. **Environment Variables**: Bu dosyaları `.gitignore`'a ekleyerek versiyon kontrolüne eklemeyin.

7. **Next.js Image Configuration**: 
   - Ana frontend (`next.config.mjs`) ve admin panel (`admin/next.config.ts`) dosyalarında production domain için image remotePatterns eklendi
   - `api.dekoartizan.com` domain'i için image yükleme izni verildi
   - Bu sayede backend'den gelen resimler Next.js Image component'i ile optimize edilebilir

8. **Backend URL**: `BACKEND_URL` değişkeni email verification linkleri için kritik öneme sahiptir. Mutlaka `https://api.dekoartizan.com` olarak ayarlanmalıdır.

---

## 🚀 Deployment Checklist

- [ ] Backend `.env` dosyası oluşturuldu ve yapılandırıldı
- [ ] Frontend `.env` dosyası oluşturuldu ve yapılandırıldı
- [ ] Admin Panel `.env` dosyası oluşturuldu ve yapılandırıldı
- [ ] Google OAuth redirect URI güncellendi
- [ ] CORS ayarları kontrol edildi
- [ ] Database bağlantı bilgileri doğrulandı
- [ ] SMTP ayarları test edildi
- [ ] JWT secret güçlü bir değerle değiştirildi
- [ ] Backend `.env`'de `BACKEND_URL=https://api.dekoartizan.com` ayarlandı
- [ ] `next.config.mjs` ve `admin/next.config.ts` dosyalarında production domain için image remotePatterns eklendi
# dekoartizan

Modern e-ticaret platformu - Dekoratif ürünler için özel tasarım.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler
- 🔐 **Kullanıcı Kimlik Doğrulama**
  - Google OAuth ile giriş/kayıt
  - E-posta/Şifre ile giriş/kayıt
  - JWT token tabanlı authentication
  - Kullanıcı profil sayfası
  - Sipariş geçmişi görüntüleme

- 📧 **E-posta Sistemi**
  - SMTP entegrasyonu (Google Workspace)
  - E-posta gönderme altyapısı hazır
  - Şifre sıfırlama ve doğrulama e-postaları için hazır

- 🛍️ **E-ticaret Temel Özellikleri**
  - Ürün listeleme ve detay sayfaları
  - Kategori bazlı filtreleme
  - Sepet yönetimi (frontend)
  - Sipariş oluşturma ve görüntüleme

### 🔄 Devam Eden Özellikler
- Sepet ve Checkout iyileştirmeleri
- Profil güncelleme
- Şifre sıfırlama
- E-posta doğrulama

## 📁 Proje Yapısı

```
dekoartizan/
├── backend/          # Node.js + Express + PostgreSQL
│   ├── routes/      # API route'ları
│   ├── models/      # Sequelize modelleri
│   ├── utils/       # Yardımcı fonksiyonlar
│   └── config/      # Yapılandırma dosyaları
├── src/             # Next.js frontend
│   ├── app/         # Next.js app router sayfaları
│   ├── components/  # React bileşenleri
│   └── context/     # React Context API
└── docs/            # Dokümantasyon
```

## 🛠️ Kurulum

### Backend
```bash
cd backend
npm install
cp .env.example .env  # .env dosyasını düzenleyin
npm run dev
```

### Frontend
```bash
npm install
npm run dev
```

## 📚 Dokümantasyon

- [Backend README](backend/README.md) - Backend API dokümantasyonu
- [SMTP Kurulum](SMTP_KURULUM_ADIMLAR.md) - E-posta gönderme kurulumu
- [Sonraki Adımlar](SONRAKI_ADIMLAR.md) - Geliştirme roadmap'i

## 🔧 Teknolojiler

### Backend
- Node.js + Express
- PostgreSQL + Sequelize ORM
- JWT Authentication
- Nodemailer (SMTP)

### Frontend
- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- React Context API

## 📝 Lisans

Bu proje özel bir projedir.

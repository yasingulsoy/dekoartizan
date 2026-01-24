# dekoartizan Backend

Backend API için Node.js, Express ve PostgreSQL kullanılmıştır.

## Kurulum

```bash
npm install
```

## Yapılandırma

Backend klasöründe `.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dekoartizan
DB_USER=postgres
DB_PASSWORD=your_password

# Database Pool Configuration
DB_POOL_MAX=15
DB_POOL_MIN=2
DB_POOL_ACQUIRE_MS=20000
DB_POOL_IDLE_MS=10000

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000

# SMTP Configuration (E-posta gönderme için)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=dekoartizan@dekoartizan.com
SMTP_PASSWORD=your_app_password_here
SMTP_FROM=dekoartizan@dekoartizan.com
SMTP_FROM_NAME=dekoartizan

# Chatbot Configuration (Opsiyonel - OpenAI API)
# OpenAI API kullanmak için aşağıdaki değişkenleri ekleyin
# OPENAI_API_KEY=your_openai_api_key_here
# OPENAI_MODEL=gpt-3.5-turbo
# Not: OpenAI API key yoksa, basit yanıt sistemi kullanılacaktır
```

## Veritabanı Bağlantısını Test Etme

```bash
npm run test
```

## Geliştirme

```bash
npm run dev
```

Sunucu `http://localhost:5000` adresinde çalışacaktır.

## Production

```bash
npm start
```

## Veritabanı Yapılandırması

Bu proje PostgreSQL kullanır ve Sequelize ORM ile pool yönetimi yapılır. Pool ayarları `.env` dosyasında yapılandırılabilir:

- `DB_POOL_MAX`: Maksimum pool bağlantı sayısı (varsayılan: 15)
- `DB_POOL_MIN`: Minimum pool bağlantı sayısı (varsayılan: 2)
- `DB_POOL_ACQUIRE_MS`: Bağlantı alma timeout (varsayılan: 20000ms)
- `DB_POOL_IDLE_MS`: Boşta kalma timeout (varsayılan: 10000ms)

## API Endpoints

### Genel
- `GET /api/health` - Sağlık kontrolü
- `GET /api/live` - Liveness probe
- `GET /api/ready` - Readiness probe

### Authentication (Auth)
- `POST /api/auth/login` - Customer login (e-posta/şifre)
- `POST /api/auth/register` - Customer kayıt
- `POST /api/auth/verify` - Token doğrulama
- `GET /api/auth/google` - Google OAuth başlatma
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/test-email` - Test e-postası gönderme (development)

### Chatbot
- `POST /api/chatbot` - Chatbot mesajı gönderme (marka bilgilerine göre tasarım önerileri)
- `GET /api/chatbot/health` - Chatbot servis durumu kontrolü

### Diğer Endpoint'ler
- `GET /api/products` - Ürün listesi
- `GET /api/products/:id` - Ürün detayı
- `GET /api/orders` - Sipariş listesi (authenticated)
- `GET /api/orders/:id` - Sipariş detayı (authenticated)

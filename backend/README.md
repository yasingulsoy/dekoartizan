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

- `GET /api/health` - Sağlık kontrolü
- `GET /api/live` - Liveness probe
- `GET /api/ready` - Readiness probe

# Admin Kullanıcısı Ekleme Rehberi

## Önemli Not
Şifreler **mutlaka hash'lenmiş** olarak veritabanına kaydedilmelidir. Düz metin şifre saklamak güvenlik açığıdır!

## Yöntem 1: Backend Uygulaması ile (Önerilen)

En güvenli yöntem, şifreyi backend uygulamanızda hash'leyip veritabanına eklemektir:

### Node.js/Express Örneği (bcrypt kullanarak):

```javascript
const bcrypt = require('bcrypt');

// Şifreyi hash'le
const password = 'admin123'; // İlk şifre
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Veritabanına ekle
await db.query(`
    INSERT INTO users (
        username, email, password_hash, first_name, last_name, role, is_active
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
`, [
    'admin',
    'admin@dekoartizan.com',
    hashedPassword,
    'Admin',
    'User',
    'admin',
    true
]);
```

### Python Örneği (Flask/Django):

```python
from werkzeug.security import generate_password_hash

password_hash = generate_password_hash('admin123')

# Veritabanına ekle
cursor.execute("""
    INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
""", ('admin', 'admin@dekoartizan.com', password_hash, 'Admin', 'User', 'admin', True))
```

## Yöntem 2: PostgreSQL pgcrypto Extension ile

Eğer PostgreSQL'de pgcrypto extension'ı aktifse:

```sql
-- Extension'ı aktif et
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Admin kullanıcısını ekle
INSERT INTO users (
    username,
    email,
    password_hash,
    first_name,
    last_name,
    role,
    is_active,
    created_by
) VALUES (
    'admin',
    'admin@dekoartizan.com',
    crypt('admin123', gen_salt('bf', 10)), -- bcrypt ile hash'leme
    'Admin',
    'User',
    'admin',
    TRUE,
    NULL
)
ON CONFLICT (username) DO NOTHING
ON CONFLICT (email) DO NOTHING;
```

## Yöntem 3: Online Bcrypt Hash Generator

1. https://bcrypt-generator.com/ gibi bir siteye gidin
2. Şifrenizi girin (örn: `admin123`)
3. Rounds: 10 seçin
4. Oluşan hash'i kopyalayın
5. `seed_admin_user.sql` dosyasındaki `password_hash` değerini değiştirin

## Güvenlik Önerileri

1. ✅ İlk şifreyi mutlaka değiştirin
2. ✅ Güçlü bir şifre kullanın (min 12 karakter, büyük/küçük harf, sayı, özel karakter)
3. ✅ Şifreleri asla düz metin olarak saklamayın
4. ✅ bcrypt veya argon2 gibi güvenli hash algoritmaları kullanın
5. ✅ Salt rounds en az 10 olmalı

## Şifre Doğrulama (Backend'de)

```javascript
// Node.js örneği
const bcrypt = require('bcrypt');

async function verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

// Kullanım
const isValid = await verifyPassword('admin123', user.password_hash);
```

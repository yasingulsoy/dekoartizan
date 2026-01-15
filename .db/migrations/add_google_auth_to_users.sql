-- Migration: Google Authentication için users tablosuna alanlar ekle
-- Tarih: 2024

-- 1. password_hash'i nullable yap (Google ile giriş yapanlar için)
ALTER TABLE users 
ALTER COLUMN password_hash DROP NOT NULL;

-- 2. google_id kolonunu ekle
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;

-- 3. auth_provider kolonunu ekle
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(20) DEFAULT 'email';

-- 4. auth_provider için CHECK constraint ekle
ALTER TABLE users 
ADD CONSTRAINT chk_users_auth_provider 
CHECK (auth_provider IN ('email', 'google'));

-- 5. auth_provider için constraint (email ise password_hash, google ise google_id gerekli)
-- Not: PostgreSQL'de bu tür karmaşık constraint'ler için trigger kullanmak daha iyi
-- Bu yüzden basit bir CHECK constraint kullanıyoruz
-- Daha detaylı kontrol için trigger eklenebilir

-- 6. Index'leri ekle
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);

-- 7. Mevcut kullanıcıların auth_provider'ını 'email' olarak ayarla
UPDATE users 
SET auth_provider = 'email' 
WHERE auth_provider IS NULL;

-- Not: Eğer mevcut kullanıcılarda password_hash NULL ise, 
-- bunları manuel olarak kontrol etmeniz gerekebilir

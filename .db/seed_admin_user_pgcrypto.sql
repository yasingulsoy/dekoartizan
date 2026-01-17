-- İlk Admin Kullanıcısını Ekleme Script'i (pgcrypto ile)
-- Bu script'i çalıştırmadan önce pgcrypto extension'ını aktif etmeniz gerekir:
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- İlk admin kullanıcısını ekle
-- Şifre: admin123 (Bu şifreyi mutlaka değiştirin!)
-- Şifre crypt fonksiyonu ile hash'lenmiş olarak saklanacak

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
    crypt('admin123', gen_salt('bf', 10)), -- Şifre burada hash'leniyor
    'Admin',
    'User',
    'admin',
    TRUE,
    NULL
)
ON CONFLICT (username) DO NOTHING;

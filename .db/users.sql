CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Google ile giriş yapanlar için NULL olabilir
    google_id VARCHAR(255) UNIQUE, -- Google kullanıcı ID'si
    auth_provider VARCHAR(20) DEFAULT 'email' CHECK (auth_provider IN ('email', 'google')), -- Giriş yöntemi
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    birth_date DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    avatar_url VARCHAR(500),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    email_verification_token VARCHAR(255),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_users_auth_provider CHECK (
        (auth_provider = 'email' AND password_hash IS NOT NULL) OR
        (auth_provider = 'google' AND google_id IS NOT NULL)
    )
);

-- Index'ler
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_auth_provider ON users(auth_provider);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_is_admin ON users(is_admin);

-- Updated_at otomatik güncelleme trigger'ı
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_users_updated_at();

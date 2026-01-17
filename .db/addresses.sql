-- Addresses Tablosu
-- Kullanıcı adreslerini saklar

CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    address_type VARCHAR(20) NOT NULL DEFAULT 'shipping',
    title VARCHAR(100),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    district VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'Türkiye',
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_addresses_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chk_addresses_address_type CHECK (address_type IN ('shipping', 'billing', 'both'))
);

-- Index'ler
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_address_type ON addresses(address_type);
CREATE INDEX idx_addresses_is_default ON addresses(is_default);
CREATE INDEX idx_addresses_is_active ON addresses(is_active);

-- Bir kullanıcı için sadece bir default adres olmasını sağlayan trigger
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = TRUE THEN
        UPDATE addresses
        SET is_default = FALSE
        WHERE user_id = NEW.user_id
        AND id != NEW.id
        AND address_type = NEW.address_type;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_single_default_address
    BEFORE INSERT OR UPDATE ON addresses
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_default_address();

-- Updated_at otomatik güncelleme trigger'ı
CREATE OR REPLACE FUNCTION update_addresses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_addresses_updated_at
    BEFORE UPDATE ON addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_addresses_updated_at();

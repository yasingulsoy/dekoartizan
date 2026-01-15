-- Coupons Tablosu
-- Kupon ve indirim kodlarını saklar

CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount'
    discount_value DECIMAL(10, 2) NOT NULL,
    min_purchase_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2), -- Yüzdelik indirimlerde maksimum indirim tutarı
    usage_limit INTEGER, -- Toplam kullanım limiti
    usage_count INTEGER DEFAULT 0,
    user_usage_limit INTEGER DEFAULT 1, -- Bir kullanıcı kaç kez kullanabilir
    applicable_to VARCHAR(50) DEFAULT 'all', -- 'all', 'category', 'product', 'sub_category'
    applicable_category_id INTEGER,
    applicable_sub_category_id INTEGER,
    applicable_product_ids INTEGER[], -- Ürün ID'leri array
    is_active BOOLEAN DEFAULT TRUE,
    starts_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_coupons_category
        FOREIGN KEY (applicable_category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_coupons_sub_category
        FOREIGN KEY (applicable_sub_category_id)
        REFERENCES sub_categories(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT chk_coupons_discount_type CHECK (discount_type IN ('percentage', 'fixed_amount')),
    CONSTRAINT chk_coupons_discount_value CHECK (discount_value > 0),
    CONSTRAINT chk_coupons_min_purchase CHECK (min_purchase_amount >= 0),
    CONSTRAINT chk_coupons_usage_limit CHECK (usage_limit IS NULL OR usage_limit > 0),
    CONSTRAINT chk_coupons_user_usage_limit CHECK (user_usage_limit > 0),
    CONSTRAINT chk_coupons_applicable_to CHECK (applicable_to IN ('all', 'category', 'product', 'sub_category'))
);

-- Index'ler
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);
CREATE INDEX idx_coupons_starts_at ON coupons(starts_at);
CREATE INDEX idx_coupons_expires_at ON coupons(expires_at);
CREATE INDEX idx_coupons_applicable_category_id ON coupons(applicable_category_id);
CREATE INDEX idx_coupons_applicable_sub_category_id ON coupons(applicable_sub_category_id);

-- Updated_at otomatik güncelleme trigger'ı
CREATE OR REPLACE FUNCTION update_coupons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_coupons_updated_at();

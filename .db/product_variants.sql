-- Product Variants Tablosu
-- Ürün varyantlarını saklar (boyut, renk, desen vb.)

CREATE TABLE IF NOT EXISTS product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    variant_type VARCHAR(50) NOT NULL, -- 'size', 'color', 'pattern', 'material' vb.
    variant_value VARCHAR(255) NOT NULL, -- 'XL', 'Kırmızı', 'Çiçekli' vb.
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_variants_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chk_product_variants_price CHECK (price IS NULL OR price >= 0),
    CONSTRAINT chk_product_variants_stock CHECK (stock_quantity >= 0)
);

-- Index'ler
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_variant_type ON product_variants(variant_type);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_product_variants_is_active ON product_variants(is_active);

-- Updated_at otomatik güncelleme trigger'ı
CREATE OR REPLACE FUNCTION update_product_variants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_variants_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_product_variants_updated_at();

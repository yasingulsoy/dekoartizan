-- Order Statuses Tablosu
-- Sipariş durumlarını saklar

CREATE TABLE IF NOT EXISTS order_statuses (
    id SERIAL PRIMARY KEY,
    code INTEGER UNIQUE NOT NULL, -- 0: alındı, 1: hazırlanıyor, 2: paketleniyor, 3: kargoya verilmek üzere yolda, 4: kargo firmasına ulaştırıldı, 5: teslim edildi
    name_tr VARCHAR(100) NOT NULL, -- Türkçe durum adı
    name_en VARCHAR(100), -- İngilizce durum adı (opsiyonel)
    description TEXT, -- Durum açıklaması
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0, -- Sıralama için
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_order_statuses_code CHECK (code >= 0 AND code <= 5)
);

-- Index'ler
CREATE INDEX idx_order_statuses_code ON order_statuses(code);
CREATE INDEX idx_order_statuses_is_active ON order_statuses(is_active);

-- Varsayılan sipariş durumlarını ekle
INSERT INTO order_statuses (code, name_tr, name_en, description, sort_order) VALUES
(0, 'Alındı', 'Received', 'Sipariş alındı ve onaylandı', 1),
(1, 'Hazırlanıyor', 'Preparing', 'Sipariş hazırlanıyor', 2),
(2, 'Paketleniyor', 'Packaging', 'Sipariş paketleniyor', 3),
(3, 'Kargoya Verilmek Üzere Yolda', 'On The Way To Cargo', 'Sipariş kargoya verilmek üzere yola çıktı', 4),
(4, 'Kargo Firmasına Ulaştırıldı', 'Reached Cargo Company', 'Sipariş kargo firmasına ulaştırıldı', 5),
(5, 'Teslim Edildi', 'Delivered', 'Sipariş teslim edildi', 6)
ON CONFLICT (code) DO NOTHING;

-- Updated_at otomatik güncelleme trigger'ı
CREATE OR REPLACE FUNCTION update_order_statuses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_order_statuses_updated_at
    BEFORE UPDATE ON order_statuses
    FOR EACH ROW
    EXECUTE FUNCTION update_order_statuses_updated_at();

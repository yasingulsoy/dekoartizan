-- Queries Tablosu
-- Arama sorguları ve müşteri sorgularını saklar

CREATE TABLE IF NOT EXISTS queries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    query_type VARCHAR(50) NOT NULL DEFAULT 'search', -- 'search', 'contact', 'support', 'complaint'
    search_term VARCHAR(255),
    query_text TEXT,
    response_text TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'answered', 'closed', 'resolved'
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    assigned_to INTEGER, -- Admin user id
    related_product_id INTEGER,
    related_order_id INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    CONSTRAINT fk_queries_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_queries_product
        FOREIGN KEY (related_product_id)
        REFERENCES products(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT chk_queries_query_type CHECK (query_type IN ('search', 'contact', 'support', 'complaint', 'feedback')),
    CONSTRAINT chk_queries_status CHECK (status IN ('pending', 'answered', 'closed', 'resolved')),
    CONSTRAINT chk_queries_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- Index'ler
CREATE INDEX idx_queries_user_id ON queries(user_id);
CREATE INDEX idx_queries_query_type ON queries(query_type);
CREATE INDEX idx_queries_status ON queries(status);
CREATE INDEX idx_queries_priority ON queries(priority);
CREATE INDEX idx_queries_search_term ON queries(search_term);
CREATE INDEX idx_queries_created_at ON queries(created_at);

-- Updated_at otomatik güncelleme trigger'ı
CREATE OR REPLACE FUNCTION update_queries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
        NEW.resolved_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_queries_updated_at
    BEFORE UPDATE ON queries
    FOR EACH ROW
    EXECUTE FUNCTION update_queries_updated_at();

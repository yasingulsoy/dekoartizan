-- Payments Tablosu
-- Ödeme bilgilerini saklar

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'
    payment_provider VARCHAR(100), -- 'iyzico', 'paypal', 'stripe', 'manual' vb.
    transaction_id VARCHAR(255) UNIQUE,
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    fee_amount DECIMAL(10, 2) DEFAULT 0, -- İşlem ücreti
    net_amount DECIMAL(10, 2) NOT NULL, -- amount - fee_amount
    card_last_four VARCHAR(4),
    card_brand VARCHAR(50), -- 'visa', 'mastercard', 'amex' vb.
    payment_date TIMESTAMP,
    failure_reason TEXT,
    refund_amount DECIMAL(10, 2) DEFAULT 0,
    refund_reason TEXT,
    refunded_at TIMESTAMP,
    metadata JSONB, -- Ek bilgiler (JSON formatında)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_payments_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_payments_status CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
    CONSTRAINT chk_payments_amounts CHECK (amount >= 0 AND fee_amount >= 0 AND net_amount >= 0 AND refund_amount >= 0),
    CONSTRAINT chk_payments_refund CHECK (refund_amount <= amount)
);

-- Index'ler
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_payment_status ON payments(payment_status);
CREATE INDEX idx_payments_payment_method ON payments(payment_method);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);

-- Updated_at otomatik güncelleme trigger'ı
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    IF NEW.payment_status = 'completed' AND OLD.payment_status != 'completed' THEN
        NEW.payment_date = CURRENT_TIMESTAMP;
    END IF;
    IF NEW.payment_status = 'refunded' AND OLD.payment_status != 'refunded' THEN
        NEW.refunded_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_payments_updated_at();

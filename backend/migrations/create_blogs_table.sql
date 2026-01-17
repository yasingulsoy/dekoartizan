-- Blog tablosu oluşturma SQL kodu
-- Bu kodu PostgreSQL veritabanınızda direkt çalıştırabilirsiniz

-- Tabloyu oluştur
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    image VARCHAR(500),
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    view_count INTEGER DEFAULT 0,
    locale VARCHAR(10) DEFAULT 'tr' NOT NULL,
    author_ids INTEGER[] DEFAULT '{}',
    author_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_blog_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Index'ler oluştur
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_is_published ON blogs(is_published);
CREATE INDEX IF NOT EXISTS idx_blogs_locale ON blogs(locale);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at);
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);

-- Updated_at otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger oluştur
DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
CREATE TRIGGER update_blogs_updated_at 
    BEFORE UPDATE ON blogs
    FOR EACH ROW 
    EXECUTE FUNCTION update_blogs_updated_at();

-- Tablo yorumları
COMMENT ON TABLE blogs IS 'Blog yazıları tablosu';
COMMENT ON COLUMN blogs.title IS 'Blog başlığı';
COMMENT ON COLUMN blogs.slug IS 'SEO dostu URL slug (benzersiz)';
COMMENT ON COLUMN blogs.content IS 'Blog içeriği (HTML formatında)';
COMMENT ON COLUMN blogs.excerpt IS 'Blog özeti';
COMMENT ON COLUMN blogs.image IS 'Kapak resmi URL yolu';
COMMENT ON COLUMN blogs.tags IS 'Blog etiketleri dizisi';
COMMENT ON COLUMN blogs.is_published IS 'Yayın durumu (true/false)';
COMMENT ON COLUMN blogs.published_at IS 'Yayınlanma tarihi ve saati';
COMMENT ON COLUMN blogs.meta_title IS 'SEO için meta başlık';
COMMENT ON COLUMN blogs.meta_description IS 'SEO için meta açıklama';
COMMENT ON COLUMN blogs.view_count IS 'Blog görüntülenme sayısı';
COMMENT ON COLUMN blogs.locale IS 'Dil kodu (tr, en, vb.)';
COMMENT ON COLUMN blogs.author_ids IS 'Yazar ID dizisi (çoklu yazar desteği)';
COMMENT ON COLUMN blogs.author_id IS 'Ana yazar ID (users tablosuna foreign key)';
COMMENT ON COLUMN blogs.created_at IS 'Kayıt oluşturulma tarihi';
COMMENT ON COLUMN blogs.updated_at IS 'Kayıt güncellenme tarihi';

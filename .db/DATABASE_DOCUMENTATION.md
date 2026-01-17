## 1. KULLANICI VE MÜŞTERİ TABLOLARI

### 📋 **users** - Admin Kullanıcıları
Admin paneli için kullanıcı bilgilerini saklar.

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz kullanıcı ID'si |
| `email` | varchar(255) | E-posta adresi (benzersiz, zorunlu) |
| `password_hash` | varchar(255) | Şifre hash'i (Google ile giriş yapanlar için null olabilir) |
| `google_id` | varchar(255) | Google hesap ID'si (Google ile giriş için) |
| `auth_provider` | varchar(20) | Kimlik doğrulama sağlayıcısı ('email' veya 'google') |
| `first_name` | varchar(100) | Ad |
| `last_name` | varchar(100) | Soyad |
| `phone` | varchar(20) | Telefon numarası |
| `birth_date` | timestamp | Doğum tarihi |
| `gender` | varchar(10) | Cinsiyet ('male', 'female', 'other') |
| `is_email_verified` | boolean | E-posta doğrulandı mı? (varsayılan: false) |
| `is_active` | boolean | Hesap aktif mi? (varsayılan: true) |
| `is_admin` | boolean | Admin yetkisi var mı? (varsayılan: false) |
| `avatar_url` | varchar(500) | Profil fotoğrafı URL'si |
| `reset_password_token` | varchar(255) | Şifre sıfırlama token'ı |
| `reset_password_expires` | timestamp | Şifre sıfırlama token'ının sona erme zamanı |
| `email_verification_token` | varchar(255) | E-posta doğrulama token'ı |
| `last_login` | timestamp | Son giriş zamanı |
| `username` | varchar(20) | Kullanıcı adı |
| `created_at` | timestamp | Kayıt oluşturulma zamanı |
| `updated_at` | timestamp | Son güncelleme zamanı |

---

### 👥 **customers** - Müşteriler
E-ticaret sitesindeki müşteri bilgilerini saklar.

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz müşteri ID'si |
| `email` | varchar(255) | E-posta adresi (benzersiz, zorunlu) |
| `password_hash` | varchar(255) | Şifre hash'i (Google ile giriş yapanlar için null olabilir) |
| `google_id` | varchar(255) | Google hesap ID'si |
| `auth_provider` | varchar(20) | Kimlik doğrulama sağlayıcısı ('email' veya 'google') |
| `first_name` | varchar(100) | Ad |
| `last_name` | varchar(100) | Soyad |
| `phone` | varchar(20) | Telefon numarası |
| `birth_date` | date | Doğum tarihi |
| `gender` | varchar(10) | Cinsiyet ('male', 'female', 'other') |
| `is_email_verified` | boolean | E-posta doğrulandı mı? (varsayılan: false) |
| `is_active` | boolean | Hesap aktif mi? (varsayılan: true) |
| `avatar_url` | varchar(500) | Profil fotoğrafı URL'si |
| `reset_password_token` | varchar(255) | Şifre sıfırlama token'ı |
| `reset_password_expires` | timestamp | Şifre sıfırlama token'ının sona erme zamanı |
| `email_verification_token` | varchar(255) | E-posta doğrulama token'ı |
| `last_login` | timestamp | Son giriş zamanı |
| `created_at` | timestamp | Kayıt oluşturulma zamanı |
| `updated_at` | timestamp | Son güncelleme zamanı |

---

## 2. ÜRÜN TABLOLARI

### 📦 **categories** - Ana Kategoriler
Ürün ana kategorilerini saklar.

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz kategori ID'si |
| `name` | varchar(255) | Kategori adı (zorunlu) |
| `slug` | varchar(255) | URL-friendly kategori adı (benzersiz, zorunlu) |
| `description` | text | Kategori açıklaması |
| `image_url` | varchar(500) | Kategori görseli URL'si |
| `icon` | varchar(100) | Kategori ikonu |
| `display_order` | integer | Görüntüleme sırası (varsayılan: 0) |
| `is_active` | boolean | Kategori aktif mi? (varsayılan: true) |
| `meta_title` | varchar(255) | SEO meta başlık |
| `meta_description` | text | SEO meta açıklama |
| `meta_keywords` | varchar(500) | SEO meta anahtar kelimeler |
| `created_at` | timestamp | Oluşturulma zamanı |
| `updated_at` | timestamp | Güncelleme zamanı |

---

### 📁 **sub_categories** - Alt Kategoriler
Ürün alt kategorilerini saklar.

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz alt kategori ID'si |
| `category_id` | integer (FK) | Ana kategori ID'si → `categories.id` |
| `name` | varchar(255) | Alt kategori adı (zorunlu) |
| `slug` | varchar(255) | URL-friendly alt kategori adı (benzersiz, zorunlu) |
| `description` | text | Alt kategori açıklaması |
| `image_url` | varchar(500) | Alt kategori görseli URL'si |
| `icon` | varchar(100) | Alt kategori ikonu |
| `display_order` | integer | Görüntüleme sırası (varsayılan: 0) |
| `is_active` | boolean | Alt kategori aktif mi? (varsayılan: true) |
| `meta_title` | varchar(255) | SEO meta başlık |
| `meta_description` | text | SEO meta açıklama |
| `meta_keywords` | varchar(500) | SEO meta anahtar kelimeler |
| `created_at` | timestamp | Oluşturulma zamanı |
| `updated_at` | timestamp | Güncelleme zamanı |

---

### 🛍️ **products** - Ürünler
Tüm ürün bilgilerini saklar.

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz ürün ID'si |
| `category_id` | integer (FK) | Ana kategori ID'si → `categories.id` |
| `sub_category_id` | integer (FK) | Alt kategori ID'si → `sub_categories.id` |
| `name` | varchar(255) | Ürün adı (zorunlu) |
| `slug` | varchar(255) | URL-friendly ürün adı (benzersiz, zorunlu) |
| `sku` | varchar(100) | Stok takip numarası (SKU) (benzersiz) |
| `short_description` | text | Kısa ürün açıklaması |
| `description` | text | Detaylı ürün açıklaması |
| `price` | numeric(10,2) | Ürün fiyatı (zorunlu) |
| `discount_price` | numeric(10,2) | İndirimli fiyat |
| `discount_percentage` | integer | İndirim yüzdesi (0-100, varsayılan: 0) |
| `stock_quantity` | integer | Stok miktarı (varsayılan: 0) |
| `min_order_quantity` | integer | Minimum sipariş miktarı (varsayılan: 1) |
| `max_order_quantity` | integer | Maksimum sipariş miktarı |
| `weight` | numeric(8,2) | Ürün ağırlığı (kg) |
| `dimensions` | varchar(100) | Ürün boyutları (örn: "10x20x30 cm") |
| `main_image_url` | varchar(500) | Ana ürün görseli URL'si |
| `is_active` | boolean | Ürün aktif mi? (varsayılan: true) |
| `is_archived` | boolean | Ürün arşivlendi mi? (varsayılan: false) |
| `is_featured` | boolean | Öne çıkan ürün mü? (varsayılan: false) |
| `is_new` | boolean | Yeni ürün mü? (varsayılan: false) |
| `is_on_sale` | boolean | İndirimde mi? (varsayılan: false) |
| `rating` | numeric(3,2) | Ortalama puan (0-5, varsayılan: 0) |
| `review_count` | integer | Yorum sayısı (varsayılan: 0) |
| `view_count` | integer | Görüntülenme sayısı (varsayılan: 0) |
| `sales_count` | integer | Satış sayısı (varsayılan: 0) |
| `meta_title` | varchar(255) | SEO meta başlık |
| `meta_description` | text | SEO meta açıklama |
| `meta_keywords` | varchar(500) | SEO meta anahtar kelimeler |
| `created_at` | timestamp | Oluşturulma zamanı |
| `updated_at` | timestamp | Güncelleme zamanı |

---

### 🎨 **product_variants** - Ürün Varyantları
Ürün varyantlarını saklar (boyut, renk vb.).

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz varyant ID'si |
| `product_id` | integer (FK) | Ürün ID'si → `products.id` |
| `variant_type` | varchar(50) | Varyant tipi (örn: 'size', 'color') |
| `variant_value` | varchar(255) | Varyant değeri (örn: 'XL', 'Kırmızı') |
| `sku` | varchar(100) | Varyant SKU'su |
| `price` | numeric | Varyant fiyatı (ana ürün fiyatından farklıysa) |
| `stock_quantity` | integer | Varyant stok miktarı (varsayılan: 0) |
| `image_url` | varchar(500) | Varyant görseli URL'si |
| `display_order` | integer | Görüntüleme sırası (varsayılan: 0) |
| `is_active` | boolean | Varyant aktif mi? (varsayılan: true) |
| `created_at` | timestamp | Oluşturulma zamanı |
| `updated_at` | timestamp | Güncelleme zamanı |

---

### 🖼️ **product_images** - Ürün Görselleri
Ürün görsellerini saklar.

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz görsel ID'si |
| `product_id` | integer (FK) | Ürün ID'si → `products.id` |
| `image_url` | varchar(500) | Görsel URL'si (zorunlu) |
| `file_name` | varchar(255) | Dosya adı (zorunlu) |
| `file_path` | varchar(500) | Dosya yolu (zorunlu) |
| `file_size` | integer | Dosya boyutu (byte) |
| `mime_type` | varchar(50) | Dosya tipi (örn: 'image/jpeg') |
| `alt_text` | varchar(255) | Görsel alt metni (SEO için) |
| `display_order` | integer | Görüntüleme sırası (varsayılan: 0) |
| `is_primary` | boolean | Ana görsel mi? (varsayılan: false) |
| `created_at` | timestamp | Oluşturulma zamanı |

---

## 3. SEPET VE SİPARİŞ TABLOLARI

### 🛒 **cart** - Sepet
Müşteri sepet bilgilerini saklar (JSONB formatında).

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz sepet ID'si |
| `customer_id` | integer (FK) | Müşteri ID'si → `customers.id` |
| `session_id` | varchar(255) | Oturum ID'si (misafir kullanıcılar için) |
| `items` | jsonb | Sepetteki ürünler (JSON array formatında) |
| `total_quantity` | integer | Toplam ürün sayısı (varsayılan: 0) |
| `total_price` | numeric | Toplam fiyat (varsayılan: 0) |
| `expires_at` | timestamp | Sepet sona erme zamanı |
| `created_at` | timestamp | Oluşturulma zamanı |
| `updated_at` | timestamp | Güncelleme zamanı |

**items JSON Formatı:**
```json
[
  {
    "product_id": 1,
    "product_variant_id": 2,
    "quantity": 2,
    "price": 150.00
  }
]
```

---

### 📋 **orders** - Siparişler
Müşteri siparişlerini saklar.

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz sipariş ID'si |
| `order_number` | varchar(50) | Sipariş numarası (benzersiz, zorunlu) |
| `customer_id` | integer (FK) | Müşteri ID'si → `customers.id` |
| `status` | varchar(50) | Sipariş durumu ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') |
| `order_status_code` | integer (FK) | Sipariş durum kodu → `order_statuses.code` |
| `payment_status` | varchar(50) | Ödeme durumu ('pending', 'paid', 'failed', 'refunded', 'partial') |
| `payment_method` | varchar(50) | Ödeme yöntemi |
| `subtotal` | numeric(10,2) | Ara toplam (indirim öncesi) |
| `tax_amount` | numeric(10,2) | Vergi tutarı (varsayılan: 0) |
| `shipping_cost` | numeric(10,2) | Kargo ücreti (varsayılan: 0) |
| `discount_amount` | numeric(10,2) | İndirim tutarı (varsayılan: 0) |
| `total_amount` | numeric(10,2) | Toplam tutar (zorunlu) |
| `currency` | varchar(3) | Para birimi (varsayılan: 'TRY') |
| `shipping_address_id` | integer (FK) | Teslimat adresi ID'si → `addresses.id` |
| `billing_address_id` | integer (FK) | Fatura adresi ID'si → `addresses.id` |
| `notes` | text | Sipariş notları |
| `tracking_number` | varchar(100) | Kargo takip numarası |
| `shipped_at` | timestamp | Kargoya verilme zamanı |
| `delivered_at` | timestamp | Teslim edilme zamanı |
| `cancelled_at` | timestamp | İptal edilme zamanı |
| `cancellation_reason` | text | İptal nedeni |
| `created_at` | timestamp | Oluşturulma zamanı |
| `updated_at` | timestamp | Güncelleme zamanı |

---

### 📦 **order_items** - Sipariş Kalemleri
Siparişteki ürünleri saklar.

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz kalem ID'si |
| `order_id` | integer (FK) | Sipariş ID'si → `orders.id` |
| `product_id` | integer (FK) | Ürün ID'si → `products.id` |
| `product_variant_id` | integer (FK) | Ürün varyant ID'si → `product_variants.id` |
| `product_name` | varchar(255) | Sipariş anındaki ürün adı (değişebilir) |
| `product_sku` | varchar(100) | Ürün SKU'su |
| `variant_info` | text | Varyant bilgisi (JSON formatında) |
| `quantity` | integer | Sipariş miktarı (zorunlu) |
| `unit_price` | numeric(10,2) | Birim fiyat (sipariş anındaki fiyat) |
| `discount_amount` | numeric(10,2) | İndirim tutarı (varsayılan: 0) |
| `total_price` | numeric(10,2) | Toplam fiyat (quantity × unit_price - discount_amount) |
| `created_at` | timestamp | Oluşturulma zamanı |

---

### 🏷️ **order_statuses** - Sipariş Durumları
Sipariş durumlarını saklar.

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz durum ID'si |
| `code` | integer | Durum kodu (0-5, benzersiz) |
| `name_tr` | varchar(100) | Türkçe durum adı (zorunlu) |
| `name_en` | varchar(100) | İngilizce durum adı |
| `description` | text | Durum açıklaması |
| `is_active` | boolean | Durum aktif mi? (varsayılan: true) |
| `sort_order` | integer | Sıralama (varsayılan: 0) |
| `created_at` | timestamp | Oluşturulma zamanı |
| `updated_at` | timestamp | Güncelleme zamanı |

**Durum Kodları:**
- 0: Alındı
- 1: Hazırlanıyor
- 2: Paketleniyor
- 3: Kargoya Verilmek Üzere Yolda
- 4: Kargo Firmasına Ulaştırıldı
- 5: Teslim Edildi

---

## 4. ADRES VE ÖDEME TABLOLARI

### 📍 **addresses** - Adresler
Müşteri adreslerini saklar.

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz adres ID'si |
| `customer_id` | integer (FK) | Müşteri ID'si → `customers.id` |
| `address_type` | varchar(20) | Adres tipi ('shipping', 'billing', 'both') |
| `title` | varchar(100) | Adres başlığı (örn: 'Ev', 'İş') |
| `first_name` | varchar(100) | Ad (zorunlu) |
| `last_name` | varchar(100) | Soyad (zorunlu) |
| `company` | varchar(255) | Şirket adı |
| `phone` | varchar(20) | Telefon numarası (zorunlu) |
| `address_line1` | varchar(255) | Adres satırı 1 (zorunlu) |
| `address_line2` | varchar(255) | Adres satırı 2 |
| `district` | varchar(100) | İlçe |
| `city` | varchar(100) | Şehir (zorunlu) |
| `state` | varchar(100) | Eyalet/Bölge |
| `postal_code` | varchar(20) | Posta kodu (zorunlu) |
| `country` | varchar(100) | Ülke (varsayılan: 'Türkiye') |
| `is_default` | boolean | Varsayılan adres mi? |
| `is_active` | boolean | Adres aktif mi? (varsayılan: true) |
| `created_at` | timestamp | Oluşturulma zamanı |
| `updated_at` | timestamp | Güncelleme zamanı |

---

### 💳 **payments** - Ödemeler
Sipariş ödemelerini saklar.

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz ödeme ID'si |
| `order_id` | integer (FK) | Sipariş ID'si → `orders.id` |
| `user_id` | integer (FK) | Kullanıcı ID'si → `users.id` |
| `payment_method` | varchar(50) | Ödeme yöntemi (zorunlu) |
| `payment_provider` | varchar(100) | Ödeme sağlayıcısı (örn: 'iyzico', 'stripe') |
| `transaction_id` | varchar(255) | İşlem ID'si |
| `payment_status` | varchar(50) | Ödeme durumu ('pending', 'paid', 'failed', 'refunded', 'partial') |
| `amount` | numeric | Ödeme tutarı (zorunlu) |
| `currency` | varchar(3) | Para birimi (varsayılan: 'TRY') |
| `fee_amount` | numeric | Komisyon tutarı (varsayılan: 0) |
| `net_amount` | numeric | Net tutar (amount - fee_amount) |
| `card_last_four` | varchar(4) | Kartın son 4 hanesi |
| `card_brand` | varchar(50) | Kart markası (örn: 'Visa', 'Mastercard') |
| `payment_date` | timestamp | Ödeme tarihi |
| `failure_reason` | text | Başarısızlık nedeni |
| `refund_amount` | numeric | İade tutarı (varsayılan: 0) |
| `refund_reason` | text | İade nedeni |
| `refunded_at` | timestamp | İade tarihi |
| `metadata` | jsonb | Ek bilgiler (JSON formatında) |
| `created_at` | timestamp | Oluşturulma zamanı |
| `updated_at` | timestamp | Güncelleme zamanı |

---

## 5. İNCELEME VE KUPON TABLOLARI

### ⭐ **reviews** - Ürün Yorumları
Ürün yorumlarını ve değerlendirmelerini saklar.

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz yorum ID'si |
| `product_id` | integer (FK) | Ürün ID'si → `products.id` |
| `customer_id` | integer (FK) | Müşteri ID'si → `customers.id` |
| `order_id` | integer (FK) | Sipariş ID'si → `orders.id` (siparişten yorum yapıldıysa) |
| `rating` | integer | Puan (1-5, zorunlu) |
| `title` | varchar(255) | Yorum başlığı |
| `comment` | text | Yorum metni |
| `is_verified_purchase` | boolean | Doğrulanmış satın alma mı? (varsayılan: false) |
| `is_approved` | boolean | Admin onayı aldı mı? (varsayılan: false) |
| `is_helpful_count` | integer | Kaç kişi faydalı buldu? (varsayılan: 0) |
| `admin_response` | text | Admin yanıtı |
| `admin_response_at` | timestamp | Admin yanıt tarihi |
| `created_at` | timestamp | Oluşturulma zamanı |
| `updated_at` | timestamp | Güncelleme zamanı |

---

### 🎟️ **coupons** - Kuponlar
İndirim kuponlarını saklar.

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz kupon ID'si |
| `code` | varchar(50) | Kupon kodu (benzersiz, zorunlu) |
| `name` | varchar(255) | Kupon adı (zorunlu) |
| `description` | text | Kupon açıklaması |
| `discount_type` | varchar(20) | İndirim tipi ('percentage' veya 'fixed') |
| `discount_value` | numeric | İndirim değeri (zorunlu) |
| `min_purchase_amount` | numeric | Minimum alışveriş tutarı (varsayılan: 0) |
| `max_discount_amount` | numeric | Maksimum indirim tutarı |
| `usage_limit` | integer | Toplam kullanım limiti |
| `usage_count` | integer | Kullanım sayısı (varsayılan: 0) |
| `user_usage_limit` | integer | Kullanıcı başına kullanım limiti (varsayılan: 1) |
| `applicable_to` | varchar(50) | Uygulanabilir alan ('all', 'category', 'product') |
| `applicable_category_id` | integer (FK) | Uygulanabilir kategori → `categories.id` |
| `applicable_sub_category_id` | integer (FK) | Uygulanabilir alt kategori → `sub_categories.id` |
| `applicable_product_ids` | integer[] | Uygulanabilir ürün ID'leri (array) |
| `is_active` | boolean | Kupon aktif mi? (varsayılan: true) |
| `starts_at` | timestamp | Başlangıç tarihi |
| `expires_at` | timestamp | Bitiş tarihi |
| `created_at` | timestamp | Oluşturulma zamanı |
| `updated_at` | timestamp | Güncelleme zamanı |

---

### 📝 **coupon_usage** - Kupon Kullanım Geçmişi
Kupon kullanımlarını saklar.

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz kullanım ID'si |
| `coupon_id` | integer (FK) | Kupon ID'si → `coupons.id` |
| `customer_id` | integer (FK) | Müşteri ID'si → `customers.id` |
| `order_id` | integer (FK) | Sipariş ID'si → `orders.id` |
| `discount_amount` | numeric | Uygulanan indirim tutarı (zorunlu) |
| `used_at` | timestamp | Kullanım tarihi (varsayılan: CURRENT_TIMESTAMP) |

---

## 6. DİĞER TABLOLAR

### 🔍 **queries** - Sorgular
Arama sorguları ve müşteri sorgularını saklar.

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz sorgu ID'si |
| `user_id` | integer (FK) | Kullanıcı ID'si → `users.id` |
| `query_type` | varchar(50) | Sorgu tipi ('search', 'contact', 'support', 'complaint', 'feedback') |
| `search_term` | varchar(255) | Arama terimi |
| `query_text` | text | Sorgu metni |
| `response_text` | text | Yanıt metni |
| `status` | varchar(50) | Durum ('pending', 'answered', 'closed', 'resolved') |
| `priority` | varchar(20) | Öncelik ('low', 'normal', 'high', 'urgent') |
| `assigned_to` | integer | Atanan admin kullanıcı ID'si |
| `related_product_id` | integer (FK) | İlgili ürün ID'si → `products.id` |
| `related_order_id` | integer | İlgili sipariş ID'si |
| `ip_address` | varchar(45) | IP adresi |
| `user_agent` | text | Tarayıcı bilgisi |
| `created_at` | timestamp | Oluşturulma zamanı |
| `updated_at` | timestamp | Güncelleme zamanı |
| `resolved_at` | timestamp | Çözülme zamanı |

---

### ❤️ **wishlist** - Favoriler
Müşteri favori ürünlerini saklar.

| Kolon Adı | Veri Tipi | Açıklama |
|-----------|-----------|----------|
| `id` | integer (PK) | Benzersiz favori ID'si |
| `customer_id` | integer (FK) | Müşteri ID'si → `customers.id` |
| `product_id` | integer (FK) | Ürün ID'si → `products.id` |
| `created_at` | timestamp | Eklenme zamanı (varsayılan: CURRENT_TIMESTAMP) |

---

## NOTLAR

### Foreign Key İlişkileri Özeti:
- `addresses.customer_id` → `customers.id`
- `cart.customer_id` → `customers.id`
- `orders.customer_id` → `customers.id`
- `orders.shipping_address_id` → `addresses.id`
- `orders.billing_address_id` → `addresses.id`
- `orders.order_status_code` → `order_statuses.code`
- `order_items.order_id` → `orders.id`
- `order_items.product_id` → `products.id`
- `order_items.product_variant_id` → `product_variants.id`
- `products.category_id` → `categories.id`
- `products.sub_category_id` → `sub_categories.id`
- `product_variants.product_id` → `products.id`
- `product_images.product_id` → `products.id`
- `sub_categories.category_id` → `categories.id`
- `reviews.product_id` → `products.id`
- `reviews.customer_id` → `customers.id`
- `reviews.order_id` → `orders.id`
- `coupons.applicable_category_id` → `categories.id`
- `coupons.applicable_sub_category_id` → `sub_categories.id`
- `coupon_usage.coupon_id` → `coupons.id`
- `coupon_usage.customer_id` → `customers.id`
- `coupon_usage.order_id` → `orders.id`
- `payments.order_id` → `orders.id`
- `payments.user_id` → `users.id`
- `queries.user_id` → `users.id`
- `queries.related_product_id` → `products.id`
- `wishlist.customer_id` → `customers.id`
- `wishlist.product_id` → `products.id`

### Ortak Kolonlar:
- `id`: Tüm tablolarda primary key
- `created_at`: Kayıt oluşturulma zamanı
- `updated_at`: Son güncelleme zamanı (çoğu tabloda)
- `is_active`: Aktif/pasif durumu (çoğu tabloda)

---

**Son Güncelleme:** 2024

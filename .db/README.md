# Veritabanı Şema Dosyaları

Bu klasörde e-ticaret projesi için gerekli tüm veritabanı tablolarının SQL dosyaları bulunmaktadır.

## Tablolar

### Temel Tablolar
- **users.sql** - Kullanıcı bilgileri
- **categories.sql** - Ana kategoriler
- **sub_categories.sql** - Alt kategoriler
- **products.sql** - Ürün bilgileri

### Ürün İlişkili Tablolar
- **product_images.sql** - Ürün görselleri
- **product_variants.sql** - Ürün varyantları (boyut, renk vb.)
- **reviews.sql** - Ürün yorumları ve değerlendirmeleri

### Sipariş ve Ödeme Tabloları
- **orders.sql** - Sipariş bilgileri
- **order_items.sql** - Sipariş kalemleri
- **payments.sql** - Ödeme bilgileri
- **addresses.sql** - Kullanıcı adresleri

### Sepet ve Favoriler
- **cart.sql** - Sepet bilgileri
- **wishlist.sql** - Favori ürünler

### Kupon ve İndirimler
- **coupons.sql** - Kupon ve indirim kodları
- **coupon_usage.sql** - Kupon kullanım geçmişi

### Diğer Tablolar
- **queries.sql** - Arama sorguları ve müşteri sorguları

## Kurulum

Tüm tabloları oluşturmak için PostgreSQL'de şu komutu çalıştırın:

```bash
# Tüm SQL dosyalarını sırayla çalıştırın
psql -U postgres -d dekoartizan -f users.sql
psql -U postgres -d dekoartizan -f categories.sql
psql -U postgres -d dekoartizan -f sub_categories.sql
psql -U postgres -d dekoartizan -f products.sql
psql -U postgres -d dekoartizan -f product_images.sql
psql -U postgres -d dekoartizan -f product_variants.sql
psql -U postgres -d dekoartizan -f queries.sql
psql -U postgres -d dekoartizan -f cart.sql
psql -U postgres -d dekoartizan -f orders.sql
psql -U postgres -d dekoartizan -f order_items.sql
psql -U postgres -d dekoartizan -f addresses.sql
psql -U postgres -d dekoartizan -f payments.sql
psql -U postgres -d dekoartizan -f reviews.sql
psql -U postgres -d dekoartizan -f wishlist.sql
psql -U postgres -d dekoartizan -f coupons.sql
psql -U postgres -d dekoartizan -f coupon_usage.sql
```

Veya tüm dosyaları tek seferde çalıştırmak için:

```bash
# Windows PowerShell
Get-ChildItem -Path . -Filter *.sql | ForEach-Object { psql -U postgres -d dekoartizan -f $_.FullName }

# Linux/Mac
for file in *.sql; do psql -U postgres -d dekoartizan -f "$file"; done
```

## Özellikler

- ✅ Foreign key ilişkileri
- ✅ Index'ler performans için
- ✅ Check constraint'ler veri bütünlüğü için
- ✅ Trigger'lar otomatik güncellemeler için
- ✅ Timestamp alanları (created_at, updated_at)
- ✅ Soft delete desteği (is_active flag'leri)
- ✅ Unique constraint'ler

## Migration Dosyaları

- **migrations/add_google_auth_to_users.sql** - Google Authentication desteği için users tablosuna alanlar ekler

Migration'ları çalıştırmak için:

```bash
psql -U postgres -d dekoartizan -f migrations/add_google_auth_to_users.sql
```

## Notlar

- Tüm tablolarda `created_at` ve `updated_at` alanları otomatik olarak yönetilir
- Foreign key'ler CASCADE veya RESTRICT ile yapılandırılmıştır
- Bazı tablolarda özel trigger'lar bulunur (ör: order_number otomatik oluşturma)
- PostgreSQL 12+ gereklidir
- Google Authentication için `google_id` ve `auth_provider` alanları eklendi
- `password_hash` artık nullable (Google ile giriş yapanlar için)
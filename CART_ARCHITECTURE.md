# 🛒 Sepet (Cart) Mimari Dokümantasyonu

> **Yaklaşım:** Ayrı CartItem Tablosu  
> **Durum:** Planlama Aşaması  
> **Son Güncelleme:** 2024

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Veritabanı Yapısı](#veritabanı-yapısı)
3. [Model Tanımları](#model-tanımları)
4. [İlişkiler (Relationships)](#ilişkiler-relationships)
5. [API Endpoint'leri](#api-endpointleri)
6. [İş Mantığı (Business Logic)](#iş-mantığı-business-logic)
7. [Kullanım Senaryoları](#kullanım-senaryoları)
8. [Frontend Entegrasyonu](#frontend-entegrasyonu)
9. [Migration Stratejisi](#migration-stratejisi)

---

## 🎯 Genel Bakış

### Mimari Karar
- **Yaklaşım:** Ayrı `Cart` ve `CartItem` tabloları
- **Neden:** Normalizasyon, performans, sorgulama kolaylığı
- **Alternatif:** JSONB yaklaşımı (reddedildi)

### Temel Prensipler
1. Her kullanıcının tek bir aktif sepeti olabilir
2. Misafir kullanıcılar için `session_id` kullanılır
3. Giriş yapınca misafir sepeti kullanıcıya bağlanır
4. Aynı ürün + aynı özellikler = miktar artırılır
5. Aynı ürün + farklı özellikler = yeni kayıt eklenir
6. Sipariş oluşturulunca sepet temizlenir

---

## 🗄️ Veritabanı Yapısı

### `carts` Tablosu

| Kolon Adı | Veri Tipi | Nullable | Açıklama |
|-----------|-----------|----------|----------|
| `id` | INTEGER | ❌ | Primary Key, Auto Increment |
| `customer_id` | INTEGER | ✅ | FK → `customers.id` (giriş yapmış kullanıcılar için) |
| `session_id` | VARCHAR(255) | ✅ | Misafir kullanıcılar için session ID |
| `created_at` | TIMESTAMP | ❌ | Oluşturulma zamanı |
| `updated_at` | TIMESTAMP | ❌ | Güncelleme zamanı |

**Kısıtlamalar:**
- `customer_id` ve `session_id` en az biri dolu olmalı
- Her `customer_id` için tek aktif sepet (unique constraint)
- Her `session_id` için tek aktif sepet (unique constraint)

**Index'ler:**
- `idx_carts_customer_id` (customer_id)
- `idx_carts_session_id` (session_id)

---

### `cart_items` Tablosu

| Kolon Adı | Veri Tipi | Nullable | Açıklama |
|-----------|-----------|----------|----------|
| `id` | INTEGER | ❌ | Primary Key, Auto Increment |
| `cart_id` | INTEGER | ❌ | FK → `carts.id` |
| `product_id` | INTEGER | ❌ | FK → `products.id` |
| `quantity` | INTEGER | ❌ | Ürün miktarı (min: 1) |
| `attributes` | JSONB | ✅ | Ürün özellikleri (renk, beden vb.) |
| `unit_price` | DECIMAL(10,2) | ❌ | Ürün fiyatı snapshot (ürün fiyatı değişse bile) |
| `created_at` | TIMESTAMP | ❌ | Oluşturulma zamanı |
| `updated_at` | TIMESTAMP | ❌ | Güncelleme zamanı |

**Kısıtlamalar:**
- `quantity >= 1`
- `unit_price >= 0`
- `cart_id` + `product_id` + `attributes` kombinasyonu unique olmalı

**Index'ler:**
- `idx_cart_items_cart_id` (cart_id)
- `idx_cart_items_product_id` (product_id)
- `idx_cart_items_unique` (cart_id, product_id, attributes) - UNIQUE

**Attributes JSON Formatı:**
```json
{
  "color": "Kırmızı",
  "size": "XL",
  "material": "Pamuk"
}
```
veya array formatı:
```json
["Kırmızı", "XL", "Pamuk"]
```

---

## 📦 Model Tanımları

### Cart Model (`backend/models/Cart.js`)

```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'customers',
      key: 'id'
    },
    comment: 'Giriş yapmış kullanıcılar için'
  },
  session_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    comment: 'Misafir kullanıcılar için session ID'
  }
}, {
  tableName: 'carts',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['customer_id'],
      where: {
        customer_id: {
          [Op.ne]: null
        }
      },
      name: 'idx_carts_customer_unique'
    },
    {
      unique: true,
      fields: ['session_id'],
      where: {
        session_id: {
          [Op.ne]: null
        }
      },
      name: 'idx_carts_session_unique'
    }
  ]
});

module.exports = Cart;
```

---

### CartItem Model (`backend/models/CartItem.js`)

```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'carts',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    },
    defaultValue: 1
  },
  attributes: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
    comment: 'Ürün özellikleri (renk, beden vb.) JSON formatında'
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    },
    comment: 'Ürün fiyatı snapshot - ürün fiyatı değişse bile bu fiyat kullanılır'
  }
}, {
  tableName: 'cart_items',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['cart_id'],
      name: 'idx_cart_items_cart_id'
    },
    {
      fields: ['product_id'],
      name: 'idx_cart_items_product_id'
    },
    {
      unique: true,
      fields: ['cart_id', 'product_id', 'attributes'],
      name: 'idx_cart_items_unique'
    }
  ]
});

module.exports = CartItem;
```

---

## 🔗 İlişkiler (Relationships)

### Model İlişkileri (`backend/models/index.js`)

```javascript
// Cart ilişkileri
Cart.belongsTo(Customer, { 
  foreignKey: 'customer_id', 
  as: 'customer' 
});

Cart.hasMany(CartItem, { 
  foreignKey: 'cart_id', 
  as: 'items',
  onDelete: 'CASCADE'
});

// CartItem ilişkileri
CartItem.belongsTo(Cart, { 
  foreignKey: 'cart_id', 
  as: 'cart' 
});

CartItem.belongsTo(Product, { 
  foreignKey: 'product_id', 
  as: 'product' 
});

// Customer ilişkileri
Customer.hasOne(Cart, { 
  foreignKey: 'customer_id', 
  as: 'cart' 
});

// Product ilişkileri
Product.hasMany(CartItem, { 
  foreignKey: 'product_id', 
  as: 'cartItems' 
});
```

---

## 🌐 API Endpoint'leri

### Base URL
```
/api/cart
```

### Endpoint'ler

#### 1. Sepeti Getir
```
GET /api/cart
```

**Authentication:** Gerekli (Bearer Token veya Session)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "customer_id": 5,
    "items": [
      {
        "id": 1,
        "product_id": 10,
        "product": {
          "id": 10,
          "name": "Ürün Adı",
          "slug": "urun-adi",
          "main_image_url": "https://..."
        },
        "quantity": 2,
        "attributes": {
          "color": "Kırmızı",
          "size": "XL"
        },
        "unit_price": 150.00
      }
    ],
    "total_quantity": 2,
    "total_price": 300.00,
    "adjusted_total_price": 270.00
  }
}
```

---

#### 2. Sepete Ürün Ekle
```
POST /api/cart/items
```

**Authentication:** Gerekli

**Request Body:**
```json
{
  "product_id": 10,
  "quantity": 2,
  "attributes": {
    "color": "Kırmızı",
    "size": "XL"
  }
}
```

**İş Mantığı:**
1. Kullanıcının sepetini bul (veya oluştur)
2. Aynı `product_id` + aynı `attributes` kombinasyonu var mı kontrol et
3. Varsa: Mevcut kaydın `quantity` değerini artır
4. Yoksa: Yeni `CartItem` kaydı oluştur
5. Ürünün güncel fiyatını `unit_price` olarak kaydet

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "cart_id": 1,
    "product_id": 10,
    "quantity": 2,
    "attributes": {
      "color": "Kırmızı",
      "size": "XL"
    },
    "unit_price": 150.00
  },
  "message": "Ürün sepete eklendi"
}
```

---

#### 3. Sepetten Ürün Çıkar
```
DELETE /api/cart/items/:itemId
```

**Authentication:** Gerekli

**Response:**
```json
{
  "success": true,
  "message": "Ürün sepetten çıkarıldı"
}
```

---

#### 4. Sepet Öğesi Miktarını Güncelle
```
PUT /api/cart/items/:itemId
```

**Authentication:** Gerekli

**Request Body:**
```json
{
  "quantity": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "quantity": 5,
    "unit_price": 150.00
  },
  "message": "Miktar güncellendi"
}
```

---

#### 5. Sepeti Temizle
```
DELETE /api/cart
```

**Authentication:** Gerekli

**Response:**
```json
{
  "success": true,
  "message": "Sepet temizlendi"
}
```

---

#### 6. Misafir Sepetini Kullanıcıya Bağla
```
POST /api/cart/merge
```

**Authentication:** Gerekli

**Request Body:**
```json
{
  "session_id": "abc123xyz"
}
```

**İş Mantığı:**
1. `session_id` ile misafir sepetini bul
2. Kullanıcının mevcut sepetini bul (veya oluştur)
3. Misafir sepetindeki öğeleri kullanıcı sepetine birleştir
4. Aynı ürün + aynı özellikler varsa miktarları topla
5. Misafir sepetini sil

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "items": [...],
    "total_quantity": 5
  },
  "message": "Sepetler birleştirildi"
}
```

---

## ⚙️ İş Mantığı (Business Logic)

### 1. Sepet Bulma/Oluşturma

```javascript
async function findOrCreateCart(customerId, sessionId) {
  let cart;
  
  if (customerId) {
    // Giriş yapmış kullanıcı
    cart = await Cart.findOne({
      where: { customer_id: customerId },
      include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
    });
    
    if (!cart) {
      cart = await Cart.create({ customer_id: customerId });
    }
  } else if (sessionId) {
    // Misafir kullanıcı
    cart = await Cart.findOne({
      where: { session_id: sessionId },
      include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
    });
    
    if (!cart) {
      cart = await Cart.create({ session_id: sessionId });
    }
  } else {
    throw new Error('customer_id veya session_id gerekli');
  }
  
  return cart;
}
```

---

### 2. Ürün Ekleme Mantığı

```javascript
async function addToCart(cartId, productId, quantity, attributes) {
  // 1. Ürünü kontrol et
  const product = await Product.findByPk(productId);
  if (!product || !product.is_active) {
    throw new Error('Ürün bulunamadı veya aktif değil');
  }
  
  // 2. Stok kontrolü
  if (product.stock_quantity < quantity) {
    throw new Error('Yeterli stok yok');
  }
  
  // 3. Attributes'ı normalize et (JSON string'e çevir)
  const normalizedAttributes = JSON.stringify(attributes || {});
  
  // 4. Aynı ürün + aynı özellikler var mı?
  const existingItem = await CartItem.findOne({
    where: {
      cart_id: cartId,
      product_id: productId,
      attributes: normalizedAttributes
    }
  });
  
  if (existingItem) {
    // VARSA: Miktarı artır
    const newQuantity = existingItem.quantity + quantity;
    
    // Stok kontrolü
    if (product.stock_quantity < newQuantity) {
      throw new Error('Yeterli stok yok');
    }
    
    existingItem.quantity = newQuantity;
    await existingItem.save();
    
    return existingItem;
  } else {
    // YOKSA: Yeni kayıt oluştur
    const finalPrice = product.discount_price || product.price;
    
    const newItem = await CartItem.create({
      cart_id: cartId,
      product_id: productId,
      quantity: quantity,
      attributes: normalizedAttributes,
      unit_price: finalPrice
    });
    
    return newItem;
  }
}
```

---

### 3. Sepet Hesaplama Fonksiyonu

```javascript
async function calculateCartTotals(cartId) {
  const items = await CartItem.findAll({
    where: { cart_id: cartId },
    include: [{ model: Product, as: 'product' }]
  });
  
  let totalQuantity = 0;
  let totalPrice = 0;
  let adjustedTotalPrice = 0;
  
  for (const item of items) {
    const itemTotal = item.unit_price * item.quantity;
    totalQuantity += item.quantity;
    totalPrice += itemTotal;
    
    // İndirim hesaplama (ürün bazlı)
    const product = item.product;
    let itemDiscount = 0;
    
    if (product.discount_percentage > 0) {
      itemDiscount = (itemTotal * product.discount_percentage) / 100;
    } else if (product.discount_price) {
      const originalPrice = product.price * item.quantity;
      itemDiscount = originalPrice - (product.discount_price * item.quantity);
    }
    
    adjustedTotalPrice += (itemTotal - itemDiscount);
  }
  
  return {
    total_quantity: totalQuantity,
    total_price: totalPrice,
    adjusted_total_price: adjustedTotalPrice
  };
}
```

---

### 4. Sepet Birleştirme (Giriş Yapınca)

```javascript
async function mergeGuestCart(customerId, sessionId) {
  // 1. Misafir sepetini bul
  const guestCart = await Cart.findOne({
    where: { session_id: sessionId },
    include: [{ model: CartItem, as: 'items' }]
  });
  
  if (!guestCart || guestCart.items.length === 0) {
    return null; // Birleştirilecek bir şey yok
  }
  
  // 2. Kullanıcı sepetini bul veya oluştur
  let userCart = await Cart.findOne({
    where: { customer_id: customerId },
    include: [{ model: CartItem, as: 'items' }]
  });
  
  if (!userCart) {
    userCart = await Cart.create({ customer_id: customerId });
  }
  
  // 3. Misafir sepetindeki öğeleri kullanıcı sepetine ekle
  for (const guestItem of guestCart.items) {
    const normalizedAttributes = JSON.stringify(guestItem.attributes || {});
    
    // Aynı ürün + aynı özellikler var mı?
    const existingItem = await CartItem.findOne({
      where: {
        cart_id: userCart.id,
        product_id: guestItem.product_id,
        attributes: normalizedAttributes
      }
    });
    
    if (existingItem) {
      // Birleştir: Miktarları topla
      existingItem.quantity += guestItem.quantity;
      await existingItem.save();
    } else {
      // Yeni kayıt oluştur
      await CartItem.create({
        cart_id: userCart.id,
        product_id: guestItem.product_id,
        quantity: guestItem.quantity,
        attributes: guestItem.attributes,
        unit_price: guestItem.unit_price
      });
    }
  }
  
  // 4. Misafir sepetini sil
  await guestCart.destroy();
  
  // 5. Güncellenmiş sepeti döndür
  return await Cart.findByPk(userCart.id, {
    include: [
      { model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }
    ]
  });
}
```

---

## 📝 Kullanım Senaryoları

### Senaryo 1: İki Farklı Ürün Ekleme

**Adımlar:**
1. Kullanıcı "Ürün A" (Kırmızı, XL) sepete ekler → `CartItem 1` oluşturulur
2. Kullanıcı "Ürün B" (Mavi, L) sepete ekler → `CartItem 2` oluşturulur

**Sonuç:**
```
Cart (id: 1)
├── CartItem 1: product_id=1, quantity=1, attributes={color: "Kırmızı", size: "XL"}
└── CartItem 2: product_id=2, quantity=1, attributes={color: "Mavi", size: "L"}
```

---

### Senaryo 2: Aynı Ürün 3 Kez Ekleme

**Adımlar:**
1. Kullanıcı "Ürün A" (Kırmızı, XL) sepete ekler → `CartItem 1` oluşturulur (quantity=1)
2. Kullanıcı tekrar "Ürün A" (Kırmızı, XL) sepete ekler → `CartItem 1` güncellenir (quantity=2)
3. Kullanıcı tekrar "Ürün A" (Kırmızı, XL) sepete ekler → `CartItem 1` güncellenir (quantity=3)

**Sonuç:**
```
Cart (id: 1)
└── CartItem 1: product_id=1, quantity=3, attributes={color: "Kırmızı", size: "XL"}
```

---

### Senaryo 3: Aynı Ürün Farklı Özelliklerle

**Adımlar:**
1. Kullanıcı "Ürün A" (Kırmızı, XL) sepete ekler → `CartItem 1` oluşturulur
2. Kullanıcı "Ürün A" (Siyah, M) sepete ekler → `CartItem 2` oluşturulur (yeni kayıt)

**Sonuç:**
```
Cart (id: 1)
├── CartItem 1: product_id=1, quantity=1, attributes={color: "Kırmızı", size: "XL"}
└── CartItem 2: product_id=1, quantity=1, attributes={color: "Siyah", size: "M"}
```

---

### Senaryo 4: Misafir Kullanıcı Giriş Yapınca

**Adımlar:**
1. Misafir kullanıcı (session_id: "abc123") sepete ürün ekler
2. Kullanıcı giriş yapar (customer_id: 5)
3. `POST /api/cart/merge` çağrılır
4. Misafir sepetindeki öğeler kullanıcı sepetine birleştirilir
5. Misafir sepeti silinir

**Önce:**
```
Guest Cart (session_id: "abc123")
└── CartItem 1: product_id=1, quantity=2

User Cart (customer_id: 5)
└── CartItem 2: product_id=2, quantity=1
```

**Sonra:**
```
User Cart (customer_id: 5)
├── CartItem 2: product_id=2, quantity=1 (mevcut)
└── CartItem 1: product_id=1, quantity=2 (birleştirildi)
```

---

## 🎨 Frontend Entegrasyonu

### Redux Store Yapısı

```typescript
// Mevcut Redux yapısı korunur, sadece backend sync eklenir

interface CartState {
  cart: Cart | null;
  totalPrice: number;
  adjustedTotalPrice: number;
  isLoading: boolean;
  error: string | null;
}

// Actions
- fetchCart() // Backend'den sepeti yükle
- addToCart(productId, quantity, attributes) // Backend'e kaydet + Redux'ı güncelle
- removeFromCart(itemId) // Backend'den sil + Redux'ı güncelle
- updateCartItemQuantity(itemId, quantity) // Backend'i güncelle + Redux'ı güncelle
- syncCartWithBackend() // Redux state'i backend ile senkronize et
```

---

### Giriş Yapınca Sepet Yükleme

```typescript
// AuthContext.tsx veya benzeri
useEffect(() => {
  if (isAuthenticated && token) {
    // 1. Backend'den sepeti yükle
    dispatch(fetchCart());
    
    // 2. LocalStorage'daki misafir sepetini birleştir
    const guestSessionId = localStorage.getItem('guest_session_id');
    if (guestSessionId) {
      dispatch(mergeGuestCart(guestSessionId));
      localStorage.removeItem('guest_session_id');
    }
  }
}, [isAuthenticated, token]);
```

---

### Ürün Ekleme Akışı

```typescript
async function handleAddToCart(productId, quantity, attributes) {
  try {
    // 1. Optimistic update (Redux'ı hemen güncelle)
    dispatch(addToCartOptimistic({ productId, quantity, attributes }));
    
    // 2. Backend'e kaydet
    const response = await fetch('/api/cart/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity,
        attributes: attributes
      })
    });
    
    if (!response.ok) {
      throw new Error('Sepete ekleme başarısız');
    }
    
    // 3. Backend'den güncel sepeti yükle
    dispatch(fetchCart());
    
  } catch (error) {
    // Hata durumunda Redux'ı geri al
    dispatch(rollbackCart());
    showError('Ürün sepete eklenemedi');
  }
}
```

---

## 🔄 Migration Stratejisi

### Mevcut Durumdan Yeni Yapıya Geçiş

**Mevcut:** `carts` tablosunda `items` JSONB kolonu var

**Yeni:** `cart_items` ayrı tablosu

### Migration Adımları

1. **Yeni tabloları oluştur**
   ```sql
   CREATE TABLE cart_items (...);
   ```

2. **Mevcut JSONB verilerini migrate et**
   ```javascript
   // Migration script
   const carts = await Cart.findAll();
   
   for (const cart of carts) {
     if (cart.items && Array.isArray(cart.items)) {
       for (const item of cart.items) {
         await CartItem.create({
           cart_id: cart.id,
           product_id: item.product_id,
           quantity: item.quantity,
           attributes: item.attributes || {},
           unit_price: item.price || 0
         });
       }
     }
   }
   ```

3. **JSONB kolonunu kaldır** (opsiyonel)
   ```sql
   ALTER TABLE carts DROP COLUMN items;
   ```

4. **Eski kodları güncelle**
   - Tüm `cart.items` referanslarını `CartItem` sorgularına çevir
   - API endpoint'lerini güncelle

---

## ✅ Kontrol Listesi

### Backend
- [ ] `Cart` modeli oluştur
- [ ] `CartItem` modeli oluştur
- [ ] Model ilişkilerini tanımla (`index.js`)
- [ ] Migration script'i yaz
- [ ] API route'ları oluştur (`routes/cart.js`)
- [ ] Authentication middleware ekle
- [ ] İş mantığı fonksiyonlarını yaz
- [ ] Error handling ekle
- [ ] Validation ekle

### Frontend
- [ ] Redux actions'ları güncelle
- [ ] Backend API entegrasyonu yap
- [ ] Giriş yapınca sepet yükleme
- [ ] Misafir sepeti birleştirme
- [ ] Error handling ekle
- [ ] Loading states ekle

### Test
- [ ] Unit testler (backend)
- [ ] Integration testler (API)
- [ ] E2E testler (frontend)

---

## 📚 Referanslar

- [Sequelize Associations](https://sequelize.org/docs/v6/core-concepts/assocs/)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [Redux Toolkit](https://redux-toolkit.js.org/)

---

**Son Güncelleme:** 2024  
**Dokümantasyon Versiyonu:** 1.0

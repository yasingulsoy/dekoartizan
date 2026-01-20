const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  product_variant_id: {
    type: DataTypes.INTEGER,
    allowNull: true
    // product_variants tablosu henüz tanımlı değil, referans kaldırıldı
  },
  product_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  product_sku: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  variant_info: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  cropped_image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Kırpılmış ürün resmi URL\'si'
  },
  crop_width: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Kırpma genişliği (cm)'
  },
  crop_height: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Kırpma yüksekliği (cm)'
  }
}, {
  tableName: 'order_items',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = OrderItem;

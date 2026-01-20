const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Wishlist = sequelize.define('Wishlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'id'
    },
    comment: 'Müşteri ID\'si'
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    },
    comment: 'Ürün ID\'si'
  }
}, {
  tableName: 'wishlist',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // Wishlist'te updated_at yok
  indexes: [
    {
      unique: true,
      fields: ['customer_id', 'product_id'],
      name: 'idx_wishlist_customer_product_unique'
    },
    {
      fields: ['customer_id'],
      name: 'idx_wishlist_customer_id'
    },
    {
      fields: ['product_id'],
      name: 'idx_wishlist_product_id'
    }
  ]
});

module.exports = Wishlist;

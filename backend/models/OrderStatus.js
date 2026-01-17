const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderStatus = sequelize.define('OrderStatus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    validate: {
      min: 0,
      max: 5
    }
  },
  name_tr: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  name_en: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'order_statuses',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = OrderStatus;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChatConversation = sequelize.define('ChatConversation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  session_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Frontend session ID veya unique identifier'
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'customers',
      key: 'id'
    },
    comment: 'Giriş yapmış müşteri ID (opsiyonel)'
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true,
    comment: 'Kullanıcının IP adresi'
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Kullanıcının tarayıcı bilgisi'
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'completed', 'archived']]
    },
    comment: 'Konuşma durumu'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Ek bilgiler (marka bilgileri, tercihler vb.)'
  }
}, {
  tableName: 'chat_conversations',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['session_id']
    },
    {
      fields: ['customer_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = ChatConversation;

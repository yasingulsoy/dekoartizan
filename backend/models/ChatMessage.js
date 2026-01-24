const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conversation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'chat_conversations',
      key: 'id'
    },
    comment: 'İlişkili konuşma ID'
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['user', 'assistant', 'system']]
    },
    comment: 'Mesaj rolü (kullanıcı, asistan, sistem)'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Mesaj içeriği'
  },
  message_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Konuşma içindeki mesaj sırası'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Ek bilgiler (AI model, token sayısı vb.)'
  },
  is_flagged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'İşaretlenmiş mesaj (moderasyon için)'
  }
}, {
  tableName: 'chat_messages',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['conversation_id']
    },
    {
      fields: ['role']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['conversation_id', 'message_order']
    }
  ]
});

module.exports = ChatMessage;

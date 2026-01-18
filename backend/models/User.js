const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // DB'de ayrı bir `name` kolonu yok; frontend/backoffice çoğu yerde `author.name` bekliyor.
  // Bu yüzden `first_name` + `last_name` (yoksa `username`, o da yoksa `email`) üzerinden virtual alan sağlıyoruz.
  name: {
    type: DataTypes.VIRTUAL,
    get() {
      const firstName = this.getDataValue('first_name');
      const lastName = this.getDataValue('last_name');
      const username = this.getDataValue('username');
      const email = this.getDataValue('email');

      const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
      return fullName || username || email || null;
    }
  },
  username: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: true // Google ile giriş yapanlar için null olabilir
  },
  google_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true
  },
  auth_provider: {
    type: DataTypes.STRING(20),
    defaultValue: 'email',
    validate: {
      isIn: [['email', 'google']]
    }
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  birth_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING(10),
    allowNull: true,
    validate: {
      isIn: [['male', 'female', 'other']]
    }
  },
  is_email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  avatar_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  reset_password_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  reset_password_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  email_verification_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;

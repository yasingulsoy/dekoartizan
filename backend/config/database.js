const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const SLOW_QUERY_MS = parseInt(process.env.DB_SLOW_QUERY_MS || '500', 10);

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  benchmark: true,
  logging: (sql, timing) => {
    // timing yalnızca benchmark:true iken gelir
    if (typeof timing === 'number' && timing >= SLOW_QUERY_MS) {
      console.warn(`⚠️ DB Slow Query (${timing}ms):`, sql.substring(0, 200));
    } else if (process.env.DB_LOG_ALL_SQL === 'true') {
      console.log(`📊 DB Query (${timing}ms):`, sql.substring(0, 200));
    }
  },
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || '15', 10),
    min: parseInt(process.env.DB_POOL_MIN || '2', 10),
    acquire: parseInt(process.env.DB_POOL_ACQUIRE_MS || '20000', 10),
    idle: parseInt(process.env.DB_POOL_IDLE_MS || '10000', 10)
  },
  dialectOptions: {
    statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT_MS || '20000', 10),
    query_timeout: parseInt(process.env.DB_QUERY_TIMEOUT_MS || '20000', 10),
  },
  define: {
    timestamps: true,
    underscored: true
  },
  retry: {
    max: parseInt(process.env.DB_RETRY_MAX || '3', 10),
    timeout: parseInt(process.env.DB_RETRY_TIMEOUT_MS || '7000', 10)
  }
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

const syncDatabase = async () => {
  try {
    const options = process.env.NODE_ENV === 'development' 
      ? { alter: true, logging: console.log }
      : { alter: false, logging: false };
    
    await sequelize.sync(options);
    console.log('✅ Database tables synchronized');
    return true;
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    throw error;
  }
};

// Graceful shutdown
const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('✅ Database connection closed gracefully');
  } catch (error) {
    console.error('❌ Error closing database connection:', error.message);
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  closeConnection
};

require('dotenv').config();
const { testConnection } = require('./config/database');

(async () => {
  try {
    console.log('🔄 Testing database connection...');
    await testConnection();
    console.log('✅ Connection test successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
  }
})();

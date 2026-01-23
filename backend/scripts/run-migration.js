/**
 * Migration script'i çalıştırma
 * Kullanım: node scripts/run-migration.js
 */

const { sequelize } = require('../config/database');
const migration = require('../migrations/update-addresses-table');

async function runMigration() {
  try {
    console.log('Migration başlatılıyor...');
    await sequelize.authenticate();
    console.log('✓ Veritabanı bağlantısı başarılı');

    const queryInterface = sequelize.getQueryInterface();
    await migration.up(queryInterface, sequelize.Sequelize);
    
    console.log('✓ Migration tamamlandı');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration hatası:', error);
    process.exit(1);
  }
}

runMigration();

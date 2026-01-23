/**
 * Addresses tablosunu güncelleme script'i
 * - company kolonunu kaldır
 * - province (İl) kolonunu ekle
 * - district (İlçe) kolonunu NOT NULL yap
 * - neighborhood (Mahalle) kolonunu ekle
 * 
 * Kullanım: node scripts/migrate-addresses.js
 */

const { sequelize } = require('../config/database');

async function migrateAddressesTable() {
  try {
    console.log('🔄 Migration başlatılıyor...');
    
    await sequelize.authenticate();
    console.log('✅ Veritabanı bağlantısı başarılı');

    const queryInterface = sequelize.getQueryInterface();
    
    // Mevcut tablo yapısını kontrol et
    const tableDescription = await queryInterface.describeTable('addresses');
    console.log('📋 Mevcut kolonlar:', Object.keys(tableDescription));

    // 1. company kolonunu kaldır (eğer varsa)
    if (tableDescription.company) {
      console.log('🗑️  company kolonu kaldırılıyor...');
      await queryInterface.removeColumn('addresses', 'company');
      console.log('✅ company kolonu kaldırıldı');
    } else {
      console.log('ℹ️  company kolonu zaten yok');
    }

    // 2. province kolonunu ekle (eğer yoksa)
    if (!tableDescription.province) {
      console.log('➕ province kolonu ekleniyor...');
      await queryInterface.addColumn('addresses', 'province', {
        type: sequelize.Sequelize.STRING(100),
        allowNull: false,
        defaultValue: '',
        comment: 'İl (Province)'
      });
      console.log('✅ province kolonu eklendi');
      
      // Varsayılan değeri kaldır
      await queryInterface.changeColumn('addresses', 'province', {
        type: sequelize.Sequelize.STRING(100),
        allowNull: false,
        comment: 'İl (Province)'
      });
    } else {
      console.log('ℹ️  province kolonu zaten var');
      
      // Eğer NULL ise NOT NULL yap
      if (tableDescription.province.allowNull) {
        console.log('🔧 province kolonu NOT NULL yapılıyor...');
        await sequelize.query(
          `UPDATE addresses SET province = '' WHERE province IS NULL`
        );
        await queryInterface.changeColumn('addresses', 'province', {
          type: sequelize.Sequelize.STRING(100),
          allowNull: false,
          comment: 'İl (Province)'
        });
        console.log('✅ province kolonu NOT NULL yapıldı');
      }
    }

    // 3. district kolonunu NOT NULL yap (eğer NULL ise)
    if (tableDescription.district) {
      if (tableDescription.district.allowNull) {
        console.log('🔧 district kolonu NOT NULL yapılıyor...');
        // Önce NULL değerleri boş string ile doldur
        await sequelize.query(
          `UPDATE addresses SET district = '' WHERE district IS NULL`
        );
        
        // Sonra NOT NULL yap
        await queryInterface.changeColumn('addresses', 'district', {
          type: sequelize.Sequelize.STRING(100),
          allowNull: false,
          defaultValue: '',
          comment: 'İlçe (District)'
        });
        console.log('✅ district kolonu NOT NULL yapıldı');
      } else {
        console.log('ℹ️  district kolonu zaten NOT NULL');
      }
    } else {
      console.log('⚠️  district kolonu bulunamadı, ekleniyor...');
      await queryInterface.addColumn('addresses', 'district', {
        type: sequelize.Sequelize.STRING(100),
        allowNull: false,
        defaultValue: '',
        comment: 'İlçe (District)'
      });
      await queryInterface.changeColumn('addresses', 'district', {
        type: sequelize.Sequelize.STRING(100),
        allowNull: false,
        comment: 'İlçe (District)'
      });
      console.log('✅ district kolonu eklendi');
    }

    // 4. neighborhood kolonunu ekle (eğer yoksa)
    if (!tableDescription.neighborhood) {
      console.log('➕ neighborhood kolonu ekleniyor...');
      await queryInterface.addColumn('addresses', 'neighborhood', {
        type: sequelize.Sequelize.STRING(100),
        allowNull: true,
        comment: 'Mahalle (Neighborhood)'
      });
      console.log('✅ neighborhood kolonu eklendi');
    } else {
      console.log('ℹ️  neighborhood kolonu zaten var');
    }

    console.log('✅ Migration başarıyla tamamlandı!');
    
    // Güncel tablo yapısını göster
    const updatedDescription = await queryInterface.describeTable('addresses');
    console.log('\n📋 Güncel kolonlar:');
    Object.keys(updatedDescription).forEach(col => {
      const colInfo = updatedDescription[col];
      console.log(`  - ${col}: ${colInfo.type} ${colInfo.allowNull ? '(NULL)' : '(NOT NULL)'}`);
    });

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration hatası:', error);
    await sequelize.close();
    process.exit(1);
  }
}

// Script'i çalıştır
migrateAddressesTable();

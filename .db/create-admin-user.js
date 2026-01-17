const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function createAdminUser() {
  const client = await pool.connect();
  
  try {
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    console.log('🔐 Şifre hash\'lendi');
    console.log('📝 Admin kullanıcısı oluşturuluyor...');
    
    const result = await client.query(`
      INSERT INTO users (
        username,
        email,
        password_hash,
        first_name,
        last_name,
        role,
        is_active,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (username) DO NOTHING
      ON CONFLICT (email) DO NOTHING
      RETURNING id, username, email, role;
    `, [
      'admin',
      'admin@dekoartizan.com',
      passwordHash,
      'Admin',
      'User',
      'admin',
      true,
      null
    ]);
    
    if (result.rows.length > 0) {
      console.log('✅ Admin kullanıcısı başarıyla oluşturuldu!');
      console.log('📋 Kullanıcı Bilgileri:');
      console.log('   ID:', result.rows[0].id);
      console.log('   Username:', result.rows[0].username);
      console.log('   Email:', result.rows[0].email);
      console.log('   Role:', result.rows[0].role);
      console.log('   Şifre:', password);
      console.log('\n⚠️  GÜVENLİK UYARISI: İlk girişten sonra şifrenizi mutlaka değiştirin!');
    } else {
      console.log('ℹ️  Admin kullanıcısı zaten mevcut. (username veya email çakışması)');
    }
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

createAdminUser();

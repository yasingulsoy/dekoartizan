import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
  console.log('PostgreSQL bağlantısı başarılı');
});

pool.on('error', (err) => {
  console.error('PostgreSQL bağlantı hatası:', err);
});

export default pool;

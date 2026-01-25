const express = require('express');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// SMTP bağlantısını test et (server başlatıldığında)
try {
  require('./utils/email');
} catch (error) {
  console.warn('⚠️ Email utility yüklenemedi:', error.message);
}

const { sequelize, testConnection, syncDatabase, closeConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

/**
 * Request logger (prod debug için)
 * LOG_REQUESTS=true iken her isteği konsola yazar.
 */
if (String(process.env.LOG_REQUESTS || '').toLowerCase() === 'true') {
  app.use((req, res, next) => {
    const start = process.hrtime.bigint();
    const requestId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    res.setHeader('X-Request-Id', requestId);

    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
      const forwardedFor = req.headers['x-forwarded-for'];
      const ip = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor || req.ip;
      const ua = req.headers['user-agent'] || '-';

      console.log(
        `[${requestId}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs.toFixed(1)}ms) ip=${ip} ua="${ua}"`
      );
    });

    next();
  });
}

const corsOrigins = (() => {
  if (process.env.CORS_ORIGINS) {
    return process.env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean);
  }
  const siteUrl = process.env.SITE_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
  const adminUrl = process.env.ADMIN_URL || 'http://localhost:3001';
  return process.env.NODE_ENV === 'production'
    ? [siteUrl, siteUrl.replace('https://', 'https://www.')].filter(Boolean)
    : [siteUrl, 'http://127.0.0.1:3000', adminUrl].filter(Boolean);
})();

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(cookieParser());

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çok fazla istek. Lütfen daha sonra deneyin.', code: 'TOO_MANY_REQUESTS' }
});

app.use('/api/', limiter);

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(compression({
  threshold: 512,
}));

/**
 * Route registry logger (prod debug için)
 * LOG_ROUTES=true iken server start'ta tüm route'ları konsola yazar.
 */
const logRegisteredRoutes = () => {
  try {
    const routes = [];
    const stack = app?._router?.stack || [];
    for (const layer of stack) {
      if (!layer) continue;
      if (layer.route && layer.route.path) {
        const methods = Object.keys(layer.route.methods || {}).map(m => m.toUpperCase()).join(',');
        routes.push(`${methods.padEnd(10)} ${layer.route.path}`);
      } else if (layer.name === 'router' && layer.handle?.stack) {
        const mountPath = layer.regexp?.toString?.() || '';
        for (const l of layer.handle.stack) {
          if (l.route && l.route.path) {
            const methods = Object.keys(l.route.methods || {}).map(m => m.toUpperCase()).join(',');
            routes.push(`${methods.padEnd(10)} ${mountPath} ${l.route.path}`);
          }
        }
      }
    }
    console.log(`🧭 Registered routes (count=${routes.length}):`);
    routes.slice(0, 500).forEach(r => console.log(` - ${r}`));
    if (routes.length > 500) console.log(` - ... truncated (${routes.length - 500} more)`);
  } catch (e) {
    console.warn('⚠️ Route listesi yazdırılamadı:', e.message);
  }
};

const initializeDatabase = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Database initialization attempt ${i + 1}/${retries}`);
      await testConnection();
      await syncDatabase();
      console.log('✅ Database initialized successfully');
      return true;
    } catch (error) {
      console.error(`❌ Database initialization attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) {
        console.error('❌ All database initialization attempts failed');
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
};

app.get('/api/live', (req, res) => {
  res.json({ status: 'OK', message: 'Liveness probe ok', timestamp: new Date().toISOString() });
});

app.get('/api/ready', async (req, res) => {
  try {
    await sequelize.authenticate();
    return res.json({ status: 'READY', message: 'Readiness probe ok', timestamp: new Date().toISOString() });
  } catch (e) {
    return res.status(503).json({ status: 'NOT_READY', error: e.message });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    let dbStatus = 'disconnected';
    try {
      await sequelize.authenticate();
      dbStatus = 'connected';
    } catch (_) {
      dbStatus = 'disconnected';
    }
    res.json({ 
      status: 'OK', 
      message: 'dekoartizan API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: dbStatus,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: 'Service unavailable',
      database: 'disconnected',
      error: error.message
    });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/paper-types', require('./routes/paperTypes'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/files', require('./routes/files'));
app.use('/api/chatbot', require('./routes/chatbot'));

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Kaynak bulunamadı',
    code: 'NOT_FOUND',
    details: { path: req.originalUrl, method: req.method }
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR'
  });
});

const startServer = async () => {
  try {
    await initializeDatabase();
    
    const host = process.env.HOST || '0.0.0.0';
    const server = app.listen(PORT, host, () => {
      console.log(`🚀 dekoartizan Backend Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const displayHost = host === '0.0.0.0' ? 'localhost' : host;
      console.log(`📊 Health Check: ${protocol}://${displayHost}:${PORT}/api/health`);

      if (String(process.env.LOG_ROUTES || '').toLowerCase() === 'true') {
        logRegisteredRoutes();
      }
    });

    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

const gracefulShutdown = async (signal) => {
  console.log(`${signal} signal received, shutting down server gracefully...`);
  
  try {
    await closeConnection();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const jwt = require('jsonwebtoken');
const { Customer, User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Authentication middleware
 * Token'ı doğrular ve req.customer ile req.customerId'yi set eder
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token bulunamadı'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const customer = await Customer.findByPk(decoded.id);

    if (!customer || !customer.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Geçersiz token veya kullanıcı aktif değil'
      });
    }

    req.customer = customer;
    req.customerId = customer.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Geçersiz token'
    });
  }
};

/**
 * Kullanıcının sadece kendi profilini güncelleyebilmesini sağlar
 */
const authorizeSelf = (req, res, next) => {
  const requestedId = parseInt(req.params.id);
  
  if (requestedId !== req.customerId) {
    return res.status(403).json({
      success: false,
      error: 'Bu işlem için yetkiniz yok'
    });
  }
  
  next();
};

/**
 * Admin authentication middleware
 * Token'ı doğrular ve admin kontrolü yapar
 */
const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token bulunamadı'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.is_admin || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Geçersiz token veya admin yetkisi yok'
      });
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Geçersiz token'
    });
  }
};

module.exports = {
  authenticateToken,
  authorizeSelf,
  authenticateAdmin
};

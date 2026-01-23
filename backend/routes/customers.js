const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const { Customer } = require('../models');
const { authenticateToken, authorizeSelf } = require('../middleware/auth');
const { sendVerificationEmail } = require('../utils/email');
const rateLimit = require('express-rate-limit');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.SITE_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

// Şifre değiştirme için rate limiter (daha sıkı)
const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5, // 15 dakikada maksimum 5 deneme
  message: {
    success: false,
    error: 'Çok fazla şifre değiştirme denemesi. Lütfen 15 dakika sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Profil güncelleme validasyon kuralları
const updateProfileValidation = [
  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Ad 1-100 karakter arasında olmalıdır'),
  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Soyad 1-100 karakter arasında olmalıdır'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Geçerli bir telefon numarası giriniz'),
  body('birth_date')
    .optional()
    .isISO8601()
    .withMessage('Geçerli bir tarih formatı giriniz (YYYY-MM-DD)'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Cinsiyet male, female veya other olmalıdır'),
];

// Şifre değiştirme validasyon kuralları
const changePasswordValidation = [
  body('current_password')
    .notEmpty()
    .withMessage('Mevcut şifre gereklidir'),
  body('new_password')
    .isLength({ min: 6 })
    .withMessage('Yeni şifre en az 6 karakter olmalıdır')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Yeni şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'),
  body('confirm_password')
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error('Yeni şifre ve onay şifresi eşleşmiyor');
      }
      return true;
    }),
];

// E-posta değiştirme validasyon kuralları
const changeEmailValidation = [
  body('new_email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz')
    .custom(async (value) => {
      const existingCustomer = await Customer.findOne({
        where: { email: value.toLowerCase().trim() }
      });
      if (existingCustomer) {
        throw new Error('Bu e-posta adresi zaten kullanılıyor');
      }
      return true;
    }),
];

// Profil bilgilerini getir
router.get('/:id', authenticateToken, authorizeSelf, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.customerId, {
      attributes: { exclude: ['password_hash', 'reset_password_token', 'reset_password_expires', 'email_verification_token'] }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      data: customer.toJSON ? customer.toJSON() : customer
    });
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Profil bilgileri yüklenirken bir hata oluştu'
    });
  }
});

// Profil güncelleme
router.put('/:id', authenticateToken, authorizeSelf, updateProfileValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validasyon hatası',
        errors: errors.array()
      });
    }

    const customer = await Customer.findByPk(req.customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      });
    }

    const { first_name, last_name, phone, birth_date, gender } = req.body;
    const updateData = {};

    if (first_name !== undefined) updateData.first_name = first_name?.trim() || null;
    if (last_name !== undefined) updateData.last_name = last_name?.trim() || null;
    if (phone !== undefined) updateData.phone = phone?.trim() || null;
    if (birth_date !== undefined) updateData.birth_date = birth_date || null;
    if (gender !== undefined) updateData.gender = gender || null;

    await customer.update(updateData);

    // Güncellenmiş kullanıcı bilgilerini getir
    const updatedCustomer = await Customer.findByPk(req.customerId, {
      attributes: { exclude: ['password_hash', 'reset_password_token', 'reset_password_expires', 'email_verification_token'] }
    });

    res.json({
      success: true,
      data: updatedCustomer.toJSON ? updatedCustomer.toJSON() : updatedCustomer,
      message: 'Profil başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Profil güncellenirken bir hata oluştu'
    });
  }
});

// Şifre değiştirme
router.put('/:id/password', authenticateToken, authorizeSelf, passwordChangeLimiter, changePasswordValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validasyon hatası',
        errors: errors.array()
      });
    }

    const customer = await Customer.findByPk(req.customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      });
    }

    // Google ile giriş yapanlar şifre değiştiremez
    if (customer.auth_provider === 'google') {
      return res.status(400).json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      });
    }

    // Mevcut şifre kontrolü
    const { current_password, new_password } = req.body;

    if (!customer.password_hash) {
      return res.status(400).json({
        success: false,
        error: 'Şifre bulunamadı'
      });
    }

    const isPasswordValid = await bcrypt.compare(current_password, customer.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Mevcut şifre yanlış'
      });
    }

    // Yeni şifreyi hashle ve kaydet
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(new_password, saltRounds);

    await customer.update({
      password_hash: newPasswordHash
    });

    res.json({
      success: true,
      message: 'Şifre başarıyla değiştirildi'
    });
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Şifre değiştirilirken bir hata oluştu'
    });
  }
});

// E-posta değiştirme
router.put('/:id/email', authenticateToken, authorizeSelf, changeEmailValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validasyon hatası',
        errors: errors.array()
      });
    }

    const customer = await Customer.findByPk(req.customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      });
    }

    const { new_email } = req.body;
    const normalizedEmail = new_email.toLowerCase().trim();

    // E-posta değişikliği için doğrulama token'ı oluştur
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Eski e-postayı sakla (doğrulama için)
    const oldEmail = customer.email;
    
    // Yeni e-postayı ve token'ı kaydet (henüz doğrulanmamış)
    await customer.update({
      email: normalizedEmail,
      is_email_verified: false,
      email_verification_token: verificationToken
    });

    // Doğrulama e-postası gönder
    const verificationUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(normalizedEmail)}`;
    
    await sendVerificationEmail(
      normalizedEmail,
      verificationToken,
      verificationUrl
    );

    // Eski e-postaya bilgilendirme e-postası gönder (opsiyonel)
    // Burada sendEmailChangeNotification fonksiyonu eklenebilir

    res.json({
      success: true,
      message: 'E-posta değiştirildi. Lütfen yeni e-posta adresinize gönderilen doğrulama linkine tıklayın.',
      data: {
        email: normalizedEmail,
        is_email_verified: false
      }
    });
  } catch (error) {
    console.error('E-posta değiştirme hatası:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'Bu e-posta adresi zaten kullanılıyor'
      });
    }

    res.status(500).json({
      success: false,
      error: 'E-posta değiştirilirken bir hata oluştu'
    });
  }
});

// E-posta doğrulama linkini tekrar gönder
router.post('/:id/resend-email-verification', authenticateToken, authorizeSelf, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      });
    }

    if (customer.is_email_verified) {
      return res.status(400).json({
        success: false,
        error: 'E-posta adresi zaten doğrulanmış'
      });
    }

    // Yeni doğrulama token'ı oluştur
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    await customer.update({
      email_verification_token: verificationToken
    });

    const verificationUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(customer.email)}`;
    
    await sendVerificationEmail(
      customer.email,
      verificationToken,
      verificationUrl
    );

    res.json({
      success: true,
      message: 'Doğrulama e-postası tekrar gönderildi'
    });
  } catch (error) {
    console.error('E-posta doğrulama tekrar gönderme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'E-posta gönderilirken bir hata oluştu'
    });
  }
});

module.exports = router;

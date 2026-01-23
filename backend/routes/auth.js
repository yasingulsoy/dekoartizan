const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { Customer } = require('../models');
const { OAuth2Client } = require('google-auth-library');
const { sendEmail, sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);
router.get('/google', (req, res) => {
  try {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'Google OAuth yapılandırması eksik'
      });
    }

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      prompt: 'consent'
    });

    res.json({
      success: true,
      authUrl: authUrl
    });
  } catch (error) {
    console.error('Google OAuth URL oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Google OAuth URL oluşturulamadı'
    });
  }
});

router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(`${FRONTEND_URL}/signin?error=no_code`);
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return res.redirect(`${FRONTEND_URL}/signin?error=config_error`);
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const {
      sub: googleId,
      email,
      given_name: firstName,
      family_name: lastName,
      picture: avatarUrl,
      email_verified
    } = payload;

    if (!email) {
      return res.redirect(`${FRONTEND_URL}/signin?error=no_email`);
    }

    let customer = await Customer.findOne({
      where: {
        [Op.or]: [
          { email: email.toLowerCase() },
          { google_id: googleId }
        ]
      }
    });

    if (customer) {
      await customer.update({
        google_id: googleId,
        auth_provider: 'google',
        first_name: firstName || customer.first_name,
        last_name: lastName || customer.last_name,
        avatar_url: avatarUrl || customer.avatar_url,
        is_email_verified: email_verified || customer.is_email_verified,
        last_login: new Date()
      });
    } else {
      customer = await Customer.create({
        email: email.toLowerCase(),
        google_id: googleId,
        auth_provider: 'google',
        first_name: firstName || null,
        last_name: lastName || null,
        avatar_url: avatarUrl || null,
        is_email_verified: email_verified || false,
        password_hash: null,
        is_active: true,
        last_login: new Date()
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      {
        id: customer.id,
        email: customer.email,
        auth_provider: 'google'
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.redirect(`${FRONTEND_URL}/signin?token=${token}&success=true`);

  } catch (error) {
    console.error('Google OAuth callback hatası:', error);
    res.redirect(`${FRONTEND_URL}/signin?error=oauth_failed`);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'E-posta ve şifre gereklidir'
      });
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Geçerli bir e-posta adresi giriniz'
      });
    }

    const customer = await Customer.findOne({
      where: {
        email: email.toLowerCase().trim()
      }
    });

    if (!customer) {
      return res.status(401).json({
        success: false,
        error: 'E-posta veya şifre hatalı'
      });
    }

    if (!customer.is_active) {
      return res.status(403).json({
        success: false,
        error: 'Hesabınız pasif durumda. Lütfen yönetici ile iletişime geçin.'
      });
    }

    if (!customer.password_hash) {
      return res.status(401).json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'E-posta veya şifre hatalı'
      });
    }

    await customer.update({ last_login: new Date() });

    const token = jwt.sign(
      {
        id: customer.id,
        email: customer.email,
        auth_provider: customer.auth_provider
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const customerData = {
      id: customer.id,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone: customer.phone,
      birth_date: customer.birth_date,
      gender: customer.gender,
      avatar_url: customer.avatar_url,
      auth_provider: customer.auth_provider,
      is_email_verified: customer.is_email_verified,
      created_at: customer.created_at,
      last_login: customer.last_login
    };

    res.json({
      success: true,
      token: token,
      data: customerData,
      message: 'Giriş başarılı'
    });

  } catch (error) {
    console.error('Login hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Giriş yapılırken bir hata oluştu'
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'E-posta ve şifre gereklidir'
      });
    }

    if (!first_name || !last_name) {
      return res.status(400).json({
        success: false,
        error: 'Ad ve soyad gereklidir'
      });
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Geçerli bir e-posta adresi giriniz'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Şifre en az 6 karakter olmalıdır'
      });
    }

    const existingCustomer = await Customer.findOne({
      where: {
        email: email.toLowerCase().trim()
      }
    });

    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        error: 'Bu e-posta adresi zaten kullanılıyor'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const customer = await Customer.create({
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      phone: phone ? phone.trim() : null,
      auth_provider: 'email',
      is_email_verified: false,
      email_verification_token: verificationToken,
      is_active: true
    });

    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const verificationUrl = `${backendUrl}/api/auth/verify-email?token=${verificationToken}`;
    
    await sendVerificationEmail(
      customer.email,
      verificationToken,
      verificationUrl
    );

    const token = jwt.sign(
      {
        id: customer.id,
        email: customer.email,
        auth_provider: 'email'
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const customerData = {
      id: customer.id,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone: customer.phone,
      birth_date: customer.birth_date,
      gender: customer.gender,
      avatar_url: customer.avatar_url,
      auth_provider: customer.auth_provider,
      is_email_verified: customer.is_email_verified,
      created_at: customer.created_at,
      last_login: customer.last_login
    };

    res.status(201).json({
      success: true,
      token: token,
      data: customerData,
      message: 'Kayıt başarılı. Lütfen e-postanızı kontrol edin ve e-postanızı doğrulayın.'
    });

  } catch (error) {
    console.error('Register hatası:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'Bu e-posta adresi zaten kullanılıyor'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Kayıt olurken bir hata oluştu'
    });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token gereklidir'
      });
    }

    // JWT token'ı doğrula
    const decoded = jwt.verify(token, JWT_SECRET);

    // Kullanıcıyı bul
    const customer = await Customer.findByPk(decoded.id);

    if (!customer || !customer.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Geçersiz token veya kullanıcı aktif değil'
      });
    }

    const customerData = {
      id: customer.id,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone: customer.phone,
      birth_date: customer.birth_date,
      gender: customer.gender,
      avatar_url: customer.avatar_url,
      auth_provider: customer.auth_provider,
      is_email_verified: customer.is_email_verified,
      created_at: customer.created_at,
      last_login: customer.last_login
    };

    res.json({
      success: true,
      data: customerData
    });

  } catch (error) {
    console.error('Token doğrulama hatası:', error);
    res.status(401).json({
      success: false,
      error: 'Geçersiz token'
    });
  }
});

router.post('/google/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token gereklidir'
      });
    }

    // JWT token'ı doğrula
    const decoded = jwt.verify(token, JWT_SECRET);

    // Kullanıcıyı bul
    const customer = await Customer.findByPk(decoded.id);

    if (!customer || !customer.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Geçersiz token veya kullanıcı aktif değil'
      });
    }

    const customerData = {
      id: customer.id,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone: customer.phone,
      birth_date: customer.birth_date,
      gender: customer.gender,
      avatar_url: customer.avatar_url,
      auth_provider: customer.auth_provider,
      is_email_verified: customer.is_email_verified,
      created_at: customer.created_at,
      last_login: customer.last_login
    };

    res.json({
      success: true,
      data: customerData
    });

  } catch (error) {
    console.error('Token doğrulama hatası:', error);
    res.status(401).json({
      success: false,
      error: 'Geçersiz token'
    });
  }
});

router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    const isApiRequest = req.headers.accept?.includes('application/json');

    if (!token) {
      if (isApiRequest) {
        return res.status(400).json({
          success: false,
          error: 'Token gereklidir'
        });
      }
      return res.redirect(`${FRONTEND_URL}/verify-email?error=no_token`);
    }

    const customer = await Customer.findOne({
      where: {
        email_verification_token: token
      }
    });

    if (!customer) {
      if (isApiRequest) {
        return res.status(400).json({
          success: false,
          error: 'Geçersiz veya süresi dolmuş doğrulama linki'
        });
      }
      return res.redirect(`${FRONTEND_URL}/verify-email?error=invalid_token`);
    }

    if (customer.is_email_verified) {
      if (isApiRequest) {
        return res.json({
          success: true,
          message: 'E-posta adresi zaten doğrulanmış',
          already_verified: true
        });
      }
      return res.redirect(`${FRONTEND_URL}/verify-email?error=already_verified`);
    }

    await customer.update({
      is_email_verified: true,
      email_verification_token: null
    });

    if (isApiRequest) {
      return res.json({
        success: true,
        message: 'E-posta adresi başarıyla doğrulandı'
      });
    }

    res.redirect(`${FRONTEND_URL}/verify-email?success=true`);

  } catch (error) {
    console.error('Email verification hatası:', error);
    if (req.headers.accept?.includes('application/json')) {
      return res.status(500).json({
        success: false,
        error: 'E-posta doğrulama sırasında bir hata oluştu'
      });
    }
    res.redirect(`${FRONTEND_URL}/verify-email?error=verification_failed`);
  }
});

router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'E-posta adresi gereklidir'
      });
    }

    const customer = await Customer.findOne({
      where: {
        email: email.toLowerCase().trim()
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Bu e-posta adresine kayıtlı kullanıcı bulunamadı'
      });
    }

    if (customer.is_email_verified) {
      return res.status(400).json({
        success: false,
        error: 'E-posta adresi zaten doğrulanmış'
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    await customer.update({
      email_verification_token: verificationToken
    });

    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const verificationUrl = `${backendUrl}/api/auth/verify-email?token=${verificationToken}`;
    
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
    console.error('Resend verification hatası:', error);
    res.status(500).json({
      success: false,
      error: 'E-posta gönderilirken bir hata oluştu'
    });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'E-posta adresi gereklidir'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Geçerli bir e-posta adresi giriniz'
      });
    }

    const customer = await Customer.findOne({
      where: {
        email: email.toLowerCase().trim()
      }
    });

    if (!customer) {
      return res.json({
        success: true,
        message: 'Eğer bu e-posta adresine kayıtlı bir hesap varsa, şifre sıfırlama linki gönderildi'
      });
    }

    if (customer.auth_provider === 'google') {
      return res.status(400).json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);

    await customer.update({
      reset_password_token: resetToken,
      reset_password_expires: resetExpires
    });

    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(
      customer.email,
      resetToken,
      resetUrl
    );

    res.json({
      success: true,
      message: 'Eğer bu e-posta adresine kayıtlı bir hesap varsa, şifre sıfırlama linki gönderildi'
    });

  } catch (error) {
    console.error('Forgot password hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Şifre sıfırlama e-postası gönderilirken bir hata oluştu'
    });
  }
});

router.get('/reset-password', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.redirect(`${FRONTEND_URL}/reset-password?error=no_token`);
    }

    const customer = await Customer.findOne({
      where: {
        reset_password_token: token,
        reset_password_expires: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!customer) {
      return res.redirect(`${FRONTEND_URL}/reset-password?error=invalid_token`);
    }

    res.redirect(`${FRONTEND_URL}/reset-password?token=${token}&valid=true`);

  } catch (error) {
    console.error('Reset password token check hatası:', error);
    res.redirect(`${FRONTEND_URL}/reset-password?error=check_failed`);
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: 'Token ve şifre gereklidir'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Şifre en az 6 karakter olmalıdır'
      });
    }

    const customer = await Customer.findOne({
      where: {
        reset_password_token: token,
        reset_password_expires: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!customer) {
      return res.status(400).json({
        success: false,
        error: 'Geçersiz veya süresi dolmuş şifre sıfırlama linki'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await customer.update({
      password_hash: passwordHash,
      reset_password_token: null,
      reset_password_expires: null
    });

    res.json({
      success: true,
      message: 'Şifreniz başarıyla sıfırlandı'
    });

  } catch (error) {
    console.error('Reset password hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Şifre sıfırlanırken bir hata oluştu'
    });
  }
});

router.post('/test-email', async (req, res) => {
  try {
    const { to } = req.body;
    const testEmail = to || 'yasingulsoy02@gmail.com';

    console.log('📧 Test e-postası gönderiliyor:', testEmail);

    const result = await sendEmail({
      to: testEmail,
      subject: 'Test E-postası - dekoartizan',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #000; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
            .success { color: #22c55e; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>dekoartizan</h1>
            </div>
            <div class="content">
              <h2>Test E-postası</h2>
              <p>Merhaba,</p>
              <p>Bu bir test e-postasıdır. SMTP yapılandırmanız <span class="success">başarıyla çalışıyor!</span> ✅</p>
              <p>E-posta gönderme özelliği aktif ve kullanıma hazır.</p>
              <p>Şifre sıfırlama, e-posta doğrulama gibi özellikler artık kullanılabilir.</p>
            </div>
            <div class="footer">
              <p>Saygılarımızla,<br><strong>dekoartizan Ekibi</strong></p>
              <p style="margin-top: 10px; color: #999;">Bu e-posta otomatik olarak gönderilmiştir.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Test E-postası - dekoartizan
        
        Merhaba,
        
        Bu bir test e-postasıdır. SMTP yapılandırmanız başarıyla çalışıyor!
        
        E-posta gönderme özelliği aktif ve kullanıma hazır.
        Şifre sıfırlama, e-posta doğrulama gibi özellikler artık kullanılabilir.
        
        Saygılarımızla,
        dekoartizan Ekibi
        
        Bu e-posta otomatik olarak gönderilmiştir.
      `
    });

    if (result.success) {
      res.json({
        success: true,
        message: `Test e-postası başarıyla gönderildi: ${testEmail}`,
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'E-posta gönderilemedi'
      });
    }

  } catch (error) {
    console.error('Test email hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'E-posta gönderilirken bir hata oluştu'
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

router.post('/auth/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    console.log('🔐 Admin login attempt:', { 
      usernameOrEmail: usernameOrEmail?.substring(0, 10) + '...',
      passwordLength: password?.length 
    });

    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        success: false,
        error: 'Kullanıcı adı/email ve şifre gereklidir'
      });
    }

    const searchTerm = usernameOrEmail.toLowerCase().trim();
    console.log('📧 Searching for user with email or username:', searchTerm);

    // Email veya username ile kullanıcıyı bul (case-insensitive)
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: { [Op.iLike]: searchTerm } },
          { username: { [Op.iLike]: searchTerm } }
        ]
      }
    });

    if (!user) {
      console.log('❌ User not found with email or username:', searchTerm);
      return res.status(401).json({
        success: false,
        error: 'Kullanıcı adı veya şifre hatalı'
      });
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      username: user.username,
      is_admin: user.is_admin,
      is_active: user.is_active,
      has_password: !!user.password_hash,
      password_hash_length: user.password_hash?.length
    });

    // Admin kontrolü
    if (!user.is_admin) {
      console.log('❌ User is not admin');
      return res.status(403).json({
        success: false,
        error: 'Bu hesap admin yetkisine sahip değil'
      });
    }

    // Aktif kullanıcı kontrolü
    if (!user.is_active) {
      console.log('❌ User is not active');
      return res.status(403).json({
        success: false,
        error: 'Hesabınız pasif durumda'
      });
    }

    // Şifre kontrolü
    if (!user.password_hash) {
      console.log('❌ No password hash found');
      return res.status(401).json({
        success: false,
        error: 'Bu hesap için şifre tanımlanmamış'
      });
    }

    console.log('🔑 Comparing password...');
    console.log('🔑 Password hash starts with:', user.password_hash.substring(0, 10));
    
    // Eğer şifre hash'lenmemişse (düz metin), direkt karşılaştır
    let isPasswordValid = false;
    if (user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$') || user.password_hash.startsWith('$2y$')) {
      // bcrypt hash
      isPasswordValid = await bcrypt.compare(password, user.password_hash);
    } else {
      // Düz metin şifre (geçici - production'da olmamalı)
      console.log('⚠️ WARNING: Password is not hashed! Using plain text comparison');
      isPasswordValid = user.password_hash === password;
    }
    
    console.log('🔑 Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return res.status(401).json({
        success: false,
        error: 'Kullanıcı adı veya şifre hatalı'
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
        role: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // last_login güncelle
    await user.update({ last_login: new Date() });

    // Kullanıcı bilgilerini döndür (şifre hash'i hariç)
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username || user.email, // Username varsa kullan, yoksa email
      first_name: user.first_name,
      last_name: user.last_name,
      role: 'admin',
      is_admin: user.is_admin,
      is_active: user.is_active,
      avatar_url: user.avatar_url
    };

    res.json({
      success: true,
      token,
      user: userData,
      message: 'Giriş başarılı'
    });
  } catch (error) {
    console.error('Admin login hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Giriş sırasında bir hata oluştu'
    });
  }
});

// Token doğrulama endpoint'i
router.get('/auth/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

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
        error: 'Geçersiz token'
      });
    }

    const userData = {
      id: user.id,
      email: user.email,
      username: user.username || user.email, // Username varsa kullan, yoksa email
      first_name: user.first_name,
      last_name: user.last_name,
      role: 'admin',
      is_admin: user.is_admin,
      is_active: user.is_active,
      avatar_url: user.avatar_url
    };

    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Geçersiz token'
    });
  }
});

module.exports = router;

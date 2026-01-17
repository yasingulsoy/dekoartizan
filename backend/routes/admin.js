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

// Kullanıcı bilgilerini formatla (role ekle)
const formatUser = (user) => {
  return {
    id: user.id,
    username: user.username || user.email,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    role: user.is_admin ? 'admin' : 'viewer', // Şimdilik is_admin'e göre belirle
    is_active: user.is_active,
    is_admin: user.is_admin,
    created_at: user.created_at
  };
};

// Tüm kullanıcıları listele
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password_hash', 'google_id', 'reset_password_token', 'reset_password_expires', 'email_verification_token'] }
    });

    const formattedUsers = users.map(user => formatUser(user));

    res.json({
      success: true,
      data: formattedUsers
    });
  } catch (error) {
    console.error('Kullanıcı listesi hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Kullanıcılar yüklenirken bir hata oluştu'
    });
  }
});

// Tek bir kullanıcı getir
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash', 'google_id', 'reset_password_token', 'reset_password_expires', 'email_verification_token'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      data: formatUser(user)
    });
  } catch (error) {
    console.error('Kullanıcı getirme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Kullanıcı bilgileri yüklenirken bir hata oluştu'
    });
  }
});

// Yeni kullanıcı oluştur
router.post('/users', async (req, res) => {
  try {
    const { username, email, password, first_name, last_name, phone, role, is_active } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        error: 'E-posta, şifre, ad ve soyad gereklidir'
      });
    }

    // Email benzersizliğini kontrol et
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: { [Op.iLike]: email } },
          ...(username ? [{ username: { [Op.iLike]: username } }] : [])
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Bu e-posta veya kullanıcı adı zaten kullanılıyor'
      });
    }

    // Şifreyi hash'le
    const passwordHash = await bcrypt.hash(password, 10);

    // Role'e göre is_admin belirle
    const is_admin = role === 'admin';

    const user = await User.create({
      username,
      email,
      password_hash: passwordHash,
      first_name,
      last_name,
      phone,
      is_admin,
      is_active: is_active !== undefined ? is_active : true,
      auth_provider: 'email',
      is_email_verified: false
    });

    res.json({
      success: true,
      data: formatUser(user),
      message: 'Kullanıcı başarıyla oluşturuldu'
    });
  } catch (error) {
    console.error('Kullanıcı oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Kullanıcı oluşturulurken bir hata oluştu'
    });
  }
});

// Kullanıcı güncelle
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      });
    }

    const { username, email, password, first_name, last_name, phone, role, is_active } = req.body;

    // Email ve username benzersizliğini kontrol et (kendi ID'si hariç)
    if (email || username) {
      const existingUser = await User.findOne({
        where: {
          id: { [Op.ne]: user.id },
          [Op.or]: [
            ...(email ? [{ email: { [Op.iLike]: email } }] : []),
            ...(username ? [{ username: { [Op.iLike]: username } }] : [])
          ]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Bu e-posta veya kullanıcı adı zaten kullanılıyor'
        });
      }
    }

    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (phone !== undefined) updateData.phone = phone;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (role !== undefined) updateData.is_admin = role === 'admin';

    // Şifre değiştiriliyorsa hash'le
    if (password && password.trim() !== '') {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    res.json({
      success: true,
      data: formatUser(user),
      message: 'Kullanıcı başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Kullanıcı güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Kullanıcı güncellenirken bir hata oluştu'
    });
  }
});

// Kullanıcı sil
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'Kullanıcı başarıyla silindi'
    });
  } catch (error) {
    console.error('Kullanıcı silme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Kullanıcı silinirken bir hata oluştu'
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Address, Customer } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authentication middleware
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

// Tüm adresleri listele (kullanıcının kendi adresleri)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: {
        customer_id: req.customerId,
        is_active: true
      },
      order: [
        ['is_default', 'DESC'],
        ['created_at', 'DESC']
      ]
    });

    res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    console.error('Adres listesi hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Adresler yüklenirken bir hata oluştu'
    });
  }
});

// Tek bir adres getir
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        customer_id: req.customerId,
        is_active: true
      }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Adres bulunamadı'
      });
    }

    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Adres getirme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Adres bilgileri yüklenirken bir hata oluştu'
    });
  }
});

// Yeni adres oluştur
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      address_type,
      title,
      first_name,
      last_name,
      company,
      phone,
      address_line1,
      address_line2,
      district,
      city,
      state,
      postal_code,
      country,
      is_default
    } = req.body;

    // Zorunlu alanları kontrol et
    if (!first_name || !last_name || !phone || !address_line1 || !city || !postal_code) {
      return res.status(400).json({
        success: false,
        error: 'Ad, soyad, telefon, adres satırı, şehir ve posta kodu gereklidir'
      });
    }

    // Eğer varsayılan adres olarak işaretleniyorsa, diğer adreslerin varsayılanını kaldır
    if (is_default) {
      await Address.update(
        { is_default: false },
        {
          where: {
            customer_id: req.customerId,
            is_default: true
          }
        }
      );
    }

    const address = await Address.create({
      customer_id: req.customerId,
      address_type: address_type || 'shipping',
      title: title || null,
      first_name,
      last_name,
      company: company || null,
      phone,
      address_line1,
      address_line2: address_line2 || null,
      district: district || null,
      city,
      state: state || null,
      postal_code,
      country: country || 'Türkiye',
      is_default: is_default || false,
      is_active: true
    });

    res.status(201).json({
      success: true,
      data: address,
      message: 'Adres başarıyla oluşturuldu'
    });
  } catch (error) {
    console.error('Adres oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Adres oluşturulurken bir hata oluştu'
    });
  }
});

// Adres güncelle
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        customer_id: req.customerId,
        is_active: true
      }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Adres bulunamadı'
      });
    }

    const {
      address_type,
      title,
      first_name,
      last_name,
      company,
      phone,
      address_line1,
      address_line2,
      district,
      city,
      state,
      postal_code,
      country,
      is_default
    } = req.body;

    // Eğer varsayılan adres olarak işaretleniyorsa, diğer adreslerin varsayılanını kaldır
    if (is_default && !address.is_default) {
      await Address.update(
        { is_default: false },
        {
          where: {
            customer_id: req.customerId,
            is_default: true,
            id: { [Op.ne]: address.id }
          }
        }
      );
    }

    const updateData = {};
    if (address_type !== undefined) updateData.address_type = address_type;
    if (title !== undefined) updateData.title = title;
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (company !== undefined) updateData.company = company;
    if (phone !== undefined) updateData.phone = phone;
    if (address_line1 !== undefined) updateData.address_line1 = address_line1;
    if (address_line2 !== undefined) updateData.address_line2 = address_line2;
    if (district !== undefined) updateData.district = district;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (postal_code !== undefined) updateData.postal_code = postal_code;
    if (country !== undefined) updateData.country = country;
    if (is_default !== undefined) updateData.is_default = is_default;

    await address.update(updateData);

    res.json({
      success: true,
      data: address,
      message: 'Adres başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Adres güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Adres güncellenirken bir hata oluştu'
    });
  }
});

// Adres sil (soft delete - is_active false yap)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        customer_id: req.customerId,
        is_active: true
      }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Adres bulunamadı'
      });
    }

    // Eğer varsayılan adres siliniyorsa, başka bir adresi varsayılan yap
    if (address.is_default) {
      const otherAddress = await Address.findOne({
        where: {
          customer_id: req.customerId,
          is_active: true,
          id: { [require('sequelize').Op.ne]: address.id }
        },
        order: [['created_at', 'DESC']]
      });

      if (otherAddress) {
        await otherAddress.update({ is_default: true });
      }
    }

    await address.update({ is_active: false });

    res.json({
      success: true,
      message: 'Adres başarıyla silindi'
    });
  } catch (error) {
    console.error('Adres silme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Adres silinirken bir hata oluştu'
    });
  }
});

// Varsayılan adres belirle
router.put('/:id/set-default', authenticateToken, async (req, res) => {
  try {
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        customer_id: req.customerId,
        is_active: true
      }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Adres bulunamadı'
      });
    }

    // Diğer tüm adreslerin varsayılanını kaldır
    await Address.update(
      { is_default: false },
      {
        where: {
          customer_id: req.customerId,
          is_default: true,
          id: { [require('sequelize').Op.ne]: address.id }
        }
      }
    );

    // Bu adresi varsayılan yap
    await address.update({ is_default: true });

    res.json({
      success: true,
      data: address,
      message: 'Varsayılan adres başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Varsayılan adres belirleme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Varsayılan adres belirlenirken bir hata oluştu'
    });
  }
});

module.exports = router;

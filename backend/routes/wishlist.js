const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Wishlist, Customer, Product, ProductImage, Category, SubCategory } = require('../models');

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

// Tüm favorileri listele
router.get('/', authenticateToken, async (req, res) => {
  try {
    const wishlistItems = await Wishlist.findAll({
      where: {
        customer_id: req.customerId
      },
      include: [
        {
          model: Product,
          as: 'product',
          where: {
            is_active: true,
            is_archived: false
          },
          include: [
            {
              model: ProductImage,
              as: 'images',
              required: false
            },
            {
              model: Category,
              as: 'category',
              required: false
            },
            {
              model: SubCategory,
              as: 'subCategory',
              required: false
            }
          ],
          required: false
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Aktif ürünleri filtrele
    const activeItems = wishlistItems.filter(item => item.product !== null);

    res.json({
      success: true,
      data: activeItems,
      count: activeItems.length
    });
  } catch (error) {
    console.error('Favoriler listesi hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Favorilere ürün ekle
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        error: 'product_id gerekli'
      });
    }

    // Ürünü kontrol et
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Ürün bulunamadı'
      });
    }

    if (!product.is_active || product.is_archived) {
      return res.status(400).json({
        success: false,
        error: 'Bu ürün aktif değil'
      });
    }

    // Zaten favorilerde var mı kontrol et
    const existingItem = await Wishlist.findOne({
      where: {
        customer_id: req.customerId,
        product_id: product_id
      }
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        error: 'Bu ürün zaten favorilerinizde'
      });
    }

    // Favorilere ekle
    const wishlistItem = await Wishlist.create({
      customer_id: req.customerId,
      product_id: product_id
    });

    res.status(201).json({
      success: true,
      data: wishlistItem,
      message: 'Ürün favorilere eklendi'
    });
  } catch (error) {
    console.error('Favorilere ekleme hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Favorilerden ürün çıkar
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      where: {
        customer_id: req.customerId,
        product_id: productId
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        error: 'Bu ürün favorilerinizde bulunamadı'
      });
    }

    await wishlistItem.destroy();

    res.json({
      success: true,
      message: 'Ürün favorilerden çıkarıldı'
    });
  } catch (error) {
    console.error('Favorilerden çıkarma hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Ürün favorilerde mi kontrol et
router.get('/check/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      where: {
        customer_id: req.customerId,
        product_id: productId
      }
    });

    res.json({
      success: true,
      isInWishlist: !!wishlistItem
    });
  } catch (error) {
    console.error('Favori kontrol hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

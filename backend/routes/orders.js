const express = require('express');
const router = express.Router();
const { Order, OrderItem, User, Product } = require('../models');
const { Op } = require('sequelize');

// Tüm siparişleri listele
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, payment_status, search } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (status) where.status = status;
    if (payment_status) where.payment_status = payment_status;
    if (search) {
      where[Op.or] = [
        { order_number: { [Op.iLike]: `%${search}%` } },
        { tracking_number: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Sipariş listesi hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Bekleyen siparişleri getir
router.get('/pending', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { status: 'pending' },
      include: [
        { model: User, as: 'user', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }
      ],
      order: [['created_at', 'ASC']]
    });
    
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Bekleyen siparişler hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tek sipariş getir
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user' },
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Sipariş bulunamadı' });
    }
    
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Sipariş getirme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sipariş durumunu güncelle
router.patch('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Sipariş bulunamadı' });
    }
    
    const { status, tracking_number } = req.body;
    
    if (status) {
      order.status = status;
    }
    if (tracking_number !== undefined) {
      order.tracking_number = tracking_number;
    }
    
    await order.save();
    
    res.json({
      success: true,
      data: order,
      message: 'Sipariş durumu güncellendi'
    });
  } catch (error) {
    console.error('Sipariş durum güncelleme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ödeme durumunu güncelle
router.patch('/:id/payment-status', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Sipariş bulunamadı' });
    }
    
    const { payment_status } = req.body;
    order.payment_status = payment_status;
    await order.save();
    
    res.json({
      success: true,
      data: order,
      message: 'Ödeme durumu güncellendi'
    });
  } catch (error) {
    console.error('Ödeme durum güncelleme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { ChatConversation, ChatMessage, Customer } = require('../models');
const crypto = require('crypto');


const getOrCreateSessionId = (req) => {
  // Cookie'den session ID al
  let sessionId = req.cookies?.chatbot_session_id;
  
  // Session ID yoksa oluştur
  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }
  
  return sessionId;
};

/**
 * Conversation oluşturma veya mevcut conversation'ı bulma
 */
const getOrCreateConversation = async (sessionId, customerId, req) => {
  // Mevcut aktif conversation'ı bul
  let conversation = await ChatConversation.findOne({
    where: {
      session_id: sessionId,
      status: 'active'
    },
    order: [['created_at', 'DESC']]
  });

  // Conversation yoksa oluştur
  if (!conversation) {
    conversation = await ChatConversation.create({
      session_id: sessionId,
      customer_id: customerId || null,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('user-agent') || null,
      status: 'active',
      metadata: {}
    });
  }

  return conversation;
};

/**
 * Mesaj kaydetme
 */
const saveMessage = async (conversationId, role, content, metadata = {}) => {
  // Son mesajın sırasını bul
  const lastMessage = await ChatMessage.findOne({
    where: { conversation_id: conversationId },
    order: [['message_order', 'DESC']]
  });

  const messageOrder = lastMessage ? lastMessage.message_order + 1 : 1;

  // Mesajı kaydet
  const message = await ChatMessage.create({
    conversation_id: conversationId,
    role: role,
    content: content,
    message_order: messageOrder,
    metadata: metadata
  });

  return message;
};

/**
 * Tasarım önerileri için sistem prompt'u
 */
const SYSTEM_PROMPT = `Sen dekoartizan'ın profesyonel tasarım asistanısın. 
Görevin müşterilere marka bilgilerine göre özel tasarım önerileri sunmak.

Önemli kurallar:
1. Müşterinin marka bilgilerini (renkler, stil, hedef kitle, sektör vb.) sor
2. Marka kimliğine uygun duvar kağıdı ve dekoratif ürün önerileri sun
3. Profesyonel, samimi ve yardımcı bir dil kullan
4. Türkçe yanıt ver
5. Önerilerinde somut ve detaylı bilgiler ver
6. Müşteriyi ürün kataloğuna yönlendir

Marka bilgileri eksikse, önce bunları öğrenmeye çalış.`;

/**
 * Basit yanıt sistemi (OpenAI API yoksa)
 */
const generateSimpleResponse = (userMessage, conversationHistory) => {
  const message = userMessage.toLowerCase();
  
  // Karşılama mesajları
  if (message.includes('merhaba') || message.includes('selam') || message.includes('hey')) {
    return 'Merhaba! Ben dekoartizan tasarım asistanınız. Size nasıl yardımcı olabilirim? Marka bilgilerinizi paylaşırsanız, size özel tasarım önerileri sunabilirim.';
  }
  
  // Marka bilgisi soruları
  if (message.includes('marka') || message.includes('brand')) {
    return 'Harika! Size en iyi tasarım önerilerini sunabilmem için birkaç soru sormam gerekiyor:\n\n1. Markanızın sektörü nedir? (örn: moda, teknoloji, gıda)\n2. Markanızın ana renkleri nelerdir?\n3. Hangi tarzı tercih edersiniz? (modern, klasik, minimalist, şık vb.)\n4. Hedef kitleniz kimler?\n\nBu bilgileri paylaşırsanız, size özel tasarım önerileri hazırlayabilirim!';
  }
  
  // Tasarım önerileri
  if (message.includes('tasarım') || message.includes('öneri') || message.includes('dekorasyon')) {
    return 'Size özel tasarım önerileri sunabilmem için marka bilgilerinize ihtiyacım var. Lütfen şunları paylaşın:\n\n• Marka adınız ve sektörünüz\n• Tercih ettiğiniz renk paleti\n• Tasarım stili (modern, klasik, minimalist vb.)\n• Kullanım alanı (ofis, mağaza, ev vb.)\n\nBu bilgileri aldıktan sonra, size en uygun duvar kağıdı ve dekoratif ürün önerilerini sunacağım!';
  }
  
  // Teşekkür mesajları
  if (message.includes('teşekkür') || message.includes('sağol') || message.includes('thanks')) {
    return 'Rica ederim! Başka bir konuda yardımcı olabilir miyim? Marka bilgilerinizi paylaşırsanız, size özel tasarım önerileri sunabilirim.';
  }
  
  // Varsayılan yanıt
  return 'Anladım! Size daha iyi yardımcı olabilmem için marka bilgilerinizi paylaşabilir misiniz? Örneğin:\n\n• Markanızın sektörü\n• Tercih ettiğiniz renkler\n• Tasarım stili\n• Kullanım amacı\n\nBu bilgilerle size özel tasarım önerileri hazırlayabilirim!';
};

/**
 * OpenAI ile yanıt üretme
 */
const generateAIResponse = async (userMessage, conversationHistory) => {
  try {
    let OpenAI;
    try {
      OpenAI = require('openai');
    } catch (error) {
      console.warn('OpenAI paketi yüklü değil, basit yanıt sistemine geçiliyor');
      return generateSimpleResponse(userMessage, conversationHistory);
    }
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10), // Son 10 mesajı gönder
      { role: 'user', content: userMessage },
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return {
      response: completion.choices[0]?.message?.content || 'Üzgünüm, bir yanıt oluşturamadım.',
      usage: completion.usage
    };
  } catch (error) {
    console.error('OpenAI API hatası:', error);
    // Hata durumunda basit yanıt sistemine dön
    return {
      response: generateSimpleResponse(userMessage, conversationHistory),
      usage: null
    };
  }
};

/**
 * POST /api/chatbot
 * Chatbot mesajı gönderme endpoint'i
 */
router.post(
  '/',
  [
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Mesaj boş olamaz')
      .isLength({ max: 1000 })
      .withMessage('Mesaj çok uzun (maksimum 1000 karakter)'),
    body('conversationHistory')
      .optional()
      .isArray()
      .withMessage('Konuşma geçmişi bir dizi olmalıdır'),
    body('sessionId')
      .optional()
      .isString()
      .withMessage('Session ID bir string olmalıdır'),
  ],
  async (req, res) => {
    const { sequelize } = require('../config/database');
    const transaction = await sequelize.transaction();
    
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        await transaction.rollback();
        return res.status(400).json({
          error: 'Geçersiz istek',
          details: errors.array(),
        });
      }

      const { message, conversationHistory = [], sessionId: clientSessionId } = req.body;

      // Session ID'yi al veya oluştur
      const sessionId = clientSessionId || getOrCreateSessionId(req);

      // Customer ID'yi token'dan al (eğer authenticated ise)
      let customerId = null;
      if (req.user && req.user.customerId) {
        customerId = req.user.customerId;
      } else if (req.user && req.user.id) {
        customerId = req.user.id;
      }

      // Conversation'ı al veya oluştur
      const conversation = await getOrCreateConversation(sessionId, customerId, req);

      // Kullanıcı mesajını kaydet
      await saveMessage(
        conversation.id,
        'user',
        message,
        {
          ip_address: req.ip || req.connection.remoteAddress,
          user_agent: req.get('user-agent')
        }
      );

      // AI yanıtını oluştur
      let response;
      let aiMetadata = {};
      
      // OpenAI API varsa kullan
      if (process.env.OPENAI_API_KEY) {
        const aiResponse = await generateAIResponse(message, conversationHistory);
        response = aiResponse.response || aiResponse;
        aiMetadata = {
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          ...(aiResponse.usage && { usage: aiResponse.usage })
        };
      } else {
        // Basit yanıt sistemi kullan
        response = generateSimpleResponse(message, conversationHistory);
        aiMetadata = {
          model: 'simple-response-system'
        };
      }

      // Asistan mesajını kaydet
      await saveMessage(
        conversation.id,
        'assistant',
        response,
        aiMetadata
      );

      // Conversation metadata'sını güncelle (marka bilgileri vb.)
      if (message.toLowerCase().includes('marka') || message.toLowerCase().includes('sektör') || 
          message.toLowerCase().includes('renk') || message.toLowerCase().includes('tasarım')) {
        const currentMetadata = conversation.metadata || {};
        conversation.metadata = {
          ...currentMetadata,
          last_brand_mention: new Date().toISOString(),
          has_brand_info: true
        };
        await conversation.save({ transaction });
      }

      await transaction.commit();

      // Session ID'yi cookie'ye kaydet (30 gün geçerli)
      res.cookie('chatbot_session_id', sessionId, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      res.json({
        success: true,
        response: response,
        sessionId: sessionId,
        conversationId: conversation.id,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Chatbot endpoint hatası:', error);
      res.status(500).json({
        error: 'Chatbot yanıtı oluşturulurken bir hata oluştu',
        message: error.message,
      });
    }
  }
);

/**
 * GET /api/chatbot/health
 * Chatbot servis durumu kontrolü
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    aiService: process.env.OPENAI_API_KEY ? 'OpenAI' : 'Simple Response System',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/chatbot/conversations
 * Tüm conversation'ları listele (admin için)
 * NOT: Bu route, /conversations/:sessionId route'undan ÖNCE tanımlanmalı
 */
router.get('/conversations', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows: conversations } = await ChatConversation.findAndCountAll({
      where,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'email', 'first_name', 'last_name']
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      conversations: conversations.map(conv => ({
        id: conv.id,
        sessionId: conv.session_id,
        customer: conv.customer ? {
          id: conv.customer.id,
          email: conv.customer.email,
          name: `${conv.customer.first_name || ''} ${conv.customer.last_name || ''}`.trim()
        } : null,
        status: conv.status,
        metadata: conv.metadata,
        createdAt: conv.created_at,
        updatedAt: conv.updated_at
      })),
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Conversation listeleme hatası:', error);
    res.status(500).json({
      error: 'Konuşmalar listelenirken bir hata oluştu',
      message: error.message,
    });
  }
});

/**
 * GET /api/chatbot/conversations/:sessionId
 * Belirli bir session'a ait conversation ve mesajları getir
 * NOT: Bu route, /conversations route'undan SONRA tanımlanmalı
 */
router.get('/conversations/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Eğer sessionId bir sayıysa (conversation ID), ID ile ara
    const isNumeric = /^\d+$/.test(sessionId);
    const where = isNumeric 
      ? { id: parseInt(sessionId) }
      : { session_id: sessionId };

    const conversation = await ChatConversation.findOne({
      where: where,
      include: [
        {
          model: ChatMessage,
          as: 'messages',
          order: [['message_order', 'ASC']]
        }
      ],
      order: [[{ model: ChatMessage, as: 'messages' }, 'message_order', 'ASC']]
    });

    if (!conversation) {
      return res.status(404).json({
        error: 'Konuşma bulunamadı'
      });
    }

    res.json({
      success: true,
      conversation: {
        id: conversation.id,
        sessionId: conversation.session_id,
        status: conversation.status,
        metadata: conversation.metadata,
        createdAt: conversation.created_at,
        messages: conversation.messages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          messageOrder: msg.message_order,
          createdAt: msg.created_at
        }))
      }
    });
  } catch (error) {
    console.error('Conversation getirme hatası:', error);
    res.status(500).json({
      error: 'Konuşma getirilirken bir hata oluştu',
      message: error.message,
    });
  }
});

module.exports = router;

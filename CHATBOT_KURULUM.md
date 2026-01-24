# Chatbot Kurulum Rehberi

Bu dokümantasyon, dekoartizan chatbot'unun kurulumu ve yapılandırması hakkında bilgi içerir.

## 📋 Genel Bakış

Chatbot, müşterilere marka bilgilerine göre özel tasarım önerileri sunan bir AI asistanıdır. İki modda çalışabilir:

1. **OpenAI API Modu**: OpenAI API kullanarak gelişmiş AI yanıtları
2. **Basit Yanıt Modu**: OpenAI API olmadan çalışan temel yanıt sistemi

## 🚀 Kurulum

### 1. Backend Bağımlılıkları

Chatbot için ek bir paket kurulumu gerekmez. Ancak OpenAI API kullanmak istiyorsanız:

```bash
cd backend
npm install openai
```

### 2. Environment Variables

Backend `.env` dosyanıza aşağıdaki değişkenleri ekleyin:

#### OpenAI API Kullanımı (Opsiyonel)

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo  # veya gpt-4, gpt-4-turbo-preview
```

**Not**: OpenAI API key yoksa, chatbot otomatik olarak basit yanıt sistemine geçer.

#### OpenAI API Key Alma

1. [OpenAI Platform](https://platform.openai.com/) adresine gidin
2. Hesap oluşturun veya giriş yapın
3. API Keys bölümünden yeni bir API key oluşturun
4. API key'i `.env` dosyasına ekleyin

### 3. Frontend Yapılandırması

Frontend tarafında ek bir yapılandırma gerekmez. Chatbot otomatik olarak tüm sayfalarda görünür.

## 🎯 Kullanım

### Kullanıcı Tarafı

1. Sağ alt köşedeki chatbot butonuna tıklayın
2. Chatbot penceresi açılacaktır
3. Marka bilgilerinizi paylaşın:
   - Marka adı ve sektörü
   - Tercih edilen renkler
   - Tasarım stili (modern, klasik, minimalist vb.)
   - Kullanım alanı
4. Chatbot size özel tasarım önerileri sunacaktır

### API Kullanımı

#### Mesaj Gönderme

```bash
POST /api/chatbot
Content-Type: application/json

{
  "message": "Markam için tasarım önerileri istiyorum",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Merhaba"
    },
    {
      "role": "assistant",
      "content": "Merhaba! Size nasıl yardımcı olabilirim?"
    }
  ]
}
```

**Yanıt:**

```json
{
  "success": true,
  "response": "Harika! Size en iyi tasarım önerilerini sunabilmem için...",
  "timestamp": "2026-01-25T10:30:00.000Z"
}
```

#### Servis Durumu Kontrolü

```bash
GET /api/chatbot/health
```

**Yanıt:**

```json
{
  "status": "OK",
  "aiService": "OpenAI",  // veya "Simple Response System"
  "timestamp": "2026-01-25T10:30:00.000Z"
}
```

## 🔧 Özelleştirme

### Sistem Prompt'unu Değiştirme

`backend/routes/chatbot.js` dosyasındaki `SYSTEM_PROMPT` değişkenini düzenleyerek chatbot'un davranışını özelleştirebilirsiniz.

### Basit Yanıt Sistemini Geliştirme

`generateSimpleResponse` fonksiyonunu düzenleyerek daha fazla yanıt senaryosu ekleyebilirsiniz.

### UI Özelleştirme

`src/components/chatbot/Chatbot.tsx` dosyasını düzenleyerek chatbot'un görünümünü özelleştirebilirsiniz.

## 📝 Özellikler

- ✅ Floating button ile kolay erişim
- ✅ Modern ve responsive chat arayüzü
- ✅ Konuşma geçmişi takibi
- ✅ OpenAI API entegrasyonu (opsiyonel)
- ✅ Basit yanıt sistemi (OpenAI olmadan çalışır)
- ✅ Marka bilgilerine göre tasarım önerileri
- ✅ Türkçe dil desteği

## 🐛 Sorun Giderme

### Chatbot Yanıt Vermiyor

1. Backend sunucusunun çalıştığından emin olun
2. `GET /api/chatbot/health` endpoint'ini kontrol edin
3. Browser console'da hata mesajlarını kontrol edin
4. Backend loglarını kontrol edin

### OpenAI API Hatası

1. API key'in doğru olduğundan emin olun
2. API key'in aktif olduğunu kontrol edin
3. OpenAI hesabınızda yeterli kredi olduğundan emin olun
4. Hata durumunda chatbot otomatik olarak basit yanıt sistemine geçer

### CORS Hatası

Backend `.env` dosyasında `CORS_ORIGINS` değişkeninin frontend URL'ini içerdiğinden emin olun.

## 📚 İleri Seviye

### Konuşma Geçmişini Veritabanında Saklama

İsterseniz konuşma geçmişini veritabanında saklayabilirsiniz. Bunun için:

1. Yeni bir `ChatConversation` modeli oluşturun
2. Her mesajı veritabanına kaydedin
3. Kullanıcıya göre konuşma geçmişini yükleyin

### Çoklu Dil Desteği

Chatbot'a çoklu dil desteği eklemek için:

1. Kullanıcının dil tercihini algılayın
2. Sistem prompt'unu dil tercihine göre ayarlayın
3. Yanıtları kullanıcının tercih ettiği dilde üretin

## 🔒 Güvenlik

- Chatbot endpoint'i rate limiting ile korunur
- Mesaj uzunluğu maksimum 1000 karakter ile sınırlıdır
- Konuşma geçmişi maksimum 10 mesaj ile sınırlıdır (performans için)
- OpenAI API key'i asla frontend'de kullanılmaz

## 📞 Destek

Sorularınız için lütfen proje yöneticisi ile iletişime geçin.

const nodemailer = require('nodemailer');

const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(SMTP_CONFIG);

transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ SMTP connection error:', error.message);
    console.error('💡 SMTP ayarlarını kontrol edin: SMTP_USER, SMTP_PASSWORD');
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('❌ SMTP yapılandırması eksik: SMTP_USER ve SMTP_PASSWORD gerekli');
      return { 
        success: false, 
        error: 'SMTP yapılandırması eksik' 
      };
    }

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'dekoartizan'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: subject,
      html: html,
      ...(text && { text: text }),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent:', {
      to: to,
      subject: subject,
      messageId: info.messageId
    });

    return { 
      success: true, 
      messageId: info.messageId 
    };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

const sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Şifre Sıfırlama</h1>
        <p>Merhaba,</p>
        <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
        <a href="${resetUrl}" class="button">Şifremi Sıfırla</a>
        <p>Veya aşağıdaki linki kopyalayıp tarayıcınıza yapıştırın:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <p>Bu link 1 saat geçerlidir.</p>
        <p>Eğer bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        <div class="footer">
          <p>Saygılarımızla,<br>dekoartizan Ekibi</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Şifre Sıfırlama
    
    Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:
    ${resetUrl}
    
    Bu link 1 saat geçerlidir.
    
    Eğer bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.
    
    Saygılarımızla,
    dekoartizan Ekibi
  `;

  return await sendEmail({
    to: email,
    subject: 'Şifre Sıfırlama - dekoartizan',
    html: html,
    text: text
  });
};

const sendVerificationEmail = async (email, verificationToken, verificationUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>E-posta Doğrulama</h1>
        <p>Merhaba,</p>
        <p>Hesabınızı doğrulamak için aşağıdaki butona tıklayın:</p>
        <a href="${verificationUrl}" class="button">E-postamı Doğrula</a>
        <p>Veya aşağıdaki linki kopyalayıp tarayıcınıza yapıştırın:</p>
        <p style="word-break: break-all;">${verificationUrl}</p>
        <p>Bu link 24 saat geçerlidir.</p>
        <div class="footer">
          <p>Saygılarımızla,<br>dekoartizan Ekibi</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    E-posta Doğrulama
    
    Hesabınızı doğrulamak için aşağıdaki linke tıklayın:
    ${verificationUrl}
    
    Bu link 24 saat geçerlidir.
    
    Saygılarımızla,
    dekoartizan Ekibi
  `;

  return await sendEmail({
    to: email,
    subject: 'E-posta Doğrulama - dekoartizan',
    html: html,
    text: text
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  transporter,
};

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kullanım Şartları | dekoartizan",
  description: "dekoartizan kullanım şartları ve koşulları.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            Kullanım Şartları
          </h1>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Son Güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              1. Genel Hükümler
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Bu Kullanım Şartları, dekoartizan web sitesini ve hizmetlerini kullanımınızı 
              düzenler. Web sitemizi kullanarak, bu şartları kabul etmiş sayılırsınız. 
              Şartları kabul etmiyorsanız, lütfen web sitemizi kullanmayın.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              2. Hizmetlerimiz
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              dekoartizan, duvar kağıdı ürünlerinin satışını yapan bir e-ticaret platformudur. 
              Web sitemiz üzerinden ürünleri görüntüleyebilir, sipariş verebilir ve satın alabilirsiniz.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              3. Hesap Oluşturma
            </h2>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              3.1. Hesap Bilgileri
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Sipariş vermek için bir hesap oluşturmanız gerekebilir. Hesap oluştururken:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>Doğru ve güncel bilgiler sağlamalısınız</li>
              <li>Hesap bilgilerinizin gizliliğinden siz sorumlusunuz</li>
              <li>Hesabınızın güvenliğinden siz sorumlusunuz</li>
              <li>Şüpheli aktivite tespit edilirse bize bildirmelisiniz</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              3.2. Yaş Sınırı
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Hizmetlerimizi kullanmak için en az 18 yaşında olmalısınız veya yasal vasinizin 
              izniyle işlem yapmalısınız.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              4. Sipariş ve Ödeme
            </h2>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              4.1. Sipariş Süreci
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Sipariş vermek için:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>Ürünleri sepetinize ekleyin</li>
              <li>Ölçülerinizi doğru girin</li>
              <li>Teslimat bilgilerinizi kontrol edin</li>
              <li>Ödeme yöntemini seçin ve ödemeyi tamamlayın</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              4.2. Fiyatlar
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Tüm fiyatlar Türk Lirası (TL) cinsindendir ve KDV dahildir. Fiyatlar önceden 
              haber vermeksizin değiştirilebilir. Ancak siparişiniz onaylandıktan sonra 
              fiyat değişikliği yapılmaz.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              4.3. Ödeme
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Ödemeler güvenli ödeme sağlayıcıları aracılığıyla yapılır. Kredi kartı, 
              banka kartı ve diğer ödeme yöntemleri kabul edilir. Ödeme bilgileriniz 
              güvenli bir şekilde işlenir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              5. Teslimat
            </h2>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              5.1. Teslimat Süresi
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Teslimat süreleri ürün ve konumunuza göre değişiklik gösterebilir. Tahmini 
              teslimat süreleri sipariş sırasında belirtilir. Teslimat gecikmelerinden 
              sorumlu değiliz.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              5.2. Teslimat Adresi
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Teslimat adresinizi doğru ve eksiksiz girmek sizin sorumluluğunuzdadır. 
              Yanlış adres nedeniyle oluşan sorunlardan sorumlu değiliz.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              6. İade ve İptal
            </h2>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              6.1. İptal Hakkı
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Siparişinizi teslimattan önce iptal edebilirsiniz. İptal talebinizi 
              müşteri hizmetlerimizle iletişime geçerek yapabilirsiniz.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              6.2. İade Koşulları
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Ürünlerin iadesi için:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>Ürün kullanılmamış ve orijinal ambalajında olmalıdır</li>
              <li>İade talebi teslimattan itibaren 14 gün içinde yapılmalıdır</li>
              <li>Ürün hatası veya hasarlı teslimat durumunda tam iade yapılır</li>
              <li>Kargo ücretleri iade koşullarına göre değişiklik gösterebilir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              7. Fikri Mülkiyet
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Web sitemizdeki tüm içerikler (metinler, görseller, logolar, tasarımlar vb.) 
              dekoartizan'a aittir ve telif haklarıyla korunmaktadır. İzinsiz kullanımı 
              yasaktır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              8. Kullanıcı Sorumlulukları
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Web sitemizi kullanırken:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>Yasalara ve düzenlemelere uymalısınız</li>
              <li>Başkalarının haklarına saygı göstermelisiniz</li>
              <li>Zararlı içerik paylaşmamalısınız</li>
              <li>Sistem güvenliğini tehdit edecek eylemlerde bulunmamalısınız</li>
              <li>Sahte bilgi vermemelisiniz</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              9. Sorumluluk Sınırlaması
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              dekoartizan, web sitesinin kesintisiz ve hatasız çalışmasını garanti etmez. 
              Teknik sorunlar, bakım çalışmaları veya diğer nedenlerle hizmet kesintileri 
              yaşanabilir. Bu durumlardan kaynaklanan zararlardan sorumlu değiliz.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              10. Değişiklikler
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Bu Kullanım Şartlarını zaman zaman güncelleyebiliriz. Önemli değişikliklerde 
              size bildirim yapacağız. Güncel şartlar her zaman bu sayfada yayınlanacaktır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              11. Uygulanacak Hukuk
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Bu Kullanım Şartları Türkiye Cumhuriyeti yasalarına tabidir. Herhangi bir 
              uyuşmazlık durumunda Türkiye Cumhuriyeti mahkemeleri yetkilidir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              12. İletişim
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Kullanım şartları hakkında sorularınız varsa bizimle iletişime geçebilirsiniz:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>E-posta:</strong> info@dekoartizan.com
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Web:</strong> <Link href="/" className="text-primary hover:underline">www.dekoartizan.com</Link>
              </p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/"
              className="text-primary hover:underline font-medium"
            >
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

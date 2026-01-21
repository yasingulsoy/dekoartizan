import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "İade ve Değişim Bilgileri | dekoartizan",
  description: "dekoartizan iade ve değişim bilgileri, cayma hakkı ve iade koşulları.",
};

export default function ReturnAndExchangePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            İade ve Değişim Bilgileri
          </h1>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Son Güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Cayma Hakkı
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Tüketicinin özel istek ve talepleri uyarınca özel ölçülü baskı yapılarak KİŞİYE ÖZEL hale getirilen ürünlerde tüketici cayma hakkını kullanamaz.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              İade ve Değişim Hakkı
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Sitemizden almış olduğunuz ürünleri aşağıdaki belirtilen kriterler çerçevesinde veya ürünlerin açılmadığı durumlarda koşulsuz, ürün teslim tarihinden itibaren, 14 gün içerisinde değişim ve iade etme hakkı bulunmaktadır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              İade ve Değişim Kriterleri
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Aşağıdaki durumlarda iade ve değişim talebiniz kabul edilir:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>
                <strong>Ürünlerde imalat hatası bulunması durumunda</strong>
              </li>
              <li>
                <strong>Verdiğiniz ölçüden farklı bir ölçü yapılması durumunda</strong> (özel baskılar için)
              </li>
              <li>
                <strong>Sipariş vermiş olduğunuz üründen farklı bir ürün gelmesi durumunda</strong>
              </li>
              <li>
                <strong>Kargodan kaynaklanan herhangi bir hasar bulunması durumunda</strong> (Hasar tespit tutanağı düzenlenmeli aksi takdirde iade ve değişim kabul edilmemektedir)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              İade ve Değişim Talebi Nasıl Yapılır?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Yukarıdaki kriterlerin en az birine sahip olmanız durumunda sitemizde bulunan destek bölümünden iade ve değişim talebinizi iletmeniz gerekmektedir. Onaylanan taleplerin geri ödemeleri 1-7 iş günü içerisinde yapılmaktadır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              İade Adresi
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              İadesi onaylanan ürünlerinizi aşağıdaki adrese anlaşmalı olduğumuz Sürat Kargo ile gönderebilirsiniz. Gönderi ücreti sizin tarafınızdan karşılanmaktadır.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-4">
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                İade Adresi:
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Meydankavağı Mah. Avni Tolunay Cd. Abdullah Yıldırım 1 Sitesi<br />
                Muratpaşa/Antalya
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Önemli Notlar
            </h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>İade ve değişim talebiniz en geç ürün teslim tarihinden itibaren 14 gün içinde yapılmalıdır.</li>
              <li>Kargodan kaynaklanan hasarlarda mutlaka hasar tespit tutanağı düzenlenmelidir.</li>
              <li>İade gönderilerinde Sürat Kargo kullanılması gerekmektedir.</li>
              <li>Gönderi ücreti müşteri tarafından karşılanmaktadır.</li>
              <li>Kişiye özel ürünlerde cayma hakkı kullanılamaz.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              İletişim
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              İade ve değişim işlemleri hakkında sorularınız için bizimle iletişime geçebilirsiniz:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>E-posta:</strong> info@dekoartizan.com
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Telefon:</strong> 0 (850) 307 03 56
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

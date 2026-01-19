import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | dekoartizan",
  description: "dekoartizan gizlilik politikası ve kişisel verilerin korunması hakkında bilgiler.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            Gizlilik Politikası
          </h1>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Son Güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              1. Giriş
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              dekoartizan olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası, 
              web sitemizi ziyaret ettiğinizde veya hizmetlerimizi kullandığınızda topladığımız bilgileri, 
              bu bilgileri nasıl kullandığımızı ve koruduğumuzu açıklamaktadır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              2. Toplanan Bilgiler
            </h2>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              2.1. Kişisel Bilgiler
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Hizmetlerimizi kullanırken aşağıdaki kişisel bilgileri toplayabiliriz:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>Ad ve soyad</li>
              <li>E-posta adresi</li>
              <li>Telefon numarası</li>
              <li>Fatura ve teslimat adresi</li>
              <li>Ödeme bilgileri (güvenli ödeme sağlayıcıları aracılığıyla)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              2.2. Otomatik Toplanan Bilgiler
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Web sitemizi ziyaret ettiğinizde aşağıdaki bilgiler otomatik olarak toplanabilir:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>IP adresi</li>
              <li>Tarayıcı türü ve sürümü</li>
              <li>İşletim sistemi</li>
              <li>Ziyaret edilen sayfalar ve süre</li>
              <li>Referans URL'ler</li>
              <li>Çerezler (cookies) ve benzeri teknolojiler</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              3. Bilgilerin Kullanımı
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Topladığımız bilgileri aşağıdaki amaçlarla kullanırız:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>Siparişlerinizi işlemek ve teslimat yapmak</li>
              <li>Müşteri hizmetleri sağlamak</li>
              <li>Hesabınızı yönetmek</li>
              <li>Ürün ve hizmetlerimizi geliştirmek</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek</li>
              <li>Güvenlik ve dolandırıcılık önleme</li>
              <li>İletişim ve pazarlama (izin verdiğiniz takdirde)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              4. Bilgilerin Paylaşılması
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Kişisel bilgilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmayız:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>Hizmet sağlayıcılarımız (kargo, ödeme işlemcileri vb.) - sadece hizmet sağlamak için gerekli bilgiler</li>
              <li>Yasal yükümlülüklerimiz gereği</li>
              <li>İşletme transferleri (birleşme, devir vb.)</li>
              <li>Açık izninizle</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              5. Çerezler (Cookies)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Web sitemizde çerezler kullanıyoruz. Çerezler, web sitesinin düzgün çalışması, 
              kullanıcı deneyimini iyileştirme ve analitik amaçlarla kullanılır. Tarayıcı 
              ayarlarınızdan çerezleri yönetebilirsiniz.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              6. Veri Güvenliği
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Kişisel bilgilerinizin güvenliğini sağlamak için endüstri standardı güvenlik 
              önlemleri alıyoruz. Ancak, internet üzerinden veri iletiminin %100 güvenli 
              olmadığını unutmayın.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              7. KVKK Haklarınız
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse bilgi talep etme</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
              <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
              <li>Kanunlarda öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
              <li>Düzeltme, silme veya yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
              <li>İşlenen verilerin münhasıran otomatik sistemler ile analiz edilmesi suretiyle aleyhinize bir sonuç doğurmasına itiraz etme</li>
              <li>Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              8. Çocukların Gizliliği
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Hizmetlerimiz 18 yaş altındaki çocuklar için tasarlanmamıştır. Bilerek 18 yaş 
              altındaki çocuklardan kişisel bilgi toplamıyoruz.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              9. Politika Değişiklikleri
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli değişikliklerde 
              size bildirim yapacağız. Güncel politika her zaman bu sayfada yayınlanacaktır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              10. İletişim
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Gizlilik politikamız hakkında sorularınız varsa veya kişisel verilerinizle ilgili 
              haklarınızı kullanmak istiyorsanız, bizimle iletişime geçebilirsiniz:
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

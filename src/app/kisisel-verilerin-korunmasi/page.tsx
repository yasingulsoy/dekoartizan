import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kişisel Verilerin Korunması | dekoartizan",
  description: "dekoartizan Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni ve kişisel verilerin korunması hakkında bilgiler.",
};

export default function KVKKPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            Kişisel Verilerin Korunması
          </h1>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Son Güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              1. Aydınlatma Metni
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verilerinizin 
              işlenmesi konusunda aşağıdaki bilgilendirmeyi sizlere sunmaktayız.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              2. Veri Sorumlusu
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Kişisel verilerinizin işlenmesinden sorumlu olan veri sorumlusu:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Şirket Adı:</strong> dekoartizan
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>E-posta:</strong> info@dekoartizan.com
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Web:</strong> <Link href="/" className="text-primary hover:underline">www.dekoartizan.com</Link>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              3. İşlenen Kişisel Veriler
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Hizmetlerimizi sunmak ve yasal yükümlülüklerimizi yerine getirmek amacıyla aşağıdaki 
              kişisel verileriniz işlenmektedir:
            </p>
            
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              3.1. Kimlik Bilgileri
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>Ad ve soyad</li>
              <li>TC Kimlik numarası (yasal zorunluluklar gereği)</li>
              <li>Doğum tarihi</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              3.2. İletişim Bilgileri
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>E-posta adresi</li>
              <li>Telefon numarası</li>
              <li>Adres bilgileri (fatura ve teslimat adresi)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              3.3. Müşteri İşlem Bilgileri
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>Sipariş bilgileri</li>
              <li>Ödeme bilgileri (güvenli ödeme sağlayıcıları aracılığıyla)</li>
              <li>Fatura bilgileri</li>
              <li>İade ve değişim bilgileri</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              3.4. Pazarlama ve İletişim Bilgileri
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>E-posta pazarlama izni (açık rıza ile)</li>
              <li>SMS pazarlama izni (açık rıza ile)</li>
              <li>Tercih ve beğeni bilgileri</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              3.5. İşlem Güvenliği Bilgileri
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>IP adresi</li>
              <li>Çerez (cookie) bilgileri</li>
              <li>Tarayıcı bilgileri</li>
              <li>Log kayıtları</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              4. Kişisel Verilerin İşlenme Amaçları
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>Siparişlerinizin işlenmesi ve teslimatının yapılması</li>
              <li>Müşteri ilişkileri yönetimi ve müşteri hizmetleri sunumu</li>
              <li>Hesap oluşturma ve yönetimi</li>
              <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
              <li>Fatura ve muhasebe işlemlerinin yürütülmesi</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi (vergi, muhasebe vb.)</li>
              <li>Güvenlik ve dolandırıcılık önleme</li>
              <li>Ürün ve hizmetlerimizin geliştirilmesi</li>
              <li>Pazarlama ve tanıtım faaliyetleri (açık rıza ile)</li>
              <li>Müşteri memnuniyeti analizi ve anket çalışmaları</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              5. Kişisel Verilerin İşlenme Hukuki Sebepleri
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Kişisel verileriniz aşağıdaki hukuki sebeplere dayanarak işlenmektedir:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>KVKK madde 5/2-a: Açık rızanızın bulunması</li>
              <li>KVKK madde 5/2-c: Sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması</li>
              <li>KVKK madde 5/2-e: Veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi</li>
              <li>KVKK madde 5/2-f: Meşru menfaatlerimiz için veri işlemenin zorunlu olması</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              6. Kişisel Verilerin Aktarılması
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Kişisel verileriniz, hizmetlerimizin sunulması ve yasal yükümlülüklerimizin yerine 
              getirilmesi amacıyla aşağıdaki üçüncü kişilere aktarılabilir:
            </p>
            
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              6.1. Hizmet Sağlayıcılar
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>Kargo ve lojistik firmaları (teslimat için)</li>
              <li>Ödeme işlemcileri ve finansal kurumlar (ödeme işlemleri için)</li>
              <li>IT hizmet sağlayıcıları (hosting, bulut servisleri vb.)</li>
              <li>Pazarlama ve reklam ajansları (açık rıza ile)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              6.2. Yasal Zorunluluklar
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Yasal yükümlülüklerimiz gereği, kişisel verileriniz kamu kurum ve kuruluşlarına 
              (vergi dairesi, mahkemeler vb.) aktarılabilir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              7. Kişisel Verilerin Saklanma Süresi
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Kişisel verileriniz, işleme amaçlarının gerektirdiği süre boyunca ve yasal saklama 
              süreleri çerçevesinde saklanmaktadır. Yasal saklama süreleri dolduktan sonra kişisel 
              verileriniz silinir, yok edilir veya anonim hale getirilir.
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>Ticari kayıtlar: 10 yıl (VUK madde 359)</li>
              <li>Fatura ve muhasebe kayıtları: 10 yıl</li>
              <li>Elektronik ticaret kayıtları: 10 yıl</li>
              <li>Pazarlama izinleri: İptal edilene kadar</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              8. KVKK Kapsamındaki Haklarınız
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 11. maddesi uyarınca aşağıdaki 
              haklara sahipsiniz:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li><strong>Öğrenme hakkı:</strong> Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li><strong>Bilgi talep etme hakkı:</strong> İşlenmişse bilgi talep etme</li>
              <li><strong>Amaç öğrenme hakkı:</strong> İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li><strong>Aktarım bilgisi hakkı:</strong> Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
              <li><strong>Düzeltme hakkı:</strong> Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
              <li><strong>Silme/yok etme hakkı:</strong> Kanunlarda öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
              <li><strong>Bildirim hakkı:</strong> Düzeltme, silme veya yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
              <li><strong>İtiraz hakkı:</strong> İşlenen verilerin münhasıran otomatik sistemler ile analiz edilmesi suretiyle aleyhinize bir sonuç doğurmasına itiraz etme</li>
              <li><strong>Zararın giderilmesi hakkı:</strong> Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              9. Haklarınızı Kullanma Yöntemi
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              KVKK kapsamındaki haklarınızı kullanmak için:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              <li>Kimliğinizi tespit edici belgelerle birlikte yazılı başvuru yapabilirsiniz</li>
              <li>E-posta yoluyla <strong>info@dekoartizan.com</strong> adresine başvurabilirsiniz</li>
              <li>Başvurularınız en geç 30 gün içinde değerlendirilerek sonuçlandırılır</li>
              <li>Başvurunuzun reddedilmesi halinde, ret gerekçesi yazılı olarak bildirilir</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              10. Çerezler (Cookies)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Web sitemizde çerezler kullanılmaktadır. Çerezler hakkında detaylı bilgi için 
              <Link href="/gizlilik-politikasi" className="text-primary hover:underline mx-1">Gizlilik Politikamızı</Link>
              inceleyebilirsiniz.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              11. Veri Güvenliği
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Kişisel verilerinizin güvenliğini sağlamak için teknik ve idari güvenlik önlemleri 
              alınmaktadır. Verileriniz yetkisiz erişim, değiştirme, ifşa veya imha edilmesine 
              karşı korunmaktadır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              12. Değişiklikler
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Bu Kişisel Verilerin Korunması Aydınlatma Metni, yasal düzenlemelerdeki değişiklikler 
              veya işleme faaliyetlerimizdeki güncellemeler nedeniyle değiştirilebilir. Güncel metin 
              her zaman bu sayfada yayınlanacaktır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              13. İletişim
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Kişisel verilerinizin korunması hakkında sorularınız veya haklarınızı kullanmak için:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>E-posta:</strong> info@dekoartizan.com
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Konu:</strong> KVKK Başvurusu
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Web:</strong> <Link href="/" className="text-primary hover:underline">www.dekoartizan.com</Link>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

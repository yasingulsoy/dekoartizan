import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gizlilik ve Güvenlik | dekoartizan",
  description: "dekoartizan gizlilik ve güvenlik politikası, kişisel verilerin korunması ve güvenlik önlemleri.",
};

export default function PrivacyAndSecurityPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            Gizlilik ve Güvenlik
          </h1>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Son Güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Mağazamızda verilen tüm servisler, Meydankavağı Mah. Avni Tolunay Cd. Abdullah Yıldırım 1 Sitesi Muratpaşa/Antalya adresinde kayıtlı Duvar Kağıdı Marketi firmamıza aittir ve firmamız tarafından işletilir. Firmamız, çeşitli amaçlarla kişisel veriler toplayabilir. Aşağıda, toplanan kişisel verilerin nasıl ve ne şekilde toplandığı, bu verilerin nasıl ve ne şekilde korunduğu belirtilmiştir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Kişisel Verilerin Toplanması
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Üyelik veya Mağazamız üzerindeki çeşitli form ve anketlerin doldurulması suretiyle üyelerin kendileriyle ilgili bir takım kişisel bilgileri (isim-soy isim, firma bilgileri, telefon, adres veya e-posta adresleri gibi) Mağazamız tarafından işin doğası gereği toplanmaktadır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Kampanya ve Bilgilendirme
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Firmamız bazı dönemlerde müşterilerine ve üyelerine kampanya bilgileri, yeni ürünler hakkında bilgiler, promosyon teklifleri gönderebilir. Üyelerimiz bu gibi bilgileri alıp almama konusunda her türlü seçimi üye olurken yapabilir, sonrasında üye girişi yaptıktan sonra hesap bilgileri bölümünden bu seçimi değiştirebilir ya da kendisine gelen bilgilendirme iletisindeki linkle bildirim yapabilir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Kişisel Bilgilerin Güvenliği
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Mağazamız üzerinden veya e-posta ile gerçekleştirilen onay sürecinde, üyelerimiz tarafından mağazamıza elektronik ortamdan iletilen kişisel bilgiler, Üyelerimiz ile yaptığımız "Kullanıcı Sözleşmesi" ile belirlenen amaçlar ve kapsam dışında üçüncü kişilere açıklanmayacaktır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              IP Adreslerinin Kullanımı
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Sistemle ilgili sorunların tanımlanması ve verilen hizmet ile ilgili çıkabilecek sorunların çözülmesi için Firmamız, üyelerinin IP adresini kaydetmekte ve bunu kullanmaktadır. IP adresleri kullanıcıları genel bir şekilde tanımlamak ve kapsamlı demografik bilgi toplamak amacıyla da kullanılabilir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Kredi Kartı Güvenliği
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Firmamız, Mağazamızdan alışveriş yapan kredi kartı sahiplerinin güvenliğini ilk planda tutmaktadır. Kredi kartı bilgileriniz hiçbir şekilde sistemimizde saklanmamaktadır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              SSL Güvenliği
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Alışveriş sırasında kullanılan kredi kartı ile ilgili bilgiler alışveriş sitelerimizden bağımsız olarak 128 bit SSL (Secure Sockets Layer) protokolü ile şifrelenip sorgulanmak üzere ilgili bankaya ulaştırılır. Kartın kullanılabilirliği onaylandığı takdirde alışverişe devam edilir. Kartla ilgili hiçbir bilgi tarafımızdan görüntülenemediğinden ve kaydedilmediğinden, üçüncü şahısların herhangi bir koşulda bu bilgileri ele geçirmesi engellenmiş olur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Üçüncü Taraf Web Siteleri ve Uygulamalar
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Mağazamız, web sitesi dâhilinde başka sitelere link verebilir. Firmamız, bu linkler vasıtasıyla erişilen sitelerin gizlilik uygulamaları ve içeriklerine yönelik herhangi bir sorumluluk taşımamaktadır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              İstisnai Haller
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Aşağıda belirtilen sınırlı hallerde, firmamız işbu "Gizlilik Politikası" hükümleri dışında kullanıcılara ait bilgileri üçüncü kişilere açıklayabilir:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Kanun, Kanun Hükmünde Kararname, Yönetmelik vb. yetkili hukuki otoriteler tarafından çıkarılan hukuk kurallarının getirdiği zorunluluklara uymak;</li>
              <li>Mağazamızın kullanıcılarla akdettiği "Üyelik Sözleşmesi"nin gereklerini yerine getirmek amacıyla;</li>
              <li>Yetkili idari ve adli otorite tarafından usulüne göre yürütülen bir araştırma veya soruşturma amacıyla;</li>
              <li>Kullanıcıların hakları veya güvenliklerini korumak amacıyla bilgi vermenin gerekli olduğu hallerde.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              E-Posta Güvenliği
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Mağazamıza gönderdiğiniz e-postalarda asla kredi kartı bilgilerinizi paylaşmayınız. E-postalarda yer alan bilgiler üçüncü şahıslar tarafından görülebilir ve firmamız bu bilgilerin güvenliğini garanti edemez.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Tarayıcı Çerezleri
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Firmamız, mağazamızı ziyaret eden kullanıcılar hakkında bilgi toplamak amacıyla çerez (cookie) kullanabilir. Çerezler, web sitemizde gezinmenizi kolaylaştırmak ve tercihlerinizi saklamak amacıyla kullanılmaktadır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Politika Değişiklikleri
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Firmamız işbu "Gizlilik Politikası" hükümlerini dilediği zaman değiştirebilir. Politikadaki değişiklikler, sitede yayınlandığı anda yürürlüğe girer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              İletişim Bilgileri
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Gizlilik politikamız ile ilgili her türlü soru ve önerileriniz için info@duvarkagidimarketi.com adresine e-posta gönderebilirsiniz.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-4">
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                Firma Bilgileri:
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Firma Ünvanı:</strong> Duvar Kağıdı Marketi
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Adresi:</strong> Meydankavağı Mah. Avni Tolunay Cd. Abdullah Yıldırım 1 Sitesi Muratpaşa/Antalya
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Telefon:</strong> 0 (850) 307 03 56
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong> info@duvarkagidimarketi.com
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

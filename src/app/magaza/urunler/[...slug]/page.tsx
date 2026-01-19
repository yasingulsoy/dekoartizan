import { Metadata } from "next";
import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import Tabs from "@/components/product-page/Tabs";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const productSlug = slug.join('/');
  const product = await getProductBySlug(productSlug);

  if (!product) {
    return {
      title: "Ürün Bulunamadı | dekoartizan",
      description: "Aradığınız ürün bulunamadı.",
    };
  }

  const baseUrl = process.env.SITE_URL || 'https://dekoartizan.com';
  const finalPrice =
    product.discount.percentage > 0
      ? product.price * (1 - product.discount.percentage / 100)
      : product.discount.amount > 0
      ? product.discount.amount
      : product.price;

  const productUrl = `${baseUrl}/magaza/urunler/${product.slug || product.title.toLowerCase().split(" ").join("-")}`;
  const productImage = `${baseUrl}${product.srcUrl}`;

  return {
    title: `${product.title} | dekoartizan`,
    description: `${product.title} - ${finalPrice.toFixed(2)} TL. ${product.rating.toFixed(1)}/5 yıldız puanı. Evinize uygun dekoratif duvar kağıdı.`,
    openGraph: {
      title: product.title,
      description: `${product.title} - ${finalPrice.toFixed(2)} TL`,
      url: productUrl,
      siteName: "dekoartizan",
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: `${product.title} - ${finalPrice.toFixed(2)} TL`,
      images: [productImage],
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const productSlug = slug.join('/');
  const productData = await getProductBySlug(productSlug);

  if (!productData?.title) {
    notFound();
  }

  // İlgili ürünleri çek (şimdilik tüm ürünlerden, daha sonra kategoriye göre filtreleyebiliriz)
  const relatedProducts = await getRelatedProducts(undefined, productData.id);

  // JSON-LD Structured Data (Schema.org Product)
  const baseUrl = BASE_URL;
  const finalPrice =
    productData.discount.percentage > 0
      ? productData.price * (1 - productData.discount.percentage / 100)
      : productData.discount.amount > 0
      ? productData.discount.amount
      : productData.price;

  const productUrl = `${baseUrl}/magaza/urunler/${productData.slug || productData.title.toLowerCase().split(" ").join("-")}`;
  const productImage = `${baseUrl}${productData.srcUrl}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productData.title,
    image: productImage,
    description: `${productData.title} - Evinize uygun dekoratif duvar kağıdı`,
    brand: {
      "@type": "Brand",
      name: "dekoartizan",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "TRY",
      price: finalPrice.toFixed(2),
      priceValidUntil: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: productData.rating.toFixed(1),
      reviewCount: Math.floor(productData.rating * 20), // Tahmini yorum sayısı
      bestRating: "5",
      worstRating: "1",
    },
    sku: `DEKO-${productData.id}`,
    mpn: `DEKO-${productData.id}`,
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
          <BreadcrumbProduct title={productData?.title ?? "product"} />
          <section className="mb-11">
            <Header data={productData} />
          </section>
          <Tabs />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <ProductListSec title="Beğenebileceğiniz diğer ürünler" data={relatedProducts} />
        </div>
      </main>
    </>
  );
}

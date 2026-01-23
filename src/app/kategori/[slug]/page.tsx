import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import ProductCard from "@/components/common/ProductCard";
import { poppins } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import BreadcrumbCategory from "@/components/shop-page/BreadcrumbCategory";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  subCategories?: SubCategory[];
}

interface SubCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  discount_price: number | null;
  discount_percentage: number;
  short_description?: string | null;
  main_image_url: string | null;
  images?: Array<{
    id: number;
    image_url: string;
    display_order: number;
  }>;
  rating: number;
  is_active: boolean;
  is_new?: boolean;
  is_featured?: boolean;
  is_on_sale?: boolean;
  category?: {
    id: number;
    name: string;
    slug?: string;
  } | null;
  subCategory?: {
    id: number;
    name: string;
    slug?: string;
  } | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const response = await apiGet<{ success: boolean; data: Category }>(
      `/api/categories/slug/${slug}`
    );

    if (!response.success || !response.data) {
      return {
        title: "Kategori Bulunamadı | dekoartizan",
        description: "Aradığınız kategori bulunamadı.",
      };
    }

    const category = response.data;

    return {
      title: `${category.name} | dekoartizan`,
      description: category.description || `${category.name} kategorisindeki ürünleri keşfedin.`,
    };
  } catch (error) {
    return {
      title: "Kategori | dekoartizan",
      description: "Kategori sayfası",
    };
  }
}

const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return "/images/placeholder.jpg";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const apiUrl =
    process.env.BACKEND_URL ||
    process.env.API_URL ||
    "http://127.0.0.1:5000";
  return `${apiUrl}${url.startsWith("/") ? url : `/${url}`}`;
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ subcategory?: string }>;
}) {
  const { slug } = await params;
  const { subcategory } = await searchParams;

  try {
    // Kategori bilgilerini çek
    const categoryResponse = await apiGet<{ success: boolean; data: Category }>(
      `/api/categories/slug/${slug}`
    );

    if (!categoryResponse.success || !categoryResponse.data) {
      notFound();
    }

    const category = categoryResponse.data;

    // Kategoriye ait ürünleri çek (alt kategori filtresi varsa uygula)
    const productQuery = subcategory
      ? `category_slug=${slug}&subcategory_slug=${subcategory}&is_active=true&limit=100`
      : `category_slug=${slug}&is_active=true&limit=100`;
    
    const productsResponse = await apiGet<{
      success: boolean;
      data: Product[];
      pagination?: any;
    }>(`/api/products?${productQuery}`);

    const products = productsResponse.success ? productsResponse.data : [];
    
    // Seçili alt kategori bilgisini al
    const selectedSubCategory = subcategory
      ? category.subCategories?.find((sub) => sub.slug === subcategory)
      : null;

    return (
      <main className="pb-20 min-h-screen">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
          <BreadcrumbCategory 
            categoryName={category.name} 
            subCategoryName={selectedSubCategory?.name || null}
          />
          
          {/* Kategori Başlık Bölümü */}
          <div className="mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
              {/* Kategori Görseli */}
              {category.image_url && (
                <div className="w-full md:w-48 lg:w-64 h-48 md:h-48 lg:h-64 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={getImageUrl(category.image_url)}
                    alt={category.name}
                    width={256}
                    height={256}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Kategori Bilgileri */}
              <div className="flex-1">
                <h1
                  className={cn([
                    poppins.className,
                    "text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-3",
                  ])}
                >
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-base md:text-lg text-black/70 mb-4">
                    {category.description}
                  </p>
                )}
                <p className="text-sm md:text-base text-black/60">
                  {products.length} ürün bulundu
                </p>
              </div>
            </div>
          </div>

          {/* Alt Kategoriler */}
          {category.subCategories && category.subCategories.length > 0 && (
            <div className="mb-8 md:mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-black">
                  Alt Kategoriler
                </h2>
                {selectedSubCategory && (
                  <Link
                    href={`/kategori/${slug}`}
                    className="text-sm text-gold-dark hover:text-gold-medium font-medium"
                  >
                    Filtreyi Temizle
                  </Link>
                )}
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <Link
                  href={`/kategori/${slug}`}
                  className={cn(
                    "px-4 py-2 rounded-lg border transition-all duration-200 text-sm md:text-base",
                    !selectedSubCategory
                      ? "bg-black text-white border-black"
                      : "bg-white border-black/10 text-black hover:border-black/30"
                  )}
                >
                  Tümü
                </Link>
                {category.subCategories.map((subCategory) => (
                  <Link
                    key={subCategory.id}
                    href={`/kategori/${slug}?subcategory=${subCategory.slug}`}
                    className={cn(
                      "px-4 py-2 rounded-lg border transition-all duration-200 text-sm md:text-base",
                      selectedSubCategory?.id === subCategory.id
                        ? "bg-black text-white border-black"
                        : "bg-white border-black/10 text-black hover:border-black/30"
                    )}
                  >
                    {subCategory.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <hr className="border-t-black/10 mb-6" />

          {/* Ürünler */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-black">
                {selectedSubCategory ? selectedSubCategory.name : "Ürünler"}
              </h2>
              <span className="text-sm md:text-base text-black/60">
                {products.length} ürün
              </span>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {products.map((product) => {
                  // ProductCard için uygun formata dönüştür
                  const transformedProduct = {
                    id: product.id,
                    title: product.name,
                    slug: product.slug,
                    price: product.price,
                    discount: {
                      percentage: product.discount_percentage || 0,
                      amount: typeof product.discount_price === 'number' ? product.discount_price : 0,
                    },
                    srcUrl: product.main_image_url || "/images/placeholder.jpg",
                    rating: product.rating || 0,
                    isNew: product.is_new || false,
                    isFeatured: product.is_featured || false,
                    isOnSale: product.is_on_sale || false,
                    category: product.category?.name || "",
                    subCategory: product.subCategory?.name || "",
                  };

                  return (
                    <ProductCard key={product.id} data={transformedProduct} />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-black/60 mb-4">
                  Bu kategoride henüz ürün bulunmamaktadır.
                </p>
                <Link
                  href="/shop"
                  className="text-gold-dark hover:text-gold-medium font-medium underline"
                >
                  Tüm ürünlere göz atın →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Kategori sayfası hatası:", error);
    notFound();
  }
}

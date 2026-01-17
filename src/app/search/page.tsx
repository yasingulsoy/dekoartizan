"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import InputGroup from "@/components/ui/input-group";
import ProductCard from "@/components/common/ProductCard";
import { apiGet } from "@/lib/api";
import { Product } from "@/types/product.types";
import { transformProduct } from "@/lib/products";

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

interface BackendProduct {
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

const CategoryCard = ({ category }: { category: Category }) => {
  const getImageUrl = (url: string | null | undefined): string => {
    if (!url) return "/images/placeholder.jpg";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    const apiUrl =
      typeof window !== "undefined"
        ? process.env.NEXT_PUBLIC_BACKEND_URL ||
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:5000"
        : process.env.BACKEND_URL ||
          process.env.API_URL ||
          "http://127.0.0.1:5000";
    return `${apiUrl}${url.startsWith("/") ? url : `/${url}`}`;
  };

  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="flex flex-col items-start bg-white border border-black/10 rounded-[13px] lg:rounded-[20px] p-4 hover:shadow-lg transition-all duration-300"
    >
      <div className="bg-[#F0EEED] rounded-[13px] w-full aspect-square mb-3 overflow-hidden flex items-center justify-center">
        <Image
          src={getImageUrl(category.image_url)}
          width={200}
          height={200}
          className="rounded-md w-full h-full object-cover"
          alt={category.name}
        />
      </div>
      <h3 className="font-bold text-black text-lg xl:text-xl mb-1">
        {category.name}
      </h3>
      {category.description && (
        <p className="text-black/60 text-sm line-clamp-2">
          {category.description}
        </p>
      )}
      {category.subCategories && category.subCategories.length > 0 && (
        <p className="text-black/40 text-xs mt-2">
          {category.subCategories.length} alt kategori
        </p>
      )}
    </Link>
  );
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || ""
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
    if (query.trim()) {
      performSearch(query);
    } else {
      setCategories([]);
      setProducts([]);
      setSearched(false);
    }
  }, [searchParams]);

  // Türkçe karakterleri normalize et
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9\s-]/g, "") // Özel karakterleri kaldır
      .trim()
      .replace(/\s+/g, " "); // Çoklu boşlukları tek boşluğa çevir
  };

  // Normalize edilmiş metinlerde arama yap
  const matchesSearch = (text: string | null | undefined, searchTerm: string): boolean => {
    if (!text) return false;
    const normalizedText = normalizeText(text);
    const normalizedSearch = normalizeText(searchTerm);
    return normalizedText.includes(normalizedSearch);
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setCategories([]);
      setProducts([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // Kategorileri ve ürünleri paralel olarak çek
      const [categoriesResponse, productsResponse] = await Promise.all([
        apiGet<{ success: boolean; data: Category[] }>("/api/categories"),
        apiGet<{
          success: boolean;
          data: BackendProduct[];
          pagination?: any;
        }>(`/api/products?is_active=true&limit=1000`),
      ]);

      // Kategorileri filtrele (client-side, normalize edilmiş arama ile)
      if (categoriesResponse.success && categoriesResponse.data) {
        const filteredCategories = categoriesResponse.data.filter(
          (category) =>
            matchesSearch(category.name, query) ||
            matchesSearch(category.description, query) ||
            matchesSearch(category.slug, query) ||
            category.subCategories?.some(
              (sub) =>
                matchesSearch(sub.name, query) ||
                matchesSearch(sub.description, query) ||
                matchesSearch(sub.slug, query)
            )
        );
        setCategories(filteredCategories);
      }

      // Ürünleri filtrele (client-side, normalize edilmiş arama ile)
      if (productsResponse.success && productsResponse.data) {
        const filteredProducts = productsResponse.data.filter(
          (product) =>
            matchesSearch(product.name, query) ||
            matchesSearch(product.sku, query) ||
            matchesSearch(product.short_description, query) ||
            matchesSearch(product.slug, query) ||
            matchesSearch(product.category?.name, query) ||
            matchesSearch(product.subCategory?.name, query)
        );
        const transformedProducts = filteredProducts.map(transformProduct);
        setProducts(transformedProducts);
      }
    } catch (error) {
      console.error("Arama hatası:", error);
      setCategories([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <main className="pb-20 min-h-screen">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <div className="mb-8">
          <h1 className="font-bold text-2xl md:text-[32px] mb-6">Arama</h1>
          <form onSubmit={handleSearch} className="max-w-2xl">
            <InputGroup className="bg-[#F0F0F0]">
              <InputGroup.Text>
                <Image
                  priority
                  src="/icons/search.svg"
                  height={20}
                  width={20}
                  alt="search"
                  className="min-w-5 min-h-5"
                />
              </InputGroup.Text>
              <InputGroup.Input
                type="search"
                name="search"
                placeholder="Kategori veya ürün ara..."
                className="bg-transparent placeholder:text-black/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </form>
        </div>

        {loading && (
          <div className="text-center py-10 text-black/60">
            Aranıyor...
          </div>
        )}

        {!loading && searched && (
          <>
            {categories.length === 0 && products.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-black/60 text-lg mb-2">
                  Aradığınız kriterlere uygun sonuç bulunamadı.
                </p>
                <p className="text-black/40 text-sm">
                  Farklı anahtar kelimeler deneyebilirsiniz.
                </p>
              </div>
            ) : (
              <>
                {categories.length > 0 && (
                  <div className="mb-12">
                    <h2 className="font-bold text-xl md:text-2xl mb-6">
                      Kategoriler ({categories.length})
                    </h2>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                      {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                      ))}
                    </div>
                  </div>
                )}

                {products.length > 0 && (
                  <div>
                    <h2 className="font-bold text-xl md:text-2xl mb-6">
                      Ürünler ({products.length})
                    </h2>
                    <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                      {products.map((product) => (
                        <ProductCard key={product.id} data={product} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {!loading && !searched && (
          <div className="text-center py-10">
            <p className="text-black/60 text-lg">
              Arama yapmak için yukarıdaki alana bir şeyler yazın.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

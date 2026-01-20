"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { poppins } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/common/ProductCard";
import { API_URL } from "@/lib/api";
import { Product } from "@/types/product.types";

// Slug oluşturma fonksiyonu (kategori/alt-kategori/urun-adi formatında)
const createProductSlug = (
  categoryName: string | null | undefined,
  subCategoryName: string | null | undefined,
  productName: string
): string => {
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '') // Özel karakterleri kaldır
      .trim()
      .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
      .replace(/-+/g, '-') // Çoklu tireleri tek tireye çevir
      .replace(/^-|-$/g, ''); // Başta ve sonda tire varsa kaldır
  };

  const categorySlug = categoryName ? normalizeText(categoryName) : '';
  const subCategorySlug = subCategoryName ? normalizeText(subCategoryName) : '';
  const productSlug = normalizeText(productName);
  
  const parts: string[] = [];
  if (categorySlug) parts.push(categorySlug);
  if (subCategorySlug) parts.push(subCategorySlug);
  parts.push(productSlug);
  
  return parts.join('/');
};

interface WishlistItem {
  id: number;
  product_id: number;
  created_at: string;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    discount_price: number | null;
    discount_percentage: number;
    main_image_url: string;
    rating: number;
    images?: Array<{
      image_url: string;
      is_primary?: boolean;
    }>;
    category?: {
      id: number;
      name: string;
      slug: string;
    } | null;
    subCategory?: {
      id: number;
      name: string;
      slug: string;
    } | null;
  };
}

export default function WishlistPage() {
  const { isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchWishlist();
    }
  }, [isAuthenticated, token]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setWishlistItems(data.data || []);
      } else {
        setError(data.error || "Favoriler yüklenirken bir hata oluştu");
      }
    } catch (err) {
      console.error("Favoriler yükleme hatası:", err);
      setError("Favoriler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    try {
      const response = await fetch(`${API_URL}/api/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Sepetten çıkar
        setWishlistItems((prev) =>
          prev.filter((item) => item.product_id !== productId)
        );
      } else {
        alert(data.error || "Ürün favorilerden çıkarılamadı");
      }
    } catch (err) {
      console.error("Favorilerden çıkarma hatası:", err);
      alert("Ürün favorilerden çıkarılamadı");
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Resim URL'sini tam URL'ye çevir
  const getImageUrl = (url: string | null | undefined): string => {
    if (!url) return "/images/placeholder.jpg";
    // Eğer zaten tam URL ise (http:// veya https:// ile başlıyorsa) olduğu gibi döndür
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Göreceli yol ise API_URL ile birleştir
    return `${API_URL}${url.startsWith('/') ? url : `/${url}`}`;
  };

  // Ürünleri ProductCard formatına çevir
  const products: Product[] = wishlistItems.map((item) => {
    const product = item.product;
    
    let imageUrl = "/images/placeholder.jpg";
    
    if (product.images && product.images.length > 0) {
      // Önce primary image'ı bul
      const primaryImage = product.images.find((img: any) => img.is_primary);
      const imageToUse = primaryImage || product.images[0];
      if (imageToUse?.image_url) {
        imageUrl = getImageUrl(imageToUse.image_url);
      }
    } else if (product.main_image_url) {
      imageUrl = getImageUrl(product.main_image_url);
    }

    // Slug oluştur - kategori/alt-kategori/ürün formatında
    const productSlug = createProductSlug(
      product.category?.name,
      product.subCategory?.name,
      product.name
    );

    return {
      id: product.id,
      title: product.name,
      slug: productSlug,
      price: parseFloat(product.price.toString()),
      srcUrl: imageUrl,
      rating: product.rating ? parseFloat(product.rating.toString()) : 0,
      discount: {
        percentage: product.discount_percentage || 0,
        amount: product.discount_price
          ? parseFloat(product.discount_price.toString())
          : 0,
      },
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="mb-8">
          <h1
            className={cn([
              poppins.className,
              "text-3xl lg:text-4xl font-bold mb-2",
            ])}
          >
            Favorilerim
          </h1>
          <p className={cn([poppins.className, "text-gray-600"])}>
            Beğendiğiniz ürünleri burada saklayabilirsiniz
          </p>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className={cn([poppins.className, "text-red-800"])}>{error}</p>
          </div>
        )}

        {/* Favoriler Listesi */}
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-300 mb-4"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <h2 className={cn([poppins.className, "text-2xl font-bold text-gray-400 mb-2"])}>
              Favorileriniz boş
            </h2>
            <p className={cn([poppins.className, "text-gray-500 mb-6"])}>
              Beğendiğiniz ürünleri favorilerinize ekleyebilirsiniz
            </p>
            <Button className="rounded-full" asChild>
              <Link href="/shop">Alışverişe Başla</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard data={product} />
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                  title="Favorilerden çıkar"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-red-500"
                  >
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { Product } from "@/types/product.types";
import { apiGet } from "./api";

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
  is_new?: boolean;
  is_featured?: boolean;
  is_on_sale?: boolean;
}

// Backend ürününü frontend Product formatına dönüştür
const transformProduct = (backendProduct: BackendProduct): Product => {
  const gallery: string[] = [];
  
  // Resim URL'lerini API_URL ile birleştir
  const getImageUrl = (url: string | null | undefined): string => {
    if (!url) return "";
    // Eğer zaten tam URL ise (http:// veya https:// ile başlıyorsa) olduğu gibi döndür
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Göreceli yol ise API_URL ile birleştir
    // Server-side ve client-side için API_URL'yi dinamik olarak al
    const apiUrl = typeof window !== 'undefined' 
      ? (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
      : (process.env.BACKEND_URL || process.env.API_URL || 'http://127.0.0.1:5000');
    return `${apiUrl}${url.startsWith('/') ? url : `/${url}`}`;
  };
  
  // Ana resmi ekle
  if (backendProduct.main_image_url) {
    const mainImageUrl = getImageUrl(backendProduct.main_image_url);
    if (mainImageUrl) {
      gallery.push(mainImageUrl);
    }
  }
  
  // Diğer resimleri ekle
  if (backendProduct.images && backendProduct.images.length > 0) {
    const sortedImages = [...backendProduct.images].sort(
      (a, b) => a.display_order - b.display_order
    );
    sortedImages.forEach((img) => {
      const imageUrl = getImageUrl(img.image_url);
      if (imageUrl && !gallery.includes(imageUrl)) {
        gallery.push(imageUrl);
      }
    });
  }
  
  // Eğer hiç resim yoksa, placeholder ekle
  if (gallery.length === 0) {
    gallery.push("/images/placeholder.jpg");
  }
  
  return {
    id: backendProduct.id,
    title: backendProduct.name,
    srcUrl: gallery[0],
    gallery: gallery,
    price: parseFloat(backendProduct.price.toString()),
    discount: {
      amount: backendProduct.discount_price
        ? parseFloat(backendProduct.discount_price.toString())
        : 0,
      percentage: backendProduct.discount_percentage || 0,
    },
    rating: backendProduct.rating ? parseFloat(backendProduct.rating.toString()) : 0,
    shortDescription: backendProduct.short_description || "",
  };
};

// API'den tüm aktif ürünleri çek
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiGet<{
      success: boolean;
      data: BackendProduct[];
      pagination?: any;
    }>("/api/products?is_active=true&limit=1000");
    
    if (response.success && response.data) {
      return response.data
        .filter((product) => product.is_active)
        .map(transformProduct);
    }
    
    return [];
  } catch (error) {
    console.error("Ürünler yüklenemedi:", error);
    return [];
  }
};

// API'den ID'ye göre ürün çek
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const response = await apiGet<{
      success: boolean;
      data: BackendProduct;
    }>(`/api/products/${id}`);
    
    if (response.success && response.data) {
      return transformProduct(response.data);
    }
    
    return null;
  } catch (error) {
    console.error(`Ürün ${id} yüklenemedi:`, error);
    return null;
  }
};

// Yeni gelenler (is_new = true)
export const getNewArrivals = async (): Promise<Product[]> => {
  try {
    const response = await apiGet<{
      success: boolean;
      data: BackendProduct[];
      pagination?: any;
    }>("/api/products?is_active=true&is_new=true&limit=20");
    
    if (response.success && response.data) {
      return response.data.map(transformProduct);
    }
    
    return [];
  } catch (error) {
    console.error("Yeni gelenler yüklenemedi:", error);
    return [];
  }
};

// Çok satanlar (is_featured = true veya sales_count'a göre)
export const getTopSelling = async (): Promise<Product[]> => {
  try {
    const response = await apiGet<{
      success: boolean;
      data: BackendProduct[];
      pagination?: any;
    }>("/api/products?is_active=true&is_featured=true&limit=20");
    
    if (response.success && response.data) {
      return response.data.map(transformProduct);
    }
    
    return [];
  } catch (error) {
    console.error("Çok satanlar yüklenemedi:", error);
    return [];
  }
};

// İlgili ürünler (aynı kategori)
export const getRelatedProducts = async (
  categoryId?: number,
  excludeId?: number
): Promise<Product[]> => {
  try {
    let endpoint = "/api/products?is_active=true&limit=20";
    if (categoryId) {
      endpoint += `&category_id=${categoryId}`;
    }
    
    const response = await apiGet<{
      success: boolean;
      data: BackendProduct[];
      pagination?: any;
    }>(endpoint);
    
    if (response.success && response.data) {
      let products = response.data.map(transformProduct);
      
      // excludeId varsa çıkar
      if (excludeId) {
        products = products.filter((p) => p.id !== excludeId);
      }
      
      return products.slice(0, 12); // Maksimum 12 ürün
    }
    
    return [];
  } catch (error) {
    console.error("İlgili ürünler yüklenemedi:", error);
    return [];
  }
};

// Tüm ürün ID'lerini al (sitemap için)
export const getAllProductIds = async (): Promise<number[]> => {
  try {
    const products = await getAllProducts();
    return products.map((product) => product.id);
  } catch (error) {
    console.error("Ürün ID'leri yüklenemedi:", error);
    return [];
  }
};

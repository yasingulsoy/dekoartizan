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
  
  // Ana resmi ekle
  if (backendProduct.main_image_url) {
    gallery.push(backendProduct.main_image_url);
  }
  
  // Diğer resimleri ekle
  if (backendProduct.images && backendProduct.images.length > 0) {
    const sortedImages = [...backendProduct.images].sort(
      (a, b) => a.display_order - b.display_order
    );
    sortedImages.forEach((img) => {
      if (img.image_url && !gallery.includes(img.image_url)) {
        gallery.push(img.image_url);
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

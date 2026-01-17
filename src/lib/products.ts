import { Product } from "@/types/product.types";
import {
  newArrivalsData,
  relatedProductData,
  topSellingData,
} from "@/app/page";

export const getAllProducts = (): Product[] => {
  return [...newArrivalsData, ...topSellingData, ...relatedProductData];
};

// ID'ye göre ürün bul
// Mock veriler kaldırıldı - API'den gelecek
export const getProductById = (id: number): Product | undefined => {
  const allProducts = getAllProducts();
  return allProducts.find((product) => product.id === id);
};

// Tüm ürün ID'lerini al (sitemap için)
// Mock veriler kaldırıldı - API'den gelecek
export const getAllProductIds = (): number[] => {
  return getAllProducts().map((product) => product.id);
};

import { Product } from "@/types/product.types";
import {
  newArrivalsData,
  relatedProductData,
  topSellingData,
} from "@/app/page";

// Tüm ürünleri birleştir
export const getAllProducts = (): Product[] => {
  return [...newArrivalsData, ...topSellingData, ...relatedProductData];
};

// ID'ye göre ürün bul
export const getProductById = (id: number): Product | undefined => {
  const allProducts = getAllProducts();
  return allProducts.find((product) => product.id === id);
};

// Tüm ürün ID'lerini al (sitemap için)
export const getAllProductIds = (): number[] => {
  return getAllProducts().map((product) => product.id);
};

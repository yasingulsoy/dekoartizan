export type Discount = {
  amount: number;
  percentage: number;
};

export type Product = {
  id: number;
  title: string;
  srcUrl: string;
  gallery?: string[];
  price: number;
  discount: Discount;
  rating: number;
  shortDescription?: string;
  slug?: string;
  categoryName?: string | null;
};

export type PaperType = {
  id: number;
  name: string;
  price: number;
  pricePerM2: number;
  description: string[];
  image?: string;
};
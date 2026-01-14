import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.SITE_URL || 'https://dekoartizan.com';
  
  // Tüm ürünleri al
  const products = getAllProducts();
  
  // Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Ürün sayfaları
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/shop/product/${product.id}/${product.title.split(' ').join('-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}

import { MetadataRoute } from 'next';
import { BASE_URL, apiGet } from '@/lib/api';

interface Blog {
  id: number;
  slug: string;
  updated_at: string;
  published_at?: string | null;
}

interface Category {
  id: number;
  slug: string;
  updated_at: string;
  subCategories?: Array<{
    id: number;
    slug: string;
  }>;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  updated_at: string;
  created_at: string;
  category?: {
    name: string;
  } | null;
  subCategory?: {
    name: string;
  } | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BASE_URL;
  
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
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gizlilik-politikasi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/kullanim-sartlari`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/iade-ve-degisim-bilgileri`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/gizlilik-ve-guvenlik`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/kisisel-verilerin-korunmasi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/tekstil-duvar-kagidi-uygulama`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Ürün sayfaları
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const productsResponse = await apiGet<{ success: boolean; data: Product[]; pagination?: any }>(
      '/api/products?is_active=true&limit=1000'
    );
    
    if (productsResponse.success && productsResponse.data) {
      productPages = productsResponse.data.map((product) => {
        // Slug oluştur (kategori/alt-kategori/urun-adi formatında)
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
              .replace(/[^a-z0-9\s-]/g, '')
              .trim()
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');
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

        const productSlug = createProductSlug(
          product.category?.name,
          product.subCategory?.name,
          product.name
        );

        return {
          url: `${baseUrl}/magaza/urunler/${productSlug}`,
          lastModified: product.updated_at ? new Date(product.updated_at) : product.created_at ? new Date(product.created_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        };
      });
    }
  } catch (error) {
    console.error('Ürün sayfaları sitemap\'e eklenirken hata:', error);
  }

  // Blog sayfaları
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const blogsResponse = await apiGet<{ success: boolean; data: Blog[]; pagination?: { total: number } }>(
      '/api/blogs?is_published=true&limit=1000&locale=tr'
    );
    
    if (blogsResponse.success && blogsResponse.data) {
      blogPages = blogsResponse.data.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.published_at ? new Date(blog.published_at) : blog.updated_at ? new Date(blog.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Blog sayfaları sitemap\'e eklenirken hata:', error);
  }

  // Kategori sayfaları
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categoriesResponse = await apiGet<{ success: boolean; data: Category[] }>(
      '/api/categories'
    );
    
    if (categoriesResponse.success && categoriesResponse.data) {
      categoryPages = categoriesResponse.data.flatMap((category) => {
        const pages: MetadataRoute.Sitemap = [
          {
            url: `${baseUrl}/kategori/${category.slug}`,
            lastModified: category.updated_at ? new Date(category.updated_at) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          },
        ];

        // Alt kategoriler için de sayfa ekle
        if (category.subCategories && category.subCategories.length > 0) {
          category.subCategories.forEach((subCategory) => {
            pages.push({
              url: `${baseUrl}/kategori/${category.slug}?subcategory=${subCategory.slug}`,
              lastModified: category.updated_at ? new Date(category.updated_at) : new Date(),
              changeFrequency: 'weekly' as const,
              priority: 0.7,
            });
          });
        }

        return pages;
      });
    }
  } catch (error) {
    console.error('Kategori sayfaları sitemap\'e eklenirken hata:', error);
  }

  return [...staticPages, ...productPages, ...blogPages, ...categoryPages];
}

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MenuListData } from "../navbar.types";

export type MenuListProps = {
  data: MenuListData;
  label: string;
};

export function MenuList({ data, label }: MenuListProps) {
  // Tüm kategorileri göster (aktif olanlar)
  const categories = data.filter(cat => {
    // Eğer is_active bilgisi varsa kontrol et, yoksa tümünü göster
    return (cat as any).is_active !== false;
  });
  
  // Debug: Gösterilecek kategorileri konsola yazdır
  console.log("MenuList - Gösterilecek kategoriler:", categories.length, "toplam:", data.length);
  
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="font-normal px-2 md:px-3 text-sm md:text-base">
        {label}
      </NavigationMenuTrigger>
      <NavigationMenuContent className="!w-[calc(100vw-2rem)] md:!w-screen max-w-7xl left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0">
        <div className="w-full p-4 md:p-6 max-h-[80vh] overflow-y-auto">
          {/* Kategoriler ve Alt Kategoriler */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category) => (
              <div key={category.id} className="flex flex-col min-w-0">
                {/* Kategori Başlığı */}
                <Link
                  href={`/kategori/${category.url?.includes('category=') ? category.url.split('category=')[1]?.split('&')[0] : category.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm md:text-base font-bold text-black mb-2 md:mb-3 hover:text-gold-dark transition-colors line-clamp-1"
                >
                  {category.label}
                </Link>
                
                {/* Alt Kategoriler */}
                {category.subCategories && category.subCategories.length > 0 && (
                  <ul className="space-y-1.5 md:space-y-2 flex-1">
                    {category.subCategories.map((subCategory) => {
                      // Category URL'den slug'ı çıkar
                      const categorySlug = category.url?.includes('category=')
                        ? category.url.split('category=')[1]?.split('&')[0]
                        : '';
                        const subCategoryUrl = categorySlug
                          ? `/kategori/${categorySlug}?subcategory=${subCategory.slug}`
                          : `/shop?subcategory=${subCategory.slug}`;
                      
                      return (
                        <li key={subCategory.id}>
                          <Link
                            href={subCategoryUrl}
                            className="text-xs md:text-sm text-black/70 hover:text-black hover:underline transition-colors block line-clamp-1"
                          >
                            {subCategory.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
                
                {/* Hepsini Göster Linki */}
                <Link
                  href={`/kategori/${category.url?.includes('category=') ? category.url.split('category=')[1]?.split('&')[0] : category.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-xs md:text-sm text-gold-dark hover:text-gold-medium font-medium mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-200"
                >
                  Hepsini Göster →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

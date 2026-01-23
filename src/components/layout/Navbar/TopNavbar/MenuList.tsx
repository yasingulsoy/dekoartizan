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
      {/* Mega menu: viewport artık TopNavbar container'ına göre full-width açılıyor */}
      <NavigationMenuContent className="!w-full !max-w-none !left-0">
        <div className="w-full p-6 md:p-8 lg:p-10 max-h-[85vh] overflow-y-auto">
          {/* Kategoriler ve Alt Kategoriler */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-8 md:gap-10">
            {categories.map((category) => (
              <div key={category.id} className="flex flex-col min-w-0">
                {/* Kategori Başlığı */}
                <Link
                  href={category.url || `/kategori/${category.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-base md:text-lg font-bold text-black mb-3 md:mb-4 hover:text-gold-dark transition-colors uppercase"
                >
                  {category.label}
                </Link>
                
                {/* Alt Kategoriler */}
                {category.subCategories && category.subCategories.length > 0 ? (
                  <ul className="space-y-2 md:space-y-2.5 flex-1 mb-3">
                    {category.subCategories.map((subCategory) => {
                      // Category URL zaten /kategori/slug formatında geliyor
                      const categoryUrl = category.url || `/kategori/${category.label.toLowerCase().replace(/\s+/g, '-')}`;
                      const subCategoryUrl = `${categoryUrl}?subcategory=${subCategory.slug}`;
                      
                      return (
                        <li key={subCategory.id}>
                          <Link
                            href={subCategoryUrl}
                            className="text-sm md:text-base text-black/70 hover:text-black hover:underline transition-colors block"
                          >
                            {subCategory.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="flex-1 mb-3"></div>
                )}
                
                {/* Hepsini Göster Linki */}
                <Link
                  href={category.url || `/kategori/${category.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm md:text-base text-gold-dark hover:text-gold-medium font-medium mt-auto pt-3 md:pt-4 border-t border-gray-200"
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

"use client";

import { cn } from "@/lib/utils";
import { poppins } from "@/styles/fonts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { NavMenu } from "../navbar.types";
import { MenuList } from "./MenuList";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MenuItem } from "./MenuItem";
import Image from "next/image";
import InputGroup from "@/components/ui/input-group";
import ResTopNavbar from "./ResTopNavbar";
import CartBtn from "./CartBtn";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url?: string | null;
  subCategories?: SubCategory[];
}

interface SubCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

const staticMenuItems: NavMenu = [
  {
    id: 2,
    type: "MenuItem",
    label: "İndirimde",
    url: "/shop#on-sale",
    children: [],
  },
  {
    id: 3,
    type: "MenuItem",
    label: "Yeni Gelenler",
    url: "/shop#new-arrivals",
    children: [],
  },
  {
    id: 4,
    type: "MenuItem",
    label: "Markalar",
    url: "/shop#brands",
    children: [],
  },
  {
    id: 5,
    type: "MenuItem",
    label: "Blog",
    url: "/blog",
    children: [],
  },
];

const TopNavbar = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [menuData, setMenuData] = useState<NavMenu>(staticMenuItems);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Tüm aktif kategorileri çek (is_active=true olanlar)
        const response = await apiGet<{ success: boolean; data: Category[] }>("/api/categories");
        
        if (response.success && response.data && response.data.length > 0) {
          const categoriesMenu: NavMenu = [
            {
              id: 1,
              label: "Kategoriler",
              type: "MenuList",
              children: response.data.map((category) => ({
                id: category.id,
                label: category.name,
                url: `/kategori/${category.slug}`,
                description: category.description || "",
                image_url: category.image_url || null,
                subCategories: category.subCategories || [],
              })),
            },
            ...staticMenuItems,
          ];
          setMenuData(categoriesMenu);
        } else {
          // Kategori yoksa sadece statik menüyü göster
          setMenuData(staticMenuItems);
        }
      } catch (error) {
        console.error("Kategoriler yüklenirken hata oluştu:", error);
        // Hata durumunda sadece statik menüyü göster
        setMenuData(staticMenuItems);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  return (
    <nav className="sticky top-0 bg-white z-20">
      <div className="flex relative max-w-frame mx-auto items-center justify-between md:justify-start py-3 md:py-4 px-2 xl:px-0 gap-2 md:gap-0">
        <div className="flex items-center">
          <div className="block md:hidden mr-2 md:mr-4 flex-shrink-0">
            <ResTopNavbar data={menuData} />
          </div>
          <Link
            href="/"
            className={cn([
              "flex items-center gap-2 md:gap-3 mb-2 mr-1 md:mr-2 lg:mr-6 flex-shrink-0",
            ])}
          >
            <Image
              src="/images/LOGO.svg"
              alt="dekoartizan logo"
              width={1000}
              height={1000}
              className="w-[50px] md:w-16 lg:w-[80px] h-[50px] md:h-16 lg:h-[80px] flex-shrink-0"
              priority
            />
            <span
              className={cn([
                poppins.className,
                "text-base sm:text-lg md:text-xl lg:text-2xl whitespace-nowrap",
              ])}
            >
              DEKOARTİZAN
            </span>
          </Link>
        </div>
        <NavigationMenu className="hidden md:flex mr-2 lg:mr-7">
          <NavigationMenuList>
            {menuData.map((item) => (
              <React.Fragment key={item.id}>
                {item.type === "MenuItem" && (
                  <MenuItem label={item.label} url={item.url} />
                )}
                {item.type === "MenuList" && item.children.length > 0 && (
                  <MenuList 
                    data={item.children.map(child => ({
                      ...child,
                      subCategories: (child as any).subCategories || []
                    }))} 
                    label={item.label} 
                  />
                )}
              </React.Fragment>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            }
          }}
          className="hidden md:flex bg-[#F0F0F0] mr-3 lg:mr-10 rounded-lg"
        >
          <InputGroup className="bg-transparent">
            <InputGroup.Text>
              <Image
                priority
                src="/icons/search.svg"
                height={20}
                width={20}
                alt="search"
                className="min-w-5 min-h-5"
              />
            </InputGroup.Text>
            <InputGroup.Input
              type="search"
              name="q"
              placeholder="Kategori veya ürün ara..."
              className="bg-transparent placeholder:text-black/40"
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </form>
        <div className="flex items-center gap-1 md:gap-0 flex-shrink-0">
          <Link href="/search" className="block md:hidden p-1">
            <Image
              priority
              src="/icons/search-black.svg"
              height={100}
              width={100}
              alt="search"
              className="max-w-[22px] max-h-[22px]"
            />
          </Link>
          <Link href={isAuthenticated ? "/favorilerim" : "/signin"} className="p-1 md:mr-[14px]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="max-w-[22px] max-h-[22px]"
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
          </Link>
          <CartBtn />
          <Link href={isAuthenticated ? "/profil" : "/signin"} className="p-1">
            <Image
              priority
              src="/icons/user.svg"
              height={100}
              width={100}
              alt="user"
              className="max-w-[22px] max-h-[22px]"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;

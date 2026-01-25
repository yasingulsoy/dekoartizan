"use client";

import { cn } from "@/lib/utils";
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
          {/* Sosyal Medya Linkleri */}
          <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/dekoartizan/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;

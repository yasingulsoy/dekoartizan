import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Link from "next/link";
import React from "react";
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

const data: NavMenu = [
  {
    id: 1,
    label: "Kategoriler",
    type: "MenuList",
    children: [
      {
        id: 11,
        label: "Oturma Odası Duvar Kağıtları",
        url: "/shop?category=living-room",
        description: "Çekici ve muhteşem renkler ve tasarımlarla",
      },
      {
        id: 12,
        label: "Yatak Odası Duvar Kağıtları",
        url: "/shop?category=bedroom",
        description: "Huzurlu ve şık tasarımlarla yatak odanıza karakter katın",
      },
      {
        id: 13,
        label: "Çocuk Odası Duvar Kağıtları",
        url: "/shop?category=kids-room",
        description: "Tüm yaşlar için, mutlu ve güzel renklerle",
      },
      {
        id: 14,
        label: "Mutfak ve Banyo Duvar Kağıtları",
        url: "/shop?category=kitchen-bathroom",
        description: "Pratik ve şık çözümlerle mekanlarınızı güzelleştirin",
      },
    ],
  },
  {
    id: 2,
    type: "MenuItem",
    label: "Indirimde",
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
];

const TopNavbar = () => {
  return (
    <nav className="sticky top-0 bg-white z-20">
      <div className="flex relative max-w-frame mx-auto items-center justify-between md:justify-start py-5 md:py-6 px-4 xl:px-0 gap-2 md:gap-0">
        <div className="flex items-center">
          <div className="block md:hidden mr-2 md:mr-4 flex-shrink-0">
            <ResTopNavbar data={data} />
          </div>
          <Link
            href="/"
            className={cn([
              "flex items-center gap-2 mb-2 mr-2 md:mr-3 lg:mr-10 flex-shrink-0",
            ])}
          >
            <Image
              src="/images/logo.jpeg"
              alt="dekoartizan logo"
              width={40}
              height={40}
              className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0"
              priority
            />
            <span
              className={cn([
                integralCF.className,
                "text-lg sm:text-xl md:text-2xl lg:text-[32px] whitespace-nowrap",
              ])}
            >
              dekoartizan
            </span>
          </Link>
        </div>
        <NavigationMenu className="hidden md:flex mr-2 lg:mr-7">
          <NavigationMenuList>
            {data.map((item) => (
              <React.Fragment key={item.id}>
                {item.type === "MenuItem" && (
                  <MenuItem label={item.label} url={item.url} />
                )}
                {item.type === "MenuList" && (
                  <MenuList data={item.children} label={item.label} />
                )}
              </React.Fragment>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <InputGroup className="hidden md:flex bg-[#F0F0F0] mr-3 lg:mr-10">
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
            name="search"
            placeholder="Ürün ara..."
            className="bg-transparent placeholder:text-black/40"
          />
        </InputGroup>
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
          <CartBtn />
          <Link href="/signin" className="p-1">
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

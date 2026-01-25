"use client";

import { useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useCartSidebar } from "@/context/CartSidebarContext";

const CartBtn = () => {
  const { cart, adjustedTotalPrice } = useAppSelector((state: RootState) => state.carts);
  const pathname = usePathname();
  const { openSidebar } = useCartSidebar();
  const isHomePage = pathname === "/";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      e.preventDefault();
      openSidebar();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link
      href="/cart"
      onClick={handleClick}
      className="relative md:mr-[14px] p-1 flex items-center gap-1"
    >
      <div className="relative">
        <Image
          priority
          src="/icons/cart.svg"
          height={100}
          width={100}
          alt="cart"
          className="max-w-[22px] max-h-[22px]"
        />
        {cart && cart.totalQuantities > 0 && (
          <span className="border bg-black text-white rounded-full w-fit-h-fit px-1 text-xs absolute -top-3 left-1/2 -translate-x-1/2">
            {cart.totalQuantities}
          </span>
        )}
      </div>
      {cart && cart.totalQuantities > 0 && (
        <span className="hidden md:inline text-sm font-medium text-black">
          {formatPrice(adjustedTotalPrice)}
        </span>
      )}
    </Link>
  );
};

export default CartBtn;

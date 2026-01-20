"use client";

import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { Product } from "@/types/product.types";
import React from "react";

const AddToCartBtn = ({ 
  data, 
  totalPrice = 0,
  calculatedArea = 0
}: { 
  data: Product & { quantity: number };
  totalPrice?: number;
  calculatedArea?: number;
}) => {
  const dispatch = useAppDispatch();
  const { sizeSelection } = useAppSelector(
    (state: RootState) => state.products
  );

  // Toplam fiyat varsa onu kullan, yoksa birim fiyatı kullan
  const getFinalPrice = () => {
    if (totalPrice > 0 && calculatedArea > 0) {
      return totalPrice;
    }
    // Birim fiyatı hesapla
    if (data.discount.percentage > 0) {
      return data.price * (1 - data.discount.percentage / 100);
    } else if (data.discount.amount > 0) {
      return data.discount.amount;
    }
    return data.price;
  };

  const finalPrice = getFinalPrice();

  return (
    <button
      type="button"
      className="bg-black w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-black/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() =>
        dispatch(
          addToCart({
            id: data.id,
            name: data.title,
            srcUrl: data.srcUrl,
            price: finalPrice,
            attributes: [sizeSelection || ""],
            discount: data.discount,
            quantity: data.quantity,
            slug: data.slug,
          })
        )
      }
      disabled={calculatedArea > 0 && totalPrice === 0}
    >
      {calculatedArea > 0 ? "ÖNİZLEME & SATIN AL" : "Sepete Ekle"}
    </button>
  );
};

export default AddToCartBtn;

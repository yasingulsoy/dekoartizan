"use client";

import React from "react";
import { useCartSidebar } from "@/context/CartSidebarContext";
import { useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import ProductCard from "@/components/cart-page/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { poppins } from "@/styles/fonts";
import Link from "next/link";
import { FaArrowRight, FaXmark } from "react-icons/fa6";
import { TbBasketExclamation } from "react-icons/tb";
import { AnimatePresence, motion } from "framer-motion";

const CartSidebar = () => {
  const { isOpen, closeSidebar } = useCartSidebar();
  const { cart, totalPrice, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Sidebar */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50 shadow-2xl overflow-y-auto"
          >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-black/10">
            <h2
              className={cn([
                poppins.className,
                "font-bold text-2xl text-black uppercase",
              ])}
            >
              Sepetiniz
            </h2>
            <button
              onClick={closeSidebar}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <FaXmark className="text-xl text-black" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart && cart.items.length > 0 ? (
              <div className="flex flex-col space-y-4">
                {cart.items.map((product, idx) => (
                  <React.Fragment key={`${product.id}-${idx}`}>
                    <ProductCard data={product} />
                    {idx < cart.items.length - 1 && (
                      <hr className="border-t-black/10" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-300 mt-20">
                <TbBasketExclamation strokeWidth={1} className="text-6xl mb-4" />
                <span className="block mb-4 text-black/60">
                  Alışveriş sepetiniz boş.
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          {cart && cart.items.length > 0 && (
            <div className="border-t border-black/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg text-black/60">Toplam</span>
                <span className="text-xl font-bold">
                  ₺{Math.round(adjustedTotalPrice)}
                </span>
              </div>
              <Button
                type="button"
                className="text-base font-medium bg-black rounded-full w-full py-4 h-[54px] group"
                asChild
              >
                <Link href="/cart" onClick={closeSidebar}>
                  Sepet Sayfasına Git{" "}
                  <FaArrowRight className="text-xl ml-2 group-hover:translate-x-1 transition-all" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </motion.aside>
    </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;

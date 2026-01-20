"use client";

import React, { useState } from "react";
import PhotoSection from "./PhotoSection";
import { Product } from "@/types/product.types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Rating from "@/components/ui/Rating";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";
import MeasurementSection from "./MeasurementSection";

const Header = ({ data }: { data: Product }) => {
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [calculatedArea, setCalculatedArea] = useState<number>(0);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <PhotoSection data={data} />
        </div>
        <div>
          <h1
            className={cn([
              integralCF.className,
              "text-2xl md:text-[40px] md:leading-[40px] mb-3 md:mb-3.5 capitalize",
            ])}
          >
            {data.title}
          </h1>
          <div className="flex items-center mb-3 sm:mb-3.5">
            <Rating
              initialValue={data.rating}
              allowFraction
              SVGclassName="inline-block"
              emptyClassName="fill-gray-50"
              size={25}
              readonly
            />
            <span className="text-black text-xs sm:text-sm ml-[11px] sm:ml-[13px] pb-0.5 sm:pb-0">
              {data.rating.toFixed(1)}
              <span className="text-black/60">/5</span>
            </span>
          </div>
          <div className="flex items-center space-x-2.5 sm:space-x-3 mb-5">
            {data.discount.percentage > 0 ? (
              <span className="font-bold text-black text-2xl sm:text-[32px]">
                {`₺${(data.price * (1 - data.discount.percentage / 100)).toFixed(2)}`}
              </span>
            ) : data.discount.amount > 0 ? (
              <span className="font-bold text-black text-2xl sm:text-[32px]">
                {`₺${data.discount.amount.toFixed(2)}`}
              </span>
            ) : (
              <span className="font-bold text-black text-2xl sm:text-[32px]">
                ₺{data.price.toFixed(2)}
              </span>
            )}
            <span className="text-sm sm:text-base text-black/60">
              / m²
            </span>
            {data.discount.percentage > 0 && (
              <span className="font-bold text-black/40 line-through text-xl sm:text-2xl">
                ₺{data.price.toFixed(2)}
              </span>
            )}
            {data.discount.amount > 0 && (
              <span className="font-bold text-black/40 line-through text-xl sm:text-2xl">
                ₺{data.price.toFixed(2)}
              </span>
            )}
            {data.discount.percentage > 0 ? (
              <span className="font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                {`-${data.discount.percentage}%`}
              </span>
            ) : (
              data.discount.amount > 0 && (
                <span className="font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                  {`-₺${(data.price - data.discount.amount).toFixed(2)}`}
                </span>
              )
            )}
          </div>
          {data.shortDescription && (
            <p className="text-sm sm:text-base text-black/60 mb-5">
              {data.shortDescription}
            </p>
          )}
          <hr className="h-[1px] border-t-black/10 mb-5" />
          
          {/* Ölçü Girişi ve Fiyat Hesaplama */}
          <MeasurementSection 
            data={data} 
            onTotalPriceChange={(price, area) => {
              setTotalPrice(price);
              setCalculatedArea(area);
            }}
          />
          
          <hr className="h-[1px] border-t-black/10 my-5" />
          
          {/* Beden Seçimi - Boş bırakıldı, içerikler sonra eklenecek */}
          <div className="flex flex-col mb-5">
            <span className="text-sm sm:text-base text-black/60 mb-4">
              Beden Seçin
            </span>
            {/* İçerikler sonra eklenecek */}
          </div>
          
          <hr className="hidden md:block h-[1px] border-t-black/10 my-5" />
          <AddToCardSection 
            data={data} 
            totalPrice={totalPrice}
            calculatedArea={calculatedArea}
          />
        </div>
      </div>
    </>
  );
};

export default Header;

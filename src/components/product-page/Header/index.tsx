"use client";

import React, { useState } from "react";
import PhotoSection from "./PhotoSection";
import { Product, PaperType } from "@/types/product.types";
import { poppins } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Rating from "@/components/ui/Rating";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";
import MeasurementSection from "./MeasurementSection";
import WishlistButton from "./WishlistButton";
import CustomizationModal from "./CustomizationModal";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addToCart } from "@/lib/features/carts/cartsSlice";

const Header = ({ data }: { data: Product }) => {
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [calculatedArea, setCalculatedArea] = useState<number>(0);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleCustomizeClick = () => {
    const widthNum = parseFloat(width.replace(',', '.')) || 0;
    const heightNum = parseFloat(height.replace(',', '.')) || 0;
    
    if (widthNum <= 0 || heightNum <= 0) {
      alert("Lütfen genişlik ve yükseklik ölçülerini giriniz (cm cinsinden).");
      return;
    }
    
    setIsCustomizationModalOpen(true);
  };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <PhotoSection data={data} />
        </div>
        <div>
          <div className="flex items-start justify-between mb-3 md:mb-3.5">
            <h1
              className={cn([
                poppins.className,
                "text-2xl md:text-[40px] md:leading-[40px] capitalize flex-1",
              ])}
            >
              {data.title}
            </h1>
            <WishlistButton productId={data.id} className="ml-4 flex-shrink-0" />
          </div>
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
            onMeasurementChange={(w, h) => {
              setWidth(w);
              setHeight(h);
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
            onCustomizeClick={handleCustomizeClick}
          />
        </div>
      </div>

      {/* Customization Modal */}
      <CustomizationModal
        product={data}
        isOpen={isCustomizationModalOpen}
        onClose={() => setIsCustomizationModalOpen(false)}
        initialWidth={width}
        initialHeight={height}
        onAddToCart={(customizationData) => {
          const finalPrice = customizationData.paperType
            ? (customizationData.width * customizationData.height / 10000) * customizationData.paperType.pricePerM2
            : totalPrice > 0
            ? totalPrice
            : data.discount.percentage > 0
            ? data.price * (1 - data.discount.percentage / 100)
            : data.discount.amount > 0
            ? data.discount.amount
            : data.price;

          dispatch(
            addToCart({
              id: data.id,
              name: data.title,
              srcUrl: customizationData.croppedImageUrl || data.srcUrl,
              price: finalPrice,
              attributes: [
                `Genişlik: ${customizationData.width}cm`,
                `Yükseklik: ${customizationData.height}cm`,
                customizationData.paperType ? `Kağıt: ${customizationData.paperType.name}` : "",
                customizationData.cropEnabled ? "Kırpma: Aktif" : "Kırpma: Pasif",
                customizationData.croppedImageUrl ? `Kırpılmış Resim: ${customizationData.croppedImageUrl}` : "",
              ].filter(Boolean),
              discount: data.discount,
              quantity: 1,
              slug: data.slug,
              croppedImageUrl: customizationData.croppedImageUrl,
              cropWidth: customizationData.width,
              cropHeight: customizationData.height,
            })
          );
        }}
      />
    </>
  );
};

export default Header;

"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types/product.types";

interface MeasurementSectionProps {
  data: Product;
  onTotalPriceChange?: (totalPrice: number, area: number) => void;
}

const MeasurementSection = ({ data, onTotalPriceChange }: MeasurementSectionProps) => {
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [area, setArea] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Birim fiyatı hesapla (indirim varsa ona göre)
  const getUnitPrice = () => {
    if (data.discount.percentage > 0) {
      return data.price * (1 - data.discount.percentage / 100);
    } else if (data.discount.amount > 0) {
      return data.discount.amount;
    }
    return data.price;
  };

  const unitPrice = getUnitPrice();

  // Virgülü noktaya çevirip sayıya dönüştür
  const parseNumber = (value: string): number => {
    if (!value) return 0;
    // Virgülü noktaya çevir
    const normalizedValue = value.replace(',', '.');
    return parseFloat(normalizedValue) || 0;
  };

  useEffect(() => {
    const widthNum = parseNumber(width);
    const heightNum = parseNumber(height);

    if (widthNum > 0 && heightNum > 0) {
      // m² hesaplama (cm'den m²'ye çevirme)
      const areaInM2 = (widthNum * heightNum) / 10000;
      setArea(areaInM2);
      
      // Toplam fiyat = alan x birim fiyat
      const calculatedPrice = areaInM2 * unitPrice;
      setTotalPrice(calculatedPrice);
      
      if (onTotalPriceChange) {
        onTotalPriceChange(calculatedPrice, areaInM2);
      }
    } else {
      setArea(0);
      setTotalPrice(0);
      if (onTotalPriceChange) {
        onTotalPriceChange(0, 0);
      }
    }
  }, [width, height, unitPrice, onTotalPriceChange]);

  // Input değişikliğini handle et (virgül ve nokta kabul et)
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Sadece sayı, virgül ve nokta kabul et
    if (value === '' || /^[0-9]+([,\.][0-9]*)?$/.test(value)) {
      setWidth(value);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Sadece sayı, virgül ve nokta kabul et
    if (value === '' || /^[0-9]+([,\.][0-9]*)?$/.test(value)) {
      setHeight(value);
    }
  };

  return (
    <div className="flex flex-col mb-5">
      <h3 className="text-sm sm:text-base font-semibold text-black mb-4">
        Duvar Ölçülerini Giriniz
      </h3>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs sm:text-sm text-black/60 mb-2">
            Genişlik
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={width}
              onChange={handleWidthChange}
              placeholder="0"
              className="w-full px-4 py-2.5 sm:py-3 pr-12 border border-black/10 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-black/60">
              cm
            </span>
          </div>
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm text-black/60 mb-2">
            Yükseklik
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={height}
              onChange={handleHeightChange}
              placeholder="0"
              className="w-full px-4 py-2.5 sm:py-3 pr-12 border border-black/10 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-black/60">
              cm
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-black/60 mb-4">
        Duvarınızın tam ölçülerini giriniz.
      </p>

      {area > 0 && (
        <div className="bg-[#F0EEED] rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm sm:text-base text-black/60">
              Hesaplanan Alan:
            </span>
            <span className="text-sm sm:text-base font-semibold text-black">
              {area.toFixed(2)} m²
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base text-black/60">
              Birim Fiyat:
            </span>
            <span className="text-sm sm:text-base font-semibold text-black">
              {unitPrice.toFixed(2)} ₺ / m²
            </span>
          </div>
          <hr className="my-3 border-black/10" />
          <div className="flex items-center justify-between">
            <span className="text-base sm:text-lg font-semibold text-black">
              Toplam Fiyat:
            </span>
            <span className="text-lg sm:text-xl font-bold text-black">
              {totalPrice.toFixed(2)} ₺
            </span>
          </div>
        </div>
      )}

      {area === 0 && width !== "" && height !== "" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-xs sm:text-sm text-yellow-800">
            Lütfen geçerli ölçüler giriniz.
          </p>
        </div>
      )}
    </div>
  );
};

export default MeasurementSection;

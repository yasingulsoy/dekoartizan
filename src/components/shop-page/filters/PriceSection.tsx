"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const priceRanges = [
  "0 TL - 1000 TL",
  "1000 TL - 2250 TL",
  "2250 TL - 4000 TL",
  "4000 TL - 7000 TL",
  "7000 TL - 12500 TL",
  "12500 TL - 15000 TL",
];

const PriceSection = () => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRange, setSelectedRange] = useState<string>("");

  return (
    <Accordion type="single" collapsible defaultValue="filter-price">
      <AccordionItem value="filter-price" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Fiyat
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="En Az"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 border border-black/20 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <input
                type="number"
                placeholder="En Çok"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 border border-black/20 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <Button
                type="button"
                className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded min-w-[40px] h-[40px]"
              >
                <Image
                  src="/icons/search.svg"
                  height={16}
                  width={16}
                  alt="search"
                  className="min-w-4 min-h-4"
                />
              </Button>
            </div>
            <div className="space-y-2">
              {priceRanges.map((range, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`price-${index}`}
                    name="price-range"
                    value={range}
                    checked={selectedRange === range}
                    onChange={(e) => setSelectedRange(e.target.value)}
                    className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                  />
                  <label
                    htmlFor={`price-${index}`}
                    className="text-black/60 cursor-pointer text-sm"
                  >
                    {range}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PriceSection;

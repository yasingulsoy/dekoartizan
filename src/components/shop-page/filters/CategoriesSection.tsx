"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CategoriesSection = () => {
  const [isChecked, setIsChecked] = useState(true);

  return (
    <Accordion type="single" collapsible defaultValue="filter-category">
      <AccordionItem value="filter-category" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Kategori
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="wallpaper"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <label htmlFor="wallpaper" className="text-black/60 cursor-pointer">
              Duvar Kağıdı
            </label>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategoriesSection;

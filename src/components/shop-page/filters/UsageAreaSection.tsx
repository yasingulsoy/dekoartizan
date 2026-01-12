"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const usageAreas = [
  "Oturma Odası",
  "Yatak Odası",
  "Mutfak",
  "Banyo",
  "Çocuk Odası",
  "Ofis",
  "Koridor",
];

const UsageAreaSection = () => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="filter-usage-area" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Kullanım Alanı
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="space-y-2">
            {usageAreas.map((area, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`usage-${index}`}
                  className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label
                  htmlFor={`usage-${index}`}
                  className="text-black/60 cursor-pointer text-sm"
                >
                  {area}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default UsageAreaSection;

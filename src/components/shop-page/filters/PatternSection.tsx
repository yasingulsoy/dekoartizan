"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const patterns = [
  "Geometrik",
  "Çiçekli",
  "Doğa",
  "Soyut",
  "Çizgili",
  "Noktalı",
  "Düz",
];

const PatternSection = () => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="filter-pattern" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Desen
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="space-y-2">
            {patterns.map((pattern, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`pattern-${index}`}
                  className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label
                  htmlFor={`pattern-${index}`}
                  className="text-black/60 cursor-pointer text-sm"
                >
                  {pattern}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PatternSection;

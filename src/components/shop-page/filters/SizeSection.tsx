"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import InputGroup from "@/components/ui/input-group";
import Image from "next/image";

const sizes = [
  "300 x 240",
  "325 x 260",
  "400 x 300",
  "425 x 200",
  "200 x 180",
  "375 x 300",
  "160 x 200",
  "120 x 200",
  "140 x 200",
];

const SizeSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const filteredSizes = sizes.filter((size) =>
    size.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-size">
      <AccordionItem value="filter-size" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Boyut/Ebat
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="space-y-4">
            <InputGroup className="bg-white border border-black/20 rounded-full">
              <InputGroup.Text>
                <Image
                  src="/icons/search.svg"
                  height={16}
                  width={16}
                  alt="search"
                  className="min-w-4 min-h-4"
                />
              </InputGroup.Text>
              <InputGroup.Input
                type="text"
                placeholder="Boyut/Ebat Ara"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent placeholder:text-black/40 text-sm"
              />
            </InputGroup>
            <div className="space-y-2">
              {filteredSizes.map((size, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`size-${index}`}
                    checked={selectedSizes.includes(size)}
                    onChange={() => toggleSize(size)}
                    className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <label
                    htmlFor={`size-${index}`}
                    className="text-black/60 cursor-pointer text-sm"
                  >
                    {size}
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

export default SizeSection;

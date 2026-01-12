import React from "react";
import CategoriesSection from "@/components/shop-page/filters/CategoriesSection";
import PriceSection from "@/components/shop-page/filters/PriceSection";
import SizeSection from "@/components/shop-page/filters/SizeSection";
import UsageAreaSection from "@/components/shop-page/filters/UsageAreaSection";
import PatternSection from "@/components/shop-page/filters/PatternSection";
import ToggleSection from "@/components/shop-page/filters/ToggleSection";
import { Button } from "@/components/ui/button";

const Filters = () => {
  return (
    <>
      <hr className="border-t-black/10" />
      <CategoriesSection />
      <hr className="border-t-black/10" />
      <SizeSection />
      <hr className="border-t-black/10" />
      <PriceSection />
      <hr className="border-t-black/10" />
      <UsageAreaSection />
      <hr className="border-t-black/10" />
      <PatternSection />
      <hr className="border-t-black/10" />
      <ToggleSection label="Fotoğraflı Yorumlar" id="photo-reviews" />
      <hr className="border-t-black/10" />
      <ToggleSection
        label="Kurumsal Faturaya Uygun"
        id="corporate-invoice"
      />
      <div className="pt-4">
        <p className="text-xs text-black/40">
          Sponsorlu ürünler reklam niteliğinde olup satıcıları tarafından öne
          çıkartılmaktadır.
        </p>
      </div>
      <Button
        type="button"
        className="bg-black w-full rounded-full text-sm font-medium py-4 h-12 mt-4"
      >
        Filtreyi Uygula
      </Button>
    </>
  );
};

export default Filters;

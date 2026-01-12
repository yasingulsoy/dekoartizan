import Link from "next/link";
import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

type Category = {
  title: string;
  slug: string;
};

const categoriesData: Category[] = [
  {
    title: "Tişörtler",
    slug: "/shop?category=t-shirts",
  },
  {
    title: "Şortlar",
    slug: "/shop?category=shorts",
  },
  {
    title: "Gömlekler",
    slug: "/shop?category=shirts",
  },
  {
    title: "Kapüşonlu",
    slug: "/shop?category=hoodie",
  },
  {
    title: "Kot Pantolonlar",
    slug: "/shop?category=jeans",
  },
];

const CategoriesSection = () => {
  return (
    <div className="flex flex-col space-y-0.5 text-black/60">
      {categoriesData.map((category, idx) => (
        <Link
          key={idx}
          href={category.slug}
          className="flex items-center justify-between py-2"
        >
          {category.title} <MdKeyboardArrowRight />
        </Link>
      ))}
    </div>
  );
};

export default CategoriesSection;

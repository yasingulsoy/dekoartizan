import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import React from "react";

type DressStyleCardProps = {
  title: string;
  url: string;
  imageUrl: string;
  className?: string;
};

const DressStyleCard = ({ title, url, imageUrl, className }: DressStyleCardProps) => {
  return (
    <Link
      href={url}
      className={cn([
        "w-full md:h-full rounded-[20px] bg-white relative overflow-hidden text-2xl md:text-4xl font-bold text-left py-4 md:py-[25px] px-6 md:px-9",
        className,
      ])}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <span className="relative z-10 text-white drop-shadow-lg">{title}</span>
    </Link>
  );
};

export default DressStyleCard;

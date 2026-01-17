"use client";

import { Product } from "@/types/product.types";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

const PhotoSection = ({ data }: { data: Product }) => {
  const [selected, setSelected] = useState<string>(data.srcUrl);
  
  // srcUrl veya gallery değiştiğinde selected'i güncelle
  useEffect(() => {
    // Eğer seçili resim gallery'de yoksa, yeni srcUrl'i seç
    if (data.srcUrl) {
      const isSelectedInGallery = data.gallery && data.gallery.length > 0 && data.gallery.includes(selected);
      if (!isSelectedInGallery) {
        setSelected(data.srcUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.srcUrl, data.gallery]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  // background-position için yüzde değerleri (0-100)
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Zoom lens boyutu
    const lensSize = 150;
    const halfLens = lensSize / 2;

    // Zoom lens pozisyonunu resmin sınırları içinde tut
    const clampedX = Math.max(halfLens, Math.min(x, rect.width - halfLens));
    const clampedY = Math.max(halfLens, Math.min(y, rect.height - halfLens));

    setZoomPosition({ x: clampedX, y: clampedY });

    // Büyütülmüş önizleme: lens merkezinin resimdeki konumunu (yüzde) direkt background-position'a bağla.
    // background-position'da 0% 0% sol-üst, 100% 100% sağ-alt demektir; bu yüzden ekstra ters çevirme yapmıyoruz.
    const percentX = (clampedX / rect.width) * 100;
    const percentY = (clampedY / rect.height) * 100;
    setImagePosition({ x: percentX, y: percentY });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsZoomed(true);
    // İlk frame'de (0,0) gözükmesin diye, enter anında pozisyonu da hesapla.
    handleMouseMove(e);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row lg:space-x-3.5">
      {data?.gallery && data.gallery.length > 0 && (
        <div className="flex lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3.5 w-full lg:w-fit items-center lg:justify-start justify-center">
          {data.gallery.map((photo, index) => (
            <button
              key={index}
              type="button"
              className="bg-[#F0EEED] rounded-[13px] xl:rounded-[20px] w-full max-w-[111px] xl:max-w-[152px] max-h-[106px] xl:max-h-[167px] xl:min-h-[167px] aspect-square overflow-hidden"
              onClick={() => setSelected(photo)}
            >
              <Image
                src={photo}
                width={152}
                height={167}
                className="rounded-md w-full h-full object-cover hover:scale-110 transition-all duration-500"
                alt={data.title}
                priority
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative w-full">
        <div
          ref={imageRef}
          className="relative flex items-center justify-center bg-[#F0EEED] rounded-[13px] sm:rounded-[20px] w-full sm:w-96 md:w-full mx-auto h-full max-h-[530px] min-h-[330px] lg:min-h-[380px] xl:min-h-[530px] overflow-hidden mb-3 lg:mb-0 cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={selected}
            width={444}
            height={530}
            className="rounded-md w-full h-full object-cover transition-all duration-300"
            alt={data.title}
            priority
            unoptimized
          />
          
          {/* Zoom Lens */}
          {isZoomed && (
            <div
              ref={zoomRef}
              className="absolute pointer-events-none border-2 border-white shadow-lg rounded-full bg-white/20 backdrop-blur-sm"
              style={{
                width: '150px',
                height: '150px',
                left: `${zoomPosition.x}px`,
                top: `${zoomPosition.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}
        </div>

        {/* Zoomed Image Preview */}
        {isZoomed && (
          <div className="hidden lg:block absolute top-0 left-full ml-4 w-[444px] h-[530px] bg-[#F0EEED] rounded-[20px] overflow-hidden border-2 border-gray-200 shadow-2xl z-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${selected})`,
                backgroundSize: '300%',
                backgroundPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoSection;

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Product, PaperType } from "@/types/product.types";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiGet, API_URL } from "@/lib/api";

interface CustomizationModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  initialWidth?: string;
  initialHeight?: string;
  onAddToCart: (data: {
    product: Product;
    width: number;
    height: number;
    paperType?: PaperType;
    cropEnabled: boolean;
    croppedImageUrl?: string;
  }) => void;
}

const CustomizationModal = ({
  product,
  isOpen,
  onClose,
  initialWidth = "",
  initialHeight = "",
  onAddToCart,
}: CustomizationModalProps) => {
  const [width, setWidth] = useState<string>(initialWidth);
  const [height, setHeight] = useState<string>(initialHeight);
  const [cropEnabled, setCropEnabled] = useState<boolean>(true);
  const [selectedPaperType, setSelectedPaperType] = useState<PaperType | null>(
    null
  );
  const [paperTypes, setPaperTypes] = useState<PaperType[]>([]);
  const [loadingPaperTypes, setLoadingPaperTypes] = useState<boolean>(true);
  const [cropArea, setCropArea] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [imagePosition, setImagePosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Modal açıldığında initial değerleri yükle
  useEffect(() => {
    if (isOpen) {
      setWidth(initialWidth);
      setHeight(initialHeight);
      fetchPaperTypes();
    }
  }, [isOpen, initialWidth, initialHeight]);

  // Resim yüklendiğinde boyutlarını al
  useEffect(() => {
    if (imgRef.current && isOpen) {
      const img = imgRef.current;
      
      // Resim yükleme hatası kontrolü
      const handleError = () => {
        console.error("Resim yüklenemedi:", product.srcUrl);
      };

      const handleLoad = () => {
        const container = imageRef.current;
        if (!container) return;

        // Resmin yüklendiğinden emin ol
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
          console.warn("Resim boyutları 0, yüklenmemiş olabilir");
          return;
        }

        const containerRect = container.getBoundingClientRect();
        const imgAspectRatio = img.naturalWidth / img.naturalHeight;
        const containerAspectRatio = containerRect.width / containerRect.height;

        let displayWidth: number;
        let displayHeight: number;
        let displayX: number;
        let displayY: number;

        if (imgAspectRatio > containerAspectRatio) {
          // Resim container'dan daha geniş
          displayWidth = containerRect.width;
          displayHeight = containerRect.width / imgAspectRatio;
          displayX = 0;
          displayY = (containerRect.height - displayHeight) / 2;
        } else {
          // Resim container'dan daha yüksek
          displayHeight = containerRect.height;
          displayWidth = containerRect.height * imgAspectRatio;
          displayX = (containerRect.width - displayWidth) / 2;
          displayY = 0;
        }

        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
        setImagePosition({ x: displayX, y: displayY, width: displayWidth, height: displayHeight });
      };

      img.addEventListener("error", handleError);

      if (img.complete && img.naturalWidth > 0) {
        handleLoad();
      } else {
        img.addEventListener("load", handleLoad);
        return () => {
          img.removeEventListener("load", handleLoad);
          img.removeEventListener("error", handleError);
        };
      }
    }
  }, [isOpen, product.srcUrl]);

  const fetchPaperTypes = async () => {
    try {
      setLoadingPaperTypes(true);
      const response = await apiGet<{ success: boolean; data: any[] }>("/api/paper-types");
      
      if (response.success && response.data) {
        const formattedPaperTypes: PaperType[] = response.data.map((pt: any) => ({
          id: pt.id,
          name: pt.name,
          price: parseFloat(pt.price),
          pricePerM2: parseFloat(pt.price_per_m2),
          description: Array.isArray(pt.description) ? pt.description : [],
          image: pt.image_url ? `${API_URL}${pt.image_url}` : undefined,
        }));
        setPaperTypes(formattedPaperTypes);
      }
    } catch (error) {
      console.error("Kağıt türleri yüklenemedi:", error);
    } finally {
      setLoadingPaperTypes(false);
    }
  };

  // Ölçülere göre kırpma alanını hesapla - resmin gerçek boyutuna göre
  useEffect(() => {
    if (!width || !height || !imagePosition || !imageSize || !cropEnabled) {
      setCropArea(null);
      return;
    }

    const widthNum = parseFloat(width.replace(",", ".")) || 0;
    const heightNum = parseFloat(height.replace(",", ".")) || 0;

    if (widthNum > 0 && heightNum > 0) {
      // Gerçek ölçülerin oranı
      const targetAspectRatio = widthNum / heightNum;
      
      // Resmin görüntülenen boyutları
      const displayWidth = imagePosition.width;
      const displayHeight = imagePosition.height;
      const displayAspectRatio = displayWidth / displayHeight;

      let cropWidth: number;
      let cropHeight: number;

      // Kırpma alanını resmin görüntülenen boyutuna göre hesapla
      if (targetAspectRatio > displayAspectRatio) {
        // Hedef daha geniş, genişliği baz al
        cropWidth = displayWidth;
        cropHeight = cropWidth / targetAspectRatio;
      } else {
        // Hedef daha yüksek, yüksekliği baz al
        cropHeight = displayHeight;
        cropWidth = cropHeight * targetAspectRatio;
      }

      // Kırpma alanını resmin görüntülenen alanının merkezine yerleştir
      const x = imagePosition.x + (displayWidth - cropWidth) / 2;
      const y = imagePosition.y + (displayHeight - cropHeight) / 2;

      setCropArea({
        x,
        y,
        width: cropWidth,
        height: cropHeight,
      });
    } else {
      setCropArea(null);
    }
  }, [width, height, cropEnabled, imagePosition, imageSize]);

  const parseNumber = (value: string): number => {
    if (!value) return 0;
    const normalizedValue = value.replace(",", ".");
    return parseFloat(normalizedValue) || 0;
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]+([,\.][0-9]*)?$/.test(value)) {
      setWidth(value);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]+([,\.][0-9]*)?$/.test(value)) {
      setHeight(value);
    }
  };

  // Kırpma alanını sürükleme işlemleri
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!cropArea) return;
    setIsDragging(true);
    const container = imageRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    setDragStart({
      x: e.clientX - containerRect.left - cropArea.x,
      y: e.clientY - containerRect.top - cropArea.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStart || !cropArea || !imagePosition) return;

      const container = imageRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newX = e.clientX - containerRect.left - dragStart.x;
      const newY = e.clientY - containerRect.top - dragStart.y;

      // Kırpma alanının resmin sınırları içinde kalmasını sağla
      const minX = imagePosition.x;
      const maxX = imagePosition.x + imagePosition.width - cropArea.width;
      const minY = imagePosition.y;
      const maxY = imagePosition.y + imagePosition.height - cropArea.height;

      const clampedX = Math.max(minX, Math.min(newX, maxX));
      const clampedY = Math.max(minY, Math.min(newY, maxY));

      setCropArea({
        ...cropArea,
        x: clampedX,
        y: clampedY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart, cropArea, imagePosition]);

  const calculateArea = (): number => {
    const widthNum = parseNumber(width);
    const heightNum = parseNumber(height);
    if (widthNum > 0 && heightNum > 0) {
      return (widthNum * heightNum) / 10000; // cm²'den m²'ye
    }
    return 0;
  };

  const calculateTotalPrice = (): number => {
    const area = calculateArea();
    if (area === 0) return 0;

    const basePrice = product.discount.percentage > 0
      ? product.price * (1 - product.discount.percentage / 100)
      : product.discount.amount > 0
      ? product.discount.amount
      : product.price;

    const paperPrice = selectedPaperType
      ? selectedPaperType.pricePerM2
      : basePrice;

    return area * paperPrice;
  };

  // Resmi kırp ve backend'e gönder
  const cropAndUploadImage = async (): Promise<string | undefined> => {
    if (!cropArea || !imageSize || !imagePosition || !imgRef.current || !cropEnabled) {
      return undefined;
    }

    try {
      const img = imgRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return undefined;

      // Resmin yüklendiğinden emin ol
      if (!img.complete || img.naturalWidth === 0) {
        throw new Error("Resim henüz yüklenmedi");
      }

      // Canvas boyutunu ayarla
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return undefined;

      // Canvas'ı temizle
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Resmin görüntülenen boyutundan gerçek boyutuna oranı
      const scaleX = imageSize.width / imagePosition.width;
      const scaleY = imageSize.height / imagePosition.height;

      // Kırpma alanının gerçek resimdeki koordinatlarını hesapla
      const sourceX = (cropArea.x - imagePosition.x) * scaleX;
      const sourceY = (cropArea.y - imagePosition.y) * scaleY;
      const sourceWidth = cropArea.width * scaleX;
      const sourceHeight = cropArea.height * scaleY;

      // Resmi kırp
      try {
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          cropArea.width,
          cropArea.height
        );
      } catch (drawError) {
        console.error("Resim çizme hatası:", drawError);
        throw new Error("Resim canvas'a çizilemedi. Lütfen resmin yüklendiğinden emin olun.");
      }

      // Canvas'ı blob'a çevir
      return new Promise((resolve, reject) => {
        try {
          canvas.toBlob(async (blob) => {
            if (!blob) {
              reject(new Error("Resim kırpılamadı"));
              return;
            }

            try {
              // FormData oluştur
              const formData = new FormData();
              formData.append("image", blob, `cropped-${product.id}-${Date.now()}.png`);

              // Backend'e gönder
              const response = await fetch(`${API_URL}/api/orders/upload-cropped-image`, {
                method: "POST",
                body: formData,
              });

              const result = await response.json();
              if (result.success && result.data?.url) {
                resolve(result.data.url);
              } else {
                reject(new Error(result.error || "Resim yüklenemedi"));
              }
            } catch (error) {
              reject(error);
            }
          }, "image/png");
        } catch (toBlobError) {
          console.error("toBlob hatası:", toBlobError);
          // Cross-origin hatası için alternatif çözüm öner
          reject(new Error("Resim kırpılamadı. Resim farklı bir sunucudan geliyorsa, lütfen resmin CORS ayarlarını kontrol edin."));
        }
      });
    } catch (error) {
      console.error("Resim kırpma hatası:", error);
      return undefined;
    }
  };

  const handleAddToCart = async () => {
    const widthNum = parseNumber(width);
    const heightNum = parseNumber(height);

    if (widthNum <= 0 || heightNum <= 0) {
      alert("Lütfen geçerli ölçüler giriniz.");
      return;
    }

    if (!selectedPaperType) {
      alert("Lütfen kağıt türü seçiniz.");
      return;
    }

    // Resmi kırp ve yükle
    let croppedImageUrl: string | undefined;
    if (cropEnabled && cropArea) {
      try {
        croppedImageUrl = await cropAndUploadImage();
      } catch (error) {
        console.error("Resim kırpma hatası:", error);
        alert("Resim kırpılırken bir hata oluştu. Devam ediliyor...");
      }
    }

    onAddToCart({
      product,
      width: widthNum,
      height: heightNum,
      paperType: selectedPaperType || undefined,
      cropEnabled,
      croppedImageUrl,
    });
  };

  if (!isOpen) return null;

  const area = calculateArea();
  const totalPrice = calculateTotalPrice();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Ürün Özelleştirme</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Left Side - Image and Crop */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r">
            <h3 className="text-xl font-bold mb-4">Resmi Kırpın</h3>

            {/* Image Container */}
            <div
              ref={imageRef}
              className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 w-full"
              style={{ minHeight: "400px", position: "relative" }}
            >
              <img
                ref={imgRef}
                src={product.srcUrl}
                alt={product.title}
                crossOrigin="anonymous"
                className="w-full h-full object-contain"
                style={{ display: "block" }}
                onError={(e) => {
                  console.error("Resim yüklenemedi:", e);
                }}
              />

              {/* Crop Area Overlay */}
              {cropArea && cropEnabled && (
                <>
                  <div
                    className={cn(
                      "absolute border-2 border-dashed border-blue-500 bg-blue-500/10 cursor-move",
                      isDragging && "border-blue-700"
                    )}
                    style={{
                      left: `${cropArea.x}px`,
                      top: `${cropArea.y}px`,
                      width: `${cropArea.width}px`,
                      height: `${cropArea.height}px`,
                    }}
                    onMouseDown={handleMouseDown}
                  >
                    {/* Measurement Labels */}
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-600 bg-white px-2 py-1 rounded shadow-sm whitespace-nowrap pointer-events-none">
                      {height}cm
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-xs font-semibold text-blue-600 bg-white px-2 py-1 rounded shadow-sm whitespace-nowrap pointer-events-none">
                      {width}cm
                    </div>
                  </div>
                  {/* Dark overlay outside crop area */}
                  <div
                    className="absolute inset-0 bg-black/30 pointer-events-none"
                    style={{
                      clipPath: `polygon(
                        0% 0%,
                        0% 100%,
                        ${cropArea.x}px 100%,
                        ${cropArea.x}px ${cropArea.y}px,
                        ${cropArea.x + cropArea.width}px ${cropArea.y}px,
                        ${cropArea.x + cropArea.width}px ${cropArea.y + cropArea.height}px,
                        ${cropArea.x}px ${cropArea.y + cropArea.height}px,
                        ${cropArea.x}px 100%,
                        100% 100%,
                        100% 0%
                      )`,
                    }}
                  />
                </>
              )}
            </div>

            {/* Hidden canvas for cropping */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Measurement Inputs - Readonly, values come from main page */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Genişlik (cm)
                </label>
                <input
                  type="text"
                  value={width}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Yükseklik (cm)
                </label>
                <input
                  type="text"
                  value={height}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Ölçüler ana sayfadan alınmıştır. Değiştirmek için ana sayfadaki ölçü alanlarını kullanın.
            </p>

            {/* Crop Enable Checkbox */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="cropEnabled"
                checked={cropEnabled}
                onChange={(e) => setCropEnabled(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="cropEnabled" className="text-sm">
                Kırpmayı Aktifleştir
              </label>
            </div>

            {/* Info Message */}
            <p className="text-sm text-gray-600">
              Siparişten sonra size ölçülerinize göre ayarlanmış Önizleme
              olarak gönderilecektir.
            </p>
          </div>

          {/* Right Side - Paper Type Selection */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Kağıt Türü Seçin</h3>

            {loadingPaperTypes ? (
              <div className="text-center py-10 text-gray-500">
                Kağıt türleri yükleniyor...
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {paperTypes.map((paper) => (
                  <div
                    key={paper.id}
                    className={cn(
                      "border-2 rounded-lg p-4 cursor-pointer transition-all",
                      selectedPaperType?.id === paper.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setSelectedPaperType(paper)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paperType"
                          checked={selectedPaperType?.id === paper.id}
                          onChange={() => setSelectedPaperType(paper)}
                          className="w-4 h-4"
                        />
                        {paper.image ? (
                          <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                            <Image
                              src={paper.image}
                              alt={paper.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">{paper.name}</h4>
                        <p className="text-lg font-semibold mb-1">
                          {paper.price.toFixed(2)} ₺
                          <span className="text-sm font-normal text-gray-600 ml-1">
                            ({paper.pricePerM2.toFixed(2)} ₺ / m²)
                          </span>
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {paper.description.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Price Summary */}
            {area > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Hesaplanan Alan:</span>
                  <span className="font-semibold">{area.toFixed(2)} m²</span>
                </div>
                {selectedPaperType && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Kağıt Türü:</span>
                    <span className="font-semibold">
                      {selectedPaperType.name}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Toplam Fiyat:</span>
                  <span>{totalPrice.toFixed(2)} ₺</span>
                </div>
              </div>
            )}

            {!selectedPaperType && (
              <p className="text-sm text-red-600 mb-4">
                Lütfen kağıt türü seçiniz
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={handleAddToCart}
            disabled={!width || !height || parseNumber(width) <= 0 || parseNumber(height) <= 0}
            className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            SEPETE EKLE
          </button>
        </div>
        {(!width || !height || parseNumber(width) <= 0 || parseNumber(height) <= 0) && (
          <div className="px-4 pb-4">
            <p className="text-sm text-red-600">
              Lütfen genişlik ve yükseklik ölçülerini giriniz (cm cinsinden).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizationModal;

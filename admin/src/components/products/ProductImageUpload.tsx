"use client";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface UploadedImage {
  id: number;
  url: string;
  is_primary?: boolean;
}

interface ProductImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  uploadedImages?: UploadedImage[]; // Yüklenmiş resimler (güncelleme için)
  maxFiles?: number;
  productId?: number;
  onImageUpdate?: (imageId: number, file: File) => Promise<void>;
  onImageDelete?: (imageId: number) => Promise<void>;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  images,
  onImagesChange,
  uploadedImages = [],
  maxFiles = 5,
  productId,
  onImageUpdate,
  onImageDelete,
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [updatingImageId, setUpdatingImageId] = useState<number | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...images, ...acceptedFiles].slice(0, maxFiles);
      onImagesChange(newFiles);

      // Preview oluştur
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    },
    [images, maxFiles, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
    },
    maxFiles: maxFiles,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    onImagesChange(newImages);
    setPreviews(newPreviews);
  };

  const handleImageUpdate = async (imageId: number, file: File) => {
    if (!onImageUpdate) return;
    
    setUpdatingImageId(imageId);
    try {
      await onImageUpdate(imageId, file);
    } catch (error) {
      console.error("Resim güncelleme hatası:", error);
    } finally {
      setUpdatingImageId(null);
    }
  };

  const handleImageDelete = async (imageId: number) => {
    if (!onImageDelete || !confirm("Bu resmi silmek istediğinize emin misiniz?")) {
      return;
    }
    
    try {
      await onImageDelete(imageId);
    } catch (error) {
      console.error("Resim silme hatası:", error);
    }
  };

  const handleFileInputChange = (imageId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpdate(imageId, file);
    }
    // Input'u sıfırla ki aynı dosya tekrar seçilebilsin
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Yüklenmiş resimler (güncelleme için) */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {uploadedImages.map((img) => (
            <div key={img.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                <img
                  src={`http://localhost:5000${img.url}`}
                  alt={`Yüklenmiş resim ${img.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {img.is_primary && (
                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Ana Resim
                </span>
              )}
              <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                Mevcut
              </span>
              
              {/* Güncelleme ve Silme Butonları */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileInputChange(img.id, e)}
                    className="hidden"
                    disabled={updatingImageId === img.id}
                  />
                  <span className="inline-flex items-center gap-1 rounded bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 disabled:opacity-50">
                    {updatingImageId === img.id ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Güncelleniyor...
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Güncelle
                      </>
                    )}
                  </span>
                </label>
                {onImageDelete && (
                  <button
                    onClick={() => handleImageDelete(img.id)}
                    className="inline-flex items-center gap-1 rounded bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Sil
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Yeni yüklenecek resimler */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                <img
                  src={preview}
                  alt={`Önizleme ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Yeni
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {images.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
            isDragActive
              ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
              : "border-gray-300 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-600"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <svg
                className="h-8 w-8 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              {isDragActive
                ? "Dosyaları buraya bırakın"
                : "Resimleri sürükleyip bırakın veya tıklayın"}
            </h4>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              PNG, JPG, WebP veya GIF (Maks. 5MB)
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {images.length}/{maxFiles} resim seçildi
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;

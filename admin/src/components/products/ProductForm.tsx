"use client";
import React, { useState, useEffect } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import ProductImageUpload from "./ProductImageUpload";
import { API_URL } from "@/lib/api";

interface Category {
  id: number;
  name: string;
  subCategories?: SubCategory[];
}

interface SubCategory {
  id: number;
  name: string;
}

interface ProductFormData {
  name: string;
  sku: string;
  category_id: string;
  sub_category_id: string;
  short_description: string;
  description: string;
  price: string;
  discount_price: string;
  discount_percentage: string;
  stock_quantity: string;
  min_order_quantity: string;
  max_order_quantity: string;
  weight: string;
  dimensions: string;
  is_featured: boolean;
  is_new: boolean;
  is_on_sale: boolean;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

interface UploadedImage {
  id: number;
  url: string;
  is_primary?: boolean;
}

interface ProductFormProps {
  productId?: number;
  onSubmit: (data: ProductFormData, images: File[]) => Promise<void>;
  initialData?: Partial<ProductFormData>;
  initialImages?: UploadedImage[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  productId,
  onSubmit,
  initialData,
  initialImages = [],
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    sku: initialData?.sku || "",
    category_id: initialData?.category_id || "",
    sub_category_id: initialData?.sub_category_id || "",
    short_description: initialData?.short_description || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    discount_price: initialData?.discount_price || "",
    discount_percentage: initialData?.discount_percentage || "",
    stock_quantity: initialData?.stock_quantity || "0",
    min_order_quantity: initialData?.min_order_quantity || "1",
    max_order_quantity: initialData?.max_order_quantity || "",
    weight: initialData?.weight || "",
    dimensions: initialData?.dimensions || "",
    is_featured: initialData?.is_featured || false,
    is_new: initialData?.is_new || false,
    is_on_sale: initialData?.is_on_sale || false,
    meta_title: initialData?.meta_title || "",
    meta_description: initialData?.meta_description || "",
    meta_keywords: initialData?.meta_keywords || "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(initialImages || []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Kategorileri yükle
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories`);
        const result = await response.json();
        if (result.success) {
          setCategories(result.data);
        }
      } catch (err) {
        console.error("Kategoriler yüklenemedi:", err);
      }
    };
    fetchCategories();
  }, []);

  // Alt kategorileri yükle
  useEffect(() => {
    if (formData.category_id) {
      const category = categories.find((c) => c.id === parseInt(formData.category_id));
      if (category?.subCategories) {
        setSubCategories(category.subCategories);
      } else {
        setSubCategories([]);
      }
    } else {
      setSubCategories([]);
    }
  }, [formData.category_id, categories]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCheckboxChange = (name: keyof ProductFormData) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleImageUpdate = async (imageId: number, file: File) => {
    if (!productId) return;
    
    try {
      const formDataImages = new FormData();
      formDataImages.append("image", file);
      
      const response = await fetch(
        `${API_URL}/api/products/${productId}/images/${imageId}`,
        {
          method: "PUT",
          body: formDataImages,
        }
      );
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || "Resim güncellenemedi");
      }
      
      // Yüklenmiş resimleri güncelle
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                url: result.data.image_url,
              }
            : img
        )
      );
    } catch (err: any) {
      throw err;
    }
  };

  const handleImageDelete = async (imageId: number) => {
    if (!productId) return;
    
    try {
      const response = await fetch(
        `${API_URL}/api/products/${productId}/images/${imageId}`,
        {
          method: "DELETE",
        }
      );
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || "Resim silinemedi");
      }
      
      // Yüklenmiş resimlerden kaldır
      setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err: any) {
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit(formData, images);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id.toString(),
    label: cat.name,
  }));

  const subCategoryOptions = subCategories.map((sub) => ({
    value: sub.id.toString(),
    label: sub.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Temel Bilgiler */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Temel Bilgiler
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <Label>
              Ürün Adı <span className="text-error-500">*</span>
            </Label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ürün adını girin"
              required
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <Label>
              SKU (Seri Numarası) <span className="text-error-500">*</span>
            </Label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Örn: DKA-001"
              required
              disabled={!!productId}
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {productId && (
              <p className="mt-1 text-xs text-gray-500">
                SKU değiştirilemez
              </p>
            )}
          </div>

          <div>
            <Label>Kategori</Label>
            <Select
              options={categoryOptions}
              placeholder="Kategori seçin"
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  category_id: value,
                  sub_category_id: "", // Alt kategoriyi sıfırla
                }))
              }
              defaultValue={formData.category_id}
            />
          </div>

          <div>
            <Label>Alt Kategori</Label>
            <Select
              options={subCategoryOptions}
              placeholder="Alt kategori seçin"
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, sub_category_id: value }))
              }
              defaultValue={formData.sub_category_id}
              className={!formData.category_id ? "opacity-50" : ""}
            />
            {!formData.category_id && (
              <p className="mt-1 text-xs text-gray-500">
                Önce kategori seçin
              </p>
            )}
          </div>

          <div className="lg:col-span-2">
            <Label>Kısa Açıklama</Label>
            <textarea
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              rows={2}
              className="h-20 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              placeholder="Kısa açıklama"
            />
          </div>

          <div className="lg:col-span-2">
            <Label>Detaylı Açıklama</Label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              placeholder="Detaylı açıklama"
            />
          </div>
        </div>
      </div>

      {/* Fiyat ve Stok */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Fiyat ve Stok
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div>
            <Label>
              Fiyat (₺) <span className="text-error-500">*</span>
            </Label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <Label>İndirimli Fiyat (₺)</Label>
            <input
              type="number"
              name="discount_price"
              value={formData.discount_price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <Label>İndirim Yüzdesi (%)</Label>
            <input
              type="number"
              name="discount_percentage"
              value={formData.discount_percentage}
              onChange={handleChange}
              placeholder="0"
              min="0"
              max="100"
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <Label>Stok Miktarı</Label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <Label>Minimum Sipariş</Label>
            <input
              type="number"
              name="min_order_quantity"
              value={formData.min_order_quantity}
              onChange={handleChange}
              placeholder="1"
              min="1"
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <Label>Maksimum Sipariş</Label>
            <input
              type="number"
              name="max_order_quantity"
              value={formData.max_order_quantity}
              onChange={handleChange}
              placeholder="Sınırsız"
              min="1"
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
        </div>
      </div>

      {/* Fiziksel Özellikler */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Fiziksel Özellikler
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <Label>Ağırlık (kg)</Label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <Label>Boyutlar</Label>
            <input
              type="text"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              placeholder="Örn: 50x70 cm"
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
        </div>
      </div>

      {/* Resimler */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Ürün Resimleri (Maks. 5)
        </h2>
        <ProductImageUpload
          images={images}
          onImagesChange={setImages}
          uploadedImages={uploadedImages}
          maxFiles={5}
          productId={productId}
          onImageUpdate={handleImageUpdate}
          onImageDelete={handleImageDelete}
        />
      </div>

      {/* SEO */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          SEO Ayarları
        </h2>
        <div className="space-y-6">
          <div>
            <Label>Meta Başlık</Label>
            <input
              type="text"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleChange}
              placeholder="SEO başlığı"
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <Label>Meta Açıklama</Label>
            <textarea
              name="meta_description"
              value={formData.meta_description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              placeholder="SEO açıklaması"
            />
          </div>

          <div>
            <Label>Meta Anahtar Kelimeler</Label>
            <input
              type="text"
              name="meta_keywords"
              value={formData.meta_keywords}
              onChange={handleChange}
              placeholder="kelime1, kelime2, kelime3"
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
        </div>
      </div>

      {/* Özellikler */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Özellikler
        </h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={() => handleCheckboxChange("is_featured")}
              className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Öne Çıkan Ürün
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.is_new}
              onChange={() => handleCheckboxChange("is_new")}
              className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Yeni Ürün
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.is_on_sale}
              onChange={() => handleCheckboxChange("is_on_sale")}
              className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              İndirimde
            </span>
          </label>
        </div>
      </div>

      {/* Butonlar */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm font-medium text-white shadow-theme-xs transition ${
            loading
              ? "cursor-not-allowed bg-brand-300 opacity-50"
              : "bg-brand-500 hover:bg-brand-600"
          }`}
        >
          {loading ? "Kaydediliyor..." : productId ? "Güncelle" : "Kaydet"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

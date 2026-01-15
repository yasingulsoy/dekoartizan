"use client";
import React, { useState, useEffect } from "react";
import Button from "../ui/button/Button";

interface SubCategory {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  display_order: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  display_order: number;
  subCategories?: SubCategory[];
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<number | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubCategory, setShowAddSubCategory] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/categories?include_inactive=true");
      const result = await response.json();

      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Kategoriler yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setShowAddCategory(false);
        setFormData({ name: "", description: "", display_order: 0, is_active: true });
        fetchCategories();
      }
    } catch (error) {
      console.error("Kategori ekleme hatası:", error);
    }
  };

  const handleAddSubCategory = async (categoryId: number, e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/${categoryId}/sub-categories`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (result.success) {
        setShowAddSubCategory(null);
        setFormData({ name: "", description: "", display_order: 0, is_active: true });
        fetchCategories();
      }
    } catch (error) {
      console.error("Alt kategori ekleme hatası:", error);
    }
  };

  const handleUpdateCategory = async (categoryId: number, e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setEditingCategory(null);
        setFormData({ name: "", description: "", display_order: 0, is_active: true });
        fetchCategories();
      }
    } catch (error) {
      console.error("Kategori güncelleme hatası:", error);
    }
  };

  const handleUpdateSubCategory = async (subCategoryId: number, e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/sub-categories/${subCategoryId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (result.success) {
        setEditingSubCategory(null);
        setFormData({ name: "", description: "", display_order: 0, is_active: true });
        fetchCategories();
      }
    } catch (error) {
      console.error("Alt kategori güncelleme hatası:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Kategori silme hatası:", error);
    }
  };

  const handleDeleteSubCategory = async (subCategoryId: number) => {
    if (!confirm("Bu alt kategoriyi silmek istediğinize emin misiniz?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/sub-categories/${subCategoryId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      if (result.success) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Alt kategori silme hatası:", error);
    }
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category.id);
    setFormData({
      name: category.name,
      description: category.description || "",
      display_order: category.display_order,
      is_active: category.is_active,
    });
  };

  const startEditSubCategory = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory.id);
    setFormData({
      name: subCategory.name,
      description: "",
      display_order: subCategory.display_order,
      is_active: subCategory.is_active,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Kategori Ekle Butonu */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Kategoriler</h2>
        <Button onClick={() => setShowAddCategory(true)}>Yeni Kategori Ekle</Button>
      </div>

      {/* Kategori Ekleme Formu */}
      {showAddCategory && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-lg font-semibold">Yeni Kategori</h3>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Kategori Adı *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Sıralama
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                  }
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>
              <div className="flex items-center gap-2 pt-8">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Aktif</label>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddCategory(false);
                  setFormData({ name: "", description: "", display_order: 0, is_active: true });
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kategori Listesi */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            {editingCategory === category.id ? (
              <form onSubmit={(e) => handleUpdateCategory(category.id, e)} className="space-y-4">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                  >
                    Kaydet
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  >
                    İptal
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {category.name}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        category.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {category.is_active ? "Aktif" : "Pasif"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditCategory(category)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => setShowAddSubCategory(category.id)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400"
                    >
                      Alt Kategori Ekle
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400"
                    >
                      Sil
                    </button>
                  </div>
                </div>

                {/* Alt Kategoriler */}
                <div className="mt-4 space-y-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  {category.subCategories && category.subCategories.length > 0 ? (
                    category.subCategories.map((subCategory) => (
                      <div
                        key={subCategory.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
                      >
                        {editingSubCategory === subCategory.id ? (
                          <form
                            onSubmit={(e) => handleUpdateSubCategory(subCategory.id, e)}
                            className="flex flex-1 gap-2"
                          >
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                              className="h-9 flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            />
                            <button
                              type="submit"
                              className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600"
                            >
                              Kaydet
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingSubCategory(null)}
                              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                            >
                              İptal
                            </button>
                          </form>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-800 dark:text-white/90">
                                {subCategory.name}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                  subCategory.is_active
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                }`}
                              >
                                {subCategory.is_active ? "Aktif" : "Pasif"}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditSubCategory(subCategory)}
                                className="text-xs text-blue-600 hover:text-blue-900 dark:text-blue-400"
                              >
                                Düzenle
                              </button>
                              <button
                                onClick={() => handleDeleteSubCategory(subCategory.id)}
                                className="text-xs text-red-600 hover:text-red-900 dark:text-red-400"
                              >
                                Sil
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Alt kategori yok
                    </p>
                  )}

                  {/* Alt Kategori Ekleme Formu */}
                  {showAddSubCategory === category.id && (
                    <form
                      onSubmit={(e) => handleAddSubCategory(category.id, e)}
                      className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Alt kategori adı"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-9 flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        />
                        <button
                          type="submit"
                          className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600"
                        >
                          Ekle
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddSubCategory(null);
                            setFormData({ name: "", description: "", display_order: 0, is_active: true });
                          }}
                          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        >
                          İptal
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;

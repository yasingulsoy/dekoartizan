"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { poppins } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InputGroup from "@/components/ui/input-group";
import { API_URL } from "@/lib/api";

export default function EditAddressPage() {
  const { isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const addressId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    address_type: "shipping",
    first_name: "",
    last_name: "",
    company: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    district: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Türkiye",
    is_default: false,
  });

  useEffect(() => {
    if (isAuthenticated && token && addressId) {
      fetchAddress();
    }
  }, [isAuthenticated, token, addressId]);

  const fetchAddress = async () => {
    try {
      setFetching(true);
      const response = await fetch(`${API_URL}/api/addresses/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        const address = data.data;
        setFormData({
          title: address.title || "",
          address_type: address.address_type || "shipping",
          first_name: address.first_name || "",
          last_name: address.last_name || "",
          company: address.company || "",
          phone: address.phone || "",
          address_line1: address.address_line1 || "",
          address_line2: address.address_line2 || "",
          district: address.district || "",
          city: address.city || "",
          state: address.state || "",
          postal_code: address.postal_code || "",
          country: address.country || "Türkiye",
          is_default: address.is_default || false,
        });
      } else {
        setError(data.error || "Adres bulunamadı");
      }
    } catch (err) {
      console.error("Adres yükleme hatası:", err);
      setError("Adres yüklenirken bir hata oluştu");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/addresses/${addressId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/profil/adreslerim");
      } else {
        setError(data.error || "Adres güncellenirken bir hata oluştu");
      }
    } catch (err) {
      console.error("Adres güncelleme hatası:", err);
      setError("Adres güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Başlık */}
        <div className="mb-8">
          <h1
            className={cn([
              poppins.className,
              "text-3xl lg:text-4xl font-bold mb-2",
            ])}
          >
            Adres Düzenle
          </h1>
          <Link
            href="/profil/adreslerim"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Adreslerime Dön
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Adres Başlığı */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Adres Başlığı (Opsiyonel)
            </label>
            <InputGroup className="bg-[#F0F0F0] rounded-full">
              <InputGroup.Input
                name="title"
                type="text"
                placeholder="Örn: Ev, İş, Anne Evi"
                value={formData.title}
                onChange={handleChange}
                className="bg-transparent placeholder:text-black/40"
              />
            </InputGroup>
          </div>

          {/* Adres Tipi */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Adres Tipi <span className="text-red-500">*</span>
            </label>
            <select
              name="address_type"
              value={formData.address_type}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#F0F0F0] rounded-full border-none focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="shipping">Teslimat Adresi</option>
              <option value="billing">Fatura Adresi</option>
              <option value="both">Her İkisi</option>
            </select>
          </div>

          {/* Ad Soyad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Ad <span className="text-red-500">*</span>
              </label>
              <InputGroup className="bg-[#F0F0F0] rounded-full">
                <InputGroup.Input
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="bg-transparent placeholder:text-black/40"
                />
              </InputGroup>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Soyad <span className="text-red-500">*</span>
              </label>
              <InputGroup className="bg-[#F0F0F0] rounded-full">
                <InputGroup.Input
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="bg-transparent placeholder:text-black/40"
                />
              </InputGroup>
            </div>
          </div>

          {/* Şirket */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Şirket (Opsiyonel)
            </label>
            <InputGroup className="bg-[#F0F0F0] rounded-full">
              <InputGroup.Input
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className="bg-transparent placeholder:text-black/40"
              />
            </InputGroup>
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Telefon <span className="text-red-500">*</span>
            </label>
            <InputGroup className="bg-[#F0F0F0] rounded-full">
              <InputGroup.Input
                name="phone"
                type="tel"
                required
                placeholder="05XX XXX XX XX"
                value={formData.phone}
                onChange={handleChange}
                className="bg-transparent placeholder:text-black/40"
              />
            </InputGroup>
          </div>

          {/* Adres Satırı 1 */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Adres Satırı 1 <span className="text-red-500">*</span>
            </label>
            <InputGroup className="bg-[#F0F0F0] rounded-full">
              <InputGroup.Input
                name="address_line1"
                type="text"
                required
                placeholder="Mahalle, Sokak, Bina No"
                value={formData.address_line1}
                onChange={handleChange}
                className="bg-transparent placeholder:text-black/40"
              />
            </InputGroup>
          </div>

          {/* Adres Satırı 2 */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Adres Satırı 2 (Opsiyonel)
            </label>
            <InputGroup className="bg-[#F0F0F0] rounded-full">
              <InputGroup.Input
                name="address_line2"
                type="text"
                placeholder="Daire, Kat, vb."
                value={formData.address_line2}
                onChange={handleChange}
                className="bg-transparent placeholder:text-black/40"
              />
            </InputGroup>
          </div>

          {/* İlçe, Şehir */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                İlçe (Opsiyonel)
              </label>
              <InputGroup className="bg-[#F0F0F0] rounded-full">
                <InputGroup.Input
                  name="district"
                  type="text"
                  value={formData.district}
                  onChange={handleChange}
                  className="bg-transparent placeholder:text-black/40"
                />
              </InputGroup>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Şehir <span className="text-red-500">*</span>
              </label>
              <InputGroup className="bg-[#F0F0F0] rounded-full">
                <InputGroup.Input
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="bg-transparent placeholder:text-black/40"
                />
              </InputGroup>
            </div>
          </div>

          {/* Eyalet, Posta Kodu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Eyalet/Bölge (Opsiyonel)
              </label>
              <InputGroup className="bg-[#F0F0F0] rounded-full">
                <InputGroup.Input
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  className="bg-transparent placeholder:text-black/40"
                />
              </InputGroup>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Posta Kodu <span className="text-red-500">*</span>
              </label>
              <InputGroup className="bg-[#F0F0F0] rounded-full">
                <InputGroup.Input
                  name="postal_code"
                  type="text"
                  required
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="bg-transparent placeholder:text-black/40"
                />
              </InputGroup>
            </div>
          </div>

          {/* Ülke */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Ülke <span className="text-red-500">*</span>
            </label>
            <InputGroup className="bg-[#F0F0F0] rounded-full">
              <InputGroup.Input
                name="country"
                type="text"
                required
                value={formData.country}
                onChange={handleChange}
                className="bg-transparent placeholder:text-black/40"
              />
            </InputGroup>
          </div>

          {/* Varsayılan Adres */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_default"
              name="is_default"
              checked={formData.is_default}
              onChange={handleChange}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
              Bu adresi varsayılan adres olarak kaydet
            </label>
          </div>

          {/* Butonlar */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white hover:bg-gray-800"
            >
              {loading ? "Güncelleniyor..." : "Adresi Güncelle"}
            </Button>
            <Link href="/profil/adreslerim">
              <Button type="button" variant="outline">
                İptal
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

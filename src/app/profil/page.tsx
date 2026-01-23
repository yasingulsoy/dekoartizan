"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { poppins } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { API_URL } from "@/lib/api";
import toast from "react-hot-toast";
import { Package, MapPin, ShoppingCart, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { customer, isAuthenticated, isLoading, logout, refreshCustomer, token } = useAuth();
  const router = useRouter();
  
  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Profile form data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    birth_date: "",
    gender: "",
  });
  
  // Password form data
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  
  // Email form data
  const [emailData, setEmailData] = useState({
    new_email: "",
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (customer) {
      setFormData({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        phone: customer.phone || "",
        birth_date: customer.birth_date ? new Date(customer.birth_date).toISOString().split('T')[0] : "",
        gender: customer.gender || "",
      });
    }
  }, [customer]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center mb-6">
                  <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-40 mx-auto" />
                </div>
                <div className="space-y-2 border-t pt-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !customer) {
    return null;
  }

  const fullName = [customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Kullanıcı";

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/customers/${customer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Profil başarıyla güncellendi");
        setIsEditing(false);
        // Customer bilgilerini güncelle (refreshCustomer içinde formData da güncellenecek)
        await refreshCustomer();
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((err: any) => {
            toast.error(err.msg || err.error || "Geçersiz veri");
          });
        } else {
          toast.error(data.error || "Profil güncellenirken bir hata oluştu");
        }
      }
    } catch (error: any) {
      console.error("Profil güncelleme hatası:", error);
      if (error.response) {
        const data = await error.response.json();
        toast.error(data.error || "Profil güncellenirken bir hata oluştu");
      } else {
        toast.error("Profil güncellenirken bir hata oluştu");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/customers/${customer.id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
          confirm_password: passwordData.confirm_password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Şifre başarıyla değiştirildi");
        setIsPasswordDialogOpen(false);
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((err: any) => {
            toast.error(err.msg || err.error);
          });
        } else {
          toast.error(data.error || "Şifre değiştirilirken bir hata oluştu");
        }
      }
    } catch (error: any) {
      console.error("Şifre değiştirme hatası:", error);
      if (error.response) {
        try {
          const data = await error.response.json();
          toast.error(data.error || "Şifre değiştirilirken bir hata oluştu");
        } catch {
          toast.error("Şifre değiştirilirken bir hata oluştu");
        }
      } else {
        toast.error("Şifre değiştirilirken bir hata oluştu");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/customers/${customer.id}/email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("E-posta değiştirildi. Lütfen yeni e-posta adresinize gönderilen doğrulama linkine tıklayın.");
        setIsEmailDialogOpen(false);
        setEmailData({ new_email: "" });
        await refreshCustomer();
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((err: any) => {
            toast.error(err.msg || err.error);
          });
        } else {
          toast.error(data.error || "E-posta değiştirilirken bir hata oluştu");
        }
      }
    } catch (error: any) {
      console.error("E-posta değiştirme hatası:", error);
      if (error.response) {
        try {
          const data = await error.response.json();
          toast.error(data.error || "E-posta değiştirilirken bir hata oluştu");
        } catch {
          toast.error("E-posta değiştirilirken bir hata oluştu");
        }
      } else {
        toast.error("E-posta değiştirilirken bir hata oluştu");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await fetch(`${API_URL}/api/customers/${customer.id}/resend-email-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Doğrulama e-postası tekrar gönderildi");
      } else {
        toast.error(data.error || "E-posta gönderilirken bir hata oluştu");
      }
    } catch (error: any) {
      console.error("E-posta gönderme hatası:", error);
      toast.error("E-posta gönderilirken bir hata oluştu");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Başlık */}
        <div className="mb-8">
          <h1
            className={cn([
              poppins.className,
              "text-3xl lg:text-4xl font-bold mb-2",
            ])}
          >
            Profilim
          </h1>
          <p className="text-gray-600">Hesap bilgilerinizi görüntüleyin ve yönetin</p>
        </div>

        {/* E-posta Doğrulama Uyarısı */}
        {!customer.is_email_verified && customer.auth_provider === "email" && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  E-posta Adresiniz Doğrulanmadı
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    E-posta adresinizi doğrulamak için gönderdiğimiz e-postayı kontrol edin.
                    E-postayı almadıysanız tekrar gönderebilirsiniz.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleResendVerification}
                    className="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                  >
                    Doğrulama E-postasını Tekrar Gönder →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Taraf - Profil Kartı */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden flex items-center justify-center">
                  {customer.avatar_url ? (
                    <Image
                      src={customer.avatar_url}
                      alt={fullName}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-bold">
                      {fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-1">{fullName}</h2>
                <p className="text-gray-500 text-sm">{customer.email}</p>
                {customer.is_email_verified && (
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    ✓ E-posta Doğrulandı
                  </span>
                )}
              </div>

              {/* Hızlı Linkler */}
              <div className="space-y-2 border-t pt-4">
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <Package className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  <span>Siparişlerim</span>
                </Link>
                <Link
                  href="/profil/adreslerim"
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <MapPin className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  <span>Adreslerim</span>
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  <span>Sepetim</span>
                </Link>
                <button
                  onClick={logout}
                  className="w-full mt-4 flex items-center gap-3 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Detaylar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Kişisel Bilgiler */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Kişisel Bilgiler</h3>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Düzenle
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ad
                      </label>
                      <Input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) =>
                          setFormData({ ...formData, first_name: e.target.value })
                        }
                        placeholder="Adınız"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Soyad
                      </label>
                      <Input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) =>
                          setFormData({ ...formData, last_name: e.target.value })
                        }
                        placeholder="Soyadınız"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Telefon numaranız"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Doğum Tarihi
                      </label>
                      <Input
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) =>
                          setFormData({ ...formData, birth_date: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cinsiyet
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                      >
                        <option value="">Seçiniz</option>
                        <option value="male">Erkek</option>
                        <option value="female">Kadın</option>
                        <option value="other">Diğer</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <LoadingButton 
                      type="submit" 
                      loading={isSubmitting}
                      loadingText="Kaydediliyor..."
                      className="w-full sm:w-auto"
                    >
                      Kaydet
                    </LoadingButton>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        setIsEditing(false);
                        if (customer) {
                          setFormData({
                            first_name: customer.first_name || "",
                            last_name: customer.last_name || "",
                            phone: customer.phone || "",
                            birth_date: customer.birth_date ? new Date(customer.birth_date).toISOString().split('T')[0] : "",
                            gender: customer.gender || "",
                          });
                        }
                      }}
                    >
                      İptal
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ad
                    </label>
                    <p className="text-gray-900">{customer.first_name || "-"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Soyad
                    </label>
                    <p className="text-gray-900">{customer.last_name || "-"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <p className="text-gray-900">{customer.phone || "-"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Doğum Tarihi
                    </label>
                    <p className="text-gray-900">
                      {customer.birth_date
                        ? new Date(customer.birth_date).toLocaleDateString("tr-TR")
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cinsiyet
                    </label>
                    <p className="text-gray-900">
                      {customer.gender === "male"
                        ? "Erkek"
                        : customer.gender === "female"
                        ? "Kadın"
                        : customer.gender === "other"
                        ? "Diğer"
                        : "-"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Hesap Bilgileri */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Hesap Bilgileri</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-gray-900 break-all">{customer.email}</p>
                    <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          Değiştir
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <form onSubmit={handleEmailChange}>
                          <DialogHeader>
                            <DialogTitle>E-posta Değiştir</DialogTitle>
                            <DialogDescription>
                              Yeni e-posta adresinizi girin. Doğrulama için yeni e-posta adresinize bir link gönderilecektir.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Yeni E-posta
                            </label>
                            <Input
                              type="email"
                              value={emailData.new_email}
                              onChange={(e) =>
                                setEmailData({ new_email: e.target.value })
                              }
                              placeholder="yeni@email.com"
                              required
                            />
                          </div>
                          <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full sm:w-auto"
                              onClick={() => setIsEmailDialogOpen(false)}
                            >
                              İptal
                            </Button>
                            <LoadingButton 
                              type="submit" 
                              loading={isSubmitting}
                              loadingText="Gönderiliyor..."
                              className="w-full sm:w-auto"
                            >
                              Değiştir
                            </LoadingButton>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giriş Yöntemi
                  </label>
                  <p className="text-gray-900">
                    {customer.auth_provider === "google" ? "Google" : "E-posta"}
                  </p>
                </div>
                {customer.auth_provider === "email" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Şifre
                    </label>
                    <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          Şifre Değiştir
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <form onSubmit={handlePasswordChange}>
                          <DialogHeader>
                            <DialogTitle>Şifre Değiştir</DialogTitle>
                            <DialogDescription>
                              Şifrenizi değiştirmek için mevcut şifrenizi girin.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4 space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mevcut Şifre
                              </label>
                              <Input
                                type="password"
                                value={passwordData.current_password}
                                onChange={(e) =>
                                  setPasswordData({
                                    ...passwordData,
                                    current_password: e.target.value,
                                  })
                                }
                                placeholder="Mevcut şifreniz"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Yeni Şifre
                              </label>
                              <Input
                                type="password"
                                value={passwordData.new_password}
                                onChange={(e) =>
                                  setPasswordData({
                                    ...passwordData,
                                    new_password: e.target.value,
                                  })
                                }
                                placeholder="Yeni şifreniz (min. 6 karakter)"
                                required
                                minLength={6}
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                En az bir büyük harf, bir küçük harf ve bir rakam içermelidir
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Yeni Şifre (Tekrar)
                              </label>
                              <Input
                                type="password"
                                value={passwordData.confirm_password}
                                onChange={(e) =>
                                  setPasswordData({
                                    ...passwordData,
                                    confirm_password: e.target.value,
                                  })
                                }
                                placeholder="Yeni şifrenizi tekrar girin"
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full sm:w-auto"
                              onClick={() => setIsPasswordDialogOpen(false)}
                            >
                              İptal
                            </Button>
                            <LoadingButton 
                              type="submit" 
                              loading={isSubmitting}
                              loadingText="Değiştiriliyor..."
                              className="w-full sm:w-auto"
                            >
                              Değiştir
                            </LoadingButton>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hesap Oluşturma Tarihi
                  </label>
                  <p className="text-gray-900">
                    {new Date(customer.created_at).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                {customer.last_login && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Son Giriş Tarihi
                    </label>
                    <p className="text-gray-900">
                      {new Date(customer.last_login).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

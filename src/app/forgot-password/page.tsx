"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import InputGroup from "@/components/ui/input-group";
import { integralCF } from "@/styles/fonts";
import { API_URL } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email) {
      setError("E-posta adresi gereklidir");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Geçerli bir e-posta adresi giriniz");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setError(null);
      } else {
        setError(data.error || "Bir hata oluştu. Lütfen tekrar deneyin.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Forgot password hatası:", error);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className={`${integralCF.className} text-3xl font-bold mb-2`}>
            Şifremi Unuttum
          </h1>
          <p className="text-gray-600">
            E-posta adresinizi girin, size şifre sıfırlama linki gönderelim
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                E-posta Gönderildi!
              </h2>
              <p className="text-gray-600 mb-6">
                Eğer bu e-posta adresine kayıtlı bir hesap varsa, şifre sıfırlama linki gönderildi.
                Lütfen e-postanızı kontrol edin (spam klasörünü de kontrol etmeyi unutmayın).
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/signin")}
                  className="w-full bg-black text-white hover:bg-black/90 rounded-full py-6"
                >
                  Giriş Sayfasına Dön
                </Button>
                <Button
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                  variant="outline"
                  className="w-full rounded-full py-6"
                >
                  Başka Bir E-posta Dene
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  E-posta Adresi
                </label>
                <InputGroup className="bg-[#F0F0F0] rounded-full">
                  <InputGroup.Input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    required
                    className="bg-transparent placeholder:text-black/40"
                  />
                </InputGroup>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white hover:bg-black/90 rounded-full py-6 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {isSubmitting ? "Gönderiliyor..." : "Şifre Sıfırlama Linki Gönder"}
                </Button>
              </div>

              <div className="text-center">
                <Link
                  href="/signin"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  ← Giriş sayfasına dön
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

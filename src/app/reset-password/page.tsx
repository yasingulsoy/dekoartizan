"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InputGroup from "@/components/ui/input-group";
import Image from "next/image";
import { poppins } from "@/styles/fonts";
import { API_URL } from "@/lib/api";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "valid" | "invalid" | "success" | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const errorParam = searchParams.get("error");
    const validParam = searchParams.get("valid");

    if (errorParam) {
      setStatus("invalid");
      switch (errorParam) {
        case "no_token":
          setError("Şifre sıfırlama linki bulunamadı.");
          break;
        case "invalid_token":
          setError("Geçersiz veya süresi dolmuş şifre sıfırlama linki.");
          break;
        case "check_failed":
          setError("Link kontrol edilirken bir hata oluştu.");
          break;
        default:
          setError("Bir hata oluştu.");
      }
      return;
    }

    if (validParam === "true" && tokenParam) {
      setToken(tokenParam);
      setStatus("valid");
      return;
    }

    if (tokenParam) {
      setToken(tokenParam);
      checkToken(tokenParam);
    } else {
      setStatus("invalid");
      setError("Şifre sıfırlama linki bulunamadı.");
    }
  }, [searchParams]);

  const checkToken = async (tokenToCheck: string) => {
    try {
      setStatus("loading");
      const response = await fetch(`${API_URL}/api/auth/reset-password?token=${tokenToCheck}`, {
        method: "GET",
      });

      if (response.ok) {
        setStatus("valid");
      } else {
        setStatus("invalid");
        setError("Geçersiz veya süresi dolmuş şifre sıfırlama linki.");
      }
    } catch (error) {
      console.error("Token check error:", error);
      setStatus("invalid");
      setError("Link kontrol edilirken bir hata oluştu.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError("Lütfen tüm alanları doldurun");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    if (!token) {
      setError("Geçersiz token");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
      } else {
        setError(data.error || "Şifre sıfırlanırken bir hata oluştu.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Şifre sıfırlanırken bir hata oluştu.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className={`${poppins.className} text-3xl font-bold mb-2`}>
            Şifre Sıfırlama
          </h1>
          <p className="text-gray-600">
            Yeni şifrenizi belirleyin
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {status === "loading" && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Link kontrol ediliyor...</p>
            </div>
          )}

          {status === "invalid" && (
            <div className="text-center py-8">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Geçersiz Link
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/forgot-password")}
                  className="w-full bg-black text-white hover:bg-black/90 rounded-full py-6"
                >
                  Yeni Şifre Sıfırlama Linki İste
                </Button>
                <Button
                  onClick={() => router.push("/signin")}
                  variant="outline"
                  className="w-full rounded-full py-6"
                >
                  Giriş Sayfasına Dön
                </Button>
              </div>
            </div>
          )}

          {status === "success" && (
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
                Şifre Başarıyla Sıfırlandı!
              </h2>
              <p className="text-gray-600 mb-6">
                Yeni şifrenizle giriş yapabilirsiniz.
              </p>
              <Button
                onClick={() => router.push("/signin")}
                className="w-full bg-black text-white hover:bg-black/90 rounded-full py-6"
              >
                Giriş Yap
              </Button>
            </div>
          )}

          {status === "valid" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Yeni Şifre
                </label>
                <InputGroup className="bg-[#F0F0F0] rounded-full">
                  <InputGroup.Text>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </InputGroup.Text>
                  <InputGroup.Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    required
                    className="bg-transparent placeholder:text-black/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="mr-4 p-1 text-black/40 hover:text-black/60 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </InputGroup>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Yeni Şifre Tekrar
                </label>
                <InputGroup className="bg-[#F0F0F0] rounded-full">
                  <InputGroup.Text>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </InputGroup.Text>
                  <InputGroup.Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    placeholder="Şifrenizi tekrar girin"
                    required
                    className="bg-transparent placeholder:text-black/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="mr-4 p-1 text-black/40 hover:text-black/60 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </InputGroup>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white hover:bg-black/90 rounded-full py-6 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {isSubmitting ? "Sıfırlanıyor..." : "Şifreyi Sıfırla"}
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

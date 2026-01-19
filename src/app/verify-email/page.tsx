"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { integralCF } from "@/styles/fonts";
import { API_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { customer, refreshCustomer } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "already_verified" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    const success = searchParams.get("success");
    const message = searchParams.get("message");

    if (message === "check_email") {
      setStatus("success");
      return;
    }

    if (success === "true") {
      setStatus("success");
      return;
    }

    if (error) {
      setStatus("error");
      switch (error) {
        case "no_token":
          setErrorMessage("Doğrulama linki bulunamadı.");
          break;
        case "invalid_token":
          setErrorMessage("Geçersiz veya süresi dolmuş doğrulama linki.");
          break;
        case "already_verified":
          setStatus("already_verified");
          break;
        case "verification_failed":
          setErrorMessage("E-posta doğrulama sırasında bir hata oluştu.");
          break;
        default:
          setErrorMessage("Bir hata oluştu.");
      }
      return;
    }

    if (token && !success && !error) {
      verifyEmail(token);
    } else if (!token && !success && !error) {
      setStatus("error");
      setErrorMessage("Doğrulama linki bulunamadı.");
    }
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      setStatus("loading");
      const response = await fetch(`${API_URL}/api/auth/verify-email?token=${token}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        if (data.already_verified) {
          setStatus("already_verified");
        } else {
          setStatus("success");
          if (customer) {
            await refreshCustomer();
          }
        }
      } else {
        setStatus("error");
        setErrorMessage(data.error || "E-posta doğrulama başarısız.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
      setErrorMessage("E-posta doğrulama sırasında bir hata oluştu.");
    }
  };

  const handleResend = async () => {
    if (!customer?.email) {
      setErrorMessage("E-posta adresi bulunamadı. Lütfen giriş yapın.");
      return;
    }

    try {
      setIsResending(true);
      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: customer.email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setErrorMessage("");
        alert("Doğrulama e-postası tekrar gönderildi. Lütfen e-postanızı kontrol edin.");
      } else {
        setErrorMessage(data.error || "E-posta gönderilemedi.");
      }
    } catch (error) {
      console.error("Resend error:", error);
      setErrorMessage("E-posta gönderilirken bir hata oluştu.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className={`${integralCF.className} text-3xl font-bold mb-2`}>
            E-posta Doğrulama
          </h1>
        </div>

        {status === "loading" && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">E-posta doğrulanıyor...</p>
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
              {searchParams.get("message") === "check_email" 
                ? "Kayıt Başarılı!" 
                : "E-posta Doğrulandı!"}
            </h2>
            <p className="text-gray-600 mb-6">
              {searchParams.get("message") === "check_email" 
                ? "Kayıt işleminiz tamamlandı. E-posta adresinizi doğrulamak için gönderdiğimiz e-postayı kontrol edin. E-postadaki linke tıklayarak hesabınızı aktif edebilirsiniz."
                : "E-posta adresiniz başarıyla doğrulandı. Artık tüm özellikleri kullanabilirsiniz."}
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/")}
                className="w-full bg-black text-white hover:bg-black/90 rounded-full py-6"
              >
                Ana Sayfaya Dön
              </Button>
              {customer && (
                <Button
                  onClick={() => router.push("/profil")}
                  variant="outline"
                  className="w-full rounded-full py-6"
                >
                  Profilime Git
                </Button>
              )}
            </div>
          </div>
        )}

        {status === "already_verified" && (
          <div className="text-center py-8">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              E-posta Zaten Doğrulanmış
            </h2>
            <p className="text-gray-600 mb-6">
              Bu e-posta adresi zaten doğrulanmış. Giriş yapabilirsiniz.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/signin")}
                className="w-full bg-black text-white hover:bg-black/90 rounded-full py-6"
              >
                Giriş Yap
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full rounded-full py-6"
              >
                Ana Sayfaya Dön
              </Button>
            </div>
          </div>
        )}

        {status === "error" && (
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
              Doğrulama Başarısız
            </h2>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <div className="space-y-3">
              {customer && !customer.is_email_verified && (
                <Button
                  onClick={handleResend}
                  disabled={isResending}
                  className="w-full bg-black text-white hover:bg-black/90 rounded-full py-6 disabled:opacity-50"
                >
                  {isResending ? "Gönderiliyor..." : "Doğrulama E-postasını Tekrar Gönder"}
                </Button>
              )}
              <Button
                onClick={() => router.push("/signin")}
                variant="outline"
                className="w-full rounded-full py-6"
              >
                Giriş Sayfasına Dön
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full rounded-full py-6"
              >
                Ana Sayfaya Dön
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

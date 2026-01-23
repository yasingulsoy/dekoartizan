"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import InputGroup from "@/components/ui/input-group";
import { poppins } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { API_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Google OAuth callback kontrolü
  useEffect(() => {
    const token = searchParams?.get("token");
    const success = searchParams?.get("success");
    const error = searchParams?.get("error");

    if (token && success === "true") {
      // Token'ı AuthContext'e kaydet
      login(token).then(() => {
        setLoginSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      });
    } else if (error) {
      // Hata mesajını göster
      toast.error("Giriş hatası oluştu");
    }
  }, [searchParams, router, login]);

  // Zaten giriş yapılmışsa ana sayfaya yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasyon
    if (!email || !password) {
      toast.error("Lütfen e-posta ve şifre giriniz");
      return;
    }

    try {
      setIsGoogleLoading(true);
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Token'ı AuthContext'e kaydet
        await login(data.token);
        setLoginSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        toast.error(data.error || "Giriş başarısız. Lütfen tekrar deneyin.");
        setIsGoogleLoading(false);
      }
    } catch (error) {
      console.error("Login hatası:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const response = await fetch(`${API_URL}/api/auth/google`);
      const data = await response.json();
      
      if (data.success && data.authUrl) {
        // Google OAuth sayfasına yönlendir
        window.location.href = data.authUrl;
      } else {
        toast.error("Google ile giriş başlatılamadı. Lütfen tekrar deneyin.");
        setIsGoogleLoading(false);
      }
    } catch (error) {
      console.error("Google Sign-In hatası:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      setIsGoogleLoading(false);
    }
  };

  if (loginSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Giriş Başarılı!</h2>
            <p className="text-gray-600">Ana sayfaya yönlendiriliyorsunuz...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo ve Başlık */}
        <div className="text-center">
          <Link
            href="/"
            className={cn([
              poppins.className,
              "text-3xl lg:text-4xl mb-2 inline-block",
            ])}
          >
            DEKOARTİZAN
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-foreground">
            Hesabınıza Giriş Yapın
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Hesabınız yok mu?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:text-primary/80"
            >
              Kayıt olun
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                E-posta Adresi
              </label>
              <InputGroup className="bg-[#F0F0F0] rounded-full">
                <InputGroup.Text>
                  <Image
                    priority
                    src="/icons/envelope.svg"
                    height={20}
                    width={20}
                    alt="email"
                    className="min-w-5 min-h-5"
                  />
                </InputGroup.Text>
                <InputGroup.Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent placeholder:text-black/40"
                />
              </InputGroup>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                şifre
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
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="şifrenizi girin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent placeholder:text-black/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mr-4 p-1 text-black/40 hover:text-black/60 transition-colors"
                >
                  {showPassword ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </InputGroup>
            </div>
          </div>

          {/* şifremi Unuttum */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-foreground"
              >
                Beni hatırla
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-primary hover:text-primary/80"
              >
                şifremi unuttum
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              disabled={isGoogleLoading}
              className="w-full bg-black text-white hover:bg-black/90 rounded-full py-6 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {isGoogleLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted-foreground">
                veya
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full rounded-full py-6 border-black/20 hover:bg-[#F0F0F0] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {isGoogleLoading ? "Yönlendiriliyor..." : "Google"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

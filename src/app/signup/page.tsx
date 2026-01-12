"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InputGroup from "@/components/ui/input-group";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Signup işlemi burada yapılacak
    console.log("Signup:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo ve Başlık */}
        <div className="text-center">
          <Link
            href="/"
            className={cn([
              integralCF.className,
              "text-3xl lg:text-4xl mb-2 inline-block",
            ])}
          >
            dekoartizan
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-foreground">
            Hesap Oluşturun
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Zaten hesabınız var mı?{" "}
            <Link
              href="/signin"
              className="font-medium text-primary hover:text-primary/80"
            >
              Giriş yapın
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Isim ve Soyisim */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Ad
                </label>
                <InputGroup className="bg-[#F0F0F0] rounded-full">
                  <InputGroup.Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    placeholder="Adınız"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-transparent placeholder:text-black/40"
                  />
                </InputGroup>
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Soyad
                </label>
                <InputGroup className="bg-[#F0F0F0] rounded-full">
                  <InputGroup.Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    placeholder="Soyadınız"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-transparent placeholder:text-black/40"
                  />
                </InputGroup>
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
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
                  autoComplete="new-password"
                  required
                  placeholder="şifrenizi girin"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground mb-2"
              >
                şifre Tekrar
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
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="şifrenizi tekrar girin"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-transparent placeholder:text-black/40"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="mr-4 p-1 text-black/40 hover:text-black/60 transition-colors"
                >
                  {showConfirmPassword ? (
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

          {/* Kullanım şartları */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agree-terms" className="text-foreground">
                <Link
                  href="/terms"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Kullanım şartlarını
                </Link>{" "}
                ve{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  gizlilik politikasını
                </Link>{" "}
                kabul ediyorum
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-black/90 rounded-full py-6 text-base font-medium"
              size="lg"
            >
              Kayıt Ol
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

          {/* Social Signup Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full py-6 border-black/20 hover:bg-[#F0F0F0] flex items-center justify-center"
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
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full py-6 border-black/20 hover:bg-[#F0F0F0] flex items-center justify-center"
            >
              <Image
                src="/icons/facebook.svg"
                height={20}
                width={20}
                alt="Facebook"
                className="mr-2"
              />
              Facebook
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

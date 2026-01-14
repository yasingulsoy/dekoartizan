import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş Yap - dekoartizan Admin",
  description: "dekoartizan Admin Paneline Giriş Yapın",
};

export default function SignIn() {
  return <SignInForm />;
}

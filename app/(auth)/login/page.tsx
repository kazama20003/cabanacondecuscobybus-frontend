import type { Metadata } from "next";
import AuthForm from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Iniciar sesión — Inca Travel Peru",
  description: "Ingresa a tu cuenta de Inca Travel Peru para gestionar tus reservas de transporte, tours y traslados.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}

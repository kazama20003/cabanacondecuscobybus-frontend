import type { Metadata } from "next";
import AuthForm from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Crear cuenta — Inca Travel Peru",
  description: "Crea tu cuenta de Inca Travel Peru para reservar transporte, tours y traslados más rápido.",
};

export default function RegistroPage() {
  return <AuthForm mode="register" />;
}

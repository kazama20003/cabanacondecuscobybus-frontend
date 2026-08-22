import type { Metadata } from "next";
import ContactoContenido from "./contenido";

export const metadata: Metadata = {
  title: "Contacto — Inca Travel Peru",
  description:
    "Reserva tu transporte, tour o traslado con Inca Travel Peru. Atención por WhatsApp, teléfono y correo desde Cusco, Perú.",
};

export default function ContactoPage() {
  return <ContactoContenido />;
}

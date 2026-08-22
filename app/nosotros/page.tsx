import type { Metadata } from "next";
import NosotrosContenido from "./contenido";

export const metadata: Metadata = {
  title: "Nosotros — Inca Travel Peru",
  description:
    "Inca Travel Peru es una agencia de turismo del sur del Perú especializada en transporte turístico, tours y traslados entre Cusco, Arequipa, Colca y Puno.",
};

export default function NosotrosPage() {
  return <NosotrosContenido />;
}

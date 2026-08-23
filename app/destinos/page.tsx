import type { Metadata } from "next";
import DestinosContenido from "./contenido";

export const metadata: Metadata = {
  title: "Destinos — Inca Travel Peru",
  description:
    "Descubre los destinos del sur del Perú: Cusco, Machu Picchu, Valle Sagrado, Arequipa, Valle del Colca y Lago Titicaca.",
};

export default function DestinosPage() {
  return <DestinosContenido />;
}

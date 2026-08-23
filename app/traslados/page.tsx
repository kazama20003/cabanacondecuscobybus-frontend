import type { Metadata } from "next";
import TrasladosContenido from "./contenido";

export const metadata: Metadata = {
  title: "Traslados Privados — Inca Travel Peru",
  description:
    "Traslados privados en Cusco y Arequipa: aeropuerto, hoteles, estaciones de tren y Valle Sagrado. Servicio 24/7 con conductores profesionales.",
};

export default function TrasladosPage() {
  return <TrasladosContenido />;
}

import ToursContenido from "./contenido";
import { obtenerJson } from "@/lib/seo";
import type { Paginado, TourApi } from "@/lib/api/tipos";

export default async function ToursPage() {
  const inicial = await obtenerJson<Paginado<TourApi>>("/tours?esEvento=false");
  return <ToursContenido initialData={inicial ?? undefined} />;
}

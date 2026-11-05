import EventosContenido from "./contenido";
import { obtenerJson } from "@/lib/seo";
import type { Paginado, TourApi } from "@/lib/api/tipos";

export default async function EventosPage() {
  const inicial = await obtenerJson<Paginado<TourApi>>("/eventos");
  return <EventosContenido initialData={inicial ?? undefined} />;
}

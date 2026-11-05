import TransporteContenido from "./contenido";
import { obtenerJson } from "@/lib/seo";
import type { Paginado, TransporteApi } from "@/lib/api/tipos";

export default async function TransportePage() {
  const inicial = await obtenerJson<Paginado<TransporteApi>>("/transportes");
  return <TransporteContenido initialData={inicial ?? undefined} />;
}

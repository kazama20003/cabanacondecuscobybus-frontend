/** Utilidades de SEO compartidas por páginas server-side y el sitemap. */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.incatravelperu.com";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface TraduccionSeo {
  idioma: string;
  titulo: string;
  resumen: string;
  descripcion: string;
}

export interface TransporteSeo {
  slug: string;
  origenNombre: string;
  destinoNombre: string;
  duracionMinutosEstimada?: number;
  traducciones?: TraduccionSeo[];
  imagenes?: { url: string }[];
}

export interface TourSeo {
  slug: string;
  destinoNombre: string;
  duracionMinutos?: number;
  traducciones?: TraduccionSeo[];
  imagenes?: { url: string }[];
}

/** Fetch server-side tolerante a fallos: nunca rompe el render por metadata. */
export async function obtenerJson<T>(ruta: string): Promise<T | null> {
  try {
    const respuesta = await fetch(`${API_URL}${ruta}`, {
      next: { revalidate: 3600 },
    });
    if (!respuesta.ok) return null;
    return (await respuesta.json()) as T;
  } catch {
    return null;
  }
}

export function tituloTransporte(t: TransporteSeo): string {
  return (
    t.traducciones?.[0]?.titulo ||
    `Transporte de ${t.origenNombre} a ${t.destinoNombre}`
  );
}

export function tituloTour(t: TourSeo): string {
  return t.traducciones?.[0]?.titulo || `Tour ${t.destinoNombre}`;
}

export function recortar(texto: string | undefined, max = 160): string | undefined {
  if (!texto) return undefined;
  const limpio = texto.replace(/\s+/g, " ").trim();
  return limpio.length <= max ? limpio : `${limpio.slice(0, max - 1).trimEnd()}…`;
}

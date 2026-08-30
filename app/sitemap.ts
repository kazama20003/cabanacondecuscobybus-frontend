import type { MetadataRoute } from "next";
import { obtenerJson, SITE_URL } from "@/lib/seo";

interface ItemSlug {
  slug: string;
  actualizadoEn?: string;
}
interface Paginado {
  datos: ItemSlug[];
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [transportes, tours] = await Promise.all([
    obtenerJson<Paginado>("/transportes?porPagina=100"),
    obtenerJson<Paginado>("/tours?porPagina=100"),
  ]);

  const estaticas: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/transporte`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/tours`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/destinos`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/nosotros`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/contacto`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const deTransportes: MetadataRoute.Sitemap = (transportes?.datos ?? []).map(
    (t) => ({
      url: `${SITE_URL}/transporte/${t.slug}`,
      lastModified: t.actualizadoEn ? new Date(t.actualizadoEn) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const deTours: MetadataRoute.Sitemap = (tours?.datos ?? []).map((t) => ({
    url: `${SITE_URL}/tours/${t.slug}`,
    lastModified: t.actualizadoEn ? new Date(t.actualizadoEn) : undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...estaticas, ...deTransportes, ...deTours];
}

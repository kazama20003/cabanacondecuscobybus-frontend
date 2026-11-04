import type { MetadataRoute } from "next";
import { obtenerJson, SITE_URL } from "@/lib/seo";
import { localizedPath, SUPPORTED_LANGUAGES } from "@/lib/language";

interface ItemSlug {
  slug: string;
  actualizadoEn?: string;
  traducciones?: { idioma: string }[];
}
interface Paginado {
  datos: ItemSlug[];
  totalPaginas: number;
}

export const revalidate = 3600;

function url(path: string, language: (typeof SUPPORTED_LANGUAGES)[number]) {
  return `${SITE_URL}${localizedPath(path, language)}`;
}

function refs(path: string, languages: readonly string[]) {
  const published = new Set(languages.filter((language): language is (typeof SUPPORTED_LANGUAGES)[number] => SUPPORTED_LANGUAGES.includes(language as (typeof SUPPORTED_LANGUAGES)[number])));
  published.add("es");
  return {
    languages: {
      ...Object.fromEntries([...published].map((language) => [language, url(path, language)])),
      "x-default": url(path, "es"),
    },
  };
}

async function catalogoCompleto(endpoint: string): Promise<ItemSlug[]> {
  const primero = await obtenerJson<Paginado>(`${endpoint}?pagina=1&porPagina=100`);
  if (!primero) return [];
  const items = [...primero.datos];
  for (let pagina = 2; pagina <= Math.min(primero.totalPaginas ?? 1, 100); pagina += 1) {
    const siguiente = await obtenerJson<Paginado>(`${endpoint}?pagina=${pagina}&porPagina=100`);
    if (!siguiente?.datos.length) break;
    items.push(...siguiente.datos);
  }
  return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [transportes, tours] = await Promise.all([
    catalogoCompleto("/transportes"),
    catalogoCompleto("/tours"),
  ]);
  const staticPaths = ["/", "/transporte", "/tours", "/eventos", "/destinos", "/nosotros", "/contacto"];
  const staticEntries: MetadataRoute.Sitemap = staticPaths.flatMap((path) =>
    SUPPORTED_LANGUAGES.map((language) => ({
      url: url(path, language),
      alternates: refs(path, SUPPORTED_LANGUAGES),
      changeFrequency: path === "/" ? "weekly" : path === "/transporte" || path === "/tours" || path === "/eventos" ? "daily" : "monthly",
      priority: path === "/" ? 1 : path === "/transporte" || path === "/tours" || path === "/eventos" ? 0.9 : 0.5,
    })),
  );

  const productEntries = (kind: "transporte" | "tours", products: ItemSlug[]): MetadataRoute.Sitemap =>
    products.flatMap((product) => {
      const path = `/${kind}/${product.slug}`;
      const languages = [...new Set(["es", ...(product.traducciones ?? []).map((item) => item.idioma)])];
      return languages.flatMap((language) => {
        if (!SUPPORTED_LANGUAGES.includes(language as (typeof SUPPORTED_LANGUAGES)[number])) return [];
        const locale = language as (typeof SUPPORTED_LANGUAGES)[number];
        return [{
          url: url(path, locale),
          lastModified: product.actualizadoEn ? new Date(product.actualizadoEn) : undefined,
          changeFrequency: "weekly" as const,
          priority: 0.8,
          alternates: refs(path, languages),
        }];
      });
    });

  return [...staticEntries, ...productEntries("transporte", transportes), ...productEntries("tours", tours)];
}

import type { Metadata } from "next";
import {
  obtenerJson,
  descripcionSeoConPrecio,
  recortar,
  languageAlternates,
  requestLanguage,
  tituloTransporte,
  traduccionEn,
  urlForPath,
  type TransporteSeo,
} from "@/lib/seo";
import TransporteContenido from "./contenido";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const idioma = await requestLanguage();
  const transporte = await obtenerJson<TransporteSeo>(`/transportes/${slug}?idioma=all`);
  if (!transporte) {
    return { title: "Transporte no encontrado", robots: { index: false, follow: false } };
  }
  const traduccion = traduccionEn(transporte.traducciones, idioma);
  const titulo = tituloTransporte(transporte, idioma);
  const descripcion =
    descripcionSeoConPrecio(
      traduccion?.resumen || traduccion?.descripcion || `Viaja de ${transporte.origenNombre} a ${transporte.destinoNombre} en transporte turístico. Consulta disponibilidad y reserva en línea con Inca Travel Peru.`,
      transporte.salidas,
      idioma,
    ) ?? "";
  const url = urlForPath(`/transporte/${slug}`, idioma);
  const idiomasDisponibles = transporte.traducciones?.map((item) => item.idioma) ?? ["es"];
  const imagen = transporte.imagenes?.[0]?.url;
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: url, languages: languageAlternates(`/transporte/${slug}`, idiomasDisponibles) },
    openGraph: {
      title: titulo,
      description: descripcion,
      url,
      type: "website",
      siteName: "Inca Travel Peru",
      ...(imagen ? { images: [{ url: imagen }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      ...(imagen ? { images: [imagen] } : {}),
    },
  };
}

export default async function TransportePage({ params }: Props) {
  const { slug } = await params;
  const idioma = await requestLanguage();
  const transporte = await obtenerJson<TransporteSeo>(`/transportes/${slug}?idioma=all`);
  const traduccion = transporte ? traduccionEn(transporte.traducciones, idioma) : undefined;

  const jsonLd = transporte
    ? {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name: tituloTransporte(transporte, idioma),
        description: recortar(
          traduccion?.resumen || traduccion?.descripcion,
          300,
        ),
        url: urlForPath(`/transporte/${slug}`, idioma),
        inLanguage: idioma,
        ...(transporte.imagenes?.length
          ? { image: transporte.imagenes.map((medio) => medio.url) }
          : {}),
        itinerary: {
          "@type": "ItemList",
          itemListElement: [
            {
              "@type": "City",
              name: transporte.origenNombre,
            },
            {
              "@type": "City",
              name: transporte.destinoNombre,
            },
          ],
        },
        provider: {
          "@type": "TravelAgency",
          name: "Inca Travel Peru",
          url: urlForPath("/", idioma),
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <TransporteContenido />
    </>
  );
}

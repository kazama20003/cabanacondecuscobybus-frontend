import type { Metadata } from "next";
import {
  obtenerJson,
  recortar,
  SITE_URL,
  tituloTransporte,
  type TransporteSeo,
} from "@/lib/seo";
import TransporteContenido from "./contenido";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const transporte = await obtenerJson<TransporteSeo>(`/transportes/${slug}`);
  if (!transporte) {
    return { title: "Transporte no encontrado — Inca Travel Peru" };
  }
  const titulo = tituloTransporte(transporte);
  const descripcion =
    recortar(
      transporte.traducciones?.[0]?.resumen ||
        transporte.traducciones?.[0]?.descripcion,
    ) ??
    `Viaja de ${transporte.origenNombre} a ${transporte.destinoNombre} en transporte turístico con paradas guiadas. Reserva en línea con Inca Travel Peru.`;
  const url = `${SITE_URL}/transporte/${slug}`;
  const imagen = transporte.imagenes?.[0]?.url;
  return {
    title: `${titulo} — Inca Travel Peru`,
    description: descripcion,
    alternates: { canonical: url },
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
  const transporte = await obtenerJson<TransporteSeo>(`/transportes/${slug}`);

  const jsonLd = transporte
    ? {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name: tituloTransporte(transporte),
        description: recortar(
          transporte.traducciones?.[0]?.resumen ||
            transporte.traducciones?.[0]?.descripcion,
          300,
        ),
        url: `${SITE_URL}/transporte/${slug}`,
        ...(transporte.imagenes?.[0]?.url
          ? { image: transporte.imagenes[0].url }
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
          url: SITE_URL,
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

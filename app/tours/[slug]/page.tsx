import type { Metadata } from "next";
import {
  obtenerJson,
  recortar,
  SITE_URL,
  tituloTour,
  type TourSeo,
} from "@/lib/seo";
import TourContenido from "./contenido";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await obtenerJson<TourSeo>(`/tours/${slug}`);
  if (!tour) {
    return { title: "Tour no encontrado — Inca Travel Peru" };
  }
  const titulo = tituloTour(tour);
  const descripcion =
    recortar(
      tour.traducciones?.[0]?.resumen || tour.traducciones?.[0]?.descripcion,
    ) ??
    `Tour a ${tour.destinoNombre} con guía profesional y salidas programadas. Reserva en línea con Inca Travel Peru.`;
  const url = `${SITE_URL}/tours/${slug}`;
  const imagen = tour.imagenes?.[0]?.url;
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

export default async function TourPage({ params }: Props) {
  const { slug } = await params;
  const tour = await obtenerJson<TourSeo>(`/tours/${slug}`);

  const jsonLd = tour
    ? {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name: tituloTour(tour),
        description: recortar(
          tour.traducciones?.[0]?.resumen ||
            tour.traducciones?.[0]?.descripcion,
          300,
        ),
        url: `${SITE_URL}/tours/${slug}`,
        ...(tour.imagenes?.[0]?.url ? { image: tour.imagenes[0].url } : {}),
        touristType: "Turismo cultural y de naturaleza",
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
      <TourContenido />
    </>
  );
}

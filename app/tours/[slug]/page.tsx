import type { Metadata } from "next";
import {
  obtenerJson,
  recortar,
  languageAlternates,
  requestLanguage,
  tituloTour,
  traduccionEn,
  urlForPath,
  type TourSeo,
} from "@/lib/seo";
import TourContenido from "./contenido";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const idioma = await requestLanguage();
  const tour = await obtenerJson<TourSeo>(`/tours/${slug}?idioma=all`);
  if (!tour) {
    return { title: "Tour no encontrado", robots: { index: false, follow: false } };
  }
  const traduccion = traduccionEn(tour.traducciones, idioma);
  const titulo = tituloTour(tour, idioma);
  const descripcion =
    recortar(
      traduccion?.resumen || traduccion?.descripcion,
    ) ??
    `Tour a ${tour.destinoNombre} con guía profesional y salidas programadas. Reserva en línea con Inca Travel Peru.`;
  const url = urlForPath(`/tours/${slug}`, idioma);
  const idiomasDisponibles = tour.traducciones?.map((item) => item.idioma) ?? ["es"];
  const imagen = tour.imagenes?.[0]?.url;
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: url, languages: languageAlternates(`/tours/${slug}`, idiomasDisponibles) },
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
  const idioma = await requestLanguage();
  const tour = await obtenerJson<TourSeo>(`/tours/${slug}?idioma=all`);
  const traduccion = tour ? traduccionEn(tour.traducciones, idioma) : undefined;

  const jsonLd = tour
    ? {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name: tituloTour(tour, idioma),
        description: recortar(
          traduccion?.resumen || traduccion?.descripcion,
          300,
        ),
        url: urlForPath(`/tours/${slug}`, idioma),
        inLanguage: idioma,
        ...(tour.imagenes?.[0]?.url ? { image: tour.imagenes[0].url } : {}),
        touristType: "Turismo cultural y de naturaleza",
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
      <TourContenido />
    </>
  );
}

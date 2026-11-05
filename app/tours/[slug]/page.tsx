import type { Metadata } from "next";
import type { Paginado, TourApi } from "@/lib/api/tipos";
import {
  obtenerJson,
  descripcionSeoConPrecio,
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
  const [tour, catalogo] = await Promise.all([
    obtenerJson<TourSeo>(`/tours/${encodeURIComponent(slug)}?idioma=all`),
    obtenerJson<Paginado<TourApi>>("/tours?pagina=1&porPagina=100"),
  ]);
  if (!tour) {
    return { title: "Tour no encontrado", robots: { index: false, follow: false } };
  }
  const traduccion = traduccionEn(tour.traducciones, idioma);
  const titulo = tituloTour(tour, idioma);
  const descripcion =
    descripcionSeoConPrecio(
      traduccion?.resumen || traduccion?.descripcion || `Tour a ${tour.destinoNombre ?? "un destino del sur del Perú"} con guía profesional y salidas programadas. Reserva en línea con Inca Travel Peru.`,
      catalogo?.datos.find((item) => item.slug === slug)?.salidas ?? tour.salidas,
      idioma,
    ) ?? "";
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
  const tour = await obtenerJson<TourApi>(`/tours/${encodeURIComponent(slug)}?idioma=${encodeURIComponent(idioma)}`);
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

  const inicioEvento = tour?.temporadaInicio ? new Date(tour.temporadaInicio) : null;
  const finEvento = tour?.temporadaFin ? new Date(tour.temporadaFin) : null;
  const fechaInicioValida = inicioEvento && Number.isFinite(inicioEvento.getTime());
  const fechaFinValida = finEvento && Number.isFinite(finEvento.getTime());
  const fechaFinPosterior = Boolean(fechaFinValida && fechaInicioValida && finEvento >= inicioEvento);
  const destino = tour?.destinoNombre?.trim();
  const lugarConfirmado = Boolean(destino && !["perú", "peru", "sur del perú", "sur del peru"].includes(destino.toLowerCase()));
  const latitud = tour?.destinoLatitud == null ? NaN : Number(tour.destinoLatitud);
  const longitud = tour?.destinoLongitud == null ? NaN : Number(tour.destinoLongitud);
  const coordenadasValidas = Number.isFinite(latitud) && latitud >= -90 && latitud <= 90
    && Number.isFinite(longitud) && longitud >= -180 && longitud <= 180;
  const eventoJsonLd = tour?.esEvento && fechaInicioValida && lugarConfirmado
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: tituloTour(tour, idioma),
        ...(recortar(traduccion?.resumen || traduccion?.descripcion, 300)
          ? { description: recortar(traduccion?.resumen || traduccion?.descripcion, 300) }
          : {}),
        startDate: inicioEvento.toISOString().slice(0, 10),
        ...(fechaFinPosterior ? { endDate: finEvento!.toISOString().slice(0, 10) } : {}),
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: destino,
          address: {
            "@type": "PostalAddress",
            addressLocality: destino,
            addressCountry: "PE",
          },
          ...(coordenadasValidas
            ? { geo: { "@type": "GeoCoordinates", latitude: latitud, longitude: longitud } }
            : {}),
        },
        ...(tour.imagenes?.length ? { image: tour.imagenes.map((medio) => medio.url) } : {}),
        url: urlForPath(`/tours/${slug}`, idioma),
        inLanguage: idioma,
      }
    : null;

  const serializeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      )}
      {eventoJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(eventoJsonLd) }}
        />
      )}
      <TourContenido initialData={tour ?? undefined} />
    </>
  );
}

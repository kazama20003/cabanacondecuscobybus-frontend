"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import IncluyeNoIncluye from "@/components/incluye-no-incluye";
import CondicionesServicio from "@/components/condiciones-servicio";
import AddToCart from "@/components/add-to-cart";
import { canalesReservaPara, CONTACT } from "@/lib/data";
import { useIdioma } from "@/components/lang-provider";
import { useT } from "@/lib/i18n";
import { useTour } from "@/hooks/use-catalogo";
import type { TourApi, TraduccionApi, ItinerarioApi } from "@/lib/api/tipos";
import { preciosDesdeSalidas } from "@/lib/precios";
import styles from "../tours.module.css";

function traduccionDe(item: TourApi | undefined): TraduccionApi | undefined {
  if (!item) return undefined;
  const arr = item.traducciones as TraduccionApi[] | undefined;
  return Array.isArray(arr) && arr.length > 0 ? arr[0] : undefined;
}

function formatearDuracion(minutos?: number): string | null {
  if (!minutos || minutos <= 0) return null;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return [h > 0 ? `${h}h` : null, m > 0 ? `${m}m` : null].filter(Boolean).join(" ") || null;
}

function formatoTiempoRelativo(minutos?: number | null): string | null {
  if (minutos == null || minutos < 0) return null;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return `Aprox. ${horas ? `${horas} h` : ""}${horas && resto ? " " : ""}${resto ? `${resto} min` : horas ? "" : "0 min"} desde la salida`;
}

export default function TourPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";
  const { idioma } = useIdioma();
  const t = useT();
  const { data: tour, isLoading, isError } = useTour(slug, idioma);

  if (isLoading) {
    return (
      <PageShell>
        <p style={{ margin: "60px 0", color: "var(--muted)", fontSize: 15 }}>{t("lista.cargando")}</p>
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell>
        <p style={{ margin: "60px 0", color: "var(--muted)", fontSize: 15 }}>
          {t("lista.errorTour")}
        </p>
      </PageShell>
    );
  }

  if (!tour) {
    notFound();
  }

  const tr = traduccionDe(tour);
  const destino = tour.destinoNombre as string | undefined;
  const heading = tr?.titulo || tour.nombre || destino || "Tour";
  const intro = tr?.resumen || tr?.descripcion || "";
  const dur = formatearDuracion(tour.duracionMinutos as number | undefined);
  const salidas = tour.salidas ?? [];
  const precio = preciosDesdeSalidas(salidas);
  const itinerarios = [...(tour.itinerarios ?? [])].sort((a: ItinerarioApi, b: ItinerarioApi) => a.orden - b.orden);
  const portada = tour.imagenes?.[0];
  const imagenesGaleria = (tour.imagenes ?? []).filter((medio) => medio.tipo !== "VIDEO");
  const esEvento = Boolean(tour.esEvento);
  const locale = idioma === "ja" ? "ja-JP" : idioma === "en" ? "en-US" : idioma === "pt" ? "pt-BR" : idioma === "fr" ? "fr-FR" : idioma === "it" ? "it-IT" : idioma === "ru" ? "ru-RU" : "es-PE";
  const fechaTemporada = (value?: string | null) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  };
  const inicioTemporada = fechaTemporada(tour.temporadaInicio);
  const finTemporada = fechaTemporada(tour.temporadaFin);
  const temporada = inicioTemporada && finTemporada
    ? `${inicioTemporada} – ${finTemporada}`
    : inicioTemporada || finTemporada;

  const fichas = [
    esEvento && temporada ? { label: t("eventos.temporada"), value: temporada } : null,
    dur ? { label: t("ficha.duracion"), value: dur } : null,
    destino ? { label: t("ficha.destino"), value: destino } : null,
    precio ? { label: t("ficha.precio"), value: `${t("common.desde")} S/ ${precio.pen} · US$ ${precio.usd} ${t("detalle.pp")}` } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <PageShell>
      <div className={styles.detailPage}>
      <nav className={styles.breadcrumb}>
        <Link href="/tours" style={{ color: "var(--muted)" }}>
          {t("nav.tours")}
        </Link>{" "}
        / {heading}
      </nav>

      {esEvento && <div className={styles.eventEyebrow}><span />{t("nav.eventos")} {tour.temporadaInicio ? new Date(tour.temporadaInicio).getUTCFullYear() : ""}</div>}

      <h1 className={styles.detailTitle}>
        {heading}
      </h1>
      {intro && (
        <p className={styles.detailIntro}>
          {intro}
        </p>
      )}

      <div className={styles.detailImage}>
        <ImageSlot
          radius={10}
          src={portada?.tipo === "VIDEO" ? undefined : portada?.url}
          video={portada?.tipo === "VIDEO" ? portada.url : undefined}
          placeholder={portada?.textoAlterno ?? heading}
        />
        {esEvento && temporada && <span className={styles.eventSeason}><span aria-hidden="true">✦</span>{temporada}</span>}
        {slug === "petroglifos-de-toro-muerto-y-valle-de-majes" && <a className={styles.imageCredit} href="https://commons.wikimedia.org/wiki/File:Toro_Muerto_Archaeological_site_-_petroglyph.jpg" target="_blank" rel="noopener noreferrer">Foto: AgainErick · CC BY-SA 3.0</a>}
      </div>

      {tr?.descripcion && tr.descripcion !== intro && (
        <section className={styles.eventNarrative}>
          <span className={styles.sectionEyebrow}>{esEvento ? t("eventos.descripcion") : "Sobre esta experiencia"}</span>
          <p>{tr.descripcion}</p>
        </section>
      )}

      {/* Ficha resumen */}
      {fichas.length > 0 && (
        <section
          className={styles.facts}
        >
          {fichas.map((c) => (
            <div key={c.label} className={styles.fact}>
              <div className={styles.factLabel}>{c.label}</div>
              <div className={styles.factValue}>{c.value}</div>
            </div>
          ))}
        </section>
      )}

      {/* Itinerario + reserva */}
      <section className={styles.detailColumns}>
        <div>
          <h2 className={styles.sectionTitle}>
            {itinerarios.length ? t("detalle.itinerarioTour") : "Planifica tu visita"}
          </h2>
          {itinerarios.length === 0 ? (
            <p className={styles.detailIntro}>El orden de las visitas, los horarios y los accesos se confirman según la fecha y las condiciones de operación. Consulta los detalles antes de reservar.</p>
          ) : (
            <>
            <div className={styles.itineraryOverview}>
              <span className={styles.sectionEyebrow}>Punto de encuentro</span>
              <strong>{itinerarios[0]?.titulo}</strong>
              <p>El recorrido comienza en este punto. Confirma la hora exacta y la ubicación de encuentro en tu reserva; el orden y los horarios de las actividades pueden variar según el programa local.</p>
            </div>
            <ol className={styles.itinerary}>
              {itinerarios.map((it, index) => {
                const mediosPropios = it.imagenes ?? [];
                const imagenGaleria = imagenesGaleria.filter((medio) => medio.url !== portada?.url)[index];
                const mediosVisibles = mediosPropios.length ? mediosPropios : imagenGaleria ? [imagenGaleria] : [];
                return (
                <li key={it.id} className={styles.itineraryItem}>
                  <span className={styles.itineraryStepLabel}>{index === 0 ? "Inicio del recorrido" : `Parada ${index}`}</span>
                  <div className={styles.itineraryStageHead}>
                    <strong>{it.titulo}</strong>
                    <div className={styles.itineraryStageMeta}>
                      {formatoTiempoRelativo(it.minutosDesdeSalida) && <span>{formatoTiempoRelativo(it.minutosDesdeSalida)}</span>}
                      {formatearDuracion(it.duracionEstimadaMinutos ?? undefined) && <span>Duración: {formatearDuracion(it.duracionEstimadaMinutos ?? undefined)}</span>}
                      {it.latitud != null && it.longitud != null && <a href={`https://www.google.com/maps/search/?api=1&query=${it.latitud},${it.longitud}`} target="_blank" rel="noopener noreferrer">Ver ubicación</a>}
                    </div>
                  </div>
                  {it.descripcion && <div className={styles.itineraryDescription}>{it.descripcion}</div>}
                  {mediosVisibles.length > 0 && <div className={styles.itineraryMediaGrid}>{mediosVisibles.map((medio) => <div key={medio.clave ?? medio.url} className={styles.itineraryMedia}><ImageSlot radius={8} src={medio.tipo === "VIDEO" ? undefined : medio.url} video={medio.tipo === "VIDEO" ? medio.url : undefined} placeholder={medio.textoAlterno ?? it.titulo} /></div>)}</div>}
                  {mediosPropios.length === 0 && imagenGaleria && <p className={styles.itineraryMediaNote}>Imagen de la galería de esta experiencia; es referencial para esta parada.</p>}
                </li>
                );
              })}
            </ol>
            </>
          )}
        </div>
        <div>
          {tr?.queLlevar && <section className={styles.prepareCard}>
            <span className={styles.sectionEyebrow}>Antes de salir</span>
            <h2 className={styles.prepareTitle}>{t("detalle.queLlevar")}</h2>
            <p>{tr.queLlevar}</p>
          </section>}
          <div className={styles.bookingCard} id="reservar">
            {precio && (
              <>
                <div className={styles.factLabel}>{t("detalle.precioPersona")}</div>
                <div className={styles.bookingPrice}>{t("common.desde")} S/ {precio.pen}<small style={{ display: "block", fontSize: 17, letterSpacing: 0, color: "var(--muted)" }}>US$ {precio.usd} {t("detalle.pp")}</small></div>
              </>
            )}
            <div style={{ marginBottom: 20 }}>
              <AddToCart
                tipoServicio="TOUR"
                esEvento={tour.esEvento}
                slug={slug}
                titulo={heading}
                imagen={tour.imagenes?.[0]?.url}
                salidas={salidas}
              />
            </div>
            <div className={styles.bookingActions}>
              {canalesReservaPara("TOUR", tour.esEvento).includes("WHATSAPP") && <a
                href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`${t("wa.tourInfo")}${heading}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardCta}
              >
                {t("common.reservarWhatsapp")}
              </a>}
              <Link href="/contacto" className={styles.secondaryCta}>
                {t("detalle.consultar")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.includesSection} aria-label="Servicios incluidos">
        <IncluyeNoIncluye incluye={tr?.incluye} noIncluye={tr?.noIncluye} />
      </section>
      <CondicionesServicio tipo={esEvento ? "evento" : "tour"} />
      </div>
    </PageShell>
  );
}

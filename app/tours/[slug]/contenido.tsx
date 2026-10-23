"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import IncluyeNoIncluye from "@/components/incluye-no-incluye";
import AddToCart from "@/components/add-to-cart";
import { CONTACT } from "@/lib/data";
import { useIdioma } from "@/components/lang-provider";
import { useT } from "@/lib/i18n";
import { useTour } from "@/hooks/use-catalogo";
import type { TourApi, TraduccionApi, SalidaApi, ItinerarioApi } from "@/lib/api/tipos";
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

function precioDesde(salidas?: SalidaApi[]): number | null {
  if (!salidas || salidas.length === 0) return null;
  const precios = salidas.map((s) => Number(s.precioPen)).filter((n) => Number.isFinite(n) && n > 0);
  if (precios.length === 0) return null;
  return Math.min(...precios);
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
  const precio = precioDesde(salidas);
  const itinerarios = [...(tour.itinerarios ?? [])].sort((a: ItinerarioApi, b: ItinerarioApi) => a.orden - b.orden);
  const portada = tour.imagenes?.[0];
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
    precio != null ? { label: t("ficha.precio"), value: `${t("common.desde")} S/ ${precio} ${t("detalle.pp")}` } : null,
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
          placeholder={heading}
        />
        {esEvento && temporada && <span className={styles.eventSeason}><span aria-hidden="true">✦</span>{temporada}</span>}
      </div>

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

      {/* Qué incluye / no incluye */}
      <IncluyeNoIncluye incluye={tr?.incluye} noIncluye={tr?.noIncluye} />

      {/* Itinerario + reserva */}
      <section className={styles.detailColumns}>
        <div>
          <h2 className={styles.sectionTitle}>
            {t("detalle.itinerarioTour")}
          </h2>
          {itinerarios.length === 0 ? (
            <p className={styles.detailIntro}>{t("detalle.itinerarioNota")}</p>
          ) : (
            <ol className={styles.itinerary}>
              {itinerarios.map((it) => (
                <li key={it.id} className={styles.itineraryItem}>
                  <strong>{it.titulo}</strong>
                  {it.descripcion && <div className={styles.itineraryDescription}>{it.descripcion}</div>}
                </li>
              ))}
            </ol>
          )}
        </div>
        <div>
          {tr?.queLlevar && (
            <>
              <h2 className={styles.sectionTitle}>
                {t("detalle.queLlevar")}
              </h2>
              <p className={styles.detailIntro}>
                {tr.queLlevar}
              </p>
            </>
          )}
          <div className={styles.bookingCard} id="reservar">
            {precio != null && (
              <>
                <div className={styles.factLabel}>{t("detalle.precioPersona")}</div>
                <div className={styles.bookingPrice}>{t("common.desde")} S/ {precio}</div>
              </>
            )}
            <div style={{ marginBottom: 20 }}>
              <AddToCart
                tipoServicio="TOUR"
                slug={slug}
                titulo={heading}
                imagen={tour.imagenes?.[0]?.url}
                salidas={salidas}
              />
            </div>
            <div className={styles.bookingActions}>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`${t("wa.tourInfo")}${heading}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardCta}
              >
                {t("common.reservarWhatsapp")}
              </a>
              <Link href="/contacto" className={styles.secondaryCta}>
                {t("detalle.consultar")}
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </PageShell>
  );
}

"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, CalendarDays, MapPin, Route } from "lucide-react";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import { CONTACT } from "@/lib/data";
import { useT, LOCALES } from "@/lib/i18n";
import { useIdioma } from "@/components/lang-provider";
import { useEventos } from "@/hooks/use-catalogo";
import type { TourApi, TraduccionApi, SalidaApi } from "@/lib/api/tipos";
import styles from "./eventos.module.css";

function traduccionDe(item: TourApi, idioma: string): TraduccionApi | undefined {
  const arr = item.traducciones as TraduccionApi[] | undefined;
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  return arr.find((x) => x.idioma === idioma) ?? arr.find((x) => x.idioma === "es") ?? arr[0];
}

function precioDesde(salidas?: SalidaApi[]): number | null {
  if (!salidas?.length) return null;
  const precios = salidas.map((salida) => Number(salida.precioPen)).filter((n) => Number.isFinite(n) && n > 0);
  return precios.length ? Math.min(...precios) : null;
}

function tituloEvento(item: TourApi, idioma: string): string {
  const tr = traduccionDe(item, idioma);
  return tr?.titulo || item.nombre || (item.destinoNombre as string | undefined) || "Evento";
}

function fechaEvento(item: TourApi, locale: string): string | null {
  const format = (iso?: string | null) => {
    if (!iso) return null;
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString(locale, { day: "numeric", month: "short", timeZone: "UTC" });
  };
  const inicio = format(item.temporadaInicio);
  const fin = format(item.temporadaFin);
  if (inicio && fin) return inicio === fin ? inicio : `${inicio} – ${fin}`;
  return inicio || fin || null;
}

function anioEvento(item: TourApi): string {
  const fecha = item.temporadaInicio || item.temporadaFin;
  if (!fecha) return "";
  const anio = new Date(fecha).getUTCFullYear();
  return Number.isFinite(anio) ? String(anio) : "";
}

export default function EventosPage() {
  const t = useT();
  const { idioma } = useIdioma();
  const { data, isLoading, isError } = useEventos();
  const eventos = data?.datos ?? [];
  const locale = LOCALES[idioma] ?? "es-PE";
  const destacado = eventos[0];
  const tituloDestacado = destacado ? tituloEvento(destacado, idioma) : "";
  const portadaDestacada = destacado?.imagenes?.[0];

  return (
    <PageShell>
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}><span className={styles.eyebrowDot} />{t("nav.eventos")}<span className={styles.eyebrowDivider}>/</span>{destacado ? anioEvento(destacado) : "Perú"}</span>
            <h1 className={styles.heroTitle}>{t("eventos.heroT1")}<br />{t("eventos.heroT2")}</h1>
            <div className={styles.heroFoot}>
              <p className={styles.heroIntro}>{t("eventos.intro")}</p>
              <a className={styles.scrollLink} href="#agenda" aria-label={t("nav.eventos")}>
                <span>{String(eventos.length).padStart(2, "0")}</span>
                <ArrowDownRight size={19} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <Link className={styles.heroVisual} href={destacado ? `/tours/${destacado.slug}` : "#agenda"} aria-label={tituloDestacado || t("nav.eventos")}>
            <ImageSlot
              radius={0}
              src={portadaDestacada?.tipo === "VIDEO" ? undefined : portadaDestacada?.url}
              video={portadaDestacada?.tipo === "VIDEO" ? portadaDestacada.url : undefined}
              placeholder={tituloDestacado || t("nav.eventos")}
            />
            <span className={styles.heroShade} />
            <span className={styles.heroImageMeta}><CalendarDays size={14} />{destacado ? fechaEvento(destacado, locale) : t("eventos.temporada")}</span>
            <span className={styles.heroImageTitle}>{tituloDestacado || t("eventos.heroT1")}<ArrowUpRight size={20} /></span>
            <span className={styles.heroImagePlace}><MapPin size={13} />{(destacado?.destinoNombre as string | undefined) || "Sur del Perú"}</span>
          </Link>
        </header>

        <section id="agenda" className={styles.agenda} aria-label={t("nav.eventos")}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.sectionEyebrow}>{t("eventos.temporada")}</span>
              <h2 className={styles.sectionTitle}>{t("eventos.heroT1")}</h2>
            </div>
            <span className={styles.eventCount}>{String(eventos.length).padStart(2, "0")} <span>/ {isLoading ? "—" : String(data?.total ?? eventos.length).padStart(2, "0")}</span></span>
          </div>

          {isLoading && <div className={styles.grid}>{Array.from({ length: 4 }, (_, index) => <div key={index} className={styles.skeleton} />)}</div>}
          {isError && <div className={styles.notice} role="status">{t("lista.errorEventos")}</div>}
          {!isLoading && !isError && eventos.length === 0 && <div className={styles.notice} role="status">{t("lista.sinEventos")}</div>}

          {!isLoading && !isError && eventos.length > 0 && (
            <div className={styles.grid}>
              {eventos.map((evento, index) => {
                const tr = traduccionDe(evento, idioma);
                const titulo = tituloEvento(evento, idioma);
                const fecha = fechaEvento(evento, locale);
                const precio = precioDesde(evento.salidas);
                const portada = evento.imagenes?.[0];
                const puntos = evento.itinerarios?.map((punto) => punto.tituloI18n?.[idioma] || punto.titulo).filter(Boolean) ?? [];
                const destino = (evento.destinoNombre as string | undefined) || "Perú";
                return (
                  <article key={evento.slug} className={`${styles.card} ${index === 0 ? styles.featuredCard : ""} ${index === 1 ? styles.secondCard : ""}`}>
                    <Link className={styles.cardImageLink} href={`/tours/${evento.slug}`} aria-label={titulo}>
                      <div className={styles.cardImage}>
                        <ImageSlot
                          radius={0}
                          src={portada?.tipo === "VIDEO" ? undefined : portada?.url}
                          video={portada?.tipo === "VIDEO" ? portada.url : undefined}
                          placeholder={titulo}
                        />
                        <span className={styles.imageShade} />
                        <span className={styles.dateTag}><CalendarDays size={13} />{fecha || t("eventos.temporada")}</span>
                        <span className={styles.imageDestination}><MapPin size={13} />{destino}</span>
                        <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span>
                      </div>
                    </Link>

                    <div className={styles.cardBody}>
                      <div className={styles.cardMeta}>
                        <span>{t("eventos.temporada")} {anioEvento(evento)}</span>
                        {puntos.length > 0 && <span className={styles.routeCount}><Route size={13} />{puntos.length}</span>}
                      </div>
                      <Link className={styles.cardTitleLink} href={`/tours/${evento.slug}`}><h3 className={styles.cardTitle}>{titulo}</h3></Link>
                      {tr?.resumen && <p className={styles.cardSummary}>{tr.resumen}</p>}

                      {puntos.length > 0 && (
                        <div className={styles.route} aria-label={`${t("eventos.recorrido")}: ${puntos.join(", ")}`}>
                          <span className={styles.routeLine} />
                          {puntos.slice(0, 3).map((punto, puntoIndex) => <span key={`${evento.slug}-${puntoIndex}`} className={styles.routeStop}><i />{punto}</span>)}
                          {puntos.length > 3 && <span className={styles.routeMore}>+{puntos.length - 3}</span>}
                        </div>
                      )}

                      <div className={styles.cardBottom}>
                        {precio != null ? <strong className={styles.cardPrice}>{t("common.desde")} S/ {precio}</strong> : <span className={styles.priceNote}>{t("eventos.programaPendiente")}</span>}
                        <a
                          className={styles.cardCta}
                          href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`${t("wa.tourInfo")}${titulo}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t(precio != null ? "common.reservar" : "common.consultar")}<ArrowUpRight size={15} />
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </PageShell>
  );
}

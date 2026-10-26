"use client";

import Link from "next/link";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import { CONTACT } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { useIdioma } from "@/components/lang-provider";
import { useTransportes } from "@/hooks/use-catalogo";
import type { TransporteApi, TraduccionApi, SalidaApi } from "@/lib/api/tipos";
import styles from "@/app/tours/tours.module.css";
import pageStyles from "./transporte.module.css";

function traduccionDe(item: TransporteApi | undefined, idioma: string): TraduccionApi | undefined {
  if (!item) return undefined;
  const arr = item.traducciones as TraduccionApi[] | undefined;
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  return arr.find((x) => x.idioma === idioma) ?? arr.find((x) => x.idioma === "es") ?? arr[0];
}

function formatearDuracion(minutos?: number): string | null {
  if (!minutos || minutos <= 0) return null;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return [h > 0 ? `${h}h` : null, m > 0 ? `${m}m` : null].filter(Boolean).join(" ") || null;
}

function precioDesde(salidas?: SalidaApi[]): number | null {
  if (!salidas?.length) return null;
  const precios = salidas.map((s) => Number(s.precioPen)).filter((n) => Number.isFinite(n) && n > 0);
  return precios.length ? Math.min(...precios) : null;
}

function tituloTransporte(item: TransporteApi, idioma: string): string {
  const tr = traduccionDe(item, idioma);
  return tr?.titulo || `${item.origenNombre} → ${item.destinoNombre}`;
}

export default function TransportePage() {
  const t = useT();
  const { idioma } = useIdioma();
  const { data, isLoading, isError } = useTransportes();
  const transportes = data?.datos ?? [];

  return (
    <PageShell>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>{t("nav.transporte")}</span>
        <h1 className={styles.heroTitle}>{t("transporte.heroT1")}<br />{t("transporte.heroT2")}</h1>
        <div className={styles.heroFoot}>
          <p className={styles.heroIntro}>{t("transporte.intro")}</p>
          <span className={styles.heroMark}>{t("transporte.rutasHorarios")} · {String(transportes.length).padStart(2, "0")}</span>
        </div>
      </header>

      <section aria-labelledby="rutas-disponibles">
        <div className={pageStyles.catalogueHeading}>
          <div>
            <span className={styles.eyebrow}>{t("nav.transporte")}</span>
            <h2 id="rutas-disponibles" className={pageStyles.catalogueTitle}>{t("transporte.rutasHorarios")}</h2>
          </div>
          <p className={pageStyles.catalogueNote}>{t("transporte.preciosNota")}</p>
        </div>

        {isLoading && <p className={pageStyles.stateMessage} role="status">{t("lista.cargandoRutas")}</p>}
        {isError && <p className={pageStyles.stateMessage} role="alert">{t("lista.errorRutas")}</p>}
        {!isLoading && !isError && transportes.length === 0 && <p className={pageStyles.stateMessage}>{t("lista.sinRutas")}</p>}

        {!isLoading && !isError && transportes.length > 0 && (
          <div className={styles.grid}>
            {transportes.map((item, index) => {
              const tr = traduccionDe(item, idioma);
              const titulo = tituloTransporte(item, idioma);
              const duracion = formatearDuracion(item.duracionMinutos);
              const precio = precioDesde(item.salidas);
              const href = `/transporte/${item.slug}`;
              return (
                <article key={item.slug} className={`${styles.card} ${index === 0 ? styles.featuredCard : ""}`}>
                  <Link href={href} className={styles.cardImageLink} aria-label={titulo}>
                    <div className={styles.cardImage}>
                      <ImageSlot radius={10} src={item.imagenes?.[0]?.url} placeholder={titulo} />
                    </div>
                  </Link>
                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span>{[item.origenNombre, duracion].filter(Boolean).join(" · ")}</span>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <Link href={href} className={styles.cardTitleLink}>
                      <h3 className={styles.cardTitle}>{titulo}</h3>
                    </Link>
                    {tr?.resumen && <p className={styles.cardSummary}>{tr.resumen}</p>}
                    <div className={styles.cardBottom}>
                      {precio != null ? <strong className={styles.cardPrice}>{t("common.desde")} S/ {precio} p/p</strong> : <span />}
                      <Link href={href} className={styles.cardCta}>{t("common.verRuta")} <span aria-hidden="true">↗</span></Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className={pageStyles.bookingSection} aria-labelledby="reserva-transporte">
        <div className={pageStyles.bookingIntro}>
          <span className={styles.eyebrow}>{t("nav.transporte")}</span>
          <h2 id="reserva-transporte" className={pageStyles.bookingTitle}>{t("transporte.reservarSimple")}</h2>
          <p className={pageStyles.bookingText}>{t("transporte.preciosNota")}</p>
          <div className={pageStyles.bookingActions}>
            <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className={styles.cardCta}>{t("common.reservarWhatsapp")}</a>
            <Link href="/contacto" className={pageStyles.contactLink}>{t("transporte.formularioContacto")}</Link>
          </div>
        </div>
        <ol className={pageStyles.bookingSteps}>
          {[t("transporte.paso1"), t("transporte.paso2"), t("transporte.paso3"), t("transporte.paso4")].map((paso, index) => (
            <li key={paso} className={pageStyles.bookingStep}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{paso}</p>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}

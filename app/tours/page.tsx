"use client";

import Link from "next/link";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import { canalesReservaPara, CONTACT } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { useIdioma } from "@/components/lang-provider";
import { useTours } from "@/hooks/use-catalogo";
import type { TourApi, TraduccionApi } from "@/lib/api/tipos";
import { preciosDesdeSalidas } from "@/lib/precios";
import styles from "./tours.module.css";

/** El listado trae todas las traducciones publicadas; elige la del idioma activo, con respaldo en español. */
function traduccionDe(item: TourApi, idioma: string): TraduccionApi | undefined {
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

function tituloTour(t: TourApi, idioma: string): string {
  const tr = traduccionDe(t, idioma);
  return tr?.titulo || t.nombre || (t.destinoNombre as string | undefined) || "Tour";
}

export default function ToursPage() {
  const t = useT();
  const { idioma } = useIdioma();
  const { data, isLoading, isError } = useTours({ esEvento: false });
  const tours = data?.datos ?? [];

  return (
    <PageShell>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>{t("nav.tours")}</span>
        <h1 className={styles.heroTitle}>{t("tours.heroT1")}<br />{t("tours.heroT2")}</h1>
        <div className={styles.heroFoot}>
          <p className={styles.heroIntro}>{t("tours.intro")}</p>
          <span className={styles.heroMark} aria-hidden="true">01 — 10</span>
        </div>
      </header>

      {isLoading && <p style={{ color: "var(--muted)", fontSize: 14 }}>{t("lista.cargandoTours")}</p>}
      {isError && (
        <p style={{ color: "var(--muted)", fontSize: 14 }}>{t("lista.errorTours")}</p>
      )}
      {!isLoading && !isError && tours.length === 0 && (
        <p style={{ color: "var(--muted)", fontSize: 14 }}>{t("lista.sinTours")}</p>
      )}

      <div className={styles.grid}>
        {tours.map((tour, index) => {
          const tr = traduccionDe(tour, idioma);
          const titulo = tituloTour(tour, idioma);
          const dur = formatearDuracion(tour.duracionMinutos as number | undefined);
          const precio = preciosDesdeSalidas(tour.salidas);
          return (
            <article key={tour.slug} className={`${styles.card} ${index === 0 ? styles.featuredCard : ""}`}>
              <Link href={`/tours/${tour.slug}`} className={styles.cardImageLink} aria-label={titulo}>
                <div className={styles.cardImage}>
                  <ImageSlot radius={10} src={tour.imagenes?.[0]?.url} placeholder={titulo} />
                </div>
              </Link>
              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  <span>{[tour.destinoNombre as string | undefined, dur].filter(Boolean).join(" · ") || t("nav.tours")}</span>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <Link href={`/tours/${tour.slug}`} className={styles.cardTitleLink}>
                  <h2 className={styles.cardTitle}>{titulo}</h2>
                </Link>
                {tr?.resumen && (
                  <p className={styles.cardSummary}>
                    {tr.resumen}
                  </p>
                )}
                <div className={styles.cardBottom}>
                  {precio != null ? (
                    <strong className={styles.cardPrice}>{t("common.desde")} S/ {precio.pen} · US$ {precio.usd}</strong>
                  ) : (
                    <span />
                  )}
                  {canalesReservaPara("TOUR", tour.esEvento).includes("WHATSAPP") ? <a
                    href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`${t("wa.tourInfo")}${titulo}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cardCta}
                  >
                    {t("common.reservar")}
                  </a> : <Link href={`/tours/${tour.slug}`} className={styles.cardCta}>{t("detalle.consultar")}</Link>}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section className={styles.customSection}>
        <span className={styles.eyebrow}>{t("nav.tours")}</span>
        <h2 className={styles.customTitle}>
          {t("tours.medidaTitulo")}
        </h2>
        <p className={styles.customText}>
          {t("tours.medidaTexto")}
        </p>
        <Link
          href="/contacto"
          className={styles.cardCta}
        >
          {t("tours.medidaCta")}
        </Link>
      </section>
    </PageShell>
  );
}

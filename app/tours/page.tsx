"use client";

import Link from "next/link";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import { CONTACT } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { useIdioma } from "@/components/lang-provider";
import { useTours } from "@/hooks/use-catalogo";
import type { TourApi, TraduccionApi, SalidaApi } from "@/lib/api/tipos";

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

function precioDesde(salidas?: SalidaApi[]): number | null {
  if (!salidas || salidas.length === 0) return null;
  const precios = salidas.map((s) => Number(s.precioPen)).filter((n) => Number.isFinite(n) && n > 0);
  if (precios.length === 0) return null;
  return Math.min(...precios);
}

function tituloTour(t: TourApi, idioma: string): string {
  const tr = traduccionDe(t, idioma);
  return tr?.titulo || t.nombre || (t.destinoNombre as string | undefined) || "Tour";
}

export default function ToursPage() {
  const t = useT();
  const { idioma } = useIdioma();
  const { data, isLoading, isError } = useTours();
  const tours = data?.datos ?? [];

  return (
    <PageShell>
      <h1
        style={{
          fontSize: "clamp(40px, 5.4vw, 84px)",
          lineHeight: 1.06,
          letterSpacing: "-0.03em",
          fontWeight: 400,
          margin: "48px 0 24px",
          textWrap: "pretty",
        }}
      >
        {t("tours.heroT1")}
        <br />
        {t("tours.heroT2")}
      </h1>
      <p style={{ maxWidth: 560, margin: "0 0 56px", fontSize: 16, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
        {t("tours.intro")}
      </p>

      {isLoading && <p style={{ color: "var(--muted)", fontSize: 14 }}>{t("lista.cargandoTours")}</p>}
      {isError && (
        <p style={{ color: "var(--muted)", fontSize: 14 }}>{t("lista.errorTours")}</p>
      )}
      {!isLoading && !isError && tours.length === 0 && (
        <p style={{ color: "var(--muted)", fontSize: 14 }}>{t("lista.sinTours")}</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {tours.map((tour) => {
          const tr = traduccionDe(tour, idioma);
          const titulo = tituloTour(tour, idioma);
          const dur = formatearDuracion(tour.duracionMinutos as number | undefined);
          const precio = precioDesde(tour.salidas);
          return (
            <figure key={tour.slug} style={{ margin: 0, background: "var(--card)", padding: 16, borderRadius: 14, display: "flex", flexDirection: "column" }}>
              <Link href={`/tours/${tour.slug}`} style={{ display: "block" }}>
                <div style={{ position: "relative", width: "100%", height: 220 }}>
                  <ImageSlot radius={10} src={tour.imagenes?.[0]?.url} placeholder={titulo} />
                </div>
              </Link>
              <figcaption style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {(tour.destinoNombre || dur) && (
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                    {[tour.destinoNombre as string | undefined, dur].filter(Boolean).join(" · ")}
                  </div>
                )}
                <Link href={`/tours/${tour.slug}`} style={{ color: "inherit" }}>
                  <strong style={{ fontSize: 16, letterSpacing: "-0.01em" }}>{titulo}</strong>
                </Link>
                {tr?.resumen && (
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty", flex: 1 }}>
                    {tr.resumen}
                  </p>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                  {precio != null ? (
                    <strong style={{ fontSize: 15 }}>{t("common.desde")} S/ {precio}</strong>
                  ) : (
                    <span />
                  )}
                  <a
                    href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`${t("wa.tourInfo")}${titulo}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 13, fontWeight: 600, background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "7px 12px", borderRadius: 8 }}
                  >
                    {t("common.reservar")}
                  </a>
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <section style={{ marginTop: 120, textAlign: "center" }}>
        <h2 style={{ margin: "0 auto 20px", maxWidth: 560, fontSize: "clamp(24px, 2vw, 34px)", fontWeight: 400, letterSpacing: "-0.015em", textWrap: "pretty" }}>
          {t("tours.medidaTitulo")}
        </h2>
        <p style={{ maxWidth: 480, margin: "0 auto 28px", fontSize: 15, lineHeight: 1.55, color: "var(--muted)", textWrap: "pretty" }}>
          {t("tours.medidaTexto")}
        </p>
        <Link
          href="/contacto"
          style={{ display: "inline-block", fontSize: 14, fontWeight: 600, background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "10px 18px", borderRadius: 8 }}
        >
          {t("tours.medidaCta")}
        </Link>
      </section>
    </PageShell>
  );
}

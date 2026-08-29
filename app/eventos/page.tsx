"use client";

import Link from "next/link";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import { CONTACT } from "@/lib/data";
import { useT, LOCALES } from "@/lib/i18n";
import { useIdioma } from "@/components/lang-provider";
import { useTours } from "@/hooks/use-catalogo";
import type { TourApi, TraduccionApi, SalidaApi } from "@/lib/api/tipos";

/** El listado trae todas las traducciones publicadas; elige la del idioma activo, con respaldo en español. */
function traduccionDe(item: TourApi, idioma: string): TraduccionApi | undefined {
  const arr = item.traducciones as TraduccionApi[] | undefined;
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  return arr.find((x) => x.idioma === idioma) ?? arr.find((x) => x.idioma === "es") ?? arr[0];
}

function precioDesde(salidas?: SalidaApi[]): number | null {
  if (!salidas || salidas.length === 0) return null;
  const precios = salidas.map((s) => Number(s.precioPen)).filter((n) => Number.isFinite(n) && n > 0);
  if (precios.length === 0) return null;
  return Math.min(...precios);
}

function tituloEvento(t: TourApi, idioma: string): string {
  const tr = traduccionDe(t, idioma);
  return tr?.titulo || t.nombre || (t.destinoNombre as string | undefined) || "Evento";
}

/** Rango de temporada legible (ej. "24 jun – 24 jun"). Null si no hay fechas. */
function temporadaTexto(t: TourApi, locale: string): string | null {
  const fmt = (iso?: string | null) => {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    // Fecha guardada como @db.Date (UTC medianoche); formatear en UTC evita
    // que en zonas negativas (Lima UTC-5) se muestre el día anterior.
    return d.toLocaleDateString(locale, { day: "numeric", month: "short", timeZone: "UTC" });
  };
  const inicio = fmt(t.temporadaInicio);
  const fin = fmt(t.temporadaFin);
  if (inicio && fin) return inicio === fin ? inicio : `${inicio} – ${fin}`;
  return inicio || fin || null;
}

export default function EventosPage() {
  const t = useT();
  const { idioma } = useIdioma();
  const { data, isLoading, isError } = useTours({ esEvento: true });
  const eventos = data?.datos ?? [];
  const locale = LOCALES[idioma] ?? "es-PE";

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
        {t("eventos.heroT1")}
        <br />
        {t("eventos.heroT2")}
      </h1>
      <p style={{ maxWidth: 560, margin: "0 0 56px", fontSize: 16, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
        {t("eventos.intro")}
      </p>

      {isLoading && <p style={{ color: "var(--muted)", fontSize: 14 }}>{t("lista.cargandoEventos")}</p>}
      {isError && (
        <p style={{ color: "var(--muted)", fontSize: 14 }}>{t("lista.errorEventos")}</p>
      )}
      {!isLoading && !isError && eventos.length === 0 && (
        <p style={{ color: "var(--muted)", fontSize: 14 }}>{t("lista.sinEventos")}</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {eventos.map((evento) => {
          const tr = traduccionDe(evento, idioma);
          const titulo = tituloEvento(evento, idioma);
          const temporada = temporadaTexto(evento, locale);
          const precio = precioDesde(evento.salidas);
          return (
            <figure key={evento.slug} style={{ margin: 0, background: "var(--card)", padding: 16, borderRadius: 14, display: "flex", flexDirection: "column" }}>
              <Link href={`/tours/${evento.slug}`} style={{ display: "block" }}>
                <div style={{ position: "relative", width: "100%", height: 220 }}>
                  <ImageSlot radius={10} src={evento.imagenes?.[0]?.url} placeholder={titulo} />
                  {temporada && (
                    <span
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        background: "var(--pill-bg)",
                        color: "var(--pill-fg)",
                        borderRadius: 999,
                        padding: "5px 12px",
                        fontSize: 12.5,
                        fontWeight: 700,
                        boxShadow: "0 2px 10px rgba(0,0,0,.18)",
                      }}
                    >
                      {temporada}
                    </span>
                  )}
                </div>
              </Link>
              <figcaption style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {(evento.destinoNombre || temporada) && (
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                    {[evento.destinoNombre as string | undefined, temporada ? `${t("eventos.temporada")}: ${temporada}` : null].filter(Boolean).join(" · ")}
                  </div>
                )}
                <Link href={`/tours/${evento.slug}`} style={{ color: "inherit" }}>
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
    </PageShell>
  );
}

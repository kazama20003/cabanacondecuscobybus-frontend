"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import IncluyeNoIncluye from "@/components/incluye-no-incluye";
import { CONTACT } from "@/lib/data";
import { useIdioma } from "@/components/lang-provider";
import { useT } from "@/lib/i18n";
import { useTransporte } from "@/hooks/use-catalogo";
import type { TransporteApi, TraduccionApi, SalidaApi, ParadaApi } from "@/lib/api/tipos";

function traduccionDe(item: TransporteApi | undefined): TraduccionApi | undefined {
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

function formatearOffset(minutos?: number): string | null {
  if (!minutos || minutos <= 0) return null;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return "+" + [h > 0 ? `${h}h` : null, m > 0 ? `${m}m` : null].filter(Boolean).join(" ");
}

function precioDesde(salidas?: SalidaApi[]): number | null {
  if (!salidas || salidas.length === 0) return null;
  const precios = salidas.map((s) => Number(s.precioPen)).filter((n) => Number.isFinite(n) && n > 0);
  if (precios.length === 0) return null;
  return Math.min(...precios);
}

export default function RoutePage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";
  const { idioma } = useIdioma();
  const t = useT();
  const { data: transporte, isLoading, isError } = useTransporte(slug, idioma);

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
          {t("lista.errorRuta")}
        </p>
      </PageShell>
    );
  }

  if (!transporte) {
    notFound();
  }

  const tr = traduccionDe(transporte);
  const heading = tr?.titulo || `${transporte.origenNombre} → ${transporte.destinoNombre}`;
  const intro = tr?.resumen || tr?.descripcion || "";
  const dur = formatearDuracion(
    transporte.duracionMinutos ??
      (typeof transporte.duracionMinutosEstimada === "number"
        ? transporte.duracionMinutosEstimada
        : undefined),
  );
  const precio = precioDesde(transporte.salidas);
  const paradas = [...(transporte.paradas ?? [])].sort((a: ParadaApi, b: ParadaApi) => a.orden - b.orden);

  const fichas = [
    dur ? { label: t("ficha.duracion"), value: dur } : null,
    { label: t("ficha.origen"), value: transporte.origenNombre },
    { label: t("ficha.destino"), value: transporte.destinoNombre },
    precio != null ? { label: t("ficha.precio"), value: `${t("common.desde")} S/ ${precio} ${t("detalle.pp")}` } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <PageShell>
      <nav style={{ margin: "40px 0 0", fontSize: 13, color: "var(--muted)" }}>
        <Link href="/transporte" style={{ color: "var(--muted)" }}>
          {t("nav.transporte")}
        </Link>{" "}
        / {transporte.origenNombre} — {transporte.destinoNombre}
      </nav>

      <h1
        style={{
          fontSize: "clamp(36px, 4.6vw, 72px)",
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          fontWeight: 400,
          margin: "24px 0 20px",
          textWrap: "pretty",
        }}
      >
        {heading}
      </h1>
      {intro && (
        <p style={{ maxWidth: 560, margin: "0 0 36px", fontSize: 16, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
          {intro}
        </p>
      )}

      <div style={{ position: "relative", width: "100%", aspectRatio: "1502 / 480" }}>
        <ImageSlot radius={10} src={transporte.imagenes?.[0]?.url} placeholder={heading} />
      </div>

      {/* Ficha resumen */}
      {fichas.length > 0 && (
        <section
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {fichas.map((c) => (
            <div key={c.label} style={{ background: "var(--card)", padding: "18px 20px" }}>
              <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.4 }}>{c.value}</div>
            </div>
          ))}
        </section>
      )}

      {/* Qué incluye / no incluye */}
      <IncluyeNoIncluye incluye={tr?.incluye} noIncluye={tr?.noIncluye} />

      {/* Itinerario + reserva */}
      <section style={{ marginTop: 110, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48 }}>
        <div>
          <h2 style={{ margin: "0 0 28px", fontSize: "clamp(26px, 2.2vw, 36px)", fontWeight: 400, letterSpacing: "-0.02em" }}>
            {t("detalle.itinerarioRuta")}
          </h2>
          {paradas.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--muted)" }}>{t("detalle.itinerarioNota")}</p>
          ) : (
            <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {paradas.map((s) => {
                const offset = formatearOffset(s.minutos);
                return (
                  <li
                    key={s.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "64px 1fr",
                      gap: 16,
                      borderTop: "1px solid var(--line)",
                      padding: "14px 0",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>{offset ?? ""}</span>
                    <span style={{ lineHeight: 1.4 }}>
                      <strong style={{ fontSize: 14.5 }}>{s.nombre}</strong>
                      {s.descripcion && <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{s.descripcion}</div>}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
        <div>
          {tr?.queLlevar && (
            <>
              <h2 style={{ margin: "0 0 20px", fontSize: "clamp(26px, 2.2vw, 36px)", fontWeight: 400, letterSpacing: "-0.02em" }}>
                {t("detalle.queLlevar")}
              </h2>
              <p style={{ margin: "0 0 36px", fontSize: 14.5, lineHeight: 1.6, color: "var(--muted)", textWrap: "pretty" }}>
                {tr.queLlevar}
              </p>
            </>
          )}
          <div style={{ background: "var(--card)", padding: "28px 26px" }}>
            {precio != null && (
              <>
                <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>{t("detalle.precioPersona")}</div>
                <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 18 }}>{t("common.desde")} S/ {precio}</div>
              </>
            )}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 14, fontWeight: 600 }}>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`${t("wa.rutaReservar")}${transporte.origenNombre} - ${transporte.destinoNombre}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "10px 16px", borderRadius: 8 }}
              >
                {t("common.reservarWhatsapp")}
              </a>
              <Link href="/contacto" style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid var(--line)" }}>
                {t("detalle.consultar")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

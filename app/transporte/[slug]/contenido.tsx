"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import IncluyeNoIncluye from "@/components/incluye-no-incluye";
import AddToCart from "@/components/add-to-cart";
import { CONTACT } from "@/lib/data";
import { useIdioma } from "@/components/lang-provider";
import { LOCALES, useT } from "@/lib/i18n";
import { useTransporte, useSalidasTransporte } from "@/hooks/use-catalogo";
import type { ImagenApi, TransporteApi, TraduccionApi, SalidaApi, ParadaApi } from "@/lib/api/tipos";

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
  const { salidas } = useSalidasTransporte(slug);
  const [indiceImagen, setIndiceImagen] = useState(0);

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
  const heading =
    tr?.titulo ||
    `Transporte de ${transporte.origenNombre} a ${transporte.destinoNombre}`;
  const intro = tr?.resumen || tr?.descripcion || "";
  const dur = formatearDuracion(
    transporte.duracionMinutos ??
      (typeof transporte.duracionMinutosEstimada === "number"
        ? transporte.duracionMinutosEstimada
        : undefined),
  );
  const salidasTodas = [...(transporte.salidas ?? []), ...salidas].filter(
    (salida, indice, lista) => lista.findIndex((item) => item.id === salida.id) === indice,
  );
  const precio = precioDesde(salidasTodas);
  const paradas = [...(transporte.paradas ?? [])].sort((a: ParadaApi, b: ParadaApi) => a.orden - b.orden);
  const imagenes = [
    ...(transporte.imagenes ?? []),
    ...paradas.flatMap((parada) => parada.imagenes ?? []),
  ]
    .filter((imagen) => imagen.url.trim())
    .filter(
      (imagen, indice, lista) =>
        lista.findIndex((item) => item.url === imagen.url) === indice,
    )
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  const videoPrincipal = imagenes.find((imagen) => imagen.tipo === "VIDEO");
  const imagenesGaleria = imagenes.filter((imagen) => imagen.tipo !== "VIDEO");
  const imagenActiva =
    imagenesGaleria[
      Math.min(indiceImagen, Math.max(imagenesGaleria.length - 1, 0))
    ];
  const proximasSalidas = salidasTodas
    .filter(
      (salida) =>
        ["A_LA_VENTA", "PENDIENTE_DE_MINIMO", "CONFIRMADA"].includes(salida.estado) &&
        new Date(salida.fechaHoraSalida).getTime() > Date.now(),
    )
    .sort((a, b) => a.fechaHoraSalida.localeCompare(b.fechaHoraSalida));
  const descripcion = tr?.descripcion?.trim();
  const mostrarDescripcion = descripcion && descripcion !== intro;
  const formatoFecha = new Intl.DateTimeFormat(LOCALES[idioma], {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

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

      <section style={{ marginTop: 36 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: videoPrincipal && imagenActiva ? "minmax(0, 1.7fr) minmax(240px, 0.85fr)" : "1fr",
            gap: 10,
          }}
        >
          {videoPrincipal ? (
            <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", minHeight: 260 }}>
              <ImageSlot
                radius={10}
                video={videoPrincipal.url}
                placeholder={videoPrincipal.textoAlterno || `Video de ${heading}`}
              />
            </div>
          ) : (
            <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 7", minHeight: 260 }}>
              <ImageSlot radius={10} src={imagenActiva?.url} placeholder={heading} />
            </div>
          )}
          {videoPrincipal && imagenActiva && (
            <div style={{ position: "relative", width: "100%", minHeight: 260 }}>
              <ImageSlot
                radius={10}
                src={imagenActiva.url}
                placeholder={imagenActiva.textoAlterno || heading}
              />
            </div>
          )}
        </div>
        {imagenesGaleria.length > 1 && (
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingTop: 10 }}>
            {imagenesGaleria.map((imagen: ImagenApi, indice) => (
              <button
                key={imagen.clave ?? imagen.url}
                type="button"
                aria-label={`Ver ${imagen.textoAlterno || `imagen ${indice + 1}`}`}
                aria-pressed={indice === Math.min(indiceImagen, imagenesGaleria.length - 1)}
                onClick={() => setIndiceImagen(indice)}
                style={{
                  position: "relative",
                  flex: "0 0 112px",
                  aspectRatio: "4 / 3",
                  padding: 0,
                  border: indice === Math.min(indiceImagen, imagenesGaleria.length - 1) ? "2px solid var(--fg)" : "1px solid var(--line)",
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "var(--card)",
                  cursor: "pointer",
                }}
              >
                <ImageSlot
                  radius={6}
                  src={imagen.url}
                  placeholder={imagen.textoAlterno || heading}
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {mostrarDescripcion && (
        <section style={{ maxWidth: 800, marginTop: 42 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: "clamp(24px, 2vw, 32px)", fontWeight: 400, letterSpacing: "-0.02em" }}>
            El viaje
          </h2>
          <p style={{ margin: 0, whiteSpace: "pre-line", fontSize: 15.5, lineHeight: 1.65, color: "var(--muted)", textWrap: "pretty" }}>
            {descripcion}
          </p>
        </section>
      )}

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

      {proximasSalidas.length > 0 && (
      <section style={{ marginTop: 56 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "clamp(26px, 2.2vw, 36px)", fontWeight: 400, letterSpacing: "-0.02em" }}>
              Próximas salidas
            </h2>
            <p style={{ margin: "7px 0 0", fontSize: 14, color: "var(--muted)" }}>
              Elige la fecha que mejor se ajuste a tu itinerario.
            </p>
          </div>
          {precio != null && (
            <span style={{ fontSize: 14, color: "var(--muted)" }}>
              Desde <strong style={{ color: "var(--fg)" }}>S/ {precio}</strong> por persona
            </span>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
          {proximasSalidas.slice(0, 6).map((salida) => (
            <div key={salida.id} style={{ border: "1px solid var(--line)", padding: "16px", background: "var(--card)" }}>
              <strong style={{ display: "block", fontSize: 14.5, textTransform: "capitalize" }}>
                {formatoFecha.format(new Date(salida.fechaHoraSalida))}
              </strong>
              <span style={{ display: "block", marginTop: 7, fontSize: 13.5, color: "var(--muted)" }}>
                S/ {Number(salida.precioPen)} · US$ {Number(salida.precioUsd)}
              </span>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* Qué incluye / no incluye */}
      <IncluyeNoIncluye incluye={tr?.incluye} noIncluye={tr?.noIncluye} />

      {/* Itinerario + reserva */}
      <section style={{ marginTop: 110, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48 }}>
        <div>
          <h2 style={{ margin: "0 0 28px", fontSize: "clamp(26px, 2.2vw, 36px)", fontWeight: 400, letterSpacing: "-0.02em" }}>
            Paradas del recorrido
          </h2>
          {paradas.length > 0 && (
            <p style={{ margin: "-16px 0 24px", fontSize: 14, color: "var(--muted)" }}>
              {paradas.length} paradas desde {transporte.origenNombre} hasta {transporte.destinoNombre}.
            </p>
          )}
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
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>{offset ?? `Parada ${s.orden}`}</span>
                    <span style={{ lineHeight: 1.4 }}>
                      <strong style={{ fontSize: 14.5 }}>{s.nombre}</strong>
                      {s.descripcion && <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{s.descripcion}</div>}
                      {s.duracionParadaMinutos > 0 && (
                        <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 5 }}>
                          Parada aproximada: {formatearDuracion(s.duracionParadaMinutos)}
                        </div>
                      )}
                      {s.imagenes?.[0] && (
                        <div style={{ position: "relative", width: "100%", maxWidth: 280, aspectRatio: "16 / 9", marginTop: 12 }}>
                          <ImageSlot
                            radius={8}
                            src={s.imagenes[0].tipo === "VIDEO" ? undefined : s.imagenes[0].url}
                            video={s.imagenes[0].tipo === "VIDEO" ? s.imagenes[0].url : undefined}
                            placeholder={s.nombre}
                          />
                        </div>
                      )}
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
            <div style={{ marginBottom: 20 }}>
              <AddToCart
                tipoServicio="TRANSPORTE"
                slug={slug}
                titulo={heading}
                imagen={imagenesGaleria[0]?.url}
                salidas={salidasTodas}
              />
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 14, fontWeight: 600, borderTop: "1px solid var(--line)", paddingTop: 18 }}>
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

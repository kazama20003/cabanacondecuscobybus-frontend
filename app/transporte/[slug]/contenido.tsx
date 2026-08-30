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
import { useT } from "@/lib/i18n";
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
  const [fotoActiva, setFotoActiva] = useState(0);
  const [mostrarVideo, setMostrarVideo] = useState(false);

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
  const paradas = [...(transporte.paradas ?? [])].sort((a: ParadaApi, b: ParadaApi) => a.orden - b.orden);
  const salidasUnicas = [...(transporte.salidas ?? []), ...salidas].filter(
    (salida, indice, lista) => lista.findIndex((item) => item.id === salida.id) === indice,
  );
  const precio = precioDesde(salidasUnicas);
  const medios = [
    ...(transporte.imagenes ?? []),
    ...paradas.flatMap((parada) => parada.imagenes ?? []),
  ].filter(
    (medio, indice, lista) =>
      Boolean(medio.url.trim()) && lista.findIndex((item) => item.url === medio.url) === indice,
  );
  const fotos = medios.filter((medio) => medio.tipo !== "VIDEO");
  const videoPrincipal = medios.find((medio) => medio.tipo === "VIDEO");
  const indiceFotoActivo = Math.min(fotoActiva, Math.max(fotos.length - 1, 0));
  const visualPrincipal =
    mostrarVideo && videoPrincipal ? videoPrincipal : fotos[indiceFotoActivo] ?? videoPrincipal;

  return (
    <PageShell>
      <section style={{ position: "relative", minHeight: "clamp(480px, 68vh, 720px)", marginTop: 24, overflow: "hidden", borderRadius: 14, background: "var(--card)" }}>
        <ImageSlot radius={0} src={visualPrincipal?.tipo === "VIDEO" ? undefined : visualPrincipal?.url} video={visualPrincipal?.tipo === "VIDEO" ? visualPrincipal.url : undefined} placeholder={heading} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, color-mix(in srgb, var(--bg) 48%, transparent) 0%, transparent 42%, color-mix(in srgb, var(--bg) 92%, transparent) 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, minHeight: "clamp(480px, 68vh, 720px)", padding: "clamp(20px, 4vw, 52px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <nav style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 11px", border: "1px solid color-mix(in srgb, var(--bg) 42%, transparent)", borderRadius: 999, background: "color-mix(in srgb, var(--bg) 70%, transparent)", backdropFilter: "blur(10px)", fontSize: 12.5 }}>
              <Link href="/transporte" style={{ color: "inherit", fontWeight: 700 }}>{t("nav.transporte")}</Link>
              <span aria-hidden style={{ opacity: 0.55 }}>·</span>
              <span>{transporte.origenNombre} — {transporte.destinoNombre}</span>
            </nav>
          </div>
          <div style={{ maxWidth: 800 }}>
            <span style={{ display: "inline-block", marginBottom: 14, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.78 }}>Ruta panorámica</span>
            <h1 style={{ margin: 0, fontSize: "clamp(42px, 6vw, 86px)", lineHeight: 0.94, letterSpacing: "-0.055em", fontWeight: 400, textWrap: "balance" }}>{heading}</h1>
            {intro && <p style={{ maxWidth: 610, margin: "16px 0 0", fontSize: 16, lineHeight: 1.6, textWrap: "pretty" }}>{intro}</p>}
            <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginTop: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 10, minWidth: "min(100%, 360px)", fontSize: 13 }}><strong>{transporte.origenNombre}</strong><span style={{ height: 1, background: "currentColor", opacity: 0.5 }} /><strong>{transporte.destinoNombre}</strong></div>
              {videoPrincipal && <div style={{ display: "flex", gap: 8 }}><button type="button" onClick={() => setMostrarVideo(false)} aria-pressed={!mostrarVideo} style={{ border: "1px solid var(--line)", background: !mostrarVideo ? "var(--fg)" : "color-mix(in srgb, var(--bg) 78%, transparent)", color: !mostrarVideo ? "var(--bg)" : "var(--fg)", padding: "8px 11px", borderRadius: 7, cursor: "pointer" }}>Foto</button><button type="button" onClick={() => setMostrarVideo(true)} aria-pressed={mostrarVideo} style={{ border: "1px solid var(--line)", background: mostrarVideo ? "var(--fg)" : "color-mix(in srgb, var(--bg) 78%, transparent)", color: mostrarVideo ? "var(--bg)" : "var(--fg)", padding: "8px 11px", borderRadius: 7, cursor: "pointer" }}>Video</button></div>}
            </div>
          </div>
        </div>
      </section>

      {fotos.length > 1 && <div style={{ display: "flex", gap: 9, overflowX: "auto", paddingTop: 12 }}>{fotos.map((foto: ImagenApi, indice) => <button key={foto.clave ?? foto.url} type="button" aria-label={`Ver foto ${indice + 1}`} aria-pressed={indice === indiceFotoActivo && !mostrarVideo} onClick={() => { setFotoActiva(indice); setMostrarVideo(false); }} style={{ position: "relative", flex: "0 0 108px", aspectRatio: "4 / 3", padding: 0, overflow: "hidden", border: indice === indiceFotoActivo && !mostrarVideo ? "2px solid var(--fg)" : "1px solid var(--line)", borderRadius: 8, background: "var(--card)", cursor: "pointer" }}><ImageSlot radius={6} src={foto.url} placeholder={heading} /></button>)}</div>}

      <section style={{ marginTop: 76, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))", gap: 54, alignItems: "start" }}>
        <div>
          {tr?.descripcion && tr.descripcion !== intro && <p style={{ maxWidth: 750, margin: "0 0 44px", whiteSpace: "pre-line", fontSize: 16, lineHeight: 1.7, color: "var(--muted)", textWrap: "pretty" }}>{tr.descripcion}</p>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, marginBottom: 26 }}>
            <div><span style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>La experiencia</span><h2 style={{ margin: "6px 0 0", fontSize: "clamp(30px, 3vw, 46px)", letterSpacing: "-0.035em", fontWeight: 400 }}>Paradas del recorrido</h2></div>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{paradas.length} lugares</span>
          </div>
          {paradas.length === 0 ? <p style={{ color: "var(--muted)" }}>{t("detalle.itinerarioNota")}</p> : (
            <ol style={{ position: "relative", margin: 0, padding: "4px 0 4px 24px", listStyle: "none", display: "grid", gap: 26 }}>
              <span aria-hidden style={{ position: "absolute", top: 18, bottom: 18, left: 34, width: 1, background: "var(--line)" }} />
              {paradas.map((parada) => (
                <li key={parada.id} style={{ position: "relative", display: "grid", gridTemplateColumns: parada.imagenes?.[0] ? "28px minmax(0, 1fr) minmax(150px, 0.42fr)" : "28px minmax(0, 1fr)", gap: 18, alignItems: "start" }}>
                  <span style={{ position: "relative", zIndex: 1, display: "grid", placeItems: "center", width: 22, height: 22, borderRadius: "50%", background: "var(--bg)", border: "1px solid var(--fg)", fontSize: 10, fontWeight: 700 }}>{parada.orden}</span>
                  <article style={{ padding: "4px 0 20px" }}><span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, letterSpacing: "0.1em" }}>HITO DEL CAMINO</span><h3 style={{ margin: "7px 0", fontSize: 23, letterSpacing: "-0.025em" }}>{parada.nombre}</h3>{parada.descripcion && <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--muted)", textWrap: "pretty" }}>{parada.descripcion}</p>}{parada.duracionParadaMinutos > 0 && <span style={{ display: "inline-block", marginTop: 12, padding: "5px 8px", fontSize: 12, border: "1px solid var(--line)", borderRadius: 99 }}>Tiempo de parada: {formatearDuracion(parada.duracionParadaMinutos)}</span>}</article>
                  {parada.imagenes?.[0] && <div style={{ position: "relative", minHeight: 160, marginBottom: 20 }}><ImageSlot radius={9} src={parada.imagenes[0].tipo === "VIDEO" ? undefined : parada.imagenes[0].url} video={parada.imagenes[0].tipo === "VIDEO" ? parada.imagenes[0].url : undefined} placeholder={parada.nombre} /></div>}
                </li>
              ))}
            </ol>
          )}
          <IncluyeNoIncluye incluye={tr?.incluye} noIncluye={tr?.noIncluye} />
        </div>
        <aside style={{ position: "sticky", top: 86, border: "1px solid var(--line)", background: "var(--card)", padding: "26px" }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>Planifica tu viaje</span>
          <h2 style={{ margin: "9px 0 16px", fontSize: 28, letterSpacing: "-0.03em", fontWeight: 400 }}>Reserva tu asiento</h2>
          {precio != null && <p style={{ margin: "0 0 18px", fontSize: 14, color: "var(--muted)" }}>{t("common.desde")} <strong style={{ color: "var(--fg)", fontSize: 22 }}>S/ {precio}</strong> {t("detalle.pp")}</p>}
          <AddToCart tipoServicio="TRANSPORTE" slug={slug} titulo={heading} imagen={medios.find((medio) => medio.tipo !== "VIDEO")?.url} salidas={salidasUnicas} />
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)", display: "grid", gap: 10, fontSize: 14, fontWeight: 600 }}>
            <a href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`${t("wa.rutaReservar")}${transporte.origenNombre} - ${transporte.destinoNombre}`)}`} target="_blank" rel="noopener noreferrer" style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "11px 14px", borderRadius: 7, textAlign: "center" }}>{t("common.reservarWhatsapp")}</a>
            <Link href="/contacto" style={{ padding: "10px 14px", border: "1px solid var(--line)", borderRadius: 7, textAlign: "center" }}>{t("detalle.consultar")}</Link>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

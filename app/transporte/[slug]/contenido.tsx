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
  const [medioActivo, setMedioActivo] = useState(0);

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
  const indiceActivo = Math.min(medioActivo, Math.max(medios.length - 1, 0));
  const medioPrincipal = medios[indiceActivo];
  const mediosSecundarios = medios.filter((_, indice) => indice !== indiceActivo).slice(0, 2);

  return (
    <PageShell>
      <nav style={{ margin: "40px 0 0", fontSize: 13, color: "var(--muted)" }}>
        <Link href="/transporte" style={{ color: "var(--muted)" }}>
          {t("nav.transporte")}
        </Link>{" "}
        / {transporte.origenNombre} — {transporte.destinoNombre}
      </nav>

      <section style={{ marginTop: 26, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 36, alignItems: "end" }}>
        <div>
          <span style={{ display: "block", marginBottom: 14, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}>
            Ruta panorámica
          </span>
          <h1 style={{ fontSize: "clamp(42px, 5.2vw, 80px)", lineHeight: 0.98, letterSpacing: "-0.045em", fontWeight: 400, margin: 0, textWrap: "balance" }}>
            {heading}
          </h1>
        </div>
        {intro && <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: "var(--muted)", textWrap: "pretty" }}>{intro}</p>}
      </section>

      <section style={{ marginTop: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: mediosSecundarios.length ? "minmax(0, 1.55fr) minmax(190px, 0.65fr)" : "1fr", gap: 10, minHeight: 420 }}>
          <div style={{ position: "relative", minHeight: 320 }}>
            <ImageSlot radius={12} src={medioPrincipal?.tipo === "VIDEO" ? undefined : medioPrincipal?.url} video={medioPrincipal?.tipo === "VIDEO" ? medioPrincipal.url : undefined} placeholder={heading} />
            <span style={{ position: "absolute", left: 16, bottom: 16, background: "color-mix(in srgb, var(--bg) 88%, transparent)", padding: "7px 10px", fontSize: 12, fontWeight: 700, borderRadius: 999 }}>
              {medioPrincipal?.tipo === "VIDEO" ? "Video de la ruta" : "Cabanaconde → Cusco"}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 10 }}>
            {mediosSecundarios.map((medio) => (
              <button key={medio.clave ?? medio.url} type="button" onClick={() => setMedioActivo(medios.findIndex((item) => item.url === medio.url))} style={{ position: "relative", border: "none", padding: 0, cursor: "pointer", background: "transparent", minHeight: 150 }}>
                <ImageSlot radius={10} src={medio.tipo === "VIDEO" ? undefined : medio.url} video={medio.tipo === "VIDEO" ? medio.url : undefined} placeholder={heading} />
              </button>
            ))}
          </div>
        </div>
        {medios.length > 1 && (
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingTop: 10 }}>
            {medios.map((medio: ImagenApi, indice) => (
              <button key={medio.clave ?? medio.url} type="button" aria-label={`Ver medio ${indice + 1}`} aria-pressed={indice === indiceActivo} onClick={() => setMedioActivo(indice)} style={{ position: "relative", flex: "0 0 82px", aspectRatio: "1", border: indice === indiceActivo ? "2px solid var(--fg)" : "1px solid var(--line)", borderRadius: 7, overflow: "hidden", padding: 0, background: "var(--card)", cursor: "pointer" }}>
                <ImageSlot radius={5} src={medio.tipo === "VIDEO" ? undefined : medio.url} video={medio.tipo === "VIDEO" ? medio.url : undefined} placeholder={String(indice + 1)} />
              </button>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: 20, padding: "18px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 16 }}>
        <div><span style={{ display: "block", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Salida</span><strong>{transporte.origenNombre}</strong></div>
        <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 13 }}>{dur ?? "Ruta turística"}<br /><span style={{ fontSize: 11 }}>{paradas.length} paradas seleccionadas</span></div>
        <div style={{ textAlign: "right" }}><span style={{ display: "block", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Llegada</span><strong>{transporte.destinoNombre}</strong></div>
      </section>

      <section style={{ marginTop: 76, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))", gap: 54, alignItems: "start" }}>
        <div>
          {tr?.descripcion && tr.descripcion !== intro && <p style={{ maxWidth: 750, margin: "0 0 44px", whiteSpace: "pre-line", fontSize: 16, lineHeight: 1.7, color: "var(--muted)", textWrap: "pretty" }}>{tr.descripcion}</p>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, marginBottom: 26 }}>
            <div><span style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>La experiencia</span><h2 style={{ margin: "6px 0 0", fontSize: "clamp(30px, 3vw, 46px)", letterSpacing: "-0.035em", fontWeight: 400 }}>Paradas del recorrido</h2></div>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{paradas.length} lugares</span>
          </div>
          {paradas.length === 0 ? <p style={{ color: "var(--muted)" }}>{t("detalle.itinerarioNota")}</p> : (
            <div style={{ display: "grid", gap: 18 }}>
              {paradas.map((parada, indice) => (
                <article key={parada.id} style={{ display: "grid", gridTemplateColumns: parada.imagenes?.[0] ? "minmax(150px, 0.42fr) minmax(0, 1fr)" : "68px minmax(0, 1fr)", gap: 18, padding: "18px", background: indice % 2 === 0 ? "var(--card)" : "transparent", border: "1px solid var(--line)" }}>
                  {parada.imagenes?.[0] ? <div style={{ position: "relative", minHeight: 150 }}><ImageSlot radius={8} src={parada.imagenes[0].tipo === "VIDEO" ? undefined : parada.imagenes[0].url} video={parada.imagenes[0].tipo === "VIDEO" ? parada.imagenes[0].url : undefined} placeholder={parada.nombre} /></div> : <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>0{parada.orden}</span>}
                  <div><span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700, letterSpacing: "0.08em" }}>PARADA {String(parada.orden).padStart(2, "0")}</span><h3 style={{ margin: "8px 0", fontSize: 21, letterSpacing: "-0.02em" }}>{parada.nombre}</h3>{parada.descripcion && <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: "var(--muted)", textWrap: "pretty" }}>{parada.descripcion}</p>}{parada.duracionParadaMinutos > 0 && <span style={{ display: "inline-block", marginTop: 12, padding: "5px 8px", fontSize: 12, background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 99 }}>Tiempo de parada: {formatearDuracion(parada.duracionParadaMinutos)}</span>}</div>
                </article>
              ))}
            </div>
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

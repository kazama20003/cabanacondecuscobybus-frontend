"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { CameraIcon, Clock3Icon, MapPinIcon, RouteIcon } from "lucide-react";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import IncluyeNoIncluye from "@/components/incluye-no-incluye";
import AddToCart from "@/components/add-to-cart";
import { canalesReservaPara, CONTACT } from "@/lib/data";
import { useIdioma } from "@/components/lang-provider";
import { useT } from "@/lib/i18n";
import { useTransporte, useSalidasTransporte } from "@/hooks/use-catalogo";
import type { ImagenApi, TransporteApi, TraduccionApi, SalidaApi, ParadaApi } from "@/lib/api/tipos";
import styles from "../../tours/tours.module.css";

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

function formatearTiempoDeRuta(minutos?: number): string | null {
  if (!minutos || minutos <= 0) return null;
  return `${formatearDuracion(minutos)} desde la salida`;
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
      <section style={{ position: "relative", minHeight: "clamp(420px, 62vh, 680px)", marginTop: 24, overflow: "hidden", borderRadius: 14, background: "var(--card)" }}>
        <ImageSlot radius={0} src={visualPrincipal?.tipo === "VIDEO" ? undefined : visualPrincipal?.url} video={visualPrincipal?.tipo === "VIDEO" ? visualPrincipal.url : undefined} placeholder={heading} />
        <nav style={{ position: "absolute", top: 18, left: 18, display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 11px", border: "1px solid var(--line)", borderRadius: 999, background: "var(--bg)", fontSize: 12.5 }}>
          <Link href="/transporte" style={{ color: "inherit", fontWeight: 700 }}>{t("nav.transporte")}</Link>
          <span aria-hidden style={{ opacity: 0.55 }}>·</span>
          <span>{transporte.origenNombre} — {transporte.destinoNombre}</span>
        </nav>
        {videoPrincipal && <div style={{ position: "absolute", top: 18, right: 18, display: "flex", gap: 8 }}><button type="button" onClick={() => setMostrarVideo(false)} aria-pressed={!mostrarVideo} style={{ border: "1px solid var(--line)", background: !mostrarVideo ? "var(--fg)" : "var(--bg)", color: !mostrarVideo ? "var(--bg)" : "var(--fg)", padding: "8px 11px", borderRadius: 7, cursor: "pointer" }}>Fotos</button><button type="button" onClick={() => setMostrarVideo(true)} aria-pressed={mostrarVideo} style={{ border: "1px solid var(--line)", background: mostrarVideo ? "var(--fg)" : "var(--bg)", color: mostrarVideo ? "var(--bg)" : "var(--fg)", padding: "8px 11px", borderRadius: 7, cursor: "pointer" }}>Ver video</button></div>}
      </section>

      {(fotos.length > 1 || videoPrincipal) && <div aria-label="Galería de fotos y video" style={{ display: "flex", alignItems: "center", gap: 10, overflowX: "auto", padding: "12px 0 4px" }}>{fotos.map((foto: ImagenApi, indice) => <button key={foto.clave ?? foto.url} type="button" aria-label={`Ver foto ${indice + 1}`} aria-pressed={indice === indiceFotoActivo && !mostrarVideo} onClick={() => { setFotoActiva(indice); setMostrarVideo(false); }} style={{ position: "relative", flex: "0 0 120px", aspectRatio: "4 / 3", padding: 0, overflow: "hidden", border: indice === indiceFotoActivo && !mostrarVideo ? "2px solid var(--fg)" : "1px solid var(--line)", borderRadius: 8, background: "var(--card)", cursor: "pointer" }}><ImageSlot radius={6} src={foto.url} placeholder={heading} /><span style={{ position: "absolute", right: 5, bottom: 5, padding: "3px 6px", borderRadius: 4, color: "white", background: "#0009", fontSize: 10 }}>{indice + 1}/{fotos.length}</span></button>)}{videoPrincipal && <button type="button" aria-label="Reproducir video de Cotahuasi" aria-pressed={mostrarVideo} onClick={() => setMostrarVideo(true)} style={{ flex: "0 0 120px", aspectRatio: "4 / 3", padding: 10, border: mostrarVideo ? "2px solid var(--fg)" : "1px solid var(--line)", borderRadius: 8, color: "var(--fg)", background: "var(--card)", cursor: "pointer", fontWeight: 700 }}>▶ Ver video</button>}</div>}

      <section style={{ marginTop: 42, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 32, alignItems: "end" }}>
        <div><span style={{ display: "block", marginBottom: 12, fontSize: 11, color: "var(--muted)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Ruta panorámica</span><h1 style={{ margin: 0, fontSize: "clamp(40px, 5.5vw, 78px)", lineHeight: 0.98, letterSpacing: "-0.05em", fontWeight: 400, textWrap: "balance" }}>{heading}</h1>{intro && <p style={{ maxWidth: 620, margin: "18px 0 0", fontSize: 16, lineHeight: 1.65, color: "var(--muted)", textWrap: "pretty" }}>{intro}</p>}</div>
        <div style={{ borderLeft: "2px solid var(--fg)", paddingLeft: 20, display: "grid", gap: 12 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--muted)", fontSize: 13 }}><MapPinIcon size={15} color="#16a34a" />Salida</span><strong>{transporte.origenNombre}</strong></div><div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--muted)", fontSize: 13 }}><Clock3Icon size={15} color="#2563eb" />Trayecto estimado</span><strong>{dur ?? "Por confirmar"}</strong></div><div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--muted)", fontSize: 13 }}><MapPinIcon size={15} color="#dc2626" />Llegada</span><strong>{transporte.destinoNombre}</strong></div>{paradas.length > 0 && <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--muted)", fontSize: 13 }}><RouteIcon size={15} color="#d97706" />Puntos de paso referenciales</span><strong>{paradas.length}</strong></div>}</div>
      </section>

      {slug === "arequipa-cotahuasi" && <section aria-labelledby="cotahuasi-info" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 1, marginTop: 54, border: "1px solid var(--line)", background: "var(--line)" }}>
        <article style={{ padding: 22, background: "var(--card)" }}><span style={{ color: "var(--muted)", fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>El destino</span><h2 id="cotahuasi-info" style={{ margin: "9px 0", fontSize: 22, fontWeight: 500 }}>La Unión, Arequipa</h2><p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>Cotahuasi es la puerta de entrada a la Reserva Paisajística Subcuenca del Cotahuasi, conocida por su cañón, pueblos andinos y paisajes de altura.</p></article>
        <article style={{ padding: 22, background: "var(--card)" }}><span style={{ color: "var(--muted)", fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>Duración referencial</span><h2 style={{ margin: "9px 0", fontSize: 22, fontWeight: 500 }}>Aprox. 10 horas</h2><p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>El tiempo puede variar por clima, tráfico y estado de la carretera. Confirma la hora, punto de embarque y equipaje antes de viajar.</p></article>
        <article style={{ padding: 22, background: "var(--card)" }}><span style={{ color: "var(--muted)", fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>Al planificar</span><h2 style={{ margin: "9px 0", fontSize: 22, fontWeight: 500 }}>Viaje de larga distancia</h2><p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>Horarios, tipo de vehículo, disponibilidad y paradas se coordinan al confirmar el servicio. Lleva agua, abrigo y tus medicamentos personales.</p></article>
      </section>}

      <section style={{ marginTop: 76, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))", gap: 54, alignItems: "start" }}>
        <div>
          {tr?.descripcion && tr.descripcion !== intro && <p style={{ maxWidth: 750, margin: "0 0 44px", whiteSpace: "pre-line", fontSize: 16, lineHeight: 1.7, color: "var(--muted)", textWrap: "pretty" }}>{tr.descripcion}</p>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, marginBottom: 26 }}>
            <div><span style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{paradas.length ? "Recorrido terrestre" : "Información para tu viaje"}</span><h2 style={{ margin: "6px 0 0", fontSize: "clamp(30px, 3vw, 46px)", letterSpacing: "-0.035em", fontWeight: 400 }}>{paradas.length ? "Puntos del corredor" : "Prepara tu trayecto"}</h2></div>
            {paradas.length > 0 && <span style={{ fontSize: 13, color: "var(--muted)" }}>{paradas.length} referencias</span>}
          </div>
          {paradas.length > 0 && <p style={{ margin: "-12px 0 18px", color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>Los tiempos son acumulados y aproximados. Estos puntos describen el corredor geográfico; no garantizan escala, descenso ni embarque.</p>}
          {paradas.length === 0 ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))", gap: 1, border: "1px solid var(--line)", background: "var(--line)" }}>
            <article style={{ padding: 20, background: "var(--card)" }}><strong style={{ fontSize: 14 }}>Antes de salir</strong><p style={{ margin: "8px 0 0", color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>Confirma el punto de embarque, la hora y el tiempo de presentación para tu salida.</p></article>
            <article style={{ padding: 20, background: "var(--card)" }}><strong style={{ fontSize: 14 }}>Equipaje y vehículo</strong><p style={{ margin: "8px 0 0", color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>Consulta la franquicia de equipaje, el tipo de unidad y los servicios disponibles antes de pagar.</p></article>
            <article style={{ padding: 20, background: "var(--card)" }}><strong style={{ fontSize: 14 }}>Durante el trayecto</strong><p style={{ margin: "8px 0 0", color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>La duración es referencial; tránsito, clima y condiciones de la carretera pueden modificarla. Las paradas se confirman con el operador.</p></article>
          </div> : (
            <ol className={styles.routeItinerary}>
              {paradas.map((parada) => (
                <li key={parada.id} className={styles.routeStage}>
                  <div className={styles.routeStageHead}>
                    <strong className={styles.routeStageTitle}>{parada.nombre}</strong>
                    <span className={styles.routeStageTime}><MapPinIcon size={14} color="#d97706" />{formatearTiempoDeRuta(parada.minutos) ?? "Punto de referencia"}</span>
                  </div>
                  {parada.descripcion && <p className={styles.routeStageDescription}>{parada.descripcion}</p>}
                  {parada.duracionParadaMinutos > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, padding: "5px 8px", fontSize: 12, border: "1px solid var(--line)", borderRadius: 99 }}><Clock3Icon size={14} color="#2563eb" />Tiempo de parada: {formatearDuracion(parada.duracionParadaMinutos)}</span>}
                  {parada.imagenes?.[0] && <div className={styles.routeStageMedia}><span style={{ position: "absolute", zIndex: 1, top: 10, left: 10, display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 7px", borderRadius: 99, background: "var(--bg)", fontSize: 11, fontWeight: 700 }}><CameraIcon size={13} color="#8b5cf6" />Vista del lugar</span><ImageSlot radius={9} src={parada.imagenes[0].tipo === "VIDEO" ? undefined : parada.imagenes[0].url} video={parada.imagenes[0].tipo === "VIDEO" ? parada.imagenes[0].url : undefined} placeholder={parada.nombre} /></div>}
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
            {canalesReservaPara("TRANSPORTE").includes("WHATSAPP") && <a href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`${t("wa.rutaReservar")}${transporte.origenNombre} - ${transporte.destinoNombre}`)}`} target="_blank" rel="noopener noreferrer" style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "11px 14px", borderRadius: 7, textAlign: "center" }}>{t("common.reservarWhatsapp")}</a>}
            <Link href="/contacto" style={{ padding: "10px 14px", border: "1px solid var(--line)", borderRadius: 7, textAlign: "center" }}>{t("detalle.consultar")}</Link>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

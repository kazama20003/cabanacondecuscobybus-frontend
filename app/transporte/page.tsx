"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BusFront, Clock3, MapPin, Route } from "lucide-react";
import PageShell from "@/components/page-shell";
import { useT } from "@/lib/i18n";
import { useIdioma } from "@/components/lang-provider";
import { useTransportes } from "@/hooks/use-catalogo";
import type { SalidaApi, TransporteApi } from "@/lib/api/tipos";
import pageStyles from "./transporte.module.css";

const estadosReservables = new Set(["A_LA_VENTA", "PENDIENTE_DE_MINIMO", "CONFIRMADA"]);

function formatearDuracion(minutos?: number): string | null {
  if (!minutos || minutos <= 0) return null;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return [horas ? `${horas} h` : null, resto ? `${resto} min` : null].filter(Boolean).join(" ") || null;
}

function salidasFuturas(salidas: SalidaApi[] = []): SalidaApi[] {
  const ahora = Date.now();
  return salidas
    .filter((salida) => estadosReservables.has(salida.estado) && new Date(salida.fechaHoraSalida).getTime() > ahora)
    .sort((a, b) => new Date(a.fechaHoraSalida).getTime() - new Date(b.fechaHoraSalida).getTime());
}

function formatoSalida(fecha: string, idioma: string): string {
  try {
    return new Intl.DateTimeFormat(idioma, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(fecha));
  } catch {
    return new Intl.DateTimeFormat("es", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(fecha));
  }
}

function RutaFila({ item, index, idioma, t }: { item: TransporteApi; index: number; idioma: string; t: ReturnType<typeof useT> }) {
  const salidas = salidasFuturas(item.salidas);
  const precios = salidas.map((salida) => Number(salida.precioPen)).filter((precio) => Number.isFinite(precio) && precio > 0);
  const paradas = [...(item.paradas ?? [])].sort((a, b) => a.orden - b.orden);
  const duracionEstimada = item.duracionMinutos ?? (typeof item.duracionMinutosEstimada === "number" ? item.duracionMinutosEstimada : undefined);
  const duracion = formatearDuracion(duracionEstimada);
  const href = `/transporte/${item.slug}`;
  return (
    <article className={pageStyles.routeRow}>
      <div className={pageStyles.routeNumber}>{String(index + 1).padStart(2, "0")}</div>
      <Link href={href} className={pageStyles.routePath} aria-label={`${item.origenNombre} a ${item.destinoNombre}`}>
        <div className={pageStyles.routeNode}><span className={pageStyles.nodeDot} /><div><small>{t("ficha.origen")}</small><strong>{item.origenNombre}</strong></div></div>
        <div className={pageStyles.routeConnector} aria-hidden="true"><span>{paradas.length || <BusFront size={15} />}</span></div>
        <div className={pageStyles.routeNode}><span className={`${pageStyles.nodeDot} ${pageStyles.destinationDot}`} /><div><small>{t("ficha.destino")}</small><strong>{item.destinoNombre}</strong></div></div>
        {paradas.length > 0 && <p className={pageStyles.stopList}>{paradas.map((parada) => parada.nombre).join(" · ")}</p>}
      </Link>
      <div className={`${pageStyles.routeInfo} ${pageStyles.routeDuration}`}>
        <div className={pageStyles.infoLabel}><Clock3 size={14} />{t("ficha.duracion")}</div>
        <strong>{duracion ?? "—"}</strong>
      </div>
      <div className={`${pageStyles.routeInfo} ${pageStyles.routeDeparture}`}>
        <div className={pageStyles.infoLabel}><BusFront size={14} />{t("home.salidas")}</div>
        {salidas[0] ? <><strong>{formatoSalida(salidas[0].fechaHoraSalida, idioma)}</strong><small>{salidas.length} · {t("home.salidas")}</small></> : <strong className={pageStyles.mutedValue}>—</strong>}
      </div>
      <div className={pageStyles.routePrice}>
        <small>{t("common.desde")}</small>
        {precios.length ? <strong>S/ {Math.min(...precios)}</strong> : <strong>—</strong>}
      </div>
      <Link href={href} className={pageStyles.routeAction}>{t("common.verRuta")}<ArrowRight size={16} /></Link>
    </article>
  );
}

export default function TransportePage() {
  const t = useT();
  const { idioma } = useIdioma();
  const { data, isLoading, isError } = useTransportes();
  const transportes = data?.datos ?? [];
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const origenes = useMemo(() => [...new Set(transportes.map((item) => item.origenNombre))].sort(), [transportes]);
  const destinos = useMemo(() => [...new Set(transportes.map((item) => item.destinoNombre))].sort(), [transportes]);
  const rutasFiltradas = useMemo(() => transportes.filter((item) => (!origen || item.origenNombre === origen) && (!destino || item.destinoNombre === destino)), [transportes, origen, destino]);

  return (
    <PageShell>
      <main className={pageStyles.transportPage}>
        <header className={pageStyles.transportHero}>
          <div className={pageStyles.heroCopy}>
            <span className={pageStyles.eyebrow}><BusFront size={14} />{t("nav.transporte")}</span>
            <h1>{t("transporte.heroT1")}<br /><span>{t("transporte.heroT2")}</span></h1>
            <p>{t("transporte.intro")}</p>
          </div>
          <div className={pageStyles.heroRoute} aria-hidden="true">
            <div className={pageStyles.heroRouteLine} />
            <span className={pageStyles.heroPoint}><MapPin size={17} /><b>Arequipa</b></span>
            <span className={`${pageStyles.heroPoint} ${pageStyles.heroPointEnd}`}><MapPin size={17} /><b>Cusco</b></span>
            <div className={pageStyles.heroRouteCaption}><Route size={16} />{t("transporte.rutasHorarios")}<strong>{String(transportes.length).padStart(2, "0")}</strong></div>
          </div>
        </header>

        <section className={pageStyles.routeFinder} aria-label={t("transporte.rutasHorarios")}>
          <div className={pageStyles.finderHeading}><span>{t("nav.transporte")}</span><strong>{t("transporte.rutasHorarios")}</strong></div>
          <label className={pageStyles.filterField}><span>{t("ficha.origen")}</span><select value={origen} onChange={(event) => setOrigen(event.target.value)}><option value="">{t("transporte.cualquierOrigen")}</option>{origenes.map((nombre) => <option key={nombre} value={nombre}>{nombre}</option>)}</select></label>
          <div className={pageStyles.finderArrow}><ArrowRight size={19} /></div>
          <label className={pageStyles.filterField}><span>{t("ficha.destino")}</span><select value={destino} onChange={(event) => setDestino(event.target.value)}><option value="">{t("transporte.cualquierDestino")}</option>{destinos.map((nombre) => <option key={nombre} value={nombre}>{nombre}</option>)}</select></label>
          <div className={pageStyles.resultCount}><strong>{isLoading ? "—" : rutasFiltradas.length}</strong><span>{t("transporte.rutasHorarios")}</span></div>
        </section>

        <section className={pageStyles.routeBoard} aria-labelledby="route-board-title">
          <div className={pageStyles.boardHeading}><div><span className={pageStyles.sectionKicker}>{t("transporte.intro").split(".")[0]}</span><h2 id="route-board-title">{t("transporte.rutasHorarios")}</h2></div><p>{t("transporte.preciosNota")}</p></div>
          <div className={pageStyles.boardLabels} aria-hidden="true"><span>Ruta</span><span>{t("ficha.duracion")}</span><span>{t("home.salidas")}</span><span>{t("common.desde")}</span><span /></div>
          {isLoading && <p className={pageStyles.emptyState} role="status">{t("lista.cargandoRutas")}</p>}
          {isError && <p className={pageStyles.emptyState} role="alert">{t("lista.errorRutas")}</p>}
          {!isLoading && !isError && rutasFiltradas.length === 0 && <p className={pageStyles.emptyState}>{t("lista.sinRutas")}</p>}
          {!isLoading && !isError && rutasFiltradas.map((item, index) => <RutaFila key={item.slug} item={item} index={index} idioma={idioma} t={t} />)}
        </section>

        <section className={pageStyles.travelNote}><div className={pageStyles.noteIcon}><BusFront size={20} /></div><div><span className={pageStyles.sectionKicker}>{t("nav.transporte")}</span><h2>{t("transporte.reservarSimple")}</h2><p>{t("transporte.preciosNota")}</p></div><Link href="/contacto">{t("transporte.formularioContacto")}<ArrowRight size={16} /></Link></section>
      </main>
    </PageShell>
  );
}

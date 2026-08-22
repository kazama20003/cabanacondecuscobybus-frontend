"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ImageSlot from "@/components/image-slot";
import RouteCard from "@/components/route-card";
import {
  MEDIA_VIDEO,
  IMG_SAN_LAZARO,
  IMG_TEMPLO,
  transportRoutes,
  type TransportRoute,
} from "@/lib/data";
import { useToursSeed, useDestinations } from "@/lib/data-i18n";
import { useIdioma } from "@/components/lang-provider";
import { useT } from "@/lib/i18n";
import { useTours, useTransportes } from "@/hooks/use-catalogo";
import type { SalidaApi, TourApi, TraduccionApi, TransporteApi } from "@/lib/api";

function duracionTexto(min?: number): string {
  if (!min || min <= 0) return "";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return [h > 0 ? `${h}h` : null, m > 0 ? `${m}m` : null].filter(Boolean).join(" ");
}

function precioMin(salidas?: SalidaApi[]): number | null {
  if (!salidas?.length) return null;
  const precios = salidas
    .map((s) => Number(s.precioPen))
    .filter((n) => Number.isFinite(n) && n > 0);
  return precios.length ? Math.min(...precios) : null;
}

function horariosSalida(salidas?: SalidaApi[]): string[] {
  if (!salidas?.length) return [];
  const horas = salidas.map((s) =>
    new Date(s.fechaHoraSalida).toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );
  return Array.from(new Set(horas)).slice(0, 4);
}

/** Elige la traducción del idioma pedido, con respaldo en español. */
function elegirTr(
  traducciones: TraduccionApi[] | undefined,
  idioma: string,
): TraduccionApi | undefined {
  if (!traducciones?.length) return undefined;
  return (
    traducciones.find((x) => x.idioma === idioma) ??
    traducciones.find((x) => x.idioma === "es") ??
    traducciones[0]
  );
}

/** Mapea un transporte de la API al shape que consume RouteCard/el aside. */
function aRuta(t: TransporteApi, idioma: string): TransportRoute {
  const tr = elegirTr(t.traducciones as TraduccionApi[] | undefined, idioma);
  return {
    slug: t.slug,
    from: t.origenNombre,
    to: t.destinoNombre,
    description: tr?.resumen ?? "",
    duration: duracionTexto(
      typeof t.duracionMinutosEstimada === "number"
        ? t.duracionMinutosEstimada
        : undefined,
    ),
    distance: "",
    vehicle: "",
    departures: horariosSalida(t.salidas),
    frequency: "",
    priceFrom: precioMin(t.salidas) ?? 0,
    image: t.imagenes?.[0]?.url ?? "",
    stops: [],
    highlights: [],
  };
}

export default function Home() {
  const asideScrollRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const { idioma } = useIdioma();
  const tours = useToursSeed();
  const destinations = useDestinations();
  const { data: transportesApi } = useTransportes({ pagina: 1, porPagina: 6 });
  const { data: toursApi } = useTours({ pagina: 1, porPagina: 12 });

  // API con respaldo en los datos de ejemplo mientras carga o si está vacía.
  const rutas: TransportRoute[] = transportesApi?.datos?.length
    ? transportesApi.datos.map((tp) => aRuta(tp, idioma))
    : transportRoutes;
  const toursLista = toursApi?.datos?.length
    ? (toursApi.datos as TourApi[]).map((tour) => {
        const tr = elegirTr(tour.traducciones as TraduccionApi[] | undefined, idioma);
        return {
          slug: tour.slug,
          name: tr?.titulo || (tour.nombre as string) || (tour.destinoNombre as string) || tour.slug,
          location: (tour.destinoNombre as string) ?? "",
          duration: duracionTexto(tour.duracionMinutos as number | undefined),
          priceFrom: precioMin(tour.salidas) ?? 0,
          image: tour.imagenes?.[0]?.url ?? "",
        };
      })
    : tours.map((tr) => ({
        slug: tr.slug,
        name: tr.name,
        location: tr.location,
        duration: tr.duration,
        priceFrom: tr.priceFrom,
        image: tr.image,
      }));

  // Scroll aislado + suave (tipo Lenis) en el aside: mientras pueda scrollear
  // internamente, bloquea la pagina y desliza el aside con lerp; en el borde
  // (arriba/abajo) suelta el evento para que la pagina siga con normalidad.
  useEffect(() => {
    const el = asideScrollRef.current;
    if (!el) return;
    let target = el.scrollTop;
    let raf = 0;
    let animating = false;
    const animate = () => {
      const diff = target - el.scrollTop;
      if (Math.abs(diff) < 0.5) {
        el.scrollTop = target;
        animating = false;
        return;
      }
      el.scrollTop += diff * 0.15; // lerp
      raf = requestAnimationFrame(animate);
    };
    const onWheel = (e: WheelEvent) => {
      const max = el.scrollHeight - el.clientHeight;
      const atTop = el.scrollTop <= 0;
      const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
      const goingDown = e.deltaY > 0;
      const canScrollInner = (goingDown && !atBottom) || (!goingDown && !atTop);
      if (canScrollInner) {
        e.preventDefault();
        e.stopPropagation();
        target = Math.max(0, Math.min(max, target + e.deltaY));
        if (!animating) {
          animating = true;
          raf = requestAnimationFrame(animate);
        }
      } else {
        // borde: sincroniza el objetivo y deja pasar el evento a Lenis (pagina)
        target = el.scrollTop;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", padding: "0 24px 48px" }}>
      <SiteHeader />

      {/* Hero */}
      <h1
        style={{
          fontSize: "clamp(48px, 6.2vw, 96px)",
          lineHeight: 1.06,
          letterSpacing: "-0.03em",
          fontWeight: 400,
          margin: "48px 0 40px",
          textWrap: "pretty",
        }}
      >
        {t("home.heroTitle1")}
        <br />
        {t("home.heroTitle2")}
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 366px", gap: 16, alignItems: "stretch" }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "1502 / 645", minWidth: 0 }}>
          <ImageSlot radius={10} video={MEDIA_VIDEO} placeholder="Video principal" />
        </div>
        {/* aside: mismo alto que el video (el contenido absoluto no estira la fila);
            solo esta columna hace scroll interno */}
        <aside style={{ position: "relative", minWidth: 0 }}>
          <div
            ref={asideScrollRef}
            className="no-scrollbar"
            style={{
              position: "absolute",
              inset: 0,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 22,
              paddingTop: 14,
              paddingRight: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{t("home.transporteTuristico")}</h3>
              <Link href="/transporte" style={{ color: "var(--fg)", fontSize: 13.5, fontWeight: 600 }}>
                {t("home.verTodas")}
              </Link>
            </div>
            {rutas.slice(0, 3).map((ruta, i) => (
              <div
                key={ruta.slug}
                style={{
                  paddingTop: i === 0 ? 0 : 20,
                  borderTop: i === 0 ? "none" : "1px solid var(--line)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {t("home.ruta")} {String(i + 1).padStart(2, "0")}{ruta.duration ? ` · ${ruta.duration}` : ""}
                  </span>
                  <Link href={`/transporte/${ruta.slug}`} style={{ color: "var(--fg)", fontSize: 15 }}>
                    +
                  </Link>
                </div>
                <h3 style={{ margin: "8px 0 6px", fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
                  {ruta.from} → {ruta.to}
                </h3>
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: 13.5,
                    lineHeight: 1.45,
                    color: "var(--muted)",
                    textWrap: "pretty",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {ruta.description}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "0 0 12px" }}>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{t("common.desde")}</span>
                  <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
                    S/ {ruta.priceFrom}
                  </span>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{t("common.porPersona")}</span>
                </div>
                <div style={{ position: "relative", width: "100%", height: 200 }}>
                  <ImageSlot radius={10} src={ruta.image} placeholder={`${ruta.from} → ${ruta.to}`} />
                  <span
                    style={{
                      position: "absolute",
                      bottom: 10,
                      left: 10,
                      background: "var(--pill-bg)",
                      color: "var(--pill-fg)",
                      borderRadius: 999,
                      padding: "5px 12px",
                      fontSize: 12.5,
                      fontWeight: 700,
                      pointerEvents: "none",
                      boxShadow: "0 2px 10px rgba(0,0,0,.18)",
                    }}
                  >
                    {t("common.desde")} S/ {ruta.priceFrom}
                  </span>
                  {ruta.departures.length > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: "rgba(0,0,0,.55)",
                        color: "#fff",
                        borderRadius: 999,
                        padding: "4px 10px",
                        fontSize: 11.5,
                        fontWeight: 600,
                        pointerEvents: "none",
                      }}
                    >
                      {t("home.salidas")}: {ruta.departures.join(" · ")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Rutas de transporte destacadas */}
      <section style={{ marginTop: 140 }}>
        <h2
          style={{
            margin: "0 0 8px 33%",
            maxWidth: 560,
            fontSize: "clamp(28px, 2.4vw, 40px)",
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
            fontWeight: 400,
            textWrap: "pretty",
          }}
        >
          {t("home.sec1")}
        </h2>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          <Link
            href="/transporte"
            style={{ background: "var(--card)", borderRadius: 8, padding: "7px 12px", fontSize: 14, fontWeight: 600 }}
          >
            {t("home.verTodasRutas")}
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {rutas.slice(0, 4).map((r) => (
            <RouteCard key={r.slug} route={r} video={MEDIA_VIDEO} compact />
          ))}
        </div>
      </section>

      {/* Testimonios */}
      <section style={{ marginTop: 160 }}>
        <h2
          style={{
            margin: "0 0 48px 33%",
            maxWidth: 540,
            fontSize: "clamp(28px, 2.4vw, 40px)",
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
            fontWeight: 400,
            textWrap: "pretty",
          }}
        >
          {t("home.sec2")}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 26 }}>
          {[
            { name: "María Fernanda R.", role: t("home.testiRole1"), badge: "MR" },
            { name: "Lucas B.", role: t("home.testiRole2"), badge: "LB" },
          ].map((testi, i) => (
            <figure key={i} style={{ margin: 0 }}>
              <div style={{ width: "100%", height: 520, position: "relative" }}>
                <ImageSlot radius={10} video={MEDIA_VIDEO} placeholder={`${t("home.videoTesti")} ${i + 1}`} />
              </div>
              <figcaption style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <span
                  style={{
                    width: 50,
                    height: 34,
                    borderRadius: 5,
                    background: "var(--fg)",
                    color: "var(--bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                  }}
                >
                  ▶
                </span>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 5,
                    background: "var(--fg)",
                    color: "var(--bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {testi.badge}
                </span>
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
                  <strong style={{ fontSize: 14 }}>{testi.name}</strong>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>{testi.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Galería tours / destinos */}
      <section style={{ marginTop: 160 }}>
        <h2
          style={{
            margin: "0 auto 56px",
            maxWidth: 620,
            textAlign: "center",
            fontSize: "clamp(28px, 2.4vw, 40px)",
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
            fontWeight: 400,
            textWrap: "pretty",
          }}
        >
          {t("home.sec3")}
        </h2>
        <div style={{ columns: 5, columnGap: 10 }}>
          {toursLista.map((tour, i) => (
            <Link key={tour.slug} href="/tours" style={{ display: "block", margin: "0 0 22px", breakInside: "avoid" }}>
              <div style={{ width: "100%", height: 160 + ((i * 67) % 160), position: "relative" }}>
                <ImageSlot radius={10} src={tour.image} placeholder={tour.name} />
              </div>
              <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.45 }}>
                <strong style={{ fontWeight: 600 }}>{tour.name}</strong>{" "}
                {tour.location && <span style={{ color: "var(--muted)" }}>/ {tour.location}</span>}
                <br />
                <span style={{ color: "var(--muted)", fontSize: 12.5 }}>
                  {[tour.duration, tour.priceFrom ? `${t("common.desde").toLowerCase()} S/ ${tour.priceFrom}` : null].filter(Boolean).join(" · ")}
                </span>
              </div>
            </Link>
          ))}
          {destinations.map((d, i) => (
            <Link key={d.slug} href="/destinos" style={{ display: "block", margin: "0 0 22px", breakInside: "avoid" }}>
              <div style={{ width: "100%", height: 140 + ((i * 89) % 180), position: "relative" }}>
                <ImageSlot radius={10} src={d.image} placeholder={d.name} />
              </div>
              <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.45 }}>
                <strong style={{ fontWeight: 600 }}>{d.name}</strong>{" "}
                <span style={{ color: "var(--muted)" }}>/ {d.region}</span>
                <br />
                <span style={{ color: "var(--muted)", fontSize: 12.5 }}>{d.altitude}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sobre la empresa */}
      <section
        style={{
          marginTop: 160,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            background: "var(--card)",
            padding: "48px 44px",
            fontSize: "clamp(24px, 2vw, 34px)",
            lineHeight: 1.28,
            letterSpacing: "-0.015em",
            textWrap: "pretty",
          }}
        >
          <p style={{ margin: "0 0 1em" }}>{t("home.aboutP1")}</p>
          <p style={{ margin: "0 0 1em" }}>{t("home.aboutP2")}</p>
          <p style={{ margin: 0 }}>{t("home.aboutP3")}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ position: "relative", width: "100%", height: 480 }}>
            <ImageSlot radius={10} src={IMG_SAN_LAZARO} placeholder={t("home.officePhoto")} />
            <div style={{ position: "absolute", top: 14, left: 16, pointerEvents: "none", lineHeight: 1.3, fontSize: 13.5, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,.5)" }}>
              <strong>Cusco</strong>
              <br />
              <span style={{ opacity: 0.85 }}>{t("home.oficinaPrincipal")}</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 12 }}>
            {[
              { name: t("home.transporteTuristico"), role: t("home.cardTransRole"), href: "/transporte" },
              { name: t("footer.trasladosPrivados"), role: t("home.cardTrasRole"), href: "/traslados" },
            ].map((f) => (
              <Link key={f.name} href={f.href} style={{ background: "var(--card)", padding: "14px 16px 16px", borderRadius: 14, display: "block" }}>
                <div style={{ lineHeight: 1.3, fontSize: 13.5, marginBottom: 12 }}>
                  <strong>{f.name}</strong>
                  <br />
                  <span style={{ color: "var(--muted)" }}>{f.role}</span>
                </div>
                <div style={{ position: "relative", width: "100%", height: 300 }}>
                  <ImageSlot radius={10} src={IMG_TEMPLO} placeholder={f.name} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

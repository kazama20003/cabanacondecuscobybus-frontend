"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ImageSlot from "@/components/image-slot";
import {
  MEDIA_VIDEO,
  IMG_SAN_LAZARO,
  IMG_TEMPLO,
  transportRoutes,
  tours,
  destinations,
} from "@/lib/data";

export default function Home() {
  const asideScrollRef = useRef<HTMLDivElement>(null);

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
          margin: "118px 0 40px",
          textWrap: "pretty",
        }}
      >
        Transporte, tours &amp; traslados.
        <br />
        Agencia de <em className="serif">viajes</em> en el sur del Perú.
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
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 600 }}>Sobre Inca Travel Peru</h3>
                <Link href="/nosotros" style={{ color: "var(--fg)", fontSize: 15 }}>
                  +
                </Link>
              </div>
              <p style={{ margin: "0 0 16px", fontSize: 13.5, lineHeight: 1.45, color: "var(--muted)", textWrap: "pretty" }}>
                Agencia de turismo con base en Cusco. Conectamos el circuito sur — Cusco, Arequipa, Colca, Puno y
                Machu Picchu — con flota propia, guías locales y salidas diarias.
              </p>
              <div style={{ position: "relative", width: "100%", height: 200 }}>
                <ImageSlot radius={10} src={IMG_SAN_LAZARO} placeholder="Foto del equipo" />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>Transporte · Ruta destacada</span>
                <Link href="/transporte/cusco-arequipa" style={{ color: "var(--fg)", fontSize: 15 }}>
                  +
                </Link>
              </div>
              <h3 style={{ margin: "8px 0 6px", fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
                Cusco → Arequipa en bus turístico
              </h3>
              <p style={{ margin: "0 0 16px", fontSize: 13.5, lineHeight: 1.45, color: "var(--muted)", textWrap: "pretty" }}>
                Nuestra ruta insignia: asientos semicama, WiFi a bordo y salidas diarias 07:30 y 20:30. Desde S/ 90.
              </p>
              <div style={{ position: "relative", width: "100%", height: 200 }}>
                <ImageSlot radius={10} src={IMG_TEMPLO} placeholder="Bus turístico" />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>Video · En ruta</span>
                <Link href="/destinos" style={{ color: "var(--fg)", fontSize: 15 }}>
                  +
                </Link>
              </div>
              <h3 style={{ margin: "8px 0 6px", fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
                Así se viaja con nosotros
              </h3>
              <p style={{ margin: "0 0 16px", fontSize: 13.5, lineHeight: 1.45, color: "var(--muted)", textWrap: "pretty" }}>
                Un vistazo al camino: volcanes, valles y el altiplano desde la ventana de nuestra flota.
              </p>
              <div style={{ position: "relative", width: "100%", height: 200 }}>
                <ImageSlot radius={10} video={MEDIA_VIDEO} placeholder="Video en ruta" />
              </div>
            </div>
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
          Nuestro producto principal: <em className="serif">transporte turístico</em> con salidas diarias por todo el
          circuito sur.
        </h2>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          <Link
            href="/transporte"
            style={{ background: "var(--card)", borderRadius: 8, padding: "7px 12px", fontSize: 14, fontWeight: 600 }}
          >
            Ver todas las rutas
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {transportRoutes.slice(0, 4).map((r) => (
            <Link
              key={r.slug}
              href={`/transporte/${r.slug}`}
              style={{
                display: "grid",
                gridTemplateColumns: "1.35fr 1fr 1fr 1fr",
                gap: 6,
                borderTop: "1px solid var(--line)",
                paddingTop: 10,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      borderRadius: 7,
                      background: "var(--fg)",
                      color: "var(--bg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      width: 34,
                      height: 34,
                      fontSize: 15,
                    }}
                  >
                    ⇄
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
                    <strong style={{ fontSize: 14 }}>
                      {r.from} → {r.to}
                    </strong>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>
                      {r.duration} · {r.distance}
                    </span>
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: "var(--muted)", maxWidth: 320, textWrap: "pretty" }}>
                  {r.description}
                </p>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.65, alignSelf: "center" }}>
                <div style={{ color: "var(--muted)" }}>Salidas</div>
                <div style={{ fontWeight: 600 }}>{r.departures.join(" · ")}</div>
                <div style={{ color: "var(--muted)", marginTop: 4 }}>{r.frequency}</div>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.65, alignSelf: "center" }}>
                <div style={{ color: "var(--muted)" }}>Vehículo</div>
                <div style={{ fontWeight: 600, textWrap: "pretty" }}>{r.vehicle}</div>
                <div style={{ fontWeight: 700, marginTop: 4 }}>
                  Desde S/ {r.priceFrom} <span style={{ color: "var(--muted)", fontWeight: 400 }}>p/persona</span>
                </div>
              </div>
              <div style={{ aspectRatio: "3 / 2", position: "relative" }}>
                <ImageSlot radius={10} src={r.image} placeholder={`${r.from} — ${r.to}`} />
              </div>
            </Link>
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
          Miles de viajeros ya cruzaron el sur del Perú <em className="serif">con nosotros</em>.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 26 }}>
          {[
            { name: "María Fernanda R.", role: "Viajó Cusco → Arequipa", badge: "MR" },
            { name: "Lucas B.", role: "Tour Cañón del Colca 2D", badge: "LB" },
          ].map((t, i) => (
            <figure key={i} style={{ margin: 0 }}>
              <div style={{ width: "100%", height: 520, position: "relative" }}>
                <ImageSlot radius={10} video={MEDIA_VIDEO} placeholder={`Video testimonial ${i + 1}`} />
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
                  {t.badge}
                </span>
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
                  <strong style={{ fontSize: 14 }}>{t.name}</strong>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>{t.role}</span>
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
          <em className="serif">Tours y destinos</em> que puedes combinar con tu ruta de transporte.
        </h2>
        <div style={{ columns: 5, columnGap: 10 }}>
          {tours.map((t, i) => (
            <Link key={t.slug} href="/tours" style={{ display: "block", margin: "0 0 22px", breakInside: "avoid" }}>
              <div style={{ width: "100%", height: 160 + ((i * 67) % 160), position: "relative" }}>
                <ImageSlot radius={10} src={t.image} placeholder={t.name} />
              </div>
              <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.45 }}>
                <strong style={{ fontWeight: 600 }}>{t.name}</strong>{" "}
                <span style={{ color: "var(--muted)" }}>/ {t.location}</span>
                <br />
                <span style={{ color: "var(--muted)", fontSize: 12.5 }}>
                  {t.duration} · desde S/ {t.priceFrom}
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
          <p style={{ margin: "0 0 1em" }}>
            Inca Travel Peru© es una agencia de turismo especializada en <em className="serif">transporte turístico</em>,{" "}
            <em className="serif">tours</em> y <em className="serif">traslados</em> por el sur del Perú.
          </p>
          <p style={{ margin: "0 0 1em" }}>
            Flota propia, guías locales y salidas diarias entre Cusco, Arequipa, el Valle del Colca, Puno y{" "}
            <em className="serif">Machu Picchu</em>.
          </p>
          <p style={{ margin: 0 }}>
            Pequeños por elección y viajeros de corazón: eliminamos intermediarios para que tu viaje sea más directo,
            más seguro y a mejor precio.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ position: "relative", width: "100%", height: 480 }}>
            <ImageSlot radius={10} src={IMG_SAN_LAZARO} placeholder="Foto de la oficina" />
            <div style={{ position: "absolute", top: 14, left: 16, pointerEvents: "none", lineHeight: 1.3, fontSize: 13.5, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,.5)" }}>
              <strong>Cusco</strong>
              <br />
              <span style={{ opacity: 0.85 }}>Oficina principal</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 12 }}>
            {[
              { name: "Transporte turístico", role: "6 rutas · salidas diarias", href: "/transporte" },
              { name: "Traslados privados", role: "Aeropuerto · hoteles · 24/7", href: "/traslados" },
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

"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { Bus, Car, MapPin, Compass, Users, Phone, LogIn } from "lucide-react";

/* ---------- image-slot replacement: simple placeholder box ---------- */
function ImageSlot({
  radius = 12,
  circle = false,
  placeholder,
  src,
  video,
  style,
}: {
  radius?: number;
  circle?: boolean;
  placeholder?: string;
  /** URL de imagen a mostrar (object-fit: cover) */
  src?: string;
  /** URL de video a reproducir en bucle, muteado (object-fit: cover) */
  video?: string;
  style?: CSSProperties;
}) {
  const box: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    borderRadius: circle ? "50%" : radius,
    overflow: "hidden",
    ...style,
  };

  if (video) {
    return (
      <video
        style={{ ...box, objectFit: "cover" }}
        src={video}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    );
  }

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img style={{ ...box, objectFit: "cover" }} src={src} alt={placeholder ?? ""} />;
  }

  return (
    <div
      style={{
        ...box,
        background:
          "repeating-linear-gradient(135deg, var(--line) 0 12px, transparent 12px 24px), var(--card)",
        border: "1px solid var(--line)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--muted)",
        fontSize: 12,
        textAlign: "center",
        padding: 12,
      }}
    >
      {placeholder}
    </div>
  );
}

/* ---------- media URLs (Cloudinary) ---------- */
const MEDIA_VIDEO =
  "https://res.cloudinary.com/dhkb93mix/video/upload/v1773250748/11929213_1920_1080_60fps_ulvu5b.mp4";
const MEDIA_IMAGE =
  "https://res.cloudinary.com/dhkb93mix/image/upload/v1786211023/big-ca579d84d7d5736a2999e621892f1a44_upjf05.jpg";
const IMG_SAN_LAZARO =
  "https://res.cloudinary.com/dhkb93mix/image/upload/v1786211023/the-san-lazaro-neighborhood-the-oldest-in-arequipa-272_nac7bs.jpg";
const IMG_TEMPLO =
  "https://res.cloudinary.com/dhkb93mix/image/upload/v1786211022/arequipa-peru-temple-7186-main_uxvqws.jpg";
// pool para rellenar slots repetidos (galeria, experimentos)
const PHOTOS = [MEDIA_IMAGE, IMG_SAN_LAZARO, IMG_TEMPLO];

/* ---------- data ---------- */
const projects = [
  { glyph: "≡", name: "Nuvex", sector: "Fintech", desc: "A trustworthy, scalable site that establishes Nuvex as the wealthtech of choice for leading private banks." },
  { glyph: "◗", name: "Marlin", sector: "Maritime", desc: "A future-facing brand platform empowering Marlin to lead the maritime sector's digital and sustainable transformation." },
  { glyph: "//", name: "Qorra", sector: "Networks", desc: "Brand and website to position Qorra as best in class in global network optimization." },
  { glyph: "ıl", name: "Helia", sector: "Pharma", desc: "A scalable brand platform uniting Helia's products and empowering marketers to drive conversion." },
  { glyph: "V", name: "Vanta", sector: "Sports Tech", desc: "Scalable components and advanced multi-language setup for a fast-growing sports tech brand." },
];

const experiments = [
  { name: "ASCII", cat: "Design Tool", h: 180 },
  { name: "Sketch", cat: "Client Project", h: 240 },
  { name: "AI Assistant", cat: "Internal", h: 320 },
  { name: "Noteworthy", cat: "Concept", h: 260 },
  { name: "Sake Research", cat: "Exploration", h: 150 },
  { name: "Hubform", cat: "Product", h: 130 },
  { name: "Midjourney", cat: "Exploration", h: 300 },
  { name: "FlowGuide", cat: "Template", h: 210 },
  { name: "GEO Workspace", cat: "Tool", h: 290 },
  { name: "Japan Posters", cat: "Concept", h: 240 },
  { name: "Warlock Island", cat: "Game", h: 130 },
  { name: "Flowie", cat: "Logo", h: 110 },
  { name: "Cards Against Corona", cat: "Platform", h: 200 },
  { name: "yearr", cat: "Product Concept", h: 120 },
  { name: "Tote Bag", cat: "Merchandise", h: 260 },
];

const footWork = [
  { glyph: "≡", name: "Nuvex" },
  { glyph: "◗", name: "Marlin" },
  { glyph: "ıl", name: "Helia" },
  { glyph: "//", name: "Qorra" },
  { glyph: "◑", name: "Teamway" },
  { glyph: "V", name: "Vanta" },
  { glyph: "H", name: "Highground" },
];

const footServices = [
  { glyph: "⊕", name: "Enterprise-Grade Website" },
  { glyph: "◈", name: "Scalable Component Build" },
  { glyph: "✳", name: "GEO (Generative Engine Optimisation)" },
  { glyph: "Aa", name: "Brand Guidelines" },
  { glyph: "▤", name: "Website Architecture" },
  { glyph: "◉", name: "Motion Design" },
  { glyph: "▣", name: "Handover & Training" },
  { glyph: "↗", name: "View all services" },
];

const footProducts = [
  { glyph: "S", name: "STEEP" },
  { glyph: "◍", name: "Hubform" },
  { glyph: "✦", name: "FlowGuide™" },
];

const footPosts = [
  "Webflow & AI coding: building websites in 2026",
  "About Inca",
  "The Small Studio Advantage In The AI Era",
  "When AI photography beats stock",
  "Cookie Consent for Webflow Analyze",
  "Inviting 55 artists to combat the pandemic",
  "How we use Midjourney to generate brand visuals",
  "AEO & GEO: How to stay visible in the age of AI search",
];

/* ---------- shared style bits ---------- */
const navPill: CSSProperties = {
  background: "var(--card)",
  borderRadius: 3,
  padding: "7px 11px",
};

const glyphBox: CSSProperties = {
  borderRadius: 6,
  background: "var(--fg)",
  color: "var(--bg)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
};

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
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

  useEffect(() => {
    const saved = (localStorage.getItem("inca-theme") as "light" | "dark") || "light";
    setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("inca-theme", next);
      return next;
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", padding: "0 24px 48px" }}>
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <a
            href="#"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "var(--fg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
            }}
          >
            <span style={{ width: 16, height: 16, borderRadius: "50%", background: "var(--bg)", display: "inline-block" }} />
          </a>
          <nav style={{ display: "flex", gap: 5, fontSize: 14.5, fontWeight: 600, letterSpacing: "-0.01em" }}>
            {[
              { label: "Transporte", Icon: Bus },
              { label: "Traslados", Icon: Car },
              { label: "Tours", Icon: MapPin },
              { label: "Destinos", Icon: Compass },
              { label: "Nosotros", Icon: Users },
            ].map(({ label, Icon }) => (
              <a key={label} href="#" style={{ ...navPill, display: "flex", alignItems: "center", gap: 6 }}>
                <Icon size={15} strokeWidth={2} />
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14.5, fontWeight: 600, letterSpacing: "-0.01em" }}>
          <a href="#" style={{ ...navPill, padding: "7px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <Phone size={15} strokeWidth={2} />
            Contacto
          </a>
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 13px",
              borderRadius: 3,
              background: "var(--btn-bg)",
              color: "var(--btn-fg)",
            }}
          >
            <LogIn size={15} strokeWidth={2} />
            Iniciar sesión
          </a>
          <button
            onClick={toggleTheme}
            title="Cambiar tema"
            style={{
              height: 30,
              width: 30,
              border: "none",
              background: "transparent",
              color: "var(--fg)",
              cursor: "pointer",
              fontSize: 17,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
      </header>

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
        Los mejores viajes &amp; tours.
        <br />
        Agencia de <em className="serif">viajes</em>.
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 366px", gap: 16, alignItems: "stretch" }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "1502 / 645", minWidth: 0 }}>
          <ImageSlot radius={0} video={MEDIA_VIDEO} placeholder="Video principal" />
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
              <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 600 }}>About Inca</h3>
              <span style={{ display: "flex", gap: 10, color: "var(--fg)", fontSize: 15 }}>
                <span>⌖</span>
                <span>+</span>
              </span>
            </div>
            <p style={{ margin: "0 0 16px", fontSize: 13.5, lineHeight: 1.45, color: "var(--muted)", textWrap: "pretty" }}>
              Inca is an innovation studio for branding, websites, and AI visibility. Two people helping ambitious brands turn complex
              products into clear experiences.
            </p>
            <div style={{ position: "relative", width: "100%", height: 200 }}>
              <ImageSlot radius={4} src={IMG_SAN_LAZARO} placeholder="Foto del equipo" />
            </div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>Insight · July 17, 2026</span>
              <span style={{ color: "var(--fg)", fontSize: 15 }}>+</span>
            </div>
            <h3 style={{ margin: "8px 0 6px", fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
              Webflow &amp; AI coding: building websites in 2026
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: 13.5, lineHeight: 1.45, color: "var(--muted)", textWrap: "pretty" }}>
              For serious B2B marketing sites we still choose Webflow. For tools, prototypes, and experiments we build directly with AI.
            </p>
            <div style={{ position: "relative", width: "100%", height: 200 }}>
              <ImageSlot radius={4} src={IMG_TEMPLO} placeholder="Imagen del post" />
            </div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>Reel · 2026</span>
              <span style={{ color: "var(--fg)", fontSize: 15 }}>+</span>
            </div>
            <h3 style={{ margin: "8px 0 6px", fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
              Behind the studio
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: 13.5, lineHeight: 1.45, color: "var(--muted)", textWrap: "pretty" }}>
              A short look at how we work — from first sketch to shipped brand.
            </p>
            <div style={{ position: "relative", width: "100%", height: 200 }}>
              <ImageSlot radius={4} video={MEDIA_VIDEO} placeholder="Video del estudio" />
            </div>
          </div>
          </div>
        </aside>
      </div>

      {/* Projects */}
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
          Partnering with <em className="serif">ambitious</em> teams to build relevant digital experiences in the age of prompting.
        </h2>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          <a href="#" style={{ ...navPill, padding: "7px 12px", fontSize: 14, fontWeight: 600 }}>
            Explore all
          </a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {projects.map((p) => (
            <div
              key={p.name}
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
                  <span style={{ ...glyphBox, width: 34, height: 34, borderRadius: 7, fontSize: 15 }}>{p.glyph}</span>
                  <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
                    <strong style={{ fontSize: 14 }}>{p.name}</strong>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>{p.sector}</span>
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: "var(--muted)", maxWidth: 320, textWrap: "pretty" }}>
                  {p.desc}
                </p>
              </div>
              {[1, 2, 3].map((n) => (
                <div key={n} style={{ aspectRatio: "3 / 2", position: "relative" }}>
                  <ImageSlot radius={0} src={PHOTOS[n % PHOTOS.length]} placeholder={`Imagen ${n}`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
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
          An <em className="serif">award-winning</em> studio that care about good work and developing relationships that enables it.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 26 }}>
          {[
            { name: "Andrés Jara", role: "Founder, No Walls Studio", badge: "✕", badgeBg: "var(--fg)", badgeFg: "var(--bg)" },
            { name: "Rasmus Kalé", role: "CPO, Helia", badge: "ıl", badgeBg: "#6437e0", badgeFg: "#fff" },
          ].map((t, i) => (
            <figure key={i} style={{ margin: 0 }}>
              <div style={{ width: "100%", height: 520, position: "relative" }}>
                <ImageSlot radius={0} video={MEDIA_VIDEO} placeholder={`Video testimonial ${i + 1}`} />
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
                    background: t.badgeBg,
                    color: t.badgeFg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
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

      {/* Experiments masonry */}
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
          Our <em className="serif">experiments, products</em> and <em className="serif">curiosity</em> shapes new ways of working.
        </h2>
        <div style={{ columns: 5, columnGap: 10 }}>
          {experiments.map((e, i) => (
            <figure key={e.name} style={{ margin: "0 0 22px", breakInside: "avoid" }}>
              <div style={{ width: "100%", height: e.h, position: "relative" }}>
                <ImageSlot radius={0} src={PHOTOS[i % PHOTOS.length]} placeholder={e.name} />
              </div>
              <figcaption style={{ marginTop: 8, fontSize: 13 }}>
                <strong style={{ fontWeight: 600 }}>{e.name}</strong> <span style={{ color: "var(--muted)" }}>/ {e.cat}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* About / studio */}
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
            Inca© is a digital innovation studio working across <em className="serif">branding</em>, <em className="serif">websites</em>,
            and <em className="serif">AI visibility</em>.
          </p>
          <p style={{ margin: "0 0 1em" }}>
            We help ambitious brands turn complex products into clear brands, scalable websites, and digital experiences built for{" "}
            <em className="serif">scale</em> and <em className="serif">conversion</em>.
          </p>
          <p style={{ margin: 0 }}>
            Small by choice and entrepreneurial by heart, we work from strategy to design to build, eliminating bureaucracy so ideas can
            move faster and land better.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ position: "relative", width: "100%", height: 480 }}>
            <ImageSlot radius={0} src={MEDIA_IMAGE} placeholder="Foto de la oficina" />
            <div style={{ position: "absolute", top: 14, left: 16, pointerEvents: "none", lineHeight: 1.3, fontSize: 13.5 }}>
              <strong>Lima</strong>
              <br />
              <span style={{ opacity: 0.75 }}>Oficina</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 12 }}>
            {[
              { name: "Daniel B.", role: "Founder & Builder" },
              { name: "Casper N.", role: "Founder & Builder" },
            ].map((f) => (
              <div key={f.name} style={{ background: "var(--card)", padding: "14px 16px 16px" }}>
                <div style={{ lineHeight: 1.3, fontSize: 13.5, marginBottom: 12 }}>
                  <strong>{f.name}</strong>
                  <br />
                  <span style={{ color: "var(--muted)" }}>{f.role}</span>
                </div>
                <div style={{ position: "relative", width: "100%", height: 300 }}>
                  <ImageSlot radius={0} src={MEDIA_IMAGE} placeholder="Retrato" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 160 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
          <FooterColumn title="Work">
            {footWork.map((w) => (
              <FooterLink key={w.name} glyph={w.glyph} label={w.name} />
            ))}
          </FooterColumn>
          <FooterColumn title="Services">
            {footServices.map((s) => (
              <FooterLink key={s.name} glyph={s.glyph} label={s.name} />
            ))}
          </FooterColumn>
          <FooterColumn title="Products">
            {footProducts.map((pr) => (
              <FooterLink key={pr.name} glyph={pr.glyph} label={pr.name} />
            ))}
          </FooterColumn>
          <FooterColumn title="Posts">
            {footPosts.map((po) => (
              <a
                key={po}
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "15px 0",
                  borderBottom: "1px solid var(--line)",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {po}
              </a>
            ))}
          </FooterColumn>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
            gap: 40,
            alignItems: "center",
            marginTop: 130,
            paddingBottom: 60,
          }}
        >
          <span
            style={{
              width: 164,
              height: 164,
              borderRadius: "50%",
              background: "var(--fg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ width: 96, height: 116, borderRadius: 22, background: "var(--bg)", display: "inline-block" }} />
          </span>
          <div>
            <h2
              style={{
                margin: "0 0 40px",
                maxWidth: 420,
                fontSize: "clamp(26px, 2.2vw, 38px)",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                fontWeight: 400,
                textWrap: "pretty",
              }}
            >
              Want a peek at how we could collaborate?
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 44, fontSize: 14, fontWeight: 600 }}>
              <a href="#" style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "8px 13px", borderRadius: 3 }}>
                Book a call
              </a>
              <a href="mailto:hello@inca.co">hello@inca.co</a>
              <a href="tel:+5114801001">(+51) 4180 1001</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{ margin: "0 0 24px", fontSize: "clamp(28px, 2.2vw, 38px)", fontWeight: 400, letterSpacing: "-0.02em" }}>{title}</h3>
      {children}
    </div>
  );
}

function FooterLink({ glyph, label }: { glyph: string; label: string }) {
  return (
    <a
      href="#"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px solid var(--line)",
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      <span style={{ ...glyphBox, width: 26, height: 26, fontSize: 12 }}>{glyph}</span>
      {label}
    </a>
  );
}

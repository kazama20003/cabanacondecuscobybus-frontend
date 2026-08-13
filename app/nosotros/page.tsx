import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import { MEDIA_IMAGE, IMG_SAN_LAZARO, IMG_TEMPLO, CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nosotros — Inca Travel Peru",
  description:
    "Inca Travel Peru es una agencia de turismo del sur del Perú especializada en transporte turístico, tours y traslados entre Cusco, Arequipa, Colca y Puno.",
};

const values = [
  {
    title: "Seguridad primero",
    desc: "Flota propia con GPS monitoreado, conductores certificados y velocidad controlada según normativa del MTC.",
  },
  {
    title: "Puntualidad andina, en serio",
    desc: "Salidas a la hora anunciada. Si tu vuelo se retrasa, tu traslado espera; si tu trek termina tarde, coordinamos.",
  },
  {
    title: "Gente local",
    desc: "Conductores y guías nacidos en la región, que conocen cada curva del camino y cada historia del valle.",
  },
  {
    title: "Precio justo",
    desc: "Tarifas claras en soles, sin cargos ocultos. Lo que cotizas es lo que pagas.",
  },
];

const stats = [
  { n: "12+", label: "años conectando el sur del Perú" },
  { n: "6", label: "rutas de transporte con salidas diarias" },
  { n: "40k+", label: "pasajeros transportados cada año" },
  { n: "4.9★", label: "calificación promedio de viajeros" },
];

export default function NosotrosPage() {
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
        Nacimos en la <em className="serif">carretera</em>
        <br />
        del sur del Perú.
      </h1>
      <p style={{ maxWidth: 620, margin: "0 0 56px", fontSize: 16, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
        Inca Travel Peru es una agencia de turismo con base en Cusco. Empezamos con una van conectando el Valle del
        Colca; hoy operamos transporte turístico, tours y traslados en todo el circuito sur: Cusco, Arequipa, Colca,
        Puno y Machu Picchu.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        <div style={{ position: "relative", width: "100%", minHeight: 380 }}>
          <ImageSlot radius={10} src={MEDIA_IMAGE} placeholder="Nuestra flota" />
        </div>
        <div style={{ position: "relative", width: "100%", minHeight: 380 }}>
          <ImageSlot radius={10} src={IMG_SAN_LAZARO} placeholder="El equipo en ruta" />
        </div>
      </div>

      {/* Stats */}
      <section style={{ marginTop: 110, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "var(--card)", padding: "28px 26px" }}>
            <div style={{ fontSize: "clamp(32px, 3vw, 48px)", fontWeight: 600, letterSpacing: "-0.02em" }}>{s.n}</div>
            <div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 6, lineHeight: 1.4 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* Valores */}
      <section style={{ marginTop: 130 }}>
        <h2
          style={{
            margin: "0 auto 48px",
            maxWidth: 620,
            textAlign: "center",
            fontSize: "clamp(28px, 2.4vw, 40px)",
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
            fontWeight: 400,
            textWrap: "pretty",
          }}
        >
          Lo que nos hace <em className="serif">diferentes</em>.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          {values.map((v) => (
            <div key={v.title} style={{ background: "var(--card)", padding: "28px 26px" }}>
              <strong style={{ fontSize: 16, letterSpacing: "-0.01em" }}>{v.title}</strong>
              <p style={{ margin: "10px 0 0", fontSize: 13.5, lineHeight: 1.55, color: "var(--muted)", textWrap: "pretty" }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formalidad + CTA */}
      <section style={{ marginTop: 130, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12, alignItems: "stretch" }}>
        <div style={{ background: "var(--card)", padding: "48px 44px", borderRadius: 16, fontSize: "clamp(20px, 1.6vw, 28px)", lineHeight: 1.35, letterSpacing: "-0.015em", textWrap: "pretty" }}>
          <p style={{ margin: "0 0 1em" }}>
            Somos una empresa <em className="serif">formal</em>: agencia registrada en MINCETUR, flota habilitada por el
            MTC y seguros de viaje vigentes en todas las rutas.
          </p>
          <p style={{ margin: 0 }}>
            Trabajamos con hoteles, agencias internacionales y viajeros independientes que buscan lo mismo:
            llegar <em className="serif">bien</em>.
          </p>
          <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap", fontSize: 14, fontWeight: 600 }}>
            <Link href="/transporte" style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "10px 16px", borderRadius: 8 }}>
              Ver rutas de transporte
            </Link>
            <Link href="/contacto" style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid var(--line)" }}>
              Hablar con nosotros
            </Link>
          </div>
        </div>
        <div style={{ position: "relative", width: "100%", minHeight: 380 }}>
          <ImageSlot radius={10} src={IMG_TEMPLO} placeholder="Oficina en Cusco" />
          <div style={{ position: "absolute", top: 14, left: 16, pointerEvents: "none", lineHeight: 1.3, fontSize: 13.5, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,.5)" }}>
            <strong>Cusco</strong>
            <br />
            <span style={{ opacity: 0.85 }}>{CONTACT.address}</span>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

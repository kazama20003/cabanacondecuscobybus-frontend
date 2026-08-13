import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import RouteCard from "@/components/route-card";
import { transportRoutes, fleet, transportFaq, CONTACT, MEDIA_VIDEO } from "@/lib/data";

export const metadata: Metadata = {
  title: "Transporte Turístico — Inca Travel Peru",
  description:
    "Transporte turístico en el sur del Perú: Cusco, Arequipa, Colca, Puno e Hidroeléctrica (Machu Picchu). Horarios diarios, buses modernos y reserva por WhatsApp.",
};

export default function TransportePage() {
  return (
    <PageShell>
      {/* Hero */}
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
        Transporte <em className="serif">turístico</em>
        <br />
        por el sur del Perú.
      </h1>
      <p style={{ maxWidth: 560, margin: "0 0 40px", fontSize: 16, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
        Nuestro producto principal: rutas diarias entre Cusco, Arequipa, el Valle del Colca, Puno y Machu Picchu, con
        flota propia, horarios confiables y atención en español e inglés.
      </p>

      <div style={{ position: "relative", width: "100%", aspectRatio: "1502 / 500", minWidth: 0 }}>
        <ImageSlot radius={10} video={MEDIA_VIDEO} placeholder="Video de flota" />
      </div>

      {/* Rutas */}
      <section style={{ marginTop: 110 }}>
        <h2
          style={{
            margin: "0 0 8px",
            fontSize: "clamp(28px, 2.4vw, 40px)",
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
            fontWeight: 400,
          }}
        >
          Rutas y <em className="serif">horarios</em>
        </h2>
        <p style={{ margin: "0 0 36px", fontSize: 14.5, color: "var(--muted)", maxWidth: 520 }}>
          Salidas diarias, todo el año. Precios por persona en soles (PEN); confirma disponibilidad al reservar.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {transportRoutes.map((r) => (
            <RouteCard key={r.slug} route={r} video={MEDIA_VIDEO} />
          ))}
        </div>
      </section>

      {/* Flota */}
      <section style={{ marginTop: 140 }}>
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
          Nuestra <em className="serif">flota</em>: moderna, monitoreada y pensada para la altura.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {fleet.map((v) => (
            <figure key={v.name} style={{ margin: 0, background: "var(--card)", padding: 16, borderRadius: 14 }}>
              <div style={{ position: "relative", width: "100%", height: 220 }}>
                <ImageSlot radius={10} src={v.image} placeholder={v.name} />
              </div>
              <figcaption style={{ marginTop: 14, lineHeight: 1.5 }}>
                <strong style={{ fontSize: 15 }}>{v.name}</strong>
                <div style={{ fontSize: 13, color: "var(--muted)", margin: "4px 0 8px" }}>{v.capacity}</div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.7 }}>
                  {v.features.split(", ").map((f) => (
                    <li key={f}>✓ {f.charAt(0).toUpperCase() + f.slice(1)}</li>
                  ))}
                </ul>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Cómo reservar */}
      <section style={{ marginTop: 140, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        <div style={{ background: "var(--card)", padding: "48px 44px", borderRadius: 16 }}>
          <h2 style={{ margin: "0 0 24px", fontSize: "clamp(24px, 2vw, 34px)", lineHeight: 1.25, letterSpacing: "-0.015em", fontWeight: 400 }}>
            Reservar es <em className="serif">simple</em>.
          </h2>
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 2, color: "var(--muted)" }}>
            <li>Elige tu ruta y horario.</li>
            <li>Escríbenos por WhatsApp o desde la página de contacto.</li>
            <li>Confirma con un adelanto del 50%.</li>
            <li>Recibe tu ticket digital y aborda.</li>
          </ol>
          <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap", fontSize: 14, fontWeight: 600 }}>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "10px 16px", borderRadius: 8 }}
            >
              Reservar por WhatsApp
            </a>
            <Link href="/contacto" style={{ background: "var(--bg)", padding: "10px 16px", borderRadius: 8, border: "1px solid var(--line)" }}>
              Formulario de contacto
            </Link>
          </div>
        </div>
        <div style={{ background: "var(--card)", padding: "48px 44px", borderRadius: 16 }}>
          <h2 style={{ margin: "0 0 24px", fontSize: "clamp(24px, 2vw, 34px)", lineHeight: 1.25, letterSpacing: "-0.015em", fontWeight: 400 }}>
            Preguntas <em className="serif">frecuentes</em>
          </h2>
          <div>
            {transportFaq.map((f) => (
              <details key={f.q} style={{ borderBottom: "1px solid var(--line)", padding: "12px 0" }}>
                <summary style={{ cursor: "pointer", fontSize: 14.5, fontWeight: 600 }}>{f.q}</summary>
                <p style={{ margin: "10px 0 4px", fontSize: 13.5, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

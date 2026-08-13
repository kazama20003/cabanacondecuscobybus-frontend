import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import { tours, CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tours — Inca Travel Peru",
  description:
    "Tours en Cusco, Arequipa y Puno: Machu Picchu, Valle Sagrado, Montaña de 7 Colores, Cañón del Colca y Lago Titicaca. Guías profesionales y salidas diarias.",
};

export default function ToursPage() {
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
        Tours con <em className="serif">guías</em> que
        <br />
        aman su tierra.
      </h1>
      <p style={{ maxWidth: 560, margin: "0 0 56px", fontSize: 16, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
        De la ciudadela de Machu Picchu al vuelo del cóndor en el Colca. Grupos pequeños, salidas diarias y
        guías oficiales en español e inglés.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {tours.map((t) => (
          <figure key={t.slug} style={{ margin: 0, background: "var(--card)", padding: 16, borderRadius: 14, display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", width: "100%", height: 220 }}>
              <ImageSlot radius={10} src={t.image} placeholder={t.name} />
              <span
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  background: "var(--btn-bg)",
                  color: "var(--btn-fg)",
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: "4px 8px",
                  borderRadius: 8,
                  letterSpacing: "0.02em",
                }}
              >
                {t.type}
              </span>
            </div>
            <figcaption style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                {t.location} · {t.duration} · {t.difficulty}
              </div>
              <strong style={{ fontSize: 16, letterSpacing: "-0.01em" }}>{t.name}</strong>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{t.departure}</div>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty", flex: 1 }}>{t.desc}</p>
              <ul style={{ margin: "4px 0 8px", padding: 0, listStyle: "none", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.7 }}>
                {t.includes.map((i) => (
                  <li key={i}>✓ {i}</li>
                ))}
              </ul>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: 15 }}>Desde S/ {t.priceFrom}</strong>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hola, quiero información del tour ${t.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 13, fontWeight: 600, background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "7px 12px", borderRadius: 8 }}
                >
                  Reservar
                </a>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <section style={{ marginTop: 120, textAlign: "center" }}>
        <h2 style={{ margin: "0 auto 20px", maxWidth: 560, fontSize: "clamp(24px, 2vw, 34px)", fontWeight: 400, letterSpacing: "-0.015em", textWrap: "pretty" }}>
          ¿Buscas algo <em className="serif">a tu medida</em>?
        </h2>
        <p style={{ maxWidth: 480, margin: "0 auto 28px", fontSize: 15, lineHeight: 1.55, color: "var(--muted)", textWrap: "pretty" }}>
          Armamos itinerarios privados combinando transporte, tours y traslados según tus fechas y presupuesto.
        </p>
        <Link
          href="/contacto"
          style={{ display: "inline-block", fontSize: 14, fontWeight: 600, background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "10px 18px", borderRadius: 8 }}
        >
          Pedir itinerario personalizado
        </Link>
      </section>
    </PageShell>
  );
}

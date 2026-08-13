import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import { transfers, CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Traslados Privados — Inca Travel Peru",
  description:
    "Traslados privados en Cusco y Arequipa: aeropuerto, hoteles, estaciones de tren y Valle Sagrado. Servicio 24/7 con conductores profesionales.",
};

export default function TrasladosPage() {
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
        Traslados <em className="serif">privados</em>,
        <br />
        puntuales y seguros.
      </h1>
      <p style={{ maxWidth: 560, margin: "0 0 56px", fontSize: 16, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
        Del aeropuerto a tu hotel, de tu hotel a la estación de tren, o a donde necesites. Monitoreamos tu vuelo,
        te esperamos con cartel y viajas en vehículo privado. Disponible 24/7 en Cusco y Arequipa.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {transfers.map((t) => (
          <figure key={t.name} style={{ margin: 0, background: "var(--card)", padding: 16, display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", width: "100%", height: 200 }}>
              <ImageSlot radius={0} src={t.image} placeholder={t.name} />
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
                  borderRadius: 3,
                  letterSpacing: "0.02em",
                }}
              >
                {t.availability}
              </span>
            </div>
            <figcaption style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                {t.vehicle} · {t.capacity}
              </div>
              <strong style={{ fontSize: 16, letterSpacing: "-0.01em" }}>{t.name}</strong>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty", flex: 1 }}>{t.desc}</p>
              <ul style={{ margin: "4px 0 8px", padding: 0, listStyle: "none", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.7 }}>
                {t.includes.map((i) => (
                  <li key={i}>✓ {i}</li>
                ))}
              </ul>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.35 }}>
                  <strong style={{ fontSize: 15 }}>Desde S/ {t.priceFrom}</strong>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{t.duration}</span>
                </span>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hola, quiero reservar el traslado ${t.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 13, fontWeight: 600, background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "7px 12px", borderRadius: 3 }}
                >
                  Reservar
                </a>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <section style={{ marginTop: 120, background: "var(--card)", padding: "48px 44px" }}>
        <h2 style={{ margin: "0 0 20px", fontSize: "clamp(24px, 2vw, 34px)", fontWeight: 400, letterSpacing: "-0.015em", textWrap: "pretty" }}>
          ¿Vuelo retrasado? <em className="serif">Sin problema.</em>
        </h2>
        <p style={{ maxWidth: 560, margin: "0 0 28px", fontSize: 15, lineHeight: 1.55, color: "var(--muted)", textWrap: "pretty" }}>
          Monitoreamos el estado de tu vuelo en tiempo real: si se retrasa, tu conductor te espera sin costo adicional.
          Envíanos tu número de vuelo al reservar y nosotros nos encargamos del resto.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 14, fontWeight: 600 }}>
          <a
            href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hola, quiero reservar un traslado")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "10px 16px", borderRadius: 3 }}
          >
            Reservar traslado
          </a>
          <Link href="/contacto" style={{ padding: "10px 16px", borderRadius: 3, border: "1px solid var(--line)" }}>
            Consultar tarifa a otro destino
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

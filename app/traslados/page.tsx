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
          margin: "90px 0 24px",
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
          <figure key={t.name} style={{ margin: 0, background: "var(--card)", padding: 16 }}>
            <div style={{ position: "relative", width: "100%", height: 200 }}>
              <ImageSlot radius={0} src={t.image} placeholder={t.name} />
            </div>
            <figcaption style={{ marginTop: 14 }}>
              <strong style={{ fontSize: 15, letterSpacing: "-0.01em" }}>{t.name}</strong>
              <p style={{ margin: "8px 0 12px", fontSize: 13.5, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>{t.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13.5 }}>
                <span style={{ color: "var(--muted)" }}>{t.duration}</span>
                <strong>Desde S/ {t.priceFrom}</strong>
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

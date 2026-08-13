import type { Metadata } from "next";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import ContactForm from "@/components/contact-form";
import { CONTACT, IMG_TEMPLO } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contacto — Inca Travel Peru",
  description:
    "Reserva tu transporte, tour o traslado con Inca Travel Peru. Atención por WhatsApp, teléfono y correo desde Cusco, Perú.",
};

export default function ContactoPage() {
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
        Hablemos de tu <em className="serif">viaje</em>.
      </h1>
      <p style={{ maxWidth: 560, margin: "0 0 56px", fontSize: 16, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
        Cuéntanos a dónde quieres ir y armamos todo: transporte, tours y traslados. Respondemos rápido por WhatsApp.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12, alignItems: "stretch" }}>
        <div style={{ background: "var(--card)", padding: "40px 36px", borderRadius: 16 }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 400, letterSpacing: "-0.015em" }}>
            Pide tu <em className="serif">cotización</em>
          </h2>
          <ContactForm />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "var(--card)", padding: "40px 36px", borderRadius: 16, flex: 1 }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 400, letterSpacing: "-0.015em" }}>
              Canales <em className="serif">directos</em>
            </h2>
            <dl style={{ margin: 0, fontSize: 14.5, lineHeight: 2 }}>
              <dt style={{ color: "var(--muted)", fontSize: 13 }}>WhatsApp / Teléfono</dt>
              <dd style={{ margin: "0 0 14px", fontWeight: 600 }}>
                <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  {CONTACT.phone}
                </a>
              </dd>
              <dt style={{ color: "var(--muted)", fontSize: 13 }}>Correo</dt>
              <dd style={{ margin: "0 0 14px", fontWeight: 600 }}>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </dd>
              <dt style={{ color: "var(--muted)", fontSize: 13 }}>Oficina</dt>
              <dd style={{ margin: "0 0 14px", fontWeight: 600 }}>
                {CONTACT.address}
                <br />
                {CONTACT.city}
              </dd>
              <dt style={{ color: "var(--muted)", fontSize: 13 }}>Horario de atención</dt>
              <dd style={{ margin: 0, fontWeight: 600 }}>
                Lunes a domingo · 6:00 am — 10:00 pm
                <br />
                <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 13 }}>Traslados de aeropuerto: 24/7</span>
              </dd>
            </dl>
          </div>
          <div style={{ position: "relative", width: "100%", minHeight: 240 }}>
            <ImageSlot radius={10} src={IMG_TEMPLO} placeholder="Oficina en Cusco" />
          </div>
        </div>
      </div>
    </PageShell>
  );
}

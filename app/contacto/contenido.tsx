"use client";

import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import ContactForm from "@/components/contact-form";
import { CONTACT, IMG_TEMPLO } from "@/lib/data";
import { useT } from "@/lib/i18n";

export default function ContactoContenido() {
  const t = useT();
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
        {t("contacto.title")}
      </h1>
      <p style={{ maxWidth: 560, margin: "0 0 56px", fontSize: 16, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
        {t("contacto.intro")}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12, alignItems: "stretch" }}>
        <div style={{ background: "var(--card)", padding: "40px 36px", borderRadius: 16 }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 400, letterSpacing: "-0.015em" }}>
            {t("contacto.cotizacion")}
          </h2>
          <ContactForm />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "var(--card)", padding: "40px 36px", borderRadius: 16, flex: 1 }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 400, letterSpacing: "-0.015em" }}>
              {t("contacto.canales")}
            </h2>
            <dl style={{ margin: 0, fontSize: 14.5, lineHeight: 2 }}>
              <dt style={{ color: "var(--muted)", fontSize: 13 }}>{t("contacto.waTel")}</dt>
              <dd style={{ margin: "0 0 14px", fontWeight: 600 }}>
                <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  {CONTACT.phone}
                </a>
              </dd>
              <dt style={{ color: "var(--muted)", fontSize: 13 }}>{t("contacto.correo")}</dt>
              <dd style={{ margin: "0 0 14px", fontWeight: 600 }}>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </dd>
              <dt style={{ color: "var(--muted)", fontSize: 13 }}>{t("contacto.oficina")}</dt>
              <dd style={{ margin: "0 0 14px", fontWeight: 600 }}>
                {CONTACT.address}
                <br />
                {CONTACT.city}
              </dd>
              <dt style={{ color: "var(--muted)", fontSize: 13 }}>{t("contacto.horario")}</dt>
              <dd style={{ margin: 0, fontWeight: 600 }}>
                {t("contacto.horarioValor")}
                <br />
                <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 13 }}>{t("contacto.horarioAeropuerto")}</span>
              </dd>
            </dl>
          </div>
          <div style={{ position: "relative", width: "100%", minHeight: 240 }}>
            <ImageSlot radius={10} src={IMG_TEMPLO} placeholder={t("contacto.oficina")} />
          </div>
        </div>
      </div>
    </PageShell>
  );
}

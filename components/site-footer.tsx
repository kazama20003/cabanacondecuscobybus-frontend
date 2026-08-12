import { CSSProperties } from "react";
import Link from "next/link";
import { CONTACT, transportRoutes, tours, destinations } from "@/lib/data";

const glyphBox: CSSProperties = {
  borderRadius: 6,
  background: "var(--fg)",
  color: "var(--bg)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
};

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{ margin: "0 0 24px", fontSize: "clamp(28px, 2.2vw, 38px)", fontWeight: 400, letterSpacing: "-0.02em" }}>{title}</h3>
      {children}
    </div>
  );
}

function FooterLink({ glyph, label, href }: { glyph?: string; label: string; href: string }) {
  return (
    <Link
      href={href}
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
      {glyph && <span style={{ ...glyphBox, width: 26, height: 26, fontSize: 12 }}>{glyph}</span>}
      {label}
    </Link>
  );
}

export default function SiteFooter() {
  return (
    <footer style={{ marginTop: 160 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40 }}>
        <FooterColumn title="Transporte">
          {transportRoutes.map((r) => (
            <FooterLink key={r.slug} glyph="⇄" label={`${r.from} — ${r.to}`} href={`/transporte/${r.slug}`} />
          ))}
        </FooterColumn>
        <FooterColumn title="Tours">
          {tours.slice(0, 6).map((t) => (
            <FooterLink key={t.slug} glyph="▲" label={t.name} href="/tours" />
          ))}
          <FooterLink glyph="↗" label="Ver todos los tours" href="/tours" />
        </FooterColumn>
        <FooterColumn title="Destinos">
          {destinations.map((d) => (
            <FooterLink key={d.slug} glyph="◉" label={d.name} href="/destinos" />
          ))}
        </FooterColumn>
        <FooterColumn title="Empresa">
          <FooterLink glyph="◈" label="Nosotros" href="/nosotros" />
          <FooterLink glyph="✆" label="Contacto" href="/contacto" />
          <FooterLink glyph="⊕" label="Traslados privados" href="/traslados" />
          <FooterLink glyph="≡" label="Transporte turístico" href="/transporte" />
        </FooterColumn>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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
            ¿Listo para tu próximo viaje por el sur del Perú?
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 44, fontSize: 14, fontWeight: 600, flexWrap: "wrap" }}>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "8px 13px", borderRadius: 3 }}
            >
              Reservar por WhatsApp
            </a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>{CONTACT.phone}</a>
          </div>
          <p style={{ marginTop: 24, fontSize: 13, color: "var(--muted)" }}>
            Inca Travel Peru © {new Date().getFullYear()} · {CONTACT.address} · {CONTACT.city}
          </p>
        </div>
      </div>
    </footer>
  );
}

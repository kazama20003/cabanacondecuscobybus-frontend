"use client";

import { CSSProperties } from "react";
import Link from "next/link";
import { CONTACT, transportRoutes, destinations } from "@/lib/data";
import { useToursSeed } from "@/lib/data-i18n";
import { useT } from "@/lib/i18n";

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
  const t = useT();
  const tours = useToursSeed();
  return (
    <footer style={{ marginTop: 160 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40 }}>
        <FooterColumn title={t("nav.transporte")}>
          {transportRoutes.map((r) => (
            <FooterLink key={r.slug} glyph="⇄" label={`${r.from} — ${r.to}`} href={`/transporte/${r.slug}`} />
          ))}
        </FooterColumn>
        <FooterColumn title={t("nav.tours")}>
          {tours.slice(0, 6).map((tour) => (
            <FooterLink key={tour.slug} glyph="▲" label={tour.name} href="/tours" />
          ))}
          <FooterLink glyph="↗" label={t("footer.verTodosTours")} href="/tours" />
        </FooterColumn>
        <FooterColumn title={t("nav.destinos")}>
          {destinations.map((d) => (
            <FooterLink key={d.slug} glyph="◉" label={d.name} href="/destinos" />
          ))}
        </FooterColumn>
        <FooterColumn title={t("footer.empresa")}>
          <FooterLink glyph="◈" label={t("nav.nosotros")} href="/nosotros" />
          <FooterLink glyph="✆" label={t("header.contacto")} href="/contacto" />
          <FooterLink glyph="⊕" label={t("footer.trasladosPrivados")} href="/traslados" />
          <FooterLink glyph="≡" label={t("home.transporteTuristico")} href="/transporte" />
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
            {t("footer.cta")}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 44, fontSize: 14, fontWeight: 600, flexWrap: "wrap" }}>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "8px 13px", borderRadius: 8 }}
            >
              {t("common.reservarWhatsapp")}
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

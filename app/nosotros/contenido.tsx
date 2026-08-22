"use client";

import Link from "next/link";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import { MEDIA_IMAGE, IMG_SAN_LAZARO, IMG_TEMPLO, CONTACT } from "@/lib/data";
import { useT } from "@/lib/i18n";

export default function NosotrosContenido() {
  const t = useT();

  const values = [
    { title: t("nosotros.val1t"), desc: t("nosotros.val1d") },
    { title: t("nosotros.val2t"), desc: t("nosotros.val2d") },
    { title: t("nosotros.val3t"), desc: t("nosotros.val3d") },
    { title: t("nosotros.val4t"), desc: t("nosotros.val4d") },
  ];

  const stats = [
    { n: "12+", label: t("nosotros.stat1") },
    { n: "6", label: t("nosotros.stat2") },
    { n: "40k+", label: t("nosotros.stat3") },
    { n: "4.9★", label: t("nosotros.stat4") },
  ];

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
        {t("nosotros.title1")}
        <br />
        {t("nosotros.title2")}
      </h1>
      <p style={{ maxWidth: 620, margin: "0 0 56px", fontSize: 16, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
        {t("nosotros.intro")}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        <div style={{ position: "relative", width: "100%", minHeight: 380 }}>
          <ImageSlot radius={10} src={MEDIA_IMAGE} placeholder="Inca Travel Peru" />
        </div>
        <div style={{ position: "relative", width: "100%", minHeight: 380 }}>
          <ImageSlot radius={10} src={IMG_SAN_LAZARO} placeholder="Inca Travel Peru" />
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
          {t("nosotros.diferentes")}
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
          <p style={{ margin: "0 0 1em" }}>{t("nosotros.formal1")}</p>
          <p style={{ margin: 0 }}>{t("nosotros.formal2")}</p>
          <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap", fontSize: 14, fontWeight: 600 }}>
            <Link href="/transporte" style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "10px 16px", borderRadius: 8 }}>
              {t("nosotros.ctaRutas")}
            </Link>
            <Link href="/contacto" style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid var(--line)" }}>
              {t("nosotros.ctaHablar")}
            </Link>
          </div>
        </div>
        <div style={{ position: "relative", width: "100%", minHeight: 380 }}>
          <ImageSlot radius={10} src={IMG_TEMPLO} placeholder="Cusco" />
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

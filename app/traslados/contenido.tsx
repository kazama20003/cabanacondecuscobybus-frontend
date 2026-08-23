"use client";

import Link from "next/link";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import { transfers, CONTACT } from "@/lib/data";
import { useT } from "@/lib/i18n";

export default function TrasladosContenido() {
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
        {t("traslados.title1")}
        <br />
        {t("traslados.title2")}
      </h1>
      <p style={{ maxWidth: 560, margin: "0 0 56px", fontSize: 16, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
        {t("traslados.intro")}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {transfers.map((tr) => (
          <figure key={tr.name} style={{ margin: 0, background: "var(--card)", padding: 16, borderRadius: 14, display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", width: "100%", height: 200 }}>
              <ImageSlot radius={10} src={tr.image} placeholder={tr.name} />
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
                {tr.availability}
              </span>
            </div>
            <figcaption style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                {tr.vehicle} · {tr.capacity}
              </div>
              <strong style={{ fontSize: 16, letterSpacing: "-0.01em" }}>{tr.name}</strong>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty", flex: 1 }}>{tr.desc}</p>
              <ul style={{ margin: "4px 0 8px", padding: 0, listStyle: "none", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.7 }}>
                {tr.includes.map((i) => (
                  <li key={i}>✓ {i}</li>
                ))}
              </ul>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.35 }}>
                  <strong style={{ fontSize: 15 }}>{t("common.desde")} S/ {tr.priceFrom}</strong>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{tr.duration}</span>
                </span>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hola, quiero reservar el traslado ${tr.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 13, fontWeight: 600, background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "7px 12px", borderRadius: 8 }}
                >
                  {t("common.reservar")}
                </a>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <section style={{ marginTop: 120, background: "var(--card)", padding: "48px 44px", borderRadius: 16 }}>
        <h2 style={{ margin: "0 0 20px", fontSize: "clamp(24px, 2vw, 34px)", fontWeight: 400, letterSpacing: "-0.015em", textWrap: "pretty" }}>
          {t("traslados.infoTitulo")}
        </h2>
        <p style={{ maxWidth: 560, margin: "0 0 28px", fontSize: 15, lineHeight: 1.55, color: "var(--muted)", textWrap: "pretty" }}>
          {t("traslados.infoTexto")}
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 14, fontWeight: 600 }}>
          <a
            href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hola, quiero reservar un traslado")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "10px 16px", borderRadius: 8 }}
          >
            {t("traslados.reservar")}
          </a>
          <Link href="/contacto" style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid var(--line)" }}>
            {t("traslados.consultar")}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

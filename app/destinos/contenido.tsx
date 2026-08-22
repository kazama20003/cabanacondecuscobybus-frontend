"use client";

import Link from "next/link";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import { useDestinations } from "@/lib/data-i18n";
import { useT } from "@/lib/i18n";

export default function DestinosContenido() {
  const t = useT();
  const destinations = useDestinations();
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
        {t("destinos.title1")}
        <br />
        {t("destinos.title2")}
      </h1>
      <p style={{ maxWidth: 560, margin: "0 0 56px", fontSize: 16, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
        {t("destinos.intro")}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {destinations.map((d, i) => (
          <article
            key={d.slug}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
              borderTop: "1px solid var(--line)",
              paddingTop: 20,
              direction: i % 2 === 1 ? "rtl" : "ltr",
            }}
          >
            <div style={{ position: "relative", width: "100%", minHeight: 300, direction: "ltr" }}>
              <ImageSlot radius={10} src={d.image} placeholder={d.name} />
            </div>
            <div style={{ direction: "ltr", display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, padding: "12px 0" }}>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>
                {d.region} · {d.altitude}
              </div>
              <h2 style={{ margin: 0, fontSize: "clamp(26px, 2.4vw, 40px)", fontWeight: 400, letterSpacing: "-0.02em" }}>{d.name}</h2>
              <p style={{ margin: 0, maxWidth: 480, fontSize: 15, lineHeight: 1.55, color: "var(--muted)", textWrap: "pretty" }}>{d.desc}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                {d.highlights.map((h) => (
                  <span key={h} style={{ fontSize: 12.5, fontWeight: 600, background: "var(--card)", padding: "6px 10px", borderRadius: 8 }}>
                    {h}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 13.5, fontWeight: 600 }}>
                <Link href="/transporte" style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "8px 13px", borderRadius: 8 }}>
                  {t("destinos.comoLlegar")}
                </Link>
                <Link href="/tours" style={{ padding: "8px 13px", borderRadius: 8, border: "1px solid var(--line)" }}>
                  {t("destinos.toursAqui")}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

type TipoCondicion = "transporte" | "tour" | "evento";

const textos: Record<TipoCondicion, { titulo: string; intro: string; detalles: string[] }> = {
  transporte: {
    titulo: "condiciones.transporte.titulo",
    intro: "condiciones.transporte.intro",
    detalles: [
      "condiciones.transporte.detalle1",
      "condiciones.transporte.detalle2",
      "condiciones.transporte.detalle3",
    ],
  },
  tour: {
    titulo: "condiciones.tour.titulo",
    intro: "condiciones.tour.intro",
    detalles: [
      "condiciones.tour.detalle1",
      "condiciones.tour.detalle2",
      "condiciones.tour.detalle3",
    ],
  },
  evento: {
    titulo: "condiciones.evento.titulo",
    intro: "condiciones.evento.intro",
    detalles: [
      "condiciones.evento.detalle1",
      "condiciones.evento.detalle2",
      "condiciones.evento.detalle3",
    ],
  },
};

const enlaces = [
  { key: "condiciones.terminos", href: process.env.NEXT_PUBLIC_URL_TERMINOS || "/terminos" },
  { key: "condiciones.privacidad", href: process.env.NEXT_PUBLIC_URL_PRIVACIDAD || "/privacidad" },
  { key: "condiciones.cancelaciones", href: process.env.NEXT_PUBLIC_URL_CANCELACIONES || "/cancelaciones" },
];

export default function CondicionesServicio({ tipo }: { tipo: TipoCondicion }) {
  const t = useT();
  const contenido = textos[tipo];
  return (
    <section aria-labelledby="condiciones-servicio" style={{ marginTop: 54, padding: "clamp(20px, 4vw, 36px)", border: "1px solid var(--line)", borderRadius: 12, background: "var(--card)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))", gap: 28 }}>
        <div>
          <span style={{ color: "var(--muted)", fontSize: 11, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase" }}>{t("condiciones.infoReserva")}</span>
          <h2 id="condiciones-servicio" style={{ margin: "8px 0", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 500 }}>{t(contenido.titulo)}</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>{t(contenido.intro)}</p>
          <nav aria-label={t("condiciones.navPoliticas")} style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 20, fontSize: 13, fontWeight: 600 }}>
            {enlaces.map((enlace) => (
              <Link key={enlace.href} href={enlace.href} target={enlace.href.startsWith("http") ? "_blank" : undefined} rel={enlace.href.startsWith("http") ? "noopener noreferrer" : undefined} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>{t(enlace.key)}</Link>
            ))}
          </nav>
        </div>
        <ul style={{ display: "grid", gap: 12, margin: 0, paddingLeft: 20, color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
          {contenido.detalles.map((detalle) => <li key={detalle}>{t(detalle)}</li>)}
          <li>{t("condiciones.usoDatos")}</li>
        </ul>
      </div>
    </section>
  );
}

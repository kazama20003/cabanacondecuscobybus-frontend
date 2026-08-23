"use client";

/* Presentación de "qué incluye / no incluye" un tour o ruta.
   Cada texto es multilínea: una línea = un ítem. */

import { useT } from "@/lib/i18n";

function aItems(texto?: string | null): string[] {
  if (!texto) return [];
  return texto
    .split(/\r?\n/)
    .map((linea) => linea.replace(/^[\s•\-*]+/, "").trim())
    .filter(Boolean);
}

function Lista({
  titulo,
  items,
  variante,
}: {
  titulo: string;
  items: string[];
  variante: "incluye" | "noIncluye";
}) {
  const color = variante === "incluye" ? "#16a34a" : "var(--muted)";
  const marca = variante === "incluye" ? "✓" : "✕";
  return (
    <div style={{ background: "var(--card)", padding: "24px 24px 28px" }}>
      <h3
        style={{
          margin: "0 0 16px",
          fontSize: 13,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "var(--muted)",
          fontWeight: 700,
        }}
      >
        {titulo}
      </h3>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
        {items.map((item, i) => (
          <li
            key={i}
            style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 10, alignItems: "start", lineHeight: 1.45 }}
          >
            <span
              style={{
                color,
                fontWeight: 700,
                fontSize: 15,
                lineHeight: 1.4,
                opacity: variante === "noIncluye" ? 0.7 : 1,
              }}
              aria-hidden
            >
              {marca}
            </span>
            <span
              style={{
                fontSize: 14.5,
                color: variante === "noIncluye" ? "var(--muted)" : "inherit",
                textWrap: "pretty",
              }}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function IncluyeNoIncluye({
  incluye,
  noIncluye,
}: {
  incluye?: string | null;
  noIncluye?: string | null;
}) {
  const t = useT();
  const itemsIncluye = aItems(incluye);
  const itemsNoIncluye = aItems(noIncluye);
  if (itemsIncluye.length === 0 && itemsNoIncluye.length === 0) return null;

  return (
    <section style={{ marginTop: 56 }}>
      <h2
        style={{
          margin: "0 0 24px",
          fontSize: "clamp(26px, 2.2vw, 36px)",
          fontWeight: 400,
          letterSpacing: "-0.02em",
        }}
      >
        {t("incluye.titulo")}
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {itemsIncluye.length > 0 && (
          <Lista titulo={t("incluye.incluido")} items={itemsIncluye} variante="incluye" />
        )}
        {itemsNoIncluye.length > 0 && (
          <Lista titulo={t("incluye.noIncluido")} items={itemsNoIncluye} variante="noIncluye" />
        )}
      </div>
    </section>
  );
}

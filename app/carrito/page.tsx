"use client";

import Link from "next/link";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import { useCarrito } from "@/components/cart-provider";
import { useIdioma } from "@/components/lang-provider";
import { useT, LOCALES } from "@/lib/i18n";

export default function CarritoPage() {
  const t = useT();
  const { idioma } = useIdioma();
  const { items, quitar, fijarPasajeros, total, totalLineas } = useCarrito();

  const fmtFecha = (iso: string) =>
    new Date(iso).toLocaleString(LOCALES[idioma], { dateStyle: "medium", timeStyle: "short" });

  return (
    <PageShell>
      <h1
        style={{
          fontSize: "clamp(36px, 4.6vw, 64px)",
          lineHeight: 1.06,
          letterSpacing: "-0.03em",
          fontWeight: 400,
          margin: "48px 0 32px",
        }}
      >
        {t("carrito.titulo")}
      </h1>

      {totalLineas === 0 ? (
        <div style={{ padding: "24px 0 80px" }}>
          <p style={{ margin: "0 0 16px", color: "var(--muted)", fontSize: 15 }}>{t("carrito.vacio")}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 14, fontWeight: 600 }}>
            <Link href="/transporte" style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "10px 16px", borderRadius: 8 }}>
              {t("carrito.verTransporte")}
            </Link>
            <Link href="/tours" style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid var(--line)" }}>
              {t("carrito.verTours")}
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 40, alignItems: "start", paddingBottom: 80 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {items.map((item) => (
              <div
                key={item.salidaId}
                style={{
                  display: "grid",
                  gridTemplateColumns: "96px minmax(0, 1fr)",
                  gap: 16,
                  background: "var(--card)",
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                <div style={{ position: "relative", width: 96, height: 96 }}>
                  <ImageSlot radius={10} src={item.imagen} placeholder={item.titulo} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <strong style={{ fontSize: 15.5, letterSpacing: "-0.01em" }}>{item.titulo}</strong>
                    <button
                      type="button"
                      onClick={() => quitar(item.salidaId)}
                      style={{ border: "none", background: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                    >
                      {t("carrito.quitar")}
                    </button>
                  </div>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>{fmtFecha(item.fechaHoraSalida)}</span>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, color: "var(--muted)" }}>{t("reservar.pasajeros")}</span>
                      <button
                        type="button"
                        aria-label="-"
                        onClick={() => fijarPasajeros(item.salidaId, item.pasajeros - 1)}
                        style={{ width: 32, height: 32, border: "1px solid var(--line)", background: "var(--bg)", color: "var(--fg)", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}
                      >
                        −
                      </button>
                      <span style={{ minWidth: 20, textAlign: "center", fontWeight: 600 }}>{item.pasajeros}</span>
                      <button
                        type="button"
                        aria-label="+"
                        onClick={() => fijarPasajeros(item.salidaId, item.pasajeros + 1)}
                        style={{ width: 32, height: 32, border: "1px solid var(--line)", background: "var(--bg)", color: "var(--fg)", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}
                      >
                        +
                      </button>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>
                      S/ {item.precioPen * item.pasajeros} · US$ {item.precioUsd * item.pasajeros}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside style={{ background: "var(--card)", borderRadius: 14, padding: "24px 22px", position: "sticky", top: 90 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 600 }}>{t("carrito.resumen")}</h2>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
              <span style={{ color: "var(--muted)" }}>{t("carrito.totalPen")}</span>
              <strong>S/ {total("PEN")}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 20 }}>
              <span style={{ color: "var(--muted)" }}>{t("carrito.totalUsd")}</span>
              <strong>US$ {total("USD")}</strong>
            </div>
            <p style={{ margin: "0 0 18px", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
              {t("carrito.notaMoneda")}
            </p>
            <Link
              href="/checkout"
              style={{ display: "block", textAlign: "center", background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "12px 18px", borderRadius: 8, fontSize: 14.5, fontWeight: 600 }}
            >
              {t("carrito.irCheckout")}
            </Link>
          </aside>
        </div>
      )}
    </PageShell>
  );
}

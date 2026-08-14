import type { ReactNode } from "react";
import Link from "next/link";
import { LOGO_URL } from "@/lib/data";

/* Layout del grupo (auth): mismo lenguaje visual de las vistas principales
   (fondo del sitio, tipografía y cards), sin header ni footer globales. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--fg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 24px 48px",
      }}
    >
      {/* Marca, como el header pero mínima */}
      <div style={{ width: "100%", maxWidth: 1080, padding: "12px 0" }}>
        <Link href="/" aria-label="Inca Travel Peru — inicio" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_URL}
            alt="Inca Travel Peru"
            style={{ height: 34, width: "auto", display: "block", borderRadius: 8 }}
          />
          <strong style={{ fontSize: 14.5, letterSpacing: "-0.01em" }}>Inca Travel Peru</strong>
        </Link>
      </div>

      <main
        style={{
          width: "100%",
          maxWidth: 440,
          margin: "clamp(32px, 8vh, 88px) auto 0",
        }}
      >
        {children}
      </main>

      <p style={{ margin: "40px 0 0", fontSize: 12.5, color: "var(--muted)", textAlign: "center" }}>
        Transporte · Tours · Traslados — sur del Perú
      </p>
    </div>
  );
}

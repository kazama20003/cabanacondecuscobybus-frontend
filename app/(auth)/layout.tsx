import type { ReactNode } from "react";
import Link from "next/link";
import { MEDIA_VIDEO } from "@/lib/data";

/* Layout propio del grupo (auth): pantalla dividida sin header ni footer del
   sitio. Izquierda: video de marca con mensaje. Derecha: formulario. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--fg)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
      }}
    >
      {/* Panel de marca */}
      <div style={{ position: "relative", minHeight: 320, overflow: "hidden" }}>
        <video
          src={MEDIA_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.15) 45%, rgba(0,0,0,.55) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "28px 32px",
            color: "#fff",
          }}
        >
          <Link href="/" aria-label="Inca Travel Peru — inicio" style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff" }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ width: 16, height: 16, borderRadius: "50%", background: "#111110", display: "inline-block" }} />
            </span>
            <strong style={{ fontSize: 15, letterSpacing: "-0.01em" }}>Inca Travel Peru</strong>
          </Link>
          <div style={{ maxWidth: 420 }}>
            <p style={{ margin: "0 0 10px", fontSize: "clamp(24px, 2.6vw, 36px)", lineHeight: 1.2, letterSpacing: "-0.02em", textWrap: "pretty" }}>
              Tu cuenta, tus <em className="serif">viajes</em> por el sur del Perú.
            </p>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, opacity: 0.85, textWrap: "pretty" }}>
              Guarda tus reservas de transporte, tours y traslados en un solo lugar.
            </p>
          </div>
        </div>
      </div>

      {/* Panel de formulario */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>{children}</div>
      </div>
    </div>
  );
}

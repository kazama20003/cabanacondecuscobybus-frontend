import type { ReactNode } from "react";
import Link from "next/link";
import { MEDIA_VIDEO } from "@/lib/data";

/* Layout del grupo (auth): experiencia inmersiva propia, sin header ni
   footer del sitio. Video a pantalla completa con overlay oscuro y una
   card de vidrio (glassmorphism) centrada con el contenido. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
        overflow: "hidden",
        color: "#fff",
      }}
    >
      {/* Fondo: video + gradiente */}
      <video
        src={MEDIA_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: -2 }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: "radial-gradient(120% 90% at 50% 10%, rgba(10,10,10,.35) 0%, rgba(10,10,10,.72) 100%)",
        }}
      />

      {/* Marca */}
      <Link
        href="/"
        aria-label="Inca Travel Peru — inicio"
        style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", marginBottom: 28 }}
      >
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#111110", display: "inline-block" }} />
        </span>
        <strong style={{ fontSize: 16, letterSpacing: "-0.01em" }}>Inca Travel Peru</strong>
      </Link>

      {/* Card de vidrio */}
      <main
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 22,
          padding: "40px 36px",
          background: "rgba(20, 20, 19, .55)",
          border: "1px solid rgba(255,255,255,.14)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "0 30px 80px rgba(0,0,0,.45)",
        }}
      >
        {children}
      </main>

      {/* Pie mínimo */}
      <p style={{ margin: "26px 0 0", fontSize: 12.5, color: "rgba(255,255,255,.65)", textAlign: "center" }}>
        Transporte · Tours · Traslados — sur del Perú
      </p>
    </div>
  );
}

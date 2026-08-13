"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { TransportRoute } from "@/lib/data";
import { CONTACT } from "@/lib/data";

/* Fila interactiva de ruta: al pasar el cursor se resalta la card, el video
   de la ruta se reproduce en lugar de la foto y aparece el CTA de reserva. */
export default function RouteCard({
  route: r,
  video,
  compact = false,
}: {
  route: TransportRoute;
  /** URL de video a reproducir en hover sobre la foto */
  video?: string;
  /** true: versión del home (menos columnas de detalle) */
  compact?: boolean;
}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hover, setHover] = useState(false);

  const onEnter = () => {
    setHover(true);
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };
  const onLeave = () => {
    setHover(false);
    videoRef.current?.pause();
  };

  const href = `/transporte/${r.slug}`;
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    `Hola, quiero reservar la ruta ${r.from} → ${r.to}`
  )}`;

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`${r.from} a ${r.to}`}
      onClick={() => router.push(href)}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(href);
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      style={{
        display: "grid",
        gridTemplateColumns: compact
          ? "1.35fr 1fr 1fr 1fr"
          : "minmax(220px, 1.35fr) minmax(180px, 1fr) minmax(160px, 1fr) minmax(200px, 1fr)",
        gap: 16,
        alignItems: "stretch",
        borderTop: hover ? "1px solid transparent" : "1px solid var(--line)",
        padding: "14px 16px 14px",
        margin: "0 -16px",
        borderRadius: 14,
        cursor: "pointer",
        background: hover ? "var(--card)" : "transparent",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? "0 10px 30px rgba(0,0,0,.08)" : "none",
        transition: "background .25s ease, transform .25s ease, box-shadow .25s ease, border-color .25s ease",
      }}
    >
      {/* Col 1: ruta + descripción */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingRight: 20, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              borderRadius: 8,
              background: "var(--fg)",
              color: "var(--bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              width: 34,
              height: 34,
              fontSize: 15,
              flexShrink: 0,
              transform: hover ? "rotate(90deg)" : "none",
              transition: "transform .3s ease",
            }}
          >
            ⇄
          </span>
          <strong style={{ fontSize: compact ? 14 : 18, letterSpacing: "-0.01em", lineHeight: 1.25 }}>
            {r.from} <span style={{ color: "var(--muted)" }}>→</span> {r.to}
          </strong>
        </div>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: "var(--muted)", maxWidth: 340, textWrap: "pretty" }}>
          {r.description}
        </p>
        <span style={{ fontSize: 13, fontWeight: 600, marginTop: "auto" }}>
          Ver ruta{" "}
          <span
            style={{
              display: "inline-block",
              transform: hover ? "translateX(6px)" : "none",
              transition: "transform .25s ease",
            }}
          >
            →
          </span>
        </span>
      </div>

      {/* Col 2: salidas */}
      <div style={{ fontSize: 13.5, lineHeight: 1.7, alignSelf: "center" }}>
        <div style={{ color: "var(--muted)" }}>Salidas</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "4px 0" }}>
          {r.departures.map((d) => (
            <span
              key={d}
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                padding: "3px 9px",
                borderRadius: 8,
                background: hover ? "var(--fg)" : "var(--card)",
                color: hover ? "var(--bg)" : "var(--fg)",
                border: "1px solid var(--line)",
                transition: "background .25s ease, color .25s ease",
              }}
            >
              {d}
            </span>
          ))}
        </div>
        <div style={{ color: "var(--muted)" }}>{r.frequency}</div>
      </div>

      {/* Col 3: duración / vehículo */}
      <div style={{ fontSize: 13.5, lineHeight: 1.7, alignSelf: "center" }}>
        <div style={{ color: "var(--muted)" }}>Duración</div>
        <div style={{ fontWeight: 600 }}>
          {r.duration} <span style={{ color: "var(--muted)", fontWeight: 400 }}>· {r.distance}</span>
        </div>
        <div style={{ color: "var(--muted)", marginTop: 6, textWrap: "pretty" }}>{r.vehicle}</div>
      </div>

      {/* Col 4: media (foto → video en hover) + precio + CTA */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 2", borderRadius: 10, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={r.image}
            alt={`${r.from} — ${r.to}`}
            loading="lazy"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hover ? "scale(1.06)" : "scale(1)",
              transition: "transform .5s ease",
            }}
          />
          {video && (
            <video
              ref={videoRef}
              src={video}
              loop
              muted
              playsInline
              preload="metadata"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: hover ? 1 : 0,
                transition: "opacity .35s ease",
              }}
            />
          )}
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              right: 10,
              bottom: 10,
              fontSize: 13,
              fontWeight: 600,
              background: "var(--btn-bg)",
              color: "var(--btn-fg)",
              padding: "7px 13px",
              borderRadius: 8,
              opacity: hover ? 1 : 0,
              transform: hover ? "translateY(0)" : "translateY(8px)",
              pointerEvents: hover ? "auto" : "none",
              transition: "opacity .25s ease, transform .25s ease",
            }}
          >
            Reservar
          </a>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700 }}>
          Desde S/ {r.priceFrom} <span style={{ color: "var(--muted)", fontWeight: 400 }}>por persona</span>
        </span>
      </div>
    </div>
  );
}

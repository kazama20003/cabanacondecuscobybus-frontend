"use client";

import { CSSProperties, useState } from "react";

/* ---------- image-slot: placeholder box / imagen / video ---------- */
export default function ImageSlot({
  radius = 12,
  circle = false,
  placeholder,
  src,
  video,
  style,
}: {
  radius?: number;
  circle?: boolean;
  placeholder?: string;
  /** URL de imagen a mostrar (object-fit: cover) */
  src?: string;
  /** URL de video a reproducir en bucle, muteado (object-fit: cover) */
  video?: string;
  style?: CSSProperties;
}) {
  const [medioFallido, setMedioFallido] = useState<{ src?: string; video?: string } | null>(null);
  const errorDeMedio = medioFallido?.src === src && medioFallido?.video === video;

  const box: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    borderRadius: circle ? "50%" : radius,
    overflow: "hidden",
    ...style,
  };

  if (video && !errorDeMedio) {
    const videoId = video.match(/(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/)?.[1];
    if (videoId) {
      return (
        <iframe
          title={placeholder ?? "Video del destino"}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
          style={{ ...box, border: 0 }}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      );
    }
    return (
      <video
        style={{ ...box, objectFit: "cover" }}
        src={video}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onError={() => setMedioFallido({ src, video })}
      />
    );
  }

  if (src && !errorDeMedio) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img style={{ ...box, objectFit: "cover" }} src={src} alt={placeholder ?? ""} loading="lazy" onError={() => setMedioFallido({ src, video })} />;
  }

  return (
    <div
      style={{
        ...box,
        background:
          "repeating-linear-gradient(135deg, var(--line) 0 12px, transparent 12px 24px), var(--card)",
        border: "1px solid var(--line)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--muted)",
        fontSize: 12,
        textAlign: "center",
        padding: 12,
      }}
    >
      {placeholder}
    </div>
  );
}

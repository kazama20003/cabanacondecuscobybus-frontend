"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";

/* ---------- image-slot: placeholder box / imagen / video ---------- */
export default function ImageSlot({
  radius = 12,
  circle = false,
  placeholder,
  src,
  video,
  poster,
  eager = false,
  style,
}: {
  radius?: number;
  circle?: boolean;
  placeholder?: string;
  /** URL de imagen a mostrar (object-fit: cover) */
  src?: string;
  /** URL de video a reproducir en bucle, muteado (object-fit: cover) */
  video?: string;
  /** Imagen fija mientras el video inicia o si el navegador no lo reproduce */
  poster?: string;
  /** Usa carga inmediata solo para el video principal visible al abrir la página */
  eager?: boolean;
  style?: CSSProperties;
}) {
  const [medioFallido, setMedioFallido] = useState<{ src?: string; video?: string } | null>(null);
  const [videoCerca, setVideoCerca] = useState(eager);
  const videoRef = useRef<HTMLVideoElement>(null);
  const errorDeMedio = medioFallido?.src === src && medioFallido?.video === video;

  useEffect(() => {
    if (!video || eager || videoCerca) return;
    const elemento = videoRef.current;
    if (!elemento) return;
    if (!("IntersectionObserver" in window)) {
      setVideoCerca(true);
      return;
    }
    const observer = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting) {
        setVideoCerca(true);
        observer.disconnect();
      }
    }, { rootMargin: "280px" });
    observer.observe(elemento);
    return () => observer.disconnect();
  }, [video, eager, videoCerca]);

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
        ref={videoRef}
        style={{ ...box, objectFit: "cover" }}
        src={videoCerca ? video : undefined}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload={eager ? "metadata" : "none"}
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

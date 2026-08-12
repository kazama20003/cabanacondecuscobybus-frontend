import { CSSProperties } from "react";

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
  const box: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    borderRadius: circle ? "50%" : radius,
    overflow: "hidden",
    ...style,
  };

  if (video) {
    return (
      <video
        style={{ ...box, objectFit: "cover" }}
        src={video}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    );
  }

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img style={{ ...box, objectFit: "cover" }} src={src} alt={placeholder ?? ""} loading="lazy" />;
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

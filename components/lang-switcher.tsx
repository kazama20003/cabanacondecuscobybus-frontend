"use client";

import { useEffect, useRef, useState } from "react";

/* Banderas SVG (los emoji de bandera no se ven en Windows) */
function FlagPE({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 30 21" style={{ borderRadius: 2, display: "block" }} aria-hidden>
      <rect width="30" height="21" fill="#D91023" />
      <rect x="10" width="10" height="21" fill="#fff" />
    </svg>
  );
}

function FlagUS({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 30 21" style={{ borderRadius: 2, display: "block" }} aria-hidden>
      <rect width="30" height="21" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={i * 1.62} width="30" height="1.62" fill="#B22234" />
      ))}
      <rect width="13" height="11.3" fill="#3C3B6E" />
    </svg>
  );
}

const LANGS = [
  { code: "es", label: "Español", short: "ES", Flag: FlagPE },
  { code: "en", label: "English", short: "EN", Flag: FlagUS },
  { code: "fr", label: "Français", short: "FR", Flag: FlagUS },
  { code: "it", label: "Italiano", short: "IT", Flag: FlagUS },
  { code: "pt", label: "Português", short: "PT", Flag: FlagUS },
  { code: "zh", label: "中文", short: "ZH", Flag: FlagUS },
  { code: "ja", label: "日本語", short: "JA", Flag: FlagUS },
  { code: "ru", label: "Русский", short: "RU", Flag: FlagUS },
  { code: "de", label: "Deutsch", short: "DE", Flag: FlagUS },
] as const;

export type LangCode = (typeof LANGS)[number]["code"];

/* Selector de idioma con banderas. Persiste en localStorage (inca-lang);
   la traducción real de contenidos se conecta después. */
export default function LangSwitcher({
  direction = "down",
  align = "right",
}: {
  /** hacia dónde abre el menú (up: útil en footers/sidebars) */
  direction?: "down" | "up";
  align?: "left" | "right";
}) {
  const [lang, setLang] = useState<LangCode>("es");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("inca-lang") as LangCode | null;
    if (saved && LANGS.some((l) => l.code === saved)) setLang(saved);
  }, []);

  // cierra al hacer clic fuera
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const pick = (code: LangCode) => {
    setLang(code);
    localStorage.setItem("inca-lang", code);
    setOpen(false);
  };

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Cambiar idioma"
        aria-expanded={open}
        title="Cambiar idioma"
        style={{
          background: "var(--pill-bg)",
          color: "var(--pill-fg)",
          borderRadius: 8,
          padding: "7px 11px",
          display: "flex",
          alignItems: "center",
          gap: 7,
          border: "none",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "inherit",
          letterSpacing: "-0.01em",
        }}
      >
        <current.Flag size={17} />
        {current.short}
        <span
          style={{
            fontSize: 9,
            transform: open !== (direction === "up") ? "rotate(180deg)" : "none",
            transition: "transform .2s",
          }}
        >
          ▼
        </span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            ...(direction === "down" ? { top: "calc(100% + 6px)" } : { bottom: "calc(100% + 6px)" }),
            ...(align === "right" ? { right: 0 } : { left: 0 }),
            background: "var(--pill-bg)",
            borderRadius: 8,
            boxShadow: "0 10px 30px rgba(0,0,0,.15)",
            border: "1px solid var(--line)",
            overflow: "hidden",
            minWidth: 140,
            zIndex: 60,
          }}
        >
          {LANGS.map(({ code, label, Flag }) => (
            <button
              key={code}
              onClick={() => pick(code)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 13px",
                border: "none",
                cursor: "pointer",
                fontSize: 13.5,
                fontWeight: code === lang ? 700 : 500,
                fontFamily: "inherit",
                background: code === lang ? "var(--fg)" : "transparent",
                color: code === lang ? "var(--bg)" : "var(--pill-fg)",
                textAlign: "left",
              }}
            >
              <Flag size={17} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

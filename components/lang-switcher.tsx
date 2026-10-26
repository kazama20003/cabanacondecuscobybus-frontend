"use client";

import { useEffect, useRef, useState } from "react";
import { IDIOMAS_HABILITADOS, useIdioma, type LangCode } from "@/components/lang-provider";

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

function FlagFR({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 30 21" style={{ borderRadius: 2, display: "block" }} aria-hidden>
      <rect width="10" height="21" fill="#002395" />
      <rect x="10" width="10" height="21" fill="#fff" />
      <rect x="20" width="10" height="21" fill="#ED2939" />
    </svg>
  );
}

function FlagIT({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 30 21" style={{ borderRadius: 2, display: "block" }} aria-hidden>
      <rect width="10" height="21" fill="#009246" />
      <rect x="10" width="10" height="21" fill="#fff" />
      <rect x="20" width="10" height="21" fill="#CE2B37" />
    </svg>
  );
}

function FlagPT({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 30 21" style={{ borderRadius: 2, display: "block" }} aria-hidden>
      <rect width="12" height="21" fill="#046A38" />
      <rect x="12" width="18" height="21" fill="#DA291C" />
      <circle cx="12" cy="10.5" r="3.3" fill="#FFCD00" />
      <circle cx="12" cy="10.5" r="2.1" fill="#fff" />
    </svg>
  );
}

function FlagCN({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 30 21" style={{ borderRadius: 2, display: "block" }} aria-hidden>
      <rect width="30" height="21" fill="#DE2910" />
      <path d="M6 3.1 7 5.6l2.7.2-2.1 1.7.7 2.6L6 8.7l-2.3 1.4.7-2.6-2.1-1.7 2.7-.2z" fill="#FFDE00" />
      <circle cx="12" cy="3.8" r=".75" fill="#FFDE00" />
      <circle cx="14.2" cy="6" r=".75" fill="#FFDE00" />
      <circle cx="14.1" cy="9" r=".75" fill="#FFDE00" />
      <circle cx="11.8" cy="11" r=".75" fill="#FFDE00" />
    </svg>
  );
}

function FlagJP({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 30 21" style={{ borderRadius: 2, display: "block" }} aria-hidden>
      <rect width="30" height="21" fill="#fff" />
      <circle cx="15" cy="10.5" r="6" fill="#BC002D" />
    </svg>
  );
}

function FlagRU({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 30 21" style={{ borderRadius: 2, display: "block" }} aria-hidden>
      <rect width="30" height="7" fill="#fff" />
      <rect y="7" width="30" height="7" fill="#0039A6" />
      <rect y="14" width="30" height="7" fill="#D52B1E" />
    </svg>
  );
}

function FlagDE({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 30 21" style={{ borderRadius: 2, display: "block" }} aria-hidden>
      <rect width="30" height="7" fill="#000" />
      <rect y="7" width="30" height="7" fill="#DD0000" />
      <rect y="14" width="30" height="7" fill="#FFCE00" />
    </svg>
  );
}

const LANGS = [
  { code: "es", label: "Español", short: "ES", Flag: FlagPE },
  { code: "en", label: "English", short: "EN", Flag: FlagUS },
  { code: "fr", label: "Français", short: "FR", Flag: FlagFR },
  { code: "it", label: "Italiano", short: "IT", Flag: FlagIT },
  { code: "pt", label: "Português", short: "PT", Flag: FlagPT },
  { code: "zh", label: "中文", short: "ZH", Flag: FlagCN },
  { code: "ja", label: "日本語", short: "JA", Flag: FlagJP },
  { code: "ru", label: "Русский", short: "RU", Flag: FlagRU },
  { code: "de", label: "Deutsch", short: "DE", Flag: FlagDE },
] as const;

/* Selector de idioma con banderas. Escribe el idioma global (IdiomaProvider),
   que persiste en localStorage (inca-lang) y consumen los hooks del catálogo. */
export default function LangSwitcher({
  direction = "down",
  align = "right",
}: {
  /** hacia dónde abre el menú (up: útil en footers/sidebars) */
  direction?: "down" | "up";
  align?: "left" | "right";
}) {
  const { idioma: lang, setIdioma } = useIdioma();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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
    setIdioma(code);
    setOpen(false);
  };

  const idiomasDisponibles = LANGS.filter((item) => IDIOMAS_HABILITADOS.includes(item.code));
  const current = idiomasDisponibles.find((l) => l.code === lang) ?? idiomasDisponibles[0];

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
          {idiomasDisponibles.map(({ code, label, Flag }) => (
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

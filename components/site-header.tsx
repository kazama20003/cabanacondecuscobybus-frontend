"use client";

import { CSSProperties, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bus, Car, MapPin, Compass, Users, Phone, LogIn } from "lucide-react";
import { LOGO_URL } from "@/lib/data";

const navPill: CSSProperties = {
  background: "var(--pill-bg)",
  color: "var(--pill-fg)",
  borderRadius: 3,
  padding: "7px 11px",
};

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
] as const;

type LangCode = (typeof LANGS)[number]["code"];

const NAV = [
  { label: "Transporte", href: "/transporte", Icon: Bus },
  { label: "Traslados", href: "/traslados", Icon: Car },
  { label: "Tours", href: "/tours", Icon: MapPin },
  { label: "Destinos", href: "/destinos", Icon: Compass },
  { label: "Nosotros", href: "/nosotros", Icon: Users },
];

export default function SiteHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<LangCode>("es");
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = (localStorage.getItem("inca-theme") as "light" | "dark") || "light";
    setTheme(saved);
    const savedLang = localStorage.getItem("inca-lang") as LangCode | null;
    if (savedLang && LANGS.some((l) => l.code === savedLang)) setLang(savedLang);
  }, []);

  const pickLang = (code: LangCode) => {
    setLang(code);
    localStorage.setItem("inca-lang", code);
    setLangOpen(false);
  };

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("inca-theme", next);
      return next;
    });
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        margin: "0 -24px",
        flexWrap: "wrap",
        gap: 8,
        background: "var(--bg)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
        <Link
          href="/"
          aria-label="Inca Travel Peru — inicio"
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: 8,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_URL}
            alt="Inca Travel Peru"
            style={{ height: 34, width: "auto", display: "block", borderRadius: 8 }}
          />
        </Link>
        <nav style={{ display: "flex", gap: 5, fontSize: 14.5, fontWeight: 600, letterSpacing: "-0.01em", flexWrap: "wrap" }}>
          {NAV.map(({ label, href, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={label}
                href={href}
                style={{
                  ...navPill,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  ...(active ? { background: "var(--fg)", color: "var(--bg)" } : {}),
                }}
              >
                <Icon size={15} strokeWidth={2} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14.5, fontWeight: 600, letterSpacing: "-0.01em" }}>
        <Link href="/contacto" style={{ ...navPill, padding: "7px 12px", display: "flex", alignItems: "center", gap: 6 }}>
          <Phone size={15} strokeWidth={2} />
          Contacto
        </Link>
        <a
          href="/login"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 13px",
            borderRadius: 3,
            background: "var(--btn-bg)",
            color: "var(--btn-fg)",
          }}
        >
          <LogIn size={15} strokeWidth={2} />
          Iniciar sesión
        </a>
        {/* Selector de idioma */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setLangOpen((o) => !o)}
            aria-label="Cambiar idioma"
            aria-expanded={langOpen}
            title="Cambiar idioma"
            style={{
              ...navPill,
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
            <span style={{ fontSize: 9, transform: langOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▼</span>
          </button>
          {langOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
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
                  onClick={() => pickLang(code)}
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
        <button
          onClick={toggleTheme}
          title="Cambiar tema"
          aria-label="Cambiar tema"
          style={{
            height: 30,
            width: 30,
            border: "none",
            background: "transparent",
            color: "var(--fg)",
            cursor: "pointer",
            fontSize: 17,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>
    </header>
  );
}

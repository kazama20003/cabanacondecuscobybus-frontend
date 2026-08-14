"use client";

import { CSSProperties, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bus, Car, MapPin, Compass, Users, Phone, LogIn } from "lucide-react";
import { LOGO_URL } from "@/lib/data";
import LangSwitcher from "@/components/lang-switcher";

const navPill: CSSProperties = {
  background: "var(--pill-bg)",
  color: "var(--pill-fg)",
  borderRadius: 3,
  padding: "7px 11px",
};

const NAV = [
  { label: "Transporte", href: "/transporte", Icon: Bus },
  { label: "Traslados", href: "/traslados", Icon: Car },
  { label: "Tours", href: "/tours", Icon: MapPin },
  { label: "Destinos", href: "/destinos", Icon: Compass },
  { label: "Nosotros", href: "/nosotros", Icon: Users },
];

export default function SiteHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const pathname = usePathname();

  useEffect(() => {
    const saved = (localStorage.getItem("inca-theme") as "light" | "dark") || "light";
    setTheme(saved);
  }, []);


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
        <LangSwitcher />
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

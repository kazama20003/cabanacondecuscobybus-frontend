"use client";
/* eslint-disable react-hooks/set-state-in-effect -- lectura de tema desde localStorage al montar */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bus, MapPin, CalendarDays, Compass, Users, Phone, LogIn, ShoppingCart } from "lucide-react";
import { LOGO_URL } from "@/lib/data";
import LangSwitcher from "@/components/lang-switcher";
import { useCarrito } from "@/components/cart-provider";
import { useT } from "@/lib/i18n";
import styles from "@/components/site-header.module.css";

const NAV = [
  { clave: "nav.transporte", href: "/transporte", Icon: Bus },
  { clave: "nav.tours", href: "/tours", Icon: MapPin },
  { clave: "nav.eventos", href: "/eventos", Icon: CalendarDays },
  { clave: "nav.destinos", href: "/destinos", Icon: Compass },
  { clave: "nav.nosotros", href: "/nosotros", Icon: Users },
];

export default function SiteHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const pathname = usePathname();
  const t = useT();
  const { totalLineas, hidratado } = useCarrito();

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
    <header className={styles.header}>
      <div className={styles.brandNav}>
        <Link
          href="/"
          aria-label="Inca Travel Peru — inicio"
          className={styles.logoLink}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_URL} alt="Inca Travel Peru" className={styles.logo} />
        </Link>
        <nav className={styles.nav}>
          {NAV.map(({ clave, href, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={clave}
                href={href}
                className={`${styles.navLink} ${active ? styles.active : ""}`}
              >
                <Icon size={15} strokeWidth={2} />
                {t(clave)}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className={styles.actions}>
        <Link href="/contacto" aria-label={t("header.contacto")} className={`${styles.actionPill} ${styles.contactLink}`}>
          <Phone size={15} strokeWidth={2} />
          <span>{t("header.contacto")}</span>
        </Link>
        <Link
          href="/carrito"
          aria-label={t("carrito.titulo")}
          className={`${styles.actionPill} ${styles.cartLink}`}
        >
          <ShoppingCart size={16} strokeWidth={2} />
          {hidratado && totalLineas > 0 && (
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                minWidth: 17,
                height: 17,
                padding: "0 4px",
                borderRadius: 9,
                background: "var(--btn-bg)",
                color: "var(--btn-fg)",
                fontSize: 10.5,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {totalLineas}
            </span>
          )}
        </Link>
        <a
          href="/login"
          aria-label={t("header.login")}
          className={styles.loginButton}
        >
          <LogIn size={15} strokeWidth={2} />
          <span>{t("header.login")}</span>
        </a>
        <div className={styles.language}><LangSwitcher /></div>
        <button
          onClick={toggleTheme}
          title={t("header.tema")}
          aria-label={t("header.tema")}
          className={styles.themeButton}
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>
    </header>
  );
}

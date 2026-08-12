import type { ReactNode } from "react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

/* Envoltura común de todas las vistas: fondo, padding, header y footer. */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", padding: "0 24px 48px" }}>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}

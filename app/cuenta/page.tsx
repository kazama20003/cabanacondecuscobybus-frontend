"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMiPerfil, useCerrarSesion } from "@/hooks/use-auth";
import { useMisReservas } from "@/hooks/use-reservas";
import { tokenStorage } from "@/lib/api";
import { useT, LOCALES } from "@/lib/i18n";
import { useIdioma } from "@/components/lang-provider";

/* Perfil del turista: sus datos y sus reservas, con el estilo del sitio público. */
export default function PaginaCuenta() {
  const router = useRouter();
  const t = useT();
  const { idioma } = useIdioma();
  const { data: perfil, isLoading, isError } = useMiPerfil();
  const hayToken = typeof window !== "undefined" && !!tokenStorage.obtener();
  const { data: reservas, isLoading: cargandoReservas } = useMisReservas(hayToken);
  const cerrarSesion = useCerrarSesion();

  useEffect(() => {
    if (!hayToken || isError) router.replace("/login");
  }, [hayToken, isError, router]);

  if (!hayToken || isLoading || !perfil) {
    return (
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "80px 20px" }}>
        <p style={{ color: "var(--muted)" }}>{t("cuenta.loading")}</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 880, margin: "0 auto", padding: "56px 20px 80px" }}>
      <p style={{ margin: "0 0 8px", fontSize: 13.5 }}>
        <Link href="/" style={{ color: "var(--muted)" }}>{t("auth.backHome")}</Link>
      </p>
      <h1
        style={{
          margin: "0 0 8px",
          fontSize: "clamp(32px, 4vw, 48px)",
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          fontWeight: 400,
        }}
      >
        {t("cuenta.helloPre")}<em className="serif">{perfil.nombres}</em>.
      </h1>
      <p style={{ margin: "0 0 32px", fontSize: 15, color: "var(--muted)" }}>
        {perfil.correo}
        {perfil.paisResidencia ? ` · ${perfil.paisResidencia}` : ""}
      </p>

      <section
        style={{
          background: "var(--card)",
          borderRadius: 16,
          padding: "28px 24px",
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 600 }}>
          {t("cuenta.misReservas")}
        </h2>

        {cargandoReservas && (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>{t("cuenta.loadingReservas")}</p>
        )}

        {reservas && reservas.length === 0 && (
          <div style={{ padding: "24px 0" }}>
            <p style={{ margin: "0 0 12px", color: "var(--muted)", fontSize: 14.5 }}>
              {t("cuenta.sinReservas")}
            </p>
            <Link href="/transporte" style={{ fontWeight: 600, fontSize: 14.5 }}>
              {t("cuenta.verRutas")}
            </Link>
          </div>
        )}

        {reservas?.map((reserva) => {
          const salidaT = reserva.salidaTransporte as
            | { fechaHoraSalida?: string; transporte?: { origenNombre?: string; destinoNombre?: string } }
            | undefined;
          const salidaTo = reserva.salidaTour as
            | { fechaHoraSalida?: string; tour?: { destinoNombre?: string } }
            | undefined;
          const nombre = salidaT?.transporte
            ? `${salidaT.transporte.origenNombre} → ${salidaT.transporte.destinoNombre}`
            : (salidaTo?.tour?.destinoNombre ?? t("cuenta.servicio"));
          const fecha = salidaT?.fechaHoraSalida ?? salidaTo?.fechaHoraSalida;
          return (
            <div
              key={reserva.id}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "16px 0",
                borderTop: "1px solid var(--line)",
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{nombre}</p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted)" }}>
                  {reserva.codigo}
                  {fecha
                    ? ` · ${new Date(fecha).toLocaleString(LOCALES[idioma], { dateStyle: "medium", timeStyle: "short" })}`
                    : ""}
                  {` · ${reserva.cantidadPasajeros ?? 1} ${t("cuenta.pasajerosSuf")}`}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>
                  {reserva.moneda === "USD" ? "US$" : "S/"} {String(reserva.montoTotal)}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--muted)" }}>
                  {t(`cuenta.estado.${String(reserva.estado)}`)}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      <button
        type="button"
        onClick={() => {
          cerrarSesion();
          router.push("/");
        }}
        style={{
          background: "none",
          border: "1px solid var(--line)",
          borderRadius: 8,
          padding: "10px 18px",
          fontSize: 14,
          cursor: "pointer",
          color: "var(--fg)",
        }}
      >
        {t("cuenta.cerrarSesion")}
      </button>
    </main>
  );
}

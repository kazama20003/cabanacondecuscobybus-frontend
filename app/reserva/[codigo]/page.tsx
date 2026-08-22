"use client";
/* eslint-disable react-hooks/set-state-in-effect -- lectura de token/sesión al montar */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import PageShell from "@/components/page-shell";
import IzipayForm from "@/components/izipay-form";
import { useT } from "@/lib/i18n";
import {
  useReservaInvitado,
  useMisReservas,
  useIniciarPagoAdelanto,
} from "@/hooks/use-reservas";
import { obtenerTokenInvitado } from "@/lib/reservas-invitado";
import { tokenStorage, ApiError } from "@/lib/api";
import type { PagoAdelantoApi, ReservaApi } from "@/lib/api";

function num(v: unknown): number {
  return Number(v ?? 0);
}

export default function ReservaPage() {
  const params = useParams();
  const codigo = typeof params?.codigo === "string" ? params.codigo : Array.isArray(params?.codigo) ? params.codigo[0] : "";
  const t = useT();
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(null);
  const [logueado, setLogueado] = useState(false);
  const [pago, setPago] = useState<PagoAdelantoApi | null>(null);
  const [errorPago, setErrorPago] = useState<string | null>(null);

  useEffect(() => {
    setToken(obtenerTokenInvitado(codigo));
    setLogueado(!!tokenStorage.obtener());
  }, [codigo]);

  const invitado = useReservaInvitado(codigo, token ?? "");
  const mias = useMisReservas(logueado && !token);
  const iniciarPago = useIniciarPagoAdelanto();

  const reserva: ReservaApi | undefined =
    invitado.data ?? mias.data?.find((r) => r.codigo === codigo);

  const cargando = invitado.isLoading || mias.isLoading;

  const pagar = async () => {
    setErrorPago(null);
    try {
      const datos = await iniciarPago.mutateAsync(codigo);
      setPago(datos);
    } catch (e) {
      setErrorPago(e instanceof ApiError ? e.message : t("reserva.errorPago"));
    }
  };

  const alPagar = () => {
    // El webhook confirma el pago de forma asíncrona; refrescamos el estado.
    setPago(null);
    void queryClient.invalidateQueries();
  };

  if (cargando) {
    return (
      <PageShell>
        <p style={{ margin: "60px 0", color: "var(--muted)", fontSize: 15 }}>{t("lista.cargando")}</p>
      </PageShell>
    );
  }

  if (!reserva) {
    return (
      <PageShell>
        <div style={{ padding: "60px 0" }}>
          <p style={{ margin: "0 0 12px", color: "var(--muted)", fontSize: 15 }}>{t("reserva.noEncontrada")}</p>
          <Link href="/" style={{ fontWeight: 600 }}>{t("auth.backHome")}</Link>
        </div>
      </PageShell>
    );
  }

  const estado = String(reserva.estado);
  const montoTotal = num(reserva.montoTotal);
  const montoAdelanto = num(reserva.montoAdelanto);
  const montoSaldo = num(reserva.montoSaldo);
  const moneda = String(reserva.moneda ?? "PEN");
  const simbolo = moneda === "USD" ? "US$" : "S/";
  const pasajeros = Array.isArray(reserva.pasajeros) ? reserva.pasajeros.length : num(reserva.cantidadPasajeros);
  const puedePagar = estado === "PENDIENTE_PAGO";

  const fila = (etiqueta: string, valor: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14, padding: "8px 0", borderTop: "1px solid var(--line)" }}>
      <span style={{ color: "var(--muted)" }}>{etiqueta}</span>
      <strong>{valor}</strong>
    </div>
  );

  return (
    <PageShell>
      <p style={{ margin: "40px 0 8px", fontSize: 13.5 }}>
        <Link href={logueado ? "/cuenta" : "/"} style={{ color: "var(--muted)" }}>{t("auth.backHome")}</Link>
      </p>
      <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.08, letterSpacing: "-0.03em", fontWeight: 400, margin: "0 0 8px" }}>
        {t("reserva.titulo")}
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: 15, color: "var(--muted)" }}>
        {t("reserva.codigo")}: <strong style={{ color: "var(--fg)" }}>{reserva.codigo}</strong>
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 340px", gap: 40, alignItems: "start", paddingBottom: 80 }}>
        <div>
          <section style={{ background: "var(--card)", borderRadius: 14, padding: "22px 22px 8px" }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600 }}>{t("reserva.detalle")}</h2>
            {fila(t("reserva.estado"), t(`cuenta.estado.${estado}`))}
            {fila(t("reserva.pasajerosLbl"), String(pasajeros))}
            {fila(t("reserva.total"), `${simbolo} ${montoTotal}`)}
            {montoAdelanto > 0 && montoAdelanto < montoTotal && fila(t("reserva.adelanto"), `${simbolo} ${montoAdelanto}`)}
            {montoSaldo > 0 && fila(t("reserva.saldo"), `${simbolo} ${montoSaldo}`)}
          </section>

          {puedePagar && (
            <section style={{ marginTop: 24 }}>
              <h2 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 600 }}>{t("reserva.pagar")}</h2>
              {!pago ? (
                <>
                  <p style={{ margin: "0 0 14px", fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
                    {t("reserva.pagarIntro")}
                  </p>
                  <button
                    type="button"
                    onClick={() => void pagar()}
                    disabled={iniciarPago.isPending}
                    style={{ border: "none", cursor: "pointer", background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "12px 18px", borderRadius: 8, fontSize: 14.5, fontWeight: 600, opacity: iniciarPago.isPending ? 0.6 : 1 }}
                  >
                    {iniciarPago.isPending ? t("reserva.iniciando") : `${t("reserva.pagarAdelanto")} ${simbolo} ${montoAdelanto || montoTotal}`}
                  </button>
                  {errorPago && <p style={{ marginTop: 12, color: "#c0392b", fontSize: 14 }}>{errorPago}</p>}
                </>
              ) : (
                <IzipayForm formToken={pago.formToken} llavePublica={pago.llavePublica} onPagado={alPagar} />
              )}
            </section>
          )}

          {!puedePagar && (
            <p style={{ marginTop: 24, fontSize: 14.5, color: "var(--muted)" }}>{t("reserva.pagoRecibido")}</p>
          )}
        </div>

        <aside style={{ background: "var(--card)", borderRadius: 14, padding: "22px 22px", position: "sticky", top: 90 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600 }}>{t("reserva.seguimiento")}</h2>
          <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{t("reserva.guardaCodigo")}</p>
          {!logueado && (
            <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>
              {t("reserva.invitadoNota")}
            </p>
          )}
        </aside>
      </div>
    </PageShell>
  );
}

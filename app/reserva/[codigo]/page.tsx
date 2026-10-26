"use client";
/* eslint-disable react-hooks/set-state-in-effect -- lectura de token/sesión al montar */

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import PageShell from "@/components/page-shell";
import IzipayForm from "@/components/izipay-form";
import { useT } from "@/lib/i18n";
import {
  useReservaInvitado,
  useMisReservas,
  useIniciarPagoAdelanto,
  useSolicitarGestionReserva,
} from "@/hooks/use-reservas";
import { obtenerTokenInvitado } from "@/lib/reservas-invitado";
import { tokenStorage, ApiError } from "@/lib/api";
import type { PagoAdelantoApi, ReservaApi } from "@/lib/api";

function num(v: unknown): number {
  return Number(v ?? 0);
}

export default function ReservaPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const codigo = typeof params?.codigo === "string" ? params.codigo : Array.isArray(params?.codigo) ? params.codigo[0] : "";
  const t = useT();
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(null);
  const [logueado, setLogueado] = useState(false);
  const [pago, setPago] = useState<PagoAdelantoApi | null>(null);
  const [errorPago, setErrorPago] = useState<string | null>(null);
  const [confirmandoPago, setConfirmandoPago] = useState(() => searchParams.get("confirmando") === "1");
  const [tipoSolicitud, setTipoSolicitud] = useState<"CANCELACION" | "REPROGRAMACION">("CANCELACION");
  const [motivoSolicitud, setMotivoSolicitud] = useState("");
  const [fechaPreferida, setFechaPreferida] = useState("");
  const [respuestaSolicitud, setRespuestaSolicitud] = useState("");
  const [errorSolicitud, setErrorSolicitud] = useState("");

  useEffect(() => {
    setToken(obtenerTokenInvitado(codigo));
    setLogueado(!!tokenStorage.obtener());
  }, [codigo]);

  const invitado = useReservaInvitado(codigo, token ?? "");
  const mias = useMisReservas(logueado && !token);
  const iniciarPago = useIniciarPagoAdelanto();
  const solicitarGestion = useSolicitarGestionReserva();

  const reserva: ReservaApi | undefined =
    invitado.data ?? mias.data?.find((r) => r.codigo === codigo);

  useEffect(() => {
    if (!confirmandoPago) return;
    if (reserva && reserva.estado !== "PENDIENTE_PAGO") {
      setConfirmandoPago(false);
      return;
    }
    const hasta = Date.now() + 60_000;
    const consultar = () => {
      if (Date.now() >= hasta) {
        setConfirmandoPago(false);
        setErrorPago("El pago sigue en validación. Actualiza esta página en unos minutos.");
        return;
      }
      void invitado.refetch();
      void mias.refetch();
    };
    consultar();
    const intervalo = window.setInterval(consultar, 3_000);
    return () => window.clearInterval(intervalo);
  }, [confirmandoPago, invitado.refetch, mias.refetch, reserva]);

  const cargando = invitado.isLoading || mias.isLoading;

  const pagar = async () => {
    setErrorPago(null);
    try {
      const datos = await iniciarPago.mutateAsync({ codigo, token: token ?? undefined });
      setPago(datos);
    } catch (e) {
      setErrorPago(e instanceof ApiError ? e.message : t("reserva.errorPago"));
    }
  };

  const alPagar = () => {
    // Izipay en el navegador no es una confirmación: esperamos el IPN firmado.
    setPago(null);
    setConfirmandoPago(true);
    void queryClient.invalidateQueries({ queryKey: ["reservas"] });
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
  const puedeSolicitarCambio = !["CANCELADA", "COMPLETADA", "VENCIDA"].includes(estado);
  const enviarSolicitudGestion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorSolicitud("");
    setRespuestaSolicitud("");
    try {
      const resultado = await solicitarGestion.mutateAsync({
        codigo,
        token: token ?? undefined,
        datos: {
          tipo: tipoSolicitud,
          motivo: motivoSolicitud,
          fechaPreferida: tipoSolicitud === "REPROGRAMACION" && fechaPreferida ? new Date(`${fechaPreferida}T12:00:00`).toISOString() : undefined,
        },
      });
      setRespuestaSolicitud(resultado.mensaje);
      setMotivoSolicitud("");
      setFechaPreferida("");
    } catch (error) {
      setErrorSolicitud(error instanceof ApiError ? error.message : "No se pudo enviar la solicitud. Intenta nuevamente.");
    }
  };

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
                   {confirmandoPago && <p style={{ marginTop: 12, color: "var(--muted)", fontSize: 14 }}>Pago enviado. Estamos confirmándolo de forma segura.</p>}
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
          {puedeSolicitarCambio && (token || logueado) && (
            <section style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
              <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 650 }}>Cambios o cancelación</h3>
              <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
                Envía una solicitud. La reserva no cambia hasta que administración la revise según la política publicada.
                {process.env.NEXT_PUBLIC_URL_CANCELACIONES && <> {" "}<a href={process.env.NEXT_PUBLIC_URL_CANCELACIONES} target="_blank" rel="noopener noreferrer">Ver política</a></>}
              </p>
              <form onSubmit={(event) => void enviarSolicitudGestion(event)} style={{ display: "grid", gap: 9 }}>
                <select aria-label="Tipo de solicitud" value={tipoSolicitud} onChange={(event) => setTipoSolicitud(event.target.value as "CANCELACION" | "REPROGRAMACION")} style={{ width: "100%", padding: 9, borderRadius: 7, border: "1px solid var(--line)", background: "var(--bg)", color: "var(--fg)" }}>
                  <option value="CANCELACION">Solicitar cancelación</option>
                  <option value="REPROGRAMACION">Solicitar cambio de fecha</option>
                </select>
                {tipoSolicitud === "REPROGRAMACION" && <input aria-label="Fecha preferida" type="date" value={fechaPreferida} onChange={(event) => setFechaPreferida(event.target.value)} style={{ width: "100%", padding: 9, borderRadius: 7, border: "1px solid var(--line)", background: "var(--bg)", color: "var(--fg)" }} />}
                <textarea aria-label="Motivo" value={motivoSolicitud} onChange={(event) => setMotivoSolicitud(event.target.value)} required maxLength={1000} rows={3} placeholder="Cuéntanos el motivo" style={{ width: "100%", padding: 9, borderRadius: 7, border: "1px solid var(--line)", background: "var(--bg)", color: "var(--fg)", resize: "vertical" }} />
                {errorSolicitud && <p role="alert" style={{ margin: 0, color: "#b42318", fontSize: 12 }}>{errorSolicitud}</p>}
                {respuestaSolicitud && <p role="status" style={{ margin: 0, color: "var(--muted)", fontSize: 12 }}>{respuestaSolicitud}</p>}
                <button type="submit" disabled={solicitarGestion.isPending} style={{ border: "1px solid var(--line)", borderRadius: 7, padding: "9px 12px", background: "var(--bg)", color: "var(--fg)", fontWeight: 600, cursor: solicitarGestion.isPending ? "wait" : "pointer" }}>
                  {solicitarGestion.isPending ? "Enviando…" : "Enviar solicitud"}
                </button>
              </form>
            </section>
          )}
        </aside>
      </div>
    </PageShell>
  );
}

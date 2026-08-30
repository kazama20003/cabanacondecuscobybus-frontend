"use client";
/* eslint-disable react-hooks/set-state-in-effect -- prellenado de contacto al llegar el perfil */

import { CSSProperties, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageShell from "@/components/page-shell";
import { useCarrito } from "@/components/cart-provider";
import { useIdioma } from "@/components/lang-provider";
import { useT, LOCALES } from "@/lib/i18n";
import { useCrearReserva } from "@/hooks/use-reservas";
import { useMiPerfil } from "@/hooks/use-auth";
import { guardarReservaInvitado } from "@/lib/reservas-invitado";
import { ApiError } from "@/lib/api";
import type { Moneda, PasajeroEntrada, ReservaApi } from "@/lib/api";

const campo: CSSProperties = {
  width: "100%",
  border: "1px solid var(--line)",
  background: "var(--bg)",
  color: "var(--fg)",
  padding: "11px 13px",
  borderRadius: 8,
  fontSize: 14,
  fontFamily: "inherit",
};
const label: CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 };

const pasajeroVacio = (): PasajeroEntrada => ({
  nombres: "",
  apellidos: "",
  nacionalidad: "",
  tipoDocumento: "DNI",
  numeroDocumento: "",
});

export default function CheckoutPage() {
  const t = useT();
  const { idioma } = useIdioma();
  const router = useRouter();
  const { items, total, totalLineas, limpiar } = useCarrito();
  const { data: perfil } = useMiPerfil();
  const crearReserva = useCrearReserva();

  const [moneda, setMoneda] = useState<Moneda>("PEN");
  const [correoContacto, setCorreo] = useState("");
  const [telefonoWhatsApp, setTelefono] = useState("");
  const [paisResidencia, setPais] = useState("");
  const [codigoPromocion, setCupon] = useState("");
  const [pasajerosPorItem, setPasajeros] = useState<Record<string, PasajeroEntrada[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // Prellena contacto con el perfil si hay sesión (solo al llegar el perfil).
  useEffect(() => {
    if (!perfil) return;
    setCorreo((v) => v || perfil.correo || "");
    setPais((v) => v || perfil.paisResidencia || "");
    setTelefono((v) => v || perfil.telefonoWhatsApp || "");
  }, [perfil]);

  const fmtFecha = (iso: string) =>
    new Date(iso).toLocaleString(LOCALES[idioma], { dateStyle: "medium", timeStyle: "short" });

  // Los pasajeros se derivan en render: el estado guarda solo lo editado y se
  // completa con formularios vacíos hasta la cantidad del carrito.
  const pasajerosDe = (salidaId: string, cantidad: number): PasajeroEntrada[] =>
    Array.from({ length: cantidad }, (_, i) => pasajerosPorItem[salidaId]?.[i] ?? pasajeroVacio());

  const actualizarPasajero = (
    salidaId: string,
    indice: number,
    campoP: keyof PasajeroEntrada,
    valor: string,
  ) =>
    setPasajeros((prev) => {
      const base = prev[salidaId] ? [...prev[salidaId]] : [];
      while (base.length <= indice) base.push(pasajeroVacio());
      base[indice] = { ...base[indice], [campoP]: valor };
      return { ...prev, [salidaId]: base };
    });

  const contactoOk =
    /.+@.+\..+/.test(correoContacto) && telefonoWhatsApp.trim().length >= 6;
  const pasajerosOk = items.every((item) =>
    pasajerosDe(item.salidaId, item.pasajeros).every(
      (p) =>
        p.nombres.trim() &&
        p.apellidos.trim() &&
        p.nacionalidad.trim() &&
        p.numeroDocumento.trim(),
    ),
  );
  const formularioOk = totalLineas > 0 && contactoOk && pasajerosOk && !enviando;

  const enviar = async () => {
    if (!formularioOk) return;
    setEnviando(true);
    setError(null);
    const creadas: ReservaApi[] = [];
    try {
      for (const item of items) {
        const reserva = await crearReserva.mutateAsync({
          tipoServicio: item.tipoServicio,
          salidaId: item.salidaId,
          correoContacto: correoContacto.trim(),
          telefonoWhatsApp: telefonoWhatsApp.trim(),
          paisResidencia: paisResidencia.trim() || undefined,
          moneda,
          pasajeros: pasajerosDe(item.salidaId, item.pasajeros),
          codigoPromocion: codigoPromocion.trim() || undefined,
        });
        creadas.push(reserva);
        if (reserva.tokenGestionInvitado) {
          guardarReservaInvitado(reserva.codigo, reserva.tokenGestionInvitado);
        }
      }
      limpiar();
      router.push(`/reserva/${creadas[0].codigo}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("checkout.errorGenerico"));
      setEnviando(false);
    }
  };

  const tiposDoc = useMemo(
    () => [
      { valor: "DNI", etiqueta: t("checkout.docDNI") },
      { valor: "PASAPORTE", etiqueta: t("checkout.docPasaporte") },
      { valor: "CE", etiqueta: t("checkout.docCE") },
    ],
    [t],
  );

  if (totalLineas === 0) {
    return (
      <PageShell>
        <div style={{ padding: "80px 0" }}>
          <p style={{ margin: "0 0 16px", color: "var(--muted)", fontSize: 15 }}>{t("carrito.vacio")}</p>
          <Link href="/transporte" style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "10px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
            {t("carrito.verTransporte")}
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <h1 style={{ fontSize: "clamp(36px, 4.6vw, 64px)", lineHeight: 1.06, letterSpacing: "-0.03em", fontWeight: 400, margin: "48px 0 8px" }}>
        {t("checkout.titulo")}
      </h1>
      <p style={{ margin: "0 0 32px", fontSize: 15, color: "var(--muted)" }}>{t("checkout.intro")}</p>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 40, alignItems: "start", paddingBottom: 80 }}>
        <form onSubmit={(e) => { e.preventDefault(); void enviar(); }} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Moneda */}
          <section>
            <h2 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 600 }}>{t("checkout.moneda")}</h2>
            <div style={{ display: "flex", gap: 10 }}>
              {(["PEN", "USD"] as Moneda[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMoneda(m)}
                  style={{
                    ...campo,
                    width: "auto",
                    cursor: "pointer",
                    fontWeight: 600,
                    ...(moneda === m ? { background: "var(--btn-bg)", color: "var(--btn-fg)", borderColor: "var(--btn-bg)" } : {}),
                  }}
                >
                  {m === "PEN" ? "Soles (S/)" : "Dólares (US$)"}
                </button>
              ))}
            </div>
          </section>

          {/* Contacto */}
          <section>
            <h2 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 600 }}>{t("checkout.contacto")}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={label} htmlFor="co-correo">{t("checkout.correo")}</label>
                <input id="co-correo" type="email" style={campo} value={correoContacto} onChange={(e) => setCorreo(e.target.value)} required />
              </div>
              <div>
                <label style={label} htmlFor="co-tel">{t("checkout.whatsapp")}</label>
                <input id="co-tel" style={campo} value={telefonoWhatsApp} onChange={(e) => setTelefono(e.target.value)} required />
              </div>
              <div>
                <label style={label} htmlFor="co-pais">{t("checkout.pais")}</label>
                <input id="co-pais" style={campo} value={paisResidencia} onChange={(e) => setPais(e.target.value)} />
              </div>
            </div>
          </section>

          {/* Pasajeros por servicio */}
          {items.map((item) => (
            <section key={item.salidaId}>
              <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>{item.titulo}</h2>
              <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--muted)" }}>{fmtFecha(item.fechaHoraSalida)}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {pasajerosDe(item.salidaId, item.pasajeros).map((p, i) => (
                  <div key={i} style={{ background: "var(--card)", borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
                      {t("checkout.pasajero")} {i + 1}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div>
                        <label style={label} htmlFor={`n-${item.salidaId}-${i}`}>{t("checkout.nombres")}</label>
                        <input id={`n-${item.salidaId}-${i}`} style={campo} value={p.nombres} onChange={(e) => actualizarPasajero(item.salidaId, i, "nombres", e.target.value)} required />
                      </div>
                      <div>
                        <label style={label} htmlFor={`a-${item.salidaId}-${i}`}>{t("checkout.apellidos")}</label>
                        <input id={`a-${item.salidaId}-${i}`} style={campo} value={p.apellidos} onChange={(e) => actualizarPasajero(item.salidaId, i, "apellidos", e.target.value)} required />
                      </div>
                      <div>
                        <label style={label} htmlFor={`nac-${item.salidaId}-${i}`}>{t("checkout.nacionalidad")}</label>
                        <input id={`nac-${item.salidaId}-${i}`} style={campo} value={p.nacionalidad} onChange={(e) => actualizarPasajero(item.salidaId, i, "nacionalidad", e.target.value)} required />
                      </div>
                      <div>
                        <label style={label} htmlFor={`td-${item.salidaId}-${i}`}>{t("checkout.tipoDocumento")}</label>
                        <select id={`td-${item.salidaId}-${i}`} style={campo} value={p.tipoDocumento} onChange={(e) => actualizarPasajero(item.salidaId, i, "tipoDocumento", e.target.value)}>
                          {tiposDoc.map((d) => (
                            <option key={d.valor} value={d.valor}>{d.etiqueta}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={label} htmlFor={`nd-${item.salidaId}-${i}`}>{t("checkout.numeroDocumento")}</label>
                        <input id={`nd-${item.salidaId}-${i}`} style={campo} value={p.numeroDocumento} onChange={(e) => actualizarPasajero(item.salidaId, i, "numeroDocumento", e.target.value)} required />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Cupón */}
          <section>
            <label style={label} htmlFor="co-cupon">{t("checkout.cupon")}</label>
            <input id="co-cupon" style={{ ...campo, maxWidth: 240 }} value={codigoPromocion} onChange={(e) => setCupon(e.target.value)} placeholder={t("checkout.cuponPh")} />
          </section>

          {error && (
            <p role="alert" style={{ margin: 0, color: "#c0392b", fontSize: 14 }}>{error}</p>
          )}
        </form>

        {/* Resumen */}
        <aside style={{ background: "var(--card)", borderRadius: 14, padding: "24px 22px", position: "sticky", top: 90 }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 600 }}>{t("carrito.resumen")}</h2>
          {items.map((item) => (
            <div key={item.salidaId} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13.5, marginBottom: 8 }}>
              <span style={{ color: "var(--muted)" }}>{item.titulo} × {item.pasajeros}</span>
              <span style={{ whiteSpace: "nowrap" }}>
                {moneda === "USD" ? `US$ ${item.precioUsd * item.pasajeros}` : `S/ ${item.precioPen * item.pasajeros}`}
              </span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--line)", margin: "12px 0", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700 }}>
            <span>{t("carrito.resumen")}</span>
            <span>{moneda === "USD" ? `US$ ${total("USD")}` : `S/ ${total("PEN")}`}</span>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>{t("checkout.notaMontos")}</p>
          <button
            type="button"
            onClick={() => void enviar()}
            disabled={!formularioOk}
            style={{
              width: "100%",
              border: "none",
              cursor: formularioOk ? "pointer" : "not-allowed",
              opacity: formularioOk ? 1 : 0.55,
              background: "var(--btn-bg)",
              color: "var(--btn-fg)",
              padding: "13px 18px",
              borderRadius: 8,
              fontSize: 14.5,
              fontWeight: 600,
            }}
          >
            {enviando ? t("checkout.creando") : t("checkout.confirmar")}
          </button>
        </aside>
      </div>
    </PageShell>
  );
}

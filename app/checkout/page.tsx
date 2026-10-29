"use client";
/* eslint-disable react-hooks/set-state-in-effect -- prellenado de contacto al llegar el perfil */

import { CSSProperties, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import IzipayForm from "@/components/izipay-form";
import PageShell from "@/components/page-shell";
import { useCarrito, type ItemCarrito } from "@/components/cart-provider";
import { useIdioma } from "@/components/lang-provider";
import { useT, LOCALES } from "@/lib/i18n";
import { useCrearReserva, useIniciarPagoAdelanto } from "@/hooks/use-reservas";
import { useMiPerfil } from "@/hooks/use-auth";
import { guardarReservaInvitado } from "@/lib/reservas-invitado";
import { canalesReservaPara } from "@/lib/data";
import { ApiError } from "@/lib/api";
import type { Moneda, PagoAdelantoApi, PasajeroEntrada, ReservaApi } from "@/lib/api";

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
const monedasDisponibles = (process.env.NEXT_PUBLIC_MONEDAS_HABILITADAS ?? "PEN,USD")
  .split(",").map((valor) => valor.trim().toUpperCase()).filter((valor): valor is Moneda => valor === "PEN" || valor === "USD");

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
  const { items, total, totalLineas, limpiar, quitar } = useCarrito();
  const canalOnlineHabilitado = items.every((item) => canalesReservaPara(item.tipoServicio, item.esEvento).includes("ONLINE"));
  const { data: perfil } = useMiPerfil();
  const crearReserva = useCrearReserva();
  const iniciarPago = useIniciarPagoAdelanto();

  const [moneda, setMoneda] = useState<Moneda>(monedasDisponibles[0] ?? "PEN");
  const [correoContacto, setCorreo] = useState("");
  const [telefonoWhatsApp, setTelefono] = useState("");
  const [paisResidencia, setPais] = useState("");
  const [codigoPromocion, setCupon] = useState("");
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);
  const [pasajerosPorItem, setPasajeros] = useState<Record<string, PasajeroEntrada[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [reservaCreada, setReservaCreada] = useState<ReservaApi | null>(null);
  const [reservasCreadas, setReservasCreadas] = useState<{ reserva: ReservaApi; item: ItemCarrito }[]>([]);
  const [pago, setPago] = useState<PagoAdelantoApi | null>(null);

  // Prellena contacto con el perfil si hay sesión (solo al llegar el perfil).
  useEffect(() => {
    if (!perfil) return;
    setCorreo((v) => v || perfil.correo || "");
    setPais((v) => v || perfil.paisResidencia || "");
    setTelefono((v) => v || perfil.telefonoWhatsApp || "");
  }, [perfil]);

  const fmtFecha = (iso: string) =>
    new Date(iso).toLocaleString(LOCALES[idioma], { dateStyle: "medium", timeStyle: "short" });
  const fmtMonto = (monto: number) => new Intl.NumberFormat(LOCALES[idioma], { maximumFractionDigits: 2 }).format(monto);

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
  const enlacesPoliticas = [
    { nombre: "Términos de compra", href: process.env.NEXT_PUBLIC_URL_TERMINOS || "/terminos" },
    { nombre: "Privacidad", href: process.env.NEXT_PUBLIC_URL_PRIVACIDAD || "/privacidad" },
    { nombre: "Cancelaciones", href: process.env.NEXT_PUBLIC_URL_CANCELACIONES || "/cancelaciones" },
  ];
  const politicasConfiguradas = enlacesPoliticas.every((item) => Boolean(item.href)) &&
    (process.env.NODE_ENV !== "production" || Boolean(process.env.NEXT_PUBLIC_VERSION_POLITICAS));
  const versionPoliticas = process.env.NEXT_PUBLIC_VERSION_POLITICAS ?? "dev-sin-version";
  const textoPoliticas: Record<string, { acepta: string; falta: string; terminos: string; privacidad: string; cancelaciones: string; vence: string }> = {
    es: { acepta: "He leído y acepto las políticas de compra, privacidad y cancelación.", falta: "El checkout requiere configurar los enlaces de términos, privacidad y cancelaciones.", terminos: "Términos de compra", privacidad: "Privacidad", cancelaciones: "Cancelaciones", vence: "Mantendremos tus asientos hasta" },
    en: { acepta: "I have read and accept the purchase, privacy, and cancellation policies.", falta: "Checkout requires configured terms, privacy, and cancellation links.", terminos: "Purchase terms", privacidad: "Privacy", cancelaciones: "Cancellations", vence: "Your seats are held until" },
    fr: { acepta: "J’ai lu et j’accepte les politiques d’achat, de confidentialité et d’annulation.", falta: "Le paiement nécessite les liens configurés vers les conditions, la confidentialité et les annulations.", terminos: "Conditions d’achat", privacidad: "Confidentialité", cancelaciones: "Annulations", vence: "Vos places sont réservées jusqu’au" },
    it: { acepta: "Ho letto e accetto le condizioni di acquisto, privacy e cancellazione.", falta: "Per il pagamento occorre configurare i link alle condizioni, alla privacy e alle cancellazioni.", terminos: "Condizioni di acquisto", privacidad: "Privacy", cancelaciones: "Cancellazioni", vence: "I posti sono riservati fino al" },
    pt: { acepta: "Li e aceito as políticas de compra, privacidade e cancelamento.", falta: "O checkout exige links configurados para compra, privacidade e cancelamento.", terminos: "Termos de compra", privacidad: "Privacidade", cancelaciones: "Cancelamentos", vence: "Seus lugares ficam reservados até" },
    zh: { acepta: "我已阅读并接受购买、隐私和取消政策。", falta: "结账前必须配置购买、隐私和取消政策链接。", terminos: "购买条款", privacidad: "隐私", cancelaciones: "取消政策", vence: "座位保留至" },
    ja: { acepta: "購入、プライバシー、キャンセルの各ポリシーを読み、同意します。", falta: "購入、プライバシー、キャンセルの各ポリシーURLを設定してください。", terminos: "購入条件", privacidad: "プライバシー", cancelaciones: "キャンセル", vence: "座席の確保期限" },
    ru: { acepta: "Я прочитал(а) и принимаю правила покупки, конфиденциальности и отмены.", falta: "Для оформления настройте ссылки на правила покупки, конфиденциальности и отмены.", terminos: "Условия покупки", privacidad: "Конфиденциальность", cancelaciones: "Отмена", vence: "Места удерживаются до" },
    de: { acepta: "Ich habe die Kauf-, Datenschutz- und Stornierungsbedingungen gelesen und akzeptiere sie.", falta: "Für den Checkout müssen Links zu Kauf-, Datenschutz- und Stornierungsbedingungen hinterlegt sein.", terminos: "Kaufbedingungen", privacidad: "Datenschutz", cancelaciones: "Stornierung", vence: "Deine Plätze sind reserviert bis" },
  };
  const legal = textoPoliticas[idioma] ?? textoPoliticas.es;
  const enlacesConEtiqueta = enlacesPoliticas.map((item, i) => ({
    ...item,
    nombre: [legal.terminos, legal.privacidad, legal.cancelaciones][i],
  }));
  const formularioCompleto = formularioOk && aceptaPoliticas && politicasConfiguradas && canalOnlineHabilitado;

  const enviar = async () => {
    if (!formularioCompleto) return;
    setEnviando(true);
    setError(null);
    const creadas: { reserva: ReservaApi; item: ItemCarrito }[] = [];
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
          aceptaPoliticas,
          versionPoliticas,
        });
        creadas.push({ reserva, item });
        if (reserva.tokenGestionInvitado) {
          guardarReservaInvitado(reserva.codigo, reserva.tokenGestionInvitado);
        }
      }
      if (creadas.length === 1) {
        limpiar();
        setReservaCreada(creadas[0].reserva);
        try {
          setPago(await iniciarPago.mutateAsync({
            codigo: creadas[0].reserva.codigo,
            token: creadas[0].reserva.tokenGestionInvitado,
          }));
        } catch (e) {
          setError(e instanceof ApiError ? e.message : t("reserva.errorPago"));
        }
        return;
      }
      limpiar();
      setReservasCreadas(creadas);
      setEnviando(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("checkout.errorGenerico"));
      if (creadas.length > 0) {
        setReservasCreadas(creadas);
        creadas.forEach(({ item }) => quitar(item.salidaId));
      }
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

  if (reservasCreadas.length > 0) {
    return (
      <PageShell>
        <div style={{ maxWidth: 760, padding: "56px 0 80px" }}>
          <p style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: 13, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>{t("checkout.reservasCreadas")}</p>
          <h1 style={{ margin: "0 0 14px", fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 400, letterSpacing: "-.05em" }}>{t("checkout.reservasCreadas")}</h1>
          <p style={{ margin: "0 0 24px", color: "var(--muted)", lineHeight: 1.65 }}>{t("checkout.reservasSeparadas")}</p>
          {error && <p role="alert" style={{ margin: "0 0 18px", padding: 14, border: "1px solid #b42318", borderRadius: 8, color: "#b42318", fontSize: 14 }}>{error}</p>}
          <div style={{ display: "grid", gap: 12 }}>
            {reservasCreadas.map(({ reserva, item }) => (
              <article key={reserva.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: 18, border: "1px solid var(--line)", borderRadius: 10, background: "var(--card)" }}>
                <div style={{ minWidth: 0 }}>
                  <span style={{ display: "block", marginBottom: 6, color: "var(--muted)", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>{item.tipoServicio === "TRANSPORTE" ? t("nav.transporte") : item.esEvento ? t("nav.eventos") : t("nav.tours")}</span>
                  <strong style={{ display: "block", fontSize: 17 }}>{item.titulo}</strong>
                  <span style={{ display: "block", marginTop: 5, color: "var(--muted)", fontSize: 13 }}>{fmtFecha(item.fechaHoraSalida)} · {reserva.codigo}</span>
                  {reserva.expiraEn && <span style={{ display: "block", marginTop: 5, color: "var(--muted)", fontSize: 12 }}>{legal.vence} {fmtFecha(reserva.expiraEn)}</span>}
                </div>
                <Link href={`/reserva/${reserva.codigo}`} style={{ flex: "0 0 auto", padding: "10px 14px", borderRadius: 7, background: "var(--btn-bg)", color: "var(--btn-fg)", fontSize: 13, fontWeight: 650, textDecoration: "none" }}>{t("checkout.verReserva")}</Link>
              </article>
            ))}
          </div>
          {totalLineas > 0 && <Link href="/checkout" style={{ display: "inline-block", marginTop: 22, fontSize: 14, fontWeight: 650 }}>{t("carrito.irCheckout")} →</Link>}
        </div>
      </PageShell>
    );
  }

  if (reservaCreada) {
    return (
      <PageShell>
        <div style={{ maxWidth: 680, padding: "64px 0 80px" }}>
          <p style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: 14 }}>Reserva creada</p>
          <h1 style={{ margin: "0 0 12px", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400 }}>Completa tu pago</h1>
          <p style={{ margin: "0 0 24px", color: "var(--muted)", lineHeight: 1.6 }}>
            Tu reserva <strong style={{ color: "var(--fg)" }}>{reservaCreada.codigo}</strong> quedó registrada. El pago se confirmará únicamente cuando llegue el IPN firmado de Izipay.
          </p>
          {reservaCreada.expiraEn && <p style={{ margin: "0 0 20px", color: "var(--muted)", fontSize: 14 }}>{legal.vence} <strong>{fmtFecha(reservaCreada.expiraEn)}</strong>.</p>}
          {pago ? (
            <IzipayForm
              formToken={pago.formToken}
              llavePublica={pago.llavePublica}
              onPagado={() => router.push(`/reserva/${reservaCreada.codigo}?confirmando=1`)}
            />
          ) : (
            <>
              {error && <p role="alert" style={{ color: "#c0392b", fontSize: 14 }}>{error}</p>}
              <Link href={`/reserva/${reservaCreada.codigo}`} style={{ fontWeight: 600 }}>
                Ir a la reserva para reintentar el pago
              </Link>
            </>
          )}
        </div>
      </PageShell>
    );
  }

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
              {monedasDisponibles.map((m) => (
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
          {!canalOnlineHabilitado && <p role="status" style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>Las reservas se coordinan por WhatsApp; vuelve a la ficha del servicio para contactar a la agencia.</p>}
          <section aria-label="Políticas de compra">
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, lineHeight: 1.55 }}>
              <input type="checkbox" checked={aceptaPoliticas} onChange={(e) => setAceptaPoliticas(e.target.checked)} disabled={!politicasConfiguradas} style={{ marginTop: 3 }} />
              <span>{legal.acepta}<br />{enlacesConEtiqueta.map((item, index) => item.href ? <span key={item.nombre}>{index > 0 ? " · " : ""}<a href={item.href} target="_blank" rel="noopener noreferrer">{item.nombre}</a></span> : null)}</span>
            </label>
            {!politicasConfiguradas && <p role="status" style={{ margin: "8px 0 0", color: "#9a6700", fontSize: 12 }}>{legal.falta}</p>}
          </section>
        </form>

        {/* Resumen */}
        <aside style={{ background: "var(--card)", borderRadius: 14, padding: "24px 22px", position: "sticky", top: 90 }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 600 }}>{t("carrito.resumen")}</h2>
          {items.map((item) => (
            <div key={item.salidaId} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13.5, marginBottom: 8 }}>
              <span style={{ color: "var(--muted)" }}>{item.titulo} × {item.pasajeros}</span>
              <span style={{ whiteSpace: "nowrap", textAlign: "right" }}>
                {moneda === "USD" ? `US$ ${fmtMonto(item.precioUsd * item.pasajeros)}` : `S/ ${fmtMonto(item.precioPen * item.pasajeros)}`}
                <small style={{ display: "block", color: "var(--muted)", fontSize: 11 }}>
                  {moneda === "USD" ? `S/ ${fmtMonto(item.precioPen * item.pasajeros)}` : `US$ ${fmtMonto(item.precioUsd * item.pasajeros)}`}
                </small>
              </span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--line)", margin: "12px 0", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700 }}>
            <span>{t("carrito.resumen")}</span>
            <span style={{ textAlign: "right" }}>
              {moneda === "USD" ? `US$ ${fmtMonto(total("USD"))}` : `S/ ${fmtMonto(total("PEN"))}`}
              <small style={{ display: "block", color: "var(--muted)", fontSize: 11, fontWeight: 400 }}>
                {moneda === "USD" ? `S/ ${fmtMonto(total("PEN"))}` : `US$ ${fmtMonto(total("USD"))}`}
              </small>
            </span>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>{t("checkout.notaMontos")}</p>
          <button
            type="button"
            onClick={() => void enviar()}
            disabled={!formularioCompleto}
            style={{
              width: "100%",
              border: "none",
              cursor: formularioCompleto ? "pointer" : "not-allowed",
              opacity: formularioCompleto ? 1 : 0.55,
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

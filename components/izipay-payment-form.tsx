"use client";

import { useEffect } from "react";
import type { PagoCheckoutApi } from "@/lib/api/tipos";

const IZIPAY_SCRIPT = "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js";

export default function IzipayPaymentForm({ pago }: { pago: PagoCheckoutApi }) {
  useEffect(() => {
    if (document.querySelector(`script[src="${IZIPAY_SCRIPT}"]`)) return;
    const script = document.createElement("script");
    script.src = IZIPAY_SCRIPT;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  if (pago.error) {
    return <p style={{ margin: 0, color: "#b42318", fontSize: 14 }}>Reserva {pago.codigoReserva}: {pago.error}</p>;
  }
  if (!pago.formToken || !pago.llavePublica) return null;

  return (
    <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}>
      <p style={{ margin: "0 0 12px", fontWeight: 600 }}>Pagar reserva {pago.codigoReserva} · S/ {pago.monto}</p>
      <form className="kr-smart-form" kr-public-key={pago.llavePublica}>
        <div className="kr-embedded" kr-form-token={pago.formToken}>
          <div className="kr-pan" />
          <div className="kr-expiry" />
          <div className="kr-security-code" />
          <button className="kr-payment-button" type="button">Pagar</button>
        </div>
      </form>
    </div>
  );
}

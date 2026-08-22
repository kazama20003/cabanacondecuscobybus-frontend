"use client";

import { useEffect, useRef, useState } from "react";
import { useIdioma } from "@/components/lang-provider";

/**
 * Formulario embebido de Izipay (Lyra / micuentaweb). Carga el cliente Krypton y
 * renderiza el formulario con el formToken + llave pública que devuelve el
 * backend (POST /reservas/:codigo/iniciar-pago-adelanto).
 *
 * El resultado real del pago llega al backend por webhook (IPN); esta vista
 * dispara `onPagado` de forma optimista cuando Krypton reporta PAID para que la
 * página vuelva a consultar el estado de la reserva.
 */
const BASE = "https://static.micuentaweb.pe/static/js/krypton-client/V4.0";

interface KRAnswer {
  clientAnswer?: { orderStatus?: string };
}
interface KR {
  setFormConfig: (config: Record<string, unknown>) => Promise<{ KR: KR }>;
  renderElements: (selector: string) => Promise<unknown>;
  onSubmit: (cb: (resp: KRAnswer) => boolean | Promise<boolean>) => void;
}
declare global {
  interface Window {
    KR?: KR;
  }
}

function cargarRecurso(tag: "script" | "link", attrs: Record<string, string>): Promise<void> {
  return new Promise((resolve, reject) => {
    const clave = attrs.src || attrs.href;
    if (document.querySelector(`[data-izipay="${clave}"]`)) {
      resolve();
      return;
    }
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    el.setAttribute("data-izipay", clave);
    el.addEventListener("load", () => resolve());
    el.addEventListener("error", () => reject(new Error(`No se pudo cargar ${clave}`)));
    document.head.appendChild(el);
  });
}

export default function IzipayForm({
  formToken,
  llavePublica,
  onPagado,
}: {
  formToken: string;
  llavePublica: string;
  onPagado?: () => void;
}) {
  const { idioma } = useIdioma();
  const [error, setError] = useState<string | null>(null);
  const montado = useRef(false);

  useEffect(() => {
    if (montado.current) return;
    montado.current = true;
    let cancelado = false;

    (async () => {
      try {
        await cargarRecurso("link", { rel: "stylesheet", href: `${BASE}/ext/classic-reset.css` });
        await cargarRecurso("script", { src: `${BASE}/ext/classic.js` });
        await cargarRecurso("script", {
          src: `${BASE}/stable/kr-payment-form.min.js`,
          "kr-public-key": llavePublica,
        });
        if (cancelado || !window.KR) return;
        const { KR } = await window.KR.setFormConfig({
          formToken,
          "kr-language": `${idioma}-PE`,
        });
        KR.onSubmit((resp) => {
          if (resp.clientAnswer?.orderStatus === "PAID") onPagado?.();
          return false;
        });
        await KR.renderElements("#kr-embedded");
      } catch (e) {
        if (!cancelado) setError(e instanceof Error ? e.message : "Error al cargar el pago");
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [formToken, llavePublica, idioma, onPagado]);

  if (error) {
    return <p style={{ color: "#c0392b", fontSize: 14 }}>{error}</p>;
  }

  return <div id="kr-embedded" className="kr-embedded" {...{ "kr-form-token": formToken }} />;
}

"use client";

import { CSSProperties, useState } from "react";
import Link from "next/link";
import { useCarrito } from "@/components/cart-provider";
import { useIdioma } from "@/components/lang-provider";
import { useT, LOCALES } from "@/lib/i18n";
import type { SalidaApi, TipoServicio } from "@/lib/api";

const VENDIBLES = ["A_LA_VENTA", "PENDIENTE_DE_MINIMO", "CONFIRMADA"];

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

/** Selector de salida + pasajeros que agrega la salida elegida al carrito. */
export default function AddToCart({
  tipoServicio,
  slug,
  titulo,
  imagen,
  salidas,
}: {
  tipoServicio: TipoServicio;
  slug: string;
  titulo: string;
  imagen?: string;
  salidas: SalidaApi[];
}) {
  const t = useT();
  const { idioma } = useIdioma();
  const { agregar } = useCarrito();
  const [ahora] = useState(() => Date.now());

  const vendibles = salidas
    .filter(
      (s) =>
        VENDIBLES.includes(s.estado) &&
        new Date(s.fechaHoraSalida).getTime() > ahora,
    )
    .sort((a, b) => a.fechaHoraSalida.localeCompare(b.fechaHoraSalida));

  const [salidaId, setSalidaId] = useState(vendibles[0]?.id ?? "");
  const [pasajeros, setPasajeros] = useState(1);
  const [agregado, setAgregado] = useState(false);

  if (vendibles.length === 0) {
    return (
      <p style={{ margin: 0, fontSize: 14, color: "var(--muted)" }}>
        {t("reservar.sinSalidas")}
      </p>
    );
  }

  const salida = vendibles.find((s) => s.id === salidaId) ?? vendibles[0];

  const fmtFecha = (iso: string) =>
    new Date(iso).toLocaleString(LOCALES[idioma], {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const manejarAgregar = () => {
    agregar({
      salidaId: salida.id,
      tipoServicio,
      slug,
      titulo,
      fechaHoraSalida: salida.fechaHoraSalida,
      precioPen: Number(salida.precioPen),
      precioUsd: Number(salida.precioUsd),
      imagen,
      pasajeros,
    });
    setAgregado(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label htmlFor="atc-salida" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          {t("reservar.elegirSalida")}
        </label>
        <select
          id="atc-salida"
          style={campo}
          value={salida.id}
          onChange={(e) => {
            setSalidaId(e.target.value);
            setAgregado(false);
          }}
        >
          {vendibles.map((s) => (
            <option key={s.id} value={s.id}>
              {fmtFecha(s.fechaHoraSalida)} · S/ {Number(s.precioPen)} · US$ {Number(s.precioUsd)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="atc-pax" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          {t("reservar.pasajeros")}
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            aria-label="-"
            onClick={() => {
              setPasajeros((n) => Math.max(1, n - 1));
              setAgregado(false);
            }}
            style={{ ...campo, width: 42, cursor: "pointer", fontWeight: 700 }}
          >
            −
          </button>
          <input
            id="atc-pax"
            type="number"
            min={1}
            value={pasajeros}
            onChange={(e) => {
              setPasajeros(Math.max(1, Number(e.target.value) || 1));
              setAgregado(false);
            }}
            style={{ ...campo, width: 80, textAlign: "center" }}
          />
          <button
            type="button"
            aria-label="+"
            onClick={() => {
              setPasajeros((n) => n + 1);
              setAgregado(false);
            }}
            style={{ ...campo, width: 42, cursor: "pointer", fontWeight: 700 }}
          >
            +
          </button>
        </div>
      </div>

      <div style={{ fontSize: 14, color: "var(--muted)" }}>
        {t("common.desde")} <strong style={{ color: "var(--fg)" }}>S/ {Number(salida.precioPen) * pasajeros}</strong>
        {" · "}US$ {Number(salida.precioUsd) * pasajeros}
      </div>

      {agregado ? (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{t("reservar.agregado")}</span>
          <Link
            href="/carrito"
            style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "10px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600 }}
          >
            {t("reservar.verCarrito")}
          </Link>
        </div>
      ) : (
        <button
          type="button"
          onClick={manejarAgregar}
          style={{
            border: "none",
            cursor: "pointer",
            background: "var(--btn-bg)",
            color: "var(--btn-fg)",
            padding: "12px 18px",
            borderRadius: 8,
            fontSize: 14.5,
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          {t("reservar.agregar")}
        </button>
      )}
    </div>
  );
}

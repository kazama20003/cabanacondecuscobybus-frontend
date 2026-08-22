"use client";

import { CSSProperties, useState } from "react";
import { CONTACT, transportRoutes, tours } from "@/lib/data";
import { useT } from "@/lib/i18n";

const field: CSSProperties = {
  width: "100%",
  border: "1px solid var(--line)",
  background: "var(--bg)",
  color: "var(--fg)",
  padding: "11px 13px",
  borderRadius: 8,
  fontSize: 14,
  fontFamily: "inherit",
};

const label: CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
};

/**
 * Formulario sin backend: arma el mensaje y lo envía por WhatsApp.
 * Cuando exista API de reservas, reemplazar handleSubmit por un POST.
 */
export default function ContactForm() {
  const t = useT();
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("2");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      `${t("wa.saludoSoy")}${name || t("wa.viajero")}.`,
      service && `${t("wa.servicioLbl")}: ${service}`,
      date && `${t("wa.fechaLbl")}: ${date}`,
      `${t("wa.pasajerosLbl")}: ${people}`,
      message && `${t("wa.mensajeLbl")}: ${message}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <label htmlFor="cf-name" style={label}>
          {t("form.nombre")}
        </label>
        <input id="cf-name" style={field} value={name} onChange={(e) => setName(e.target.value)} placeholder={t("form.nombrePh")} required />
      </div>
      <div>
        <label htmlFor="cf-service" style={label}>
          {t("form.queNecesitas")}
        </label>
        <select id="cf-service" style={field} value={service} onChange={(e) => setService(e.target.value)} required>
          <option value="">{t("form.elige")}</option>
          <optgroup label={t("nav.transporte")}>
            {transportRoutes.map((r) => (
              <option key={r.slug} value={`Transporte ${r.from} - ${r.to}`}>
                {r.from} → {r.to}
              </option>
            ))}
          </optgroup>
          <optgroup label={t("nav.tours")}>
            {tours.map((tour) => (
              <option key={tour.slug} value={`Tour ${tour.name}`}>
                {tour.name}
              </option>
            ))}
          </optgroup>
          <optgroup label={t("form.grupoOtros")}>
            <option value="Traslado privado">{t("form.trasladoPrivado")}</option>
            <option value="Itinerario personalizado">{t("form.itinerarioPersonalizado")}</option>
          </optgroup>
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label htmlFor="cf-date" style={label}>
            {t("form.fecha")}
          </label>
          <input id="cf-date" type="date" style={field} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="cf-people" style={label}>
            {t("form.pasajeros")}
          </label>
          <input id="cf-people" type="number" min={1} max={50} style={field} value={people} onChange={(e) => setPeople(e.target.value)} />
        </div>
      </div>
      <div>
        <label htmlFor="cf-message" style={label}>
          {t("form.mensaje")}
        </label>
        <textarea
          id="cf-message"
          style={{ ...field, minHeight: 100, resize: "vertical" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("form.mensajePh")}
        />
      </div>
      <button
        type="submit"
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
        {t("form.enviar")}
      </button>
      <p style={{ margin: 0, fontSize: 12.5, color: "var(--muted)" }}>
        {t("form.nota")}
      </p>
    </form>
  );
}

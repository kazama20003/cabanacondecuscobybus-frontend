"use client";

import { CSSProperties, useState } from "react";
import { CONTACT, transportRoutes, tours } from "@/lib/data";

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
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("2");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      `Hola, soy ${name || "un viajero"}.`,
      service && `Servicio: ${service}`,
      date && `Fecha: ${date}`,
      `Pasajeros: ${people}`,
      message && `Mensaje: ${message}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <label htmlFor="cf-name" style={label}>
          Nombre
        </label>
        <input id="cf-name" style={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
      </div>
      <div>
        <label htmlFor="cf-service" style={label}>
          ¿Qué necesitas?
        </label>
        <select id="cf-service" style={field} value={service} onChange={(e) => setService(e.target.value)} required>
          <option value="">Elige un servicio…</option>
          <optgroup label="Transporte">
            {transportRoutes.map((r) => (
              <option key={r.slug} value={`Transporte ${r.from} - ${r.to}`}>
                Transporte {r.from} → {r.to}
              </option>
            ))}
          </optgroup>
          <optgroup label="Tours">
            {tours.map((t) => (
              <option key={t.slug} value={`Tour ${t.name}`}>
                {t.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Otros">
            <option value="Traslado privado">Traslado privado</option>
            <option value="Itinerario personalizado">Itinerario personalizado</option>
          </optgroup>
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label htmlFor="cf-date" style={label}>
            Fecha de viaje
          </label>
          <input id="cf-date" type="date" style={field} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="cf-people" style={label}>
            Pasajeros
          </label>
          <input id="cf-people" type="number" min={1} max={50} style={field} value={people} onChange={(e) => setPeople(e.target.value)} />
        </div>
      </div>
      <div>
        <label htmlFor="cf-message" style={label}>
          Mensaje
        </label>
        <textarea
          id="cf-message"
          style={{ ...field, minHeight: 100, resize: "vertical" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Cuéntanos tu plan de viaje…"
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
        Enviar por WhatsApp
      </button>
      <p style={{ margin: 0, fontSize: 12.5, color: "var(--muted)" }}>
        Al enviar se abrirá WhatsApp con tu mensaje listo. Respondemos en menos de 1 hora en horario de atención.
      </p>
    </form>
  );
}

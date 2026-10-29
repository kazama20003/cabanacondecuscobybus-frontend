import Link from "next/link";

type TipoCondicion = "transporte" | "tour" | "evento";

const textos: Record<TipoCondicion, { titulo: string; intro: string; detalles: string[] }> = {
  transporte: {
    titulo: "Condiciones del transporte",
    intro: "Antes de reservar, revisa las condiciones de la salida seleccionada.",
    detalles: [
      "Los horarios y tiempos de viaje son estimados. El tránsito, el clima, el estado de la carretera, la altura o las indicaciones de las autoridades pueden modificarlos.",
      "Las paradas y puntos de recojo se realizan según el itinerario confirmado y las condiciones de seguridad. Un punto del mapa no garantiza por sí solo una escala o embarque.",
      "Confirma el lugar de presentación, el equipaje permitido y los servicios incluidos en tu salida. Llega con anticipación y sigue las indicaciones del operador.",
    ],
  },
  tour: {
    titulo: "Condiciones del tour",
    intro: "El programa puede adaptarse para cuidar la seguridad y viabilidad de la experiencia.",
    detalles: [
      "Los horarios, duración, accesos y orden de las visitas son referenciales; pueden cambiar por clima, tránsito, estado de la ruta, aforo o decisiones de las autoridades locales.",
      "El acceso a miradores y atractivos depende de que estén habilitados el día de la salida. Los fenómenos naturales y avistamientos de fauna no se pueden garantizar.",
      "Consulta el punto de encuentro, qué llevar y los servicios incluidos en la ficha y en la confirmación de tu salida.",
    ],
  },
  evento: {
    titulo: "Condiciones del evento",
    intro: "Las celebraciones y actividades dependen de su organización local y del programa de cada temporada.",
    detalles: [
      "Fechas, horarios, recorridos y actividades pueden cambiar por clima, seguridad, aforo o decisiones de la organización y las autoridades.",
      "La publicación del evento no garantiza el acceso a ceremonias, templos o espacios con capacidad limitada. Respeta las indicaciones de la comunidad y del personal local.",
      "Verifica el programa y el punto de encuentro de la salida confirmada. Los servicios no descritos como incluidos se pagan por separado.",
    ],
  },
};

const enlaces = [
  { label: "Términos del servicio", href: process.env.NEXT_PUBLIC_URL_TERMINOS || "/terminos" },
  { label: "Privacidad", href: process.env.NEXT_PUBLIC_URL_PRIVACIDAD || "/privacidad" },
  { label: "Cambios y cancelaciones", href: process.env.NEXT_PUBLIC_URL_CANCELACIONES || "/cancelaciones" },
];

export default function CondicionesServicio({ tipo }: { tipo: TipoCondicion }) {
  const contenido = textos[tipo];
  return (
    <section aria-labelledby="condiciones-servicio" style={{ marginTop: 54, padding: "clamp(20px, 4vw, 36px)", border: "1px solid var(--line)", borderRadius: 12, background: "var(--card)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))", gap: 28 }}>
        <div>
          <span style={{ color: "var(--muted)", fontSize: 11, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase" }}>Información antes de reservar</span>
          <h2 id="condiciones-servicio" style={{ margin: "8px 0", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 500 }}>{contenido.titulo}</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>{contenido.intro}</p>
          <nav aria-label="Políticas del servicio" style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 20, fontSize: 13, fontWeight: 600 }}>
            {enlaces.map((enlace) => (
              <Link key={enlace.href} href={enlace.href} target={enlace.href.startsWith("http") ? "_blank" : undefined} rel={enlace.href.startsWith("http") ? "noopener noreferrer" : undefined} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>{enlace.label}</Link>
            ))}
          </nav>
        </div>
        <ul style={{ display: "grid", gap: 12, margin: 0, paddingLeft: 20, color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
          {contenido.detalles.map((detalle) => <li key={detalle}>{detalle}</li>)}
          <li>Los datos de contacto y de los viajeros se usan para gestionar la reserva y comunicar información operativa. Consulta el aviso de privacidad para conocer los detalles.</li>
        </ul>
      </div>
    </section>
  );
}

import Link from "next/link";
import PageShell from "@/components/page-shell";

const secciones = [
  ["Información del servicio", "La ficha de cada tour, transporte o evento describe el recorrido, horario, precio, disponibilidad y servicios incluidos conocidos al momento de publicar. La confirmación de la salida especifica los datos aplicables a tu reserva."],
  ["Horarios, rutas y clima", "Las duraciones y horas de llegada son referenciales. El clima, el tráfico, el estado de la carretera, la altura, el aforo y las disposiciones de las autoridades pueden requerir cambios de horario, ruta, orden de visitas o paradas. Por seguridad, el operador puede ajustar o suspender actividades y comunicará las alternativas disponibles para la reserva."],
  ["Eventos y actividades al aire libre", "Los programas de fiestas y eventos dependen de sus organizadores locales. El acceso a espacios con aforo limitado, la realización de actividades y los avistamientos de fauna o fenómenos naturales no se garantizan."],
  ["Responsabilidades del viajero", "Revisa el punto de encuentro, llega a la hora confirmada, proporciona información correcta para la reserva y sigue las instrucciones del conductor, guía, organizador y autoridades locales. Comunica con anticipación necesidades de movilidad, salud o alimentación."],
  ["Servicios y gastos", "Solo se consideran incluidos los conceptos expresamente indicados en la ficha o confirmación. Entradas, alimentos, bebidas, propinas, gastos personales y servicios opcionales corren por cuenta del viajero salvo indicación expresa."],
  ["Reservas, pagos y cambios", "La disponibilidad, el estado de la reserva, el pago y los plazos aplicables se muestran durante el proceso de compra o en la confirmación. Los cambios de fecha, cancelaciones y devoluciones se rigen por la política correspondiente y por las condiciones comunicadas para la salida."],
];

export default function TerminosPage() {
  return <PageShell><main style={{ maxWidth: 900, margin: "64px auto 0" }}>
    <Link href="/" style={{ fontSize: 13, color: "var(--muted)" }}>← Inca Travel Peru</Link>
    <p style={{ margin: "28px 0 8px", color: "var(--muted)", fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>Políticas</p>
    <h1 style={{ margin: 0, fontSize: "clamp(36px, 7vw, 64px)", fontWeight: 500, letterSpacing: "-.04em" }}>Términos del servicio</h1>
    <p style={{ maxWidth: 680, color: "var(--muted)", fontSize: 16, lineHeight: 1.7 }}>Condiciones generales para las experiencias y servicios de transporte publicados por Inca Travel Peru.</p>
    <div style={{ display: "grid", gap: 24, margin: "38px 0 80px" }}>{secciones.map(([titulo, texto]) => <section key={titulo} style={{ borderTop: "1px solid var(--line)", paddingTop: 18 }}><h2 style={{ margin: "0 0 8px", fontSize: 21, fontWeight: 500 }}>{titulo}</h2><p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.75 }}>{texto}</p></section>)}
      <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Para consultas sobre una reserva, <Link href="/contacto" style={{ textDecoration: "underline" }}>contáctanos</Link>. Revisa también la <Link href="/privacidad" style={{ textDecoration: "underline" }}>política de privacidad</Link> y la <Link href="/cancelaciones" style={{ textDecoration: "underline" }}>política de cambios y cancelaciones</Link>.</p>
    </div>
  </main></PageShell>;
}

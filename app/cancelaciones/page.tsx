import Link from "next/link";
import PageShell from "@/components/page-shell";

const secciones = [
  ["Antes de confirmar", "Revisa la fecha, el servicio, el punto de encuentro, el precio y las condiciones de cancelación que aparecen durante la compra o en la confirmación de tu reserva."],
  ["Solicitar un cambio o cancelación", "Comunícate por el canal de atención indicado en tu reserva tan pronto como sea posible. Los cambios dependen de la disponibilidad de otra salida y pueden tener condiciones o cargos comunicados para ese servicio."],
  ["Cambios por operación o clima", "Si el clima, la carretera, una disposición local o una condición de seguridad afecta la salida, el equipo informará las opciones disponibles para el caso, según las condiciones de compra y la confirmación de la reserva."],
  ["Devoluciones", "Las devoluciones y su medio de procesamiento se determinan según la política aplicable a la reserva y el estado del pago. Conserva el código de reserva y el comprobante al solicitar atención."],
];

export default function CancelacionesPage() {
  return <PageShell><main style={{ maxWidth: 900, margin: "64px auto 0" }}>
    <Link href="/" style={{ fontSize: 13, color: "var(--muted)" }}>← Inca Travel Peru</Link>
    <p style={{ margin: "28px 0 8px", color: "var(--muted)", fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>Políticas</p>
    <h1 style={{ margin: 0, fontSize: "clamp(36px, 7vw, 64px)", fontWeight: 500, letterSpacing: "-.04em" }}>Cambios y cancelaciones</h1>
    <p style={{ maxWidth: 680, color: "var(--muted)", fontSize: 16, lineHeight: 1.7 }}>Información para gestionar solicitudes relacionadas con una salida reservada.</p>
    <div style={{ display: "grid", gap: 24, margin: "38px 0 80px" }}>{secciones.map(([titulo, texto]) => <section key={titulo} style={{ borderTop: "1px solid var(--line)", paddingTop: 18 }}><h2 style={{ margin: "0 0 8px", fontSize: 21, fontWeight: 500 }}>{titulo}</h2><p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.75 }}>{texto}</p></section>)}
      <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Si tienes una reserva, <Link href="/contacto" style={{ textDecoration: "underline" }}>contáctanos</Link> con su código. Esta página complementa las condiciones mostradas al comprar y en la confirmación.</p>
    </div>
  </main></PageShell>;
}

import Link from "next/link";
import PageShell from "@/components/page-shell";
import { CONTACT } from "@/lib/data";

const secciones = [
  ["Datos que usamos", "Para responder consultas y gestionar reservas podemos tratar nombre, datos de contacto, país de residencia e información de identificación de los viajeros. Los datos solicitados dependen del servicio y del proceso de reserva."],
  ["Para qué se usan", "Usamos esos datos para cotizar y administrar reservas, coordinar puntos de encuentro, enviar cambios operativos, atender solicitudes y mantener registros de pagos y atención."],
  ["Proveedores necesarios", "Cuando se requiere para completar el servicio, compartimos los datos pertinentes con el operador turístico o transportista y con proveedores de pago o tecnología que procesan la reserva. No se deben ingresar datos completos de tarjetas en formularios de contacto."],
  ["Conservación y consultas", "Conservamos la información durante el tiempo necesario para atender la reserva, las obligaciones administrativas aplicables y las consultas posteriores. Para solicitar información o corregir tus datos, escribe a reservas@incatravelperu.com."],
];

export default function PrivacidadPage() {
  return <PageShell><main style={{ maxWidth: 900, margin: "64px auto 0" }}>
    <Link href="/" style={{ fontSize: 13, color: "var(--muted)" }}>← Inca Travel Peru</Link>
    <p style={{ margin: "28px 0 8px", color: "var(--muted)", fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>Políticas</p>
    <h1 style={{ margin: 0, fontSize: "clamp(36px, 7vw, 64px)", fontWeight: 500, letterSpacing: "-.04em" }}>Aviso de privacidad</h1>
    <p style={{ maxWidth: 680, color: "var(--muted)", fontSize: 16, lineHeight: 1.7 }}>Cómo usamos la información necesaria para atender consultas, reservas y servicios de viaje.</p>
    <div style={{ display: "grid", gap: 24, margin: "38px 0 80px" }}>{secciones.map(([titulo, texto]) => <section key={titulo} style={{ borderTop: "1px solid var(--line)", paddingTop: 18 }}><h2 style={{ margin: "0 0 8px", fontSize: 21, fontWeight: 500 }}>{titulo}</h2><p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.75 }}>{texto}</p></section>)}
      <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>Contacto de privacidad: <a href={`mailto:${CONTACT.email}`} style={{ textDecoration: "underline" }}>{CONTACT.email}</a>. Consulta los <Link href="/terminos" style={{ textDecoration: "underline" }}>términos del servicio</Link>.</p>
    </div>
  </main></PageShell>;
}

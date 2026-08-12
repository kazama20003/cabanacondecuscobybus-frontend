import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import { transportRoutes, CONTACT } from "@/lib/data";

export function generateStaticParams() {
  return transportRoutes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = transportRoutes.find((r) => r.slug === slug);
  if (!route) return { title: "Ruta no encontrada — Inca Travel Peru" };
  return {
    title: `${route.from} a ${route.to} — Transporte Turístico | Inca Travel Peru`,
    description: `Transporte turístico de ${route.from} a ${route.to}: ${route.duration}, salidas ${route.departures.join(" y ")}, desde S/ ${route.priceFrom} por persona.`,
  };
}

export default async function RoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = transportRoutes.find((r) => r.slug === slug);
  if (!route) notFound();

  const others = transportRoutes.filter((r) => r.slug !== route.slug).slice(0, 3);

  return (
    <PageShell>
      <nav style={{ margin: "40px 0 0", fontSize: 13, color: "var(--muted)" }}>
        <Link href="/transporte" style={{ color: "var(--muted)" }}>
          Transporte
        </Link>{" "}
        / {route.from} — {route.to}
      </nav>

      <h1
        style={{
          fontSize: "clamp(36px, 4.6vw, 72px)",
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          fontWeight: 400,
          margin: "24px 0 20px",
          textWrap: "pretty",
        }}
      >
        {route.from} <em className="serif">→</em> {route.to}
      </h1>
      <p style={{ maxWidth: 560, margin: "0 0 36px", fontSize: 16, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
        {route.description}
      </p>

      <div style={{ position: "relative", width: "100%", aspectRatio: "1502 / 480" }}>
        <ImageSlot radius={0} src={route.image} placeholder={`${route.from} — ${route.to}`} />
      </div>

      {/* Ficha resumen */}
      <section
        style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        {[
          { label: "Duración", value: route.duration },
          { label: "Distancia", value: route.distance },
          { label: "Salidas", value: route.departures.join(" · ") },
          { label: "Frecuencia", value: route.frequency },
          { label: "Vehículo", value: route.vehicle },
          { label: "Precio", value: `Desde S/ ${route.priceFrom} p/p` },
        ].map((c) => (
          <div key={c.label} style={{ background: "var(--card)", padding: "18px 20px" }}>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.4 }}>{c.value}</div>
          </div>
        ))}
      </section>

      {/* Itinerario + incluye */}
      <section style={{ marginTop: 110, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48 }}>
        <div>
          <h2 style={{ margin: "0 0 28px", fontSize: "clamp(26px, 2.2vw, 36px)", fontWeight: 400, letterSpacing: "-0.02em" }}>
            Itinerario de <em className="serif">ruta</em>
          </h2>
          <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {route.stops.map((s, i) => (
              <li
                key={s.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "64px 1fr",
                  gap: 16,
                  borderTop: "1px solid var(--line)",
                  padding: "14px 0",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700 }}>{s.time}</span>
                <span style={{ lineHeight: 1.4 }}>
                  <strong style={{ fontSize: 14.5 }}>
                    {i === 0 ? "Salida · " : i === route.stops.length - 1 ? "Llegada · " : ""}
                    {s.name}
                  </strong>
                  {s.note && <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{s.note}</div>}
                </span>
              </li>
            ))}
          </ol>
          <p style={{ marginTop: 16, fontSize: 12.5, color: "var(--muted)" }}>
            * Horarios referenciales del primer turno; pueden variar por clima o estado de la vía.
          </p>
        </div>
        <div>
          <h2 style={{ margin: "0 0 28px", fontSize: "clamp(26px, 2.2vw, 36px)", fontWeight: 400, letterSpacing: "-0.02em" }}>
            El servicio <em className="serif">incluye</em>
          </h2>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {route.highlights.map((h) => (
              <li key={h} style={{ borderTop: "1px solid var(--line)", padding: "14px 0", fontSize: 14.5, fontWeight: 600 }}>
                ✓ {h}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 36, background: "var(--card)", padding: "28px 26px" }}>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Precio por persona</div>
            <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 18 }}>Desde S/ {route.priceFrom}</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 14, fontWeight: 600 }}>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hola, quiero reservar la ruta ${route.from} - ${route.to}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "10px 16px", borderRadius: 3 }}
              >
                Reservar por WhatsApp
              </a>
              <Link href="/contacto" style={{ padding: "10px 16px", borderRadius: 3, border: "1px solid var(--line)" }}>
                Consultar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Otras rutas */}
      <section style={{ marginTop: 120 }}>
        <h2 style={{ margin: "0 0 28px", fontSize: "clamp(26px, 2.2vw, 36px)", fontWeight: 400, letterSpacing: "-0.02em" }}>
          Otras <em className="serif">rutas</em>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {others.map((r) => (
            <Link key={r.slug} href={`/transporte/${r.slug}`} style={{ background: "var(--card)", padding: 16, display: "block" }}>
              <div style={{ position: "relative", width: "100%", height: 170 }}>
                <ImageSlot radius={0} src={r.image} placeholder={`${r.from} — ${r.to}`} />
              </div>
              <div style={{ marginTop: 12, fontSize: 15, fontWeight: 600 }}>
                {r.from} → {r.to}
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                {r.duration} · desde S/ {r.priceFrom}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

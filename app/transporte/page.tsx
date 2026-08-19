"use client";

import Link from "next/link";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import { CONTACT } from "@/lib/data";
import { useTransportes } from "@/hooks/use-catalogo";
import type { TransporteApi, TraduccionApi, SalidaApi } from "@/lib/api/tipos";

function traduccionDe(item: TransporteApi | undefined): TraduccionApi | undefined {
  if (!item) return undefined;
  const arr = item.traducciones as TraduccionApi[] | undefined;
  return Array.isArray(arr) && arr.length > 0 ? arr[0] : undefined;
}

function formatearDuracion(minutos?: number): string | null {
  if (!minutos || minutos <= 0) return null;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return [h > 0 ? `${h}h` : null, m > 0 ? `${m}m` : null].filter(Boolean).join(" ") || null;
}

function precioDesde(salidas?: SalidaApi[]): number | null {
  if (!salidas || salidas.length === 0) return null;
  const precios = salidas.map((s) => Number(s.precioPen)).filter((n) => Number.isFinite(n) && n > 0);
  if (precios.length === 0) return null;
  return Math.min(...precios);
}

function tituloTransporte(t: TransporteApi): string {
  const tr = traduccionDe(t);
  return tr?.titulo || `${t.origenNombre} → ${t.destinoNombre}`;
}

export default function TransportePage() {
  const { data, isLoading, isError } = useTransportes();
  const transportes = data?.datos ?? [];

  return (
    <PageShell>
      {/* Hero */}
      <h1
        style={{
          fontSize: "clamp(40px, 5.4vw, 84px)",
          lineHeight: 1.06,
          letterSpacing: "-0.03em",
          fontWeight: 400,
          margin: "48px 0 24px",
          textWrap: "pretty",
        }}
      >
        Transporte <em className="serif">turístico</em>
        <br />
        por el sur del Perú.
      </h1>
      <p style={{ maxWidth: 560, margin: "0 0 40px", fontSize: 16, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
        Nuestro producto principal: rutas entre Cusco, Arequipa, el Valle del Colca, Puno y Machu Picchu, con
        flota propia, horarios confiables y atención en español e inglés.
      </p>

      {/* Rutas */}
      <section style={{ marginTop: 40 }}>
        <h2
          style={{
            margin: "0 0 8px",
            fontSize: "clamp(28px, 2.4vw, 40px)",
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
            fontWeight: 400,
          }}
        >
          Rutas y <em className="serif">horarios</em>
        </h2>
        <p style={{ margin: "0 0 36px", fontSize: 14.5, color: "var(--muted)", maxWidth: 520 }}>
          Precios por persona en soles (PEN); confirma disponibilidad al reservar.
        </p>

        {isLoading && <p style={{ color: "var(--muted)", fontSize: 14 }}>Cargando rutas…</p>}
        {isError && (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>No se pudieron cargar las rutas. Intenta de nuevo más tarde.</p>
        )}
        {!isLoading && !isError && transportes.length === 0 && (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Aún no hay rutas disponibles.</p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {transportes.map((t) => {
            const tr = traduccionDe(t);
            const titulo = tituloTransporte(t);
            const dur = formatearDuracion(t.duracionMinutos);
            const precio = precioDesde(t.salidas);
            return (
              <Link
                key={t.slug}
                href={`/transporte/${t.slug}`}
                style={{ background: "var(--card)", padding: 16, borderRadius: 14, display: "block" }}
              >
                <div style={{ position: "relative", width: "100%", height: 200 }}>
                  <ImageSlot radius={10} src={t.imagenes?.[0]?.url} placeholder={titulo} />
                </div>
                <div style={{ marginTop: 14, fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>{titulo}</div>
                {tr?.resumen && (
                  <p style={{ margin: "6px 0 0", fontSize: 13.5, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
                    {tr.resumen}
                  </p>
                )}
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--muted)" }}>
                  {[dur, precio != null ? `Desde S/ ${precio}` : null].filter(Boolean).join(" · ")}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Cómo reservar */}
      <section style={{ marginTop: 140 }}>
        <div style={{ background: "var(--card)", padding: "48px 44px", borderRadius: 16, maxWidth: 620 }}>
          <h2 style={{ margin: "0 0 24px", fontSize: "clamp(24px, 2vw, 34px)", lineHeight: 1.25, letterSpacing: "-0.015em", fontWeight: 400 }}>
            Reservar es <em className="serif">simple</em>.
          </h2>
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 2, color: "var(--muted)" }}>
            <li>Elige tu ruta y horario.</li>
            <li>Escríbenos por WhatsApp o desde la página de contacto.</li>
            <li>Confirma con un adelanto del 50%.</li>
            <li>Recibe tu ticket digital y aborda.</li>
          </ol>
          <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap", fontSize: 14, fontWeight: 600 }}>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "10px 16px", borderRadius: 8 }}
            >
              Reservar por WhatsApp
            </a>
            <Link href="/contacto" style={{ background: "var(--bg)", padding: "10px 16px", borderRadius: 8, border: "1px solid var(--line)" }}>
              Formulario de contacto
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

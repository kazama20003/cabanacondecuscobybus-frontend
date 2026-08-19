"use client";

import Link from "next/link";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import { CONTACT } from "@/lib/data";
import { useTours } from "@/hooks/use-catalogo";
import type { TourApi, TraduccionApi, SalidaApi } from "@/lib/api/tipos";

function traduccionDe(item: TourApi): TraduccionApi | undefined {
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

function tituloTour(t: TourApi): string {
  const tr = traduccionDe(t);
  return tr?.titulo || t.nombre || (t.destinoNombre as string | undefined) || "Tour";
}

export default function ToursPage() {
  const { data, isLoading, isError } = useTours();
  const tours = data?.datos ?? [];

  return (
    <PageShell>
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
        Tours con <em className="serif">guías</em> que
        <br />
        aman su tierra.
      </h1>
      <p style={{ maxWidth: 560, margin: "0 0 56px", fontSize: 16, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
        De la ciudadela de Machu Picchu al vuelo del cóndor en el Colca. Grupos pequeños, salidas diarias y
        guías oficiales en español e inglés.
      </p>

      {isLoading && <p style={{ color: "var(--muted)", fontSize: 14 }}>Cargando tours…</p>}
      {isError && (
        <p style={{ color: "var(--muted)", fontSize: 14 }}>No se pudieron cargar los tours. Intenta de nuevo más tarde.</p>
      )}
      {!isLoading && !isError && tours.length === 0 && (
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Aún no hay tours disponibles.</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {tours.map((t) => {
          const tr = traduccionDe(t);
          const titulo = tituloTour(t);
          const dur = formatearDuracion(t.duracionMinutos as number | undefined);
          const precio = precioDesde(t.salidas);
          return (
            <figure key={t.slug} style={{ margin: 0, background: "var(--card)", padding: 16, borderRadius: 14, display: "flex", flexDirection: "column" }}>
              <Link href={`/tours/${t.slug}`} style={{ display: "block" }}>
                <div style={{ position: "relative", width: "100%", height: 220 }}>
                  <ImageSlot radius={10} src={t.imagenes?.[0]?.url} placeholder={titulo} />
                </div>
              </Link>
              <figcaption style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {(t.destinoNombre || dur) && (
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                    {[t.destinoNombre as string | undefined, dur].filter(Boolean).join(" · ")}
                  </div>
                )}
                <Link href={`/tours/${t.slug}`} style={{ color: "inherit" }}>
                  <strong style={{ fontSize: 16, letterSpacing: "-0.01em" }}>{titulo}</strong>
                </Link>
                {tr?.resumen && (
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty", flex: 1 }}>
                    {tr.resumen}
                  </p>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                  {precio != null ? (
                    <strong style={{ fontSize: 15 }}>Desde S/ {precio}</strong>
                  ) : (
                    <span />
                  )}
                  <a
                    href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hola, quiero información del tour ${titulo}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 13, fontWeight: 600, background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "7px 12px", borderRadius: 8 }}
                  >
                    Reservar
                  </a>
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <section style={{ marginTop: 120, textAlign: "center" }}>
        <h2 style={{ margin: "0 auto 20px", maxWidth: 560, fontSize: "clamp(24px, 2vw, 34px)", fontWeight: 400, letterSpacing: "-0.015em", textWrap: "pretty" }}>
          ¿Buscas algo <em className="serif">a tu medida</em>?
        </h2>
        <p style={{ maxWidth: 480, margin: "0 auto 28px", fontSize: 15, lineHeight: 1.55, color: "var(--muted)", textWrap: "pretty" }}>
          Armamos itinerarios privados combinando transporte, tours y traslados según tus fechas y presupuesto.
        </p>
        <Link
          href="/contacto"
          style={{ display: "inline-block", fontSize: 14, fontWeight: 600, background: "var(--btn-bg)", color: "var(--btn-fg)", padding: "10px 18px", borderRadius: 8 }}
        >
          Pedir itinerario personalizado
        </Link>
      </section>
    </PageShell>
  );
}

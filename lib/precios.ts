import type { SalidaApi } from "@/lib/api/tipos";

export type PrecioDoble = { pen: number; usd: number };

const estadosDisponibles = new Set(["A_LA_VENTA", "PENDIENTE_DE_MINIMO", "CONFIRMADA"]);

/** Solo permite escoger salidas vendibles cuyo instante aún no ha pasado. */
export function salidasFuturasReservables(
  salidas?: SalidaApi[],
  ahora = Date.now(),
): SalidaApi[] {
  return (salidas ?? [])
    .filter((salida) => {
      const fecha = new Date(salida.fechaHoraSalida).getTime();
      return estadosDisponibles.has(salida.estado) && Number.isFinite(fecha) && fecha > ahora;
    })
    .sort((a, b) => a.fechaHoraSalida.localeCompare(b.fechaHoraSalida));
}

/** Elige la salida futura más barata en PEN y conserva el USD de esa misma salida. */
export function preciosDesdeSalidas(salidas?: SalidaApi[]): PrecioDoble | null {
  const disponibles = salidasFuturasReservables(salidas)
    .map((salida) => ({ pen: Number(salida.precioPen), usd: Number(salida.precioUsd) }))
    .filter((precio) => Number.isFinite(precio.pen) && precio.pen > 0 && Number.isFinite(precio.usd) && precio.usd > 0)
    .sort((a, b) => a.pen - b.pen);
  return disponibles[0] ?? null;
}

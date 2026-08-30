/**
 * Guarda los tokens de gestión de reservas creadas como invitado, para poder
 * consultarlas y pagarlas sin cuenta. Mapa { codigo: token } en localStorage.
 */
const CLAVE = "inca-reservas-invitado";

type Mapa = Record<string, string>;

function leer(): Mapa {
  if (typeof window === "undefined") return {};
  try {
    return (JSON.parse(localStorage.getItem(CLAVE) || "{}") as Mapa) ?? {};
  } catch {
    return {};
  }
}

export function guardarReservaInvitado(codigo: string, token: string): void {
  if (typeof window === "undefined") return;
  const mapa = leer();
  mapa[codigo] = token;
  try {
    localStorage.setItem(CLAVE, JSON.stringify(mapa));
  } catch {
    /* almacenamiento no disponible */
  }
}

export function obtenerTokenInvitado(codigo: string): string | null {
  return leer()[codigo] ?? null;
}

export function listarReservasInvitado(): { codigo: string; token: string }[] {
  return Object.entries(leer()).map(([codigo, token]) => ({ codigo, token }));
}

/* Cliente HTTP único: token, timeout, errores tipados. Todos los servicios lo usan. */

import { apiConfig, endpoints } from "./config";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/* Avatar de Google (viene en el ID token, el backend no lo guarda). */
export const avatarStorage = {
  obtener(): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("inca-avatar") ?? "";
  },
  guardar(url: string) {
    localStorage.setItem("inca-avatar", url);
  },
  limpiar() {
    localStorage.removeItem("inca-avatar");
  },
};

export const tokenStorage = {
  obtener(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(apiConfig.tokenStorageKey);
  },
  guardar(token: string) {
    localStorage.setItem(apiConfig.tokenStorageKey, token);
  },
  obtenerRenovacion(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(apiConfig.refreshTokenStorageKey);
  },
  guardarRenovacion(token: string) {
    localStorage.setItem(apiConfig.refreshTokenStorageKey, token);
  },
  limpiarRenovacion() {
    localStorage.removeItem(apiConfig.refreshTokenStorageKey);
  },
  limpiar() {
    localStorage.removeItem(apiConfig.tokenStorageKey);
  },
};

let renovacionEnCurso: Promise<boolean> | null = null;

function renovarTokenAcceso(): Promise<boolean> {
  if (renovacionEnCurso) return renovacionEnCurso;
  const tokenRenovacion = tokenStorage.obtenerRenovacion();
  if (!tokenRenovacion) return Promise.resolve(false);

  renovacionEnCurso = (async () => {
    const controladorRenovacion = new AbortController();
    const timeoutRenovacion = setTimeout(
      () => controladorRenovacion.abort(),
      apiConfig.timeoutMs,
    );
    try {
      const res = await fetch(`${apiConfig.baseUrl}${endpoints.autenticacion.renovar}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenRenovacion }),
        signal: controladorRenovacion.signal,
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          tokenStorage.limpiar();
          tokenStorage.limpiarRenovacion();
        }
        return false;
      }
      const sesion = (await res.json()) as {
        tokenAcceso?: string;
        tokenRenovacion?: string;
      };
      if (!sesion.tokenAcceso || !sesion.tokenRenovacion) return false;
      tokenStorage.guardar(sesion.tokenAcceso);
      tokenStorage.guardarRenovacion(sesion.tokenRenovacion);
      return true;
    } catch {
      return false;
    } finally {
      clearTimeout(timeoutRenovacion);
    }
  })().finally(() => {
    renovacionEnCurso = null;
  });
  return renovacionEnCurso;
}

type Metodo = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface OpcionesSolicitud {
  metodo?: Metodo;
  cuerpo?: unknown;
  query?: object;
  señal?: AbortSignal;
}

export async function solicitar<T>(
  ruta: string,
  { metodo = "GET", cuerpo, query, señal }: OpcionesSolicitud = {},
): Promise<T> {
  const url = new URL(`${apiConfig.baseUrl}${ruta}`);
  if (query) {
    for (const [clave, valor] of Object.entries(
      query as Record<string, unknown>,
    )) {
      if (valor !== undefined && valor !== null)
        url.searchParams.set(clave, String(valor));
    }
  }

  const controlador = new AbortController();
  const timeout = setTimeout(() => controlador.abort(), apiConfig.timeoutMs);
  señal?.addEventListener("abort", () => controlador.abort());

  try {
    const hacerSolicitud = () => {
      const tokenActual = tokenStorage.obtener();
      return fetch(url, {
        method: metodo,
        headers: {
          ...(cuerpo !== undefined ? { "Content-Type": "application/json" } : {}),
          ...(tokenActual ? { Authorization: `Bearer ${tokenActual}` } : {}),
        },
        body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
        signal: controlador.signal,
      });
    };
    let res = await hacerSolicitud();
    const rutasSinRenovacion: string[] = [
      endpoints.autenticacion.google,
      endpoints.autenticacion.renovar,
      endpoints.autenticacion.cerrarSesion,
    ];
    if (
      res.status === 401 &&
      !rutasSinRenovacion.includes(ruta) &&
      (await renovarTokenAcceso())
    ) {
      res = await hacerSolicitud();
    }

    if (!res.ok) {
      let mensaje = `Error ${res.status}`;
      try {
        const detalle = await res.json();
        mensaje = Array.isArray(detalle.message)
          ? detalle.message.join(", ")
          : (detalle.message ?? mensaje);
      } catch {}
      throw new ApiError(res.status, mensaje);
    }
    return (await res.json()) as T;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new ApiError(
        0,
        "No se pudo conectar con el servidor. Verifica que el backend esté iniciado y disponible.",
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/* Cliente HTTP único: token, timeout, errores tipados. Todos los servicios lo usan. */

import { apiConfig } from "./config";

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
  limpiar() {
    localStorage.removeItem(apiConfig.tokenStorageKey);
  },
};

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

  const token = tokenStorage.obtener();
  const controlador = new AbortController();
  const timeout = setTimeout(() => controlador.abort(), apiConfig.timeoutMs);
  señal?.addEventListener("abort", () => controlador.abort());

  try {
    const res = await fetch(url, {
      method: metodo,
      headers: {
        ...(cuerpo !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
      signal: controlador.signal,
    });

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

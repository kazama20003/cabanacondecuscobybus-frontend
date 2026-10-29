import { apiConfig, endpoints } from "../config";
import { tokenStorage } from "../cliente";
import type { CargaArchivo } from "../tipos";

export const servicioArchivos = {
  /** Sube el archivo al backend para mantener las credenciales de almacenamiento solo en el backend. */
  async subir(
    archivo: File,
    categoria: "transportes" | "tours" | "eventos" | "promociones",
  ): Promise<CargaArchivo> {
    const datos = new FormData();
    datos.append("archivo", archivo);
    const respuesta = await fetch(`${apiConfig.baseUrl}${endpoints.uploads.subir(categoria)}`, {
      method: "POST",
      headers: tokenStorage.obtener() ? { Authorization: `Bearer ${tokenStorage.obtener()}` } : {},
      body: datos,
    });
    if (!respuesta.ok) {
      const detalle = await respuesta.json().catch(() => null);
      throw new Error(detalle?.message ?? `Falló la subida (HTTP ${respuesta.status})`);
    }
    return respuesta.json() as Promise<CargaArchivo>;
  },

  async eliminar(
    clave: string,
    tipo: "IMAGEN" | "VIDEO",
    categoria: "transportes" | "tours" | "eventos" | "promociones",
  ) {
    const url = new URL(`${apiConfig.baseUrl}${endpoints.uploads.subir(categoria)}`);
    url.searchParams.set("clave", clave);
    url.searchParams.set("tipo", tipo);
    const respuesta = await fetch(url, {
      method: "DELETE",
      headers: tokenStorage.obtener() ? { Authorization: `Bearer ${tokenStorage.obtener()}` } : {},
    });
    if (!respuesta.ok) throw new Error(`No se pudo eliminar el archivo (HTTP ${respuesta.status})`);
  },
};

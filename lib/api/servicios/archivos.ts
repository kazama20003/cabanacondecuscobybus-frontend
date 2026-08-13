import { solicitar } from "../cliente";
import { endpoints } from "../config";
import type { CargaArchivo } from "../tipos";

export const servicioArchivos = {
  /** Pide al backend una URL firmada de carga a Cloudflare R2. */
  crearCarga: (archivo: File, categoria: "transportes" | "tours" | "comprobantes") =>
    solicitar<CargaArchivo>(endpoints.archivos.crearCarga, {
      metodo: "POST",
      cuerpo: {
        nombreArchivo: archivo.name,
        tipoContenido: archivo.type,
        categoria,
      },
    }),

  /** Flujo completo: URL firmada + PUT del archivo a R2. Devuelve la URL pública. */
  async subir(
    archivo: File,
    categoria: "transportes" | "tours" | "comprobantes",
  ): Promise<CargaArchivo> {
    const carga = await servicioArchivos.crearCarga(archivo, categoria);
    const respuesta = await fetch(carga.urlCarga, {
      method: "PUT",
      headers: { "Content-Type": archivo.type },
      body: archivo,
    });
    if (!respuesta.ok) {
      throw new Error(`Falló la subida a R2 (HTTP ${respuesta.status})`);
    }
    return carga;
  },
};

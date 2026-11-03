import { solicitar } from "../cliente";
import { endpoints } from "../config";
import type { Perfil, Sesion } from "../tipos";

export const servicioAutenticacion = {
  iniciarSesionGoogle: (idToken: string) =>
    solicitar<Sesion>(endpoints.autenticacion.google, {
      metodo: "POST",
      cuerpo: { idToken },
    }),

  cerrarSesion: (tokenRenovacion: string) =>
    solicitar<{ cerrada: boolean }>(endpoints.autenticacion.cerrarSesion, {
      metodo: "POST",
      cuerpo: { tokenRenovacion },
    }),

  miPerfil: () => solicitar<Perfil>(endpoints.autenticacion.miPerfil),
};

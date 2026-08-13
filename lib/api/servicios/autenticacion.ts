import { solicitar } from "../cliente";
import { endpoints } from "../config";
import type { Perfil, Sesion } from "../tipos";

export const servicioAutenticacion = {
  iniciarSesionGoogle: (idToken: string) =>
    solicitar<Sesion>(endpoints.autenticacion.google, {
      metodo: "POST",
      cuerpo: { idToken },
    }),

  miPerfil: () => solicitar<Perfil>(endpoints.autenticacion.miPerfil),
};

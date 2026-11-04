import { solicitar } from "../cliente";
import { endpoints } from "../config";
import type {
  ComprobanteSaldoEntrada,
  CrearReservaEntrada,
  PagoAdelantoApi,
  Paginado,
  ParametrosPagina,
  ReservaApi,
  SolicitudGestionReservaEntrada,
} from "../tipos";

export const servicioReservas = {
  crear: (datos: CrearReservaEntrada) =>
    solicitar<ReservaApi>(endpoints.reservas.crear, { metodo: "POST", cuerpo: datos }),

  mias: (paginacion?: ParametrosPagina) =>
    solicitar<Paginado<ReservaApi>>(endpoints.reservas.mias, {
      query: paginacion,
    }),

  verInvitado: (codigo: string, token: string) =>
    solicitar<ReservaApi>(endpoints.reservas.verInvitado(codigo), {
      query: { token },
    }),

  iniciarPagoAdelanto: (codigo: string, token?: string) =>
    solicitar<PagoAdelantoApi>(endpoints.reservas.iniciarPagoAdelanto(codigo), {
      metodo: "POST",
      query: { token },
    }),

  registrarComprobanteSaldo: (
    codigo: string,
    token: string,
    datos: ComprobanteSaldoEntrada,
  ) =>
    solicitar<unknown>(endpoints.reservas.comprobanteSaldo(codigo), {
      metodo: "POST",
      cuerpo: datos,
      query: { token },
    }),

  solicitarGestion: (
    codigo: string,
    token: string | undefined,
    datos: SolicitudGestionReservaEntrada,
  ) =>
    solicitar<{ recibida: boolean; mensaje: string }>(endpoints.reservas.solicitudesGestion(codigo), {
      metodo: "POST",
      cuerpo: datos,
      query: { token },
    }),
};

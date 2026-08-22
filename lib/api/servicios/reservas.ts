import { solicitar } from "../cliente";
import { endpoints } from "../config";
import type {
  ComprobanteSaldoEntrada,
  CrearReservaEntrada,
  PagoAdelantoApi,
  ReservaApi,
} from "../tipos";

export const servicioReservas = {
  crear: (datos: CrearReservaEntrada) =>
    solicitar<ReservaApi>(endpoints.reservas.crear, { metodo: "POST", cuerpo: datos }),

  mias: () => solicitar<ReservaApi[]>(endpoints.reservas.mias),

  verInvitado: (codigo: string, token: string) =>
    solicitar<ReservaApi>(endpoints.reservas.verInvitado(codigo), {
      query: { token },
    }),

  iniciarPagoAdelanto: (codigo: string) =>
    solicitar<PagoAdelantoApi>(endpoints.reservas.iniciarPagoAdelanto(codigo), {
      metodo: "POST",
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
};

import { solicitar } from "../cliente";
import { endpoints } from "../config";
import type {
  ComprobanteSaldoEntrada,
  CrearReservaEntrada,
  ReservaApi,
} from "../tipos";

export const servicioReservas = {
  crear: (datos: CrearReservaEntrada) =>
    solicitar<ReservaApi>(endpoints.reservas.crear, { metodo: "POST", cuerpo: datos }),

  verInvitado: (codigo: string, token: string) =>
    solicitar<ReservaApi>(endpoints.reservas.verInvitado(codigo), {
      query: { token },
    }),

  iniciarPagoAdelanto: (codigo: string) =>
    solicitar<unknown>(endpoints.reservas.iniciarPagoAdelanto(codigo), {
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

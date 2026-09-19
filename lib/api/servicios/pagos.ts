import { solicitar } from "../cliente";
import { endpoints } from "../config";
import type { FiltrosPagosAdmin, PagoAdminApi, Paginado } from "../tipos";

export const servicioPagos = {
  listarAdministracion: (filtros: FiltrosPagosAdmin = {}) =>
    solicitar<Paginado<PagoAdminApi>>(endpoints.pagos.listarAdministracion, {
      query: filtros,
    }),

  confirmar: (pagoId: string) =>
    solicitar<PagoAdminApi>(endpoints.pagos.confirmar(pagoId), { metodo: "POST" }),
};

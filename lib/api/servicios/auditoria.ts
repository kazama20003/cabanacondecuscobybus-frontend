import { solicitar } from "../cliente";
import { endpoints } from "../config";
import type {
  AuditoriaApi,
  EntidadAuditoria,
  Paginado,
  ParametrosPagina,
} from "../tipos";

export const servicioAuditoria = {
  listar: (filtros?: ParametrosPagina & { entidad?: EntidadAuditoria }) =>
    solicitar<Paginado<AuditoriaApi>>(endpoints.auditoria.listar, {
      query: filtros,
    }),
};

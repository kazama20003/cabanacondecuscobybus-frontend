import { solicitar } from "../cliente";
import { endpoints } from "../config";
import type {
  CrearPromocionEntrada,
  ObjetivoPromocion,
  Paginado,
  ParametrosPagina,
  PromocionApi,
} from "../tipos";

export const servicioPromociones = {
  vigentes: (objetivo?: ObjetivoPromocion) =>
    solicitar<PromocionApi[]>(endpoints.promociones.vigentes, {
      query: { objetivo },
    }),

  listar: (filtros?: ParametrosPagina) =>
    solicitar<Paginado<PromocionApi>>(endpoints.promociones.listar, {
      query: filtros,
    }),

  crear: (datos: CrearPromocionEntrada) =>
    solicitar<PromocionApi>(endpoints.promociones.crear, {
      metodo: "POST",
      cuerpo: datos,
    }),

  actualizar: (id: string, datos: Partial<CrearPromocionEntrada>) =>
    solicitar<PromocionApi>(endpoints.promociones.actualizar(id), {
      metodo: "PATCH",
      cuerpo: datos,
    }),

  eliminar: (id: string) =>
    solicitar<{ mensaje: string }>(endpoints.promociones.eliminar(id), {
      metodo: "DELETE",
    }),
};

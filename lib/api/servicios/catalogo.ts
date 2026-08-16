import { solicitar } from "../cliente";
import { endpoints } from "../config";
import type {
  ActualizarSalidaEntrada,
  ContenidoEntrada,
  CrearSalidaEntrada,
  ItinerarioApi,
  ItinerarioEntrada,
  ParadaApi,
  ParadaEntrada,
  SalidaAdminApi,
  TraduccionApi,
  CrearTourEntrada,
  CrearTransporteEntrada,
  Paginado,
  ParametrosPagina,
  SalidaApi,
  TourApi,
  TransporteApi,
} from "../tipos";

export const servicioCatalogo = {
  transportes: (
    filtros?: ParametrosPagina & { origen?: string; destino?: string },
  ) =>
    solicitar<Paginado<TransporteApi>>(endpoints.catalogo.transportes, {
      query: filtros,
    }),

  transporte: (slug: string) =>
    solicitar<TransporteApi>(endpoints.catalogo.transporte(slug)),

  buscarTransportes: (filtros: { origen?: string; destino?: string; fecha?: string }) =>
    solicitar<TransporteApi[]>(endpoints.catalogo.buscarTransportes, { query: filtros }),

  tours: (filtros?: ParametrosPagina & { destino?: string }) =>
    solicitar<Paginado<TourApi>>(endpoints.catalogo.tours, { query: filtros }),

  tour: (slug: string) => solicitar<TourApi>(endpoints.catalogo.tour(slug)),

  crearTransporte: (datos: CrearTransporteEntrada) =>
    solicitar<TransporteApi>(endpoints.catalogo.crearTransporte, {
      metodo: "POST",
      cuerpo: datos,
    }),

  crearTour: (datos: CrearTourEntrada) =>
    solicitar<TourApi>(endpoints.catalogo.crearTour, {
      metodo: "POST",
      cuerpo: datos,
    }),

  eliminarTransporte: (id: string) =>
    solicitar<{ mensaje: string }>(endpoints.catalogo.eliminarTransporte(id), { metodo: "DELETE" }),

  eliminarTour: (id: string) =>
    solicitar<{ mensaje: string }>(endpoints.catalogo.eliminarTour(id), { metodo: "DELETE" }),

  definirParadas: (transporteId: string, paradas: ParadaEntrada[]) =>
    solicitar<ParadaApi[]>(endpoints.catalogo.definirParadas(transporteId), {
      metodo: "POST",
      cuerpo: { paradas },
    }),

  crearSalidaTransporte: (transporteId: string, datos: CrearSalidaEntrada) =>
    solicitar<SalidaApi>(endpoints.catalogo.crearSalidaTransporte(transporteId), {
      metodo: "POST",
      cuerpo: datos,
    }),

  definirItinerario: (tourId: string, items: ItinerarioEntrada[]) =>
    solicitar<ItinerarioApi[]>(endpoints.catalogo.definirItinerario(tourId), {
      metodo: "POST",
      cuerpo: { items },
    }),

  salidasAdmin: (filtros?: ParametrosPagina & { tipo?: "TRANSPORTE" | "TOUR" }) =>
    solicitar<Paginado<SalidaAdminApi>>(endpoints.catalogo.salidasAdmin, {
      query: filtros,
    }),

  actualizarSalida: (
    tipo: "transporte" | "tour",
    id: string,
    cambios: ActualizarSalidaEntrada,
  ) =>
    solicitar<SalidaAdminApi>(endpoints.catalogo.actualizarSalida(tipo, id), {
      metodo: "PATCH",
      cuerpo: cambios,
    }),

  traducciones: (tipo: "transportes" | "tours", id: string) =>
    solicitar<TraduccionApi[]>(endpoints.catalogo.traducciones(tipo, id)),

  editarTraduccion: (
    tipo: "transportes" | "tours",
    id: string,
    idioma: string,
    datos: Partial<ContenidoEntrada> & { estado?: "BORRADOR" | "PUBLICADA" },
  ) =>
    solicitar<TraduccionApi>(
      endpoints.catalogo.editarTraduccion(tipo, id, idioma),
      { metodo: "PUT", cuerpo: datos },
    ),

  crearSalidaTour: (tourId: string, datos: CrearSalidaEntrada) =>
    solicitar<SalidaApi>(endpoints.catalogo.crearSalidaTour(tourId), {
      metodo: "POST",
      cuerpo: datos,
    }),
};

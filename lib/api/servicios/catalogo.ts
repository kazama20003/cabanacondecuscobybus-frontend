import { solicitar } from "../cliente";
import { endpoints } from "../config";
import type {
  ActualizarPlantillaEntrada,
  ActualizarSalidaEntrada,
  CrearPlantillaEntrada,
  PlantillaSalidaApi,
  ActualizarTourEntrada,
  ActualizarTransporteEntrada,
  ContenidoEntrada,
  CrearSalidaEntrada,
  ItinerarioApi,
  ItinerarioEntrada,
  ParadaApi,
  ParadaEntrada,
  SalidaAdminApi,
  TraduccionApi,
  CrearTourEntrada,
  CrearEventoEspecialEntrada,
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

  transporte: (slug: string, idioma?: string) =>
    solicitar<TransporteApi>(endpoints.catalogo.transporte(slug), {
      query: { idioma },
    }),

  buscarTransportes: (filtros: { origen?: string; destino?: string; fecha?: string }) =>
    solicitar<TransporteApi[]>(endpoints.catalogo.buscarTransportes, { query: filtros }),

  tours: (filtros?: ParametrosPagina & { destino?: string; esEvento?: boolean }) =>
    solicitar<Paginado<TourApi>>(endpoints.catalogo.tours, { query: filtros }),

  tour: (slug: string, idioma?: string) =>
    solicitar<TourApi>(endpoints.catalogo.tour(slug), { query: { idioma } }),

  crearTransporte: (datos: CrearTransporteEntrada) =>
    solicitar<TransporteApi>(endpoints.catalogo.crearTransporte, {
      metodo: "POST",
      cuerpo: datos,
    }),

  eventos: (filtros?: ParametrosPagina) =>
    solicitar<Paginado<TourApi>>(endpoints.catalogo.eventos, { query: filtros }),

  eventosAdmin: (filtros?: ParametrosPagina) =>
    solicitar<Paginado<TourApi>>(endpoints.catalogo.eventosAdmin, { query: filtros }),

  crearEventoEspecial: (datos: CrearEventoEspecialEntrada) =>
    solicitar<TourApi>(endpoints.catalogo.crearEventoEspecial, {
      metodo: "POST",
      cuerpo: datos,
    }),

  actualizarEstadoEvento: (id: string, activo: boolean) =>
    solicitar<TourApi>(endpoints.catalogo.actualizarEstadoEvento(id), {
      metodo: "PATCH",
      cuerpo: { activo },
    }),

  reordenar: (id: string, tipo: "TRANSPORTE" | "TOUR" | "EVENTO", direccion: "ARRIBA" | "ABAJO") =>
    solicitar<{ id: string; ordenCatalogo: number }>(endpoints.catalogo.reordenar(id), {
      metodo: "PUT",
      cuerpo: { tipo, direccion },
    }),

  crearTour: (datos: CrearTourEntrada) =>
    solicitar<TourApi>(endpoints.catalogo.crearTour, {
      metodo: "POST",
      cuerpo: datos,
    }),

  actualizarTransporte: (id: string, datos: ActualizarTransporteEntrada) =>
    solicitar<TransporteApi>(endpoints.catalogo.actualizarTransporte(id), {
      metodo: "PATCH",
      cuerpo: datos,
    }),

  actualizarTour: (id: string, datos: ActualizarTourEntrada) =>
    solicitar<TourApi>(endpoints.catalogo.actualizarTour(id), {
      metodo: "PATCH",
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

  salidasAdmin: (filtros?: ParametrosPagina & { tipo?: "TRANSPORTE" | "TOUR"; servicioId?: string }) =>
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

  plantillasSalida: (tipo?: "TRANSPORTE" | "TOUR") =>
    solicitar<PlantillaSalidaApi[]>(endpoints.catalogo.plantillasSalida, {
      query: tipo ? { tipo } : undefined,
    }),

  crearPlantillaTransporte: (transporteId: string, datos: CrearPlantillaEntrada) =>
    solicitar<PlantillaSalidaApi>(
      endpoints.catalogo.crearPlantillaTransporte(transporteId),
      { metodo: "POST", cuerpo: datos },
    ),

  crearPlantillaTour: (tourId: string, datos: CrearPlantillaEntrada) =>
    solicitar<PlantillaSalidaApi>(endpoints.catalogo.crearPlantillaTour(tourId), {
      metodo: "POST",
      cuerpo: datos,
    }),

  actualizarPlantilla: (id: string, cambios: ActualizarPlantillaEntrada) =>
    solicitar<PlantillaSalidaApi>(endpoints.catalogo.plantillaSalida(id), {
      metodo: "PATCH",
      cuerpo: cambios,
    }),

  eliminarPlantilla: (id: string) =>
    solicitar<{ eliminada: boolean }>(endpoints.catalogo.plantillaSalida(id), {
      metodo: "DELETE",
    }),
};

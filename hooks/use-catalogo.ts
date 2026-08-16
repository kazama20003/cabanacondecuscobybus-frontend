"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { claves, servicioCatalogo } from "@/lib/api";
import type {
  ActualizarSalidaEntrada,
  ContenidoEntrada,
  CrearSalidaEntrada,
  CrearTourEntrada,
  CrearTransporteEntrada,
  ItinerarioEntrada,
  ParadaEntrada,
  ParametrosPagina,
} from "@/lib/api";

export function useTransportes(
  filtros?: ParametrosPagina & { origen?: string; destino?: string },
) {
  return useQuery({
    queryKey: [...claves.catalogo.transportes(), filtros ?? {}],
    queryFn: () => servicioCatalogo.transportes(filtros),
    placeholderData: keepPreviousData,
  });
}

export function useTransporte(slug: string) {
  return useQuery({
    queryKey: claves.catalogo.transporte(slug),
    queryFn: () => servicioCatalogo.transporte(slug),
    enabled: !!slug,
  });
}

export function useTours(filtros?: ParametrosPagina & { destino?: string }) {
  return useQuery({
    queryKey: [...claves.catalogo.tours(filtros?.destino), filtros ?? {}],
    queryFn: () => servicioCatalogo.tours(filtros),
    placeholderData: keepPreviousData,
  });
}

export function useTour(slug: string) {
  return useQuery({
    queryKey: claves.catalogo.tour(slug),
    queryFn: () => servicioCatalogo.tour(slug),
    enabled: !!slug,
  });
}

/* --- Mutaciones de administración --- */

export function useCrearTransporte() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: CrearTransporteEntrada) =>
      servicioCatalogo.crearTransporte(datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: claves.catalogo.todas }),
  });
}

export function useCrearTour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: CrearTourEntrada) => servicioCatalogo.crearTour(datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: claves.catalogo.todas }),
  });
}

export function useEliminarTransporte() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicioCatalogo.eliminarTransporte(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: claves.catalogo.todas }),
  });
}

export function useEliminarTour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicioCatalogo.eliminarTour(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: claves.catalogo.todas }),
  });
}

export function useDefinirParadas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { transporteId: string; paradas: ParadaEntrada[] }) =>
      servicioCatalogo.definirParadas(params.transporteId, params.paradas),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: claves.catalogo.todas }),
  });
}

export function useDefinirItinerario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { tourId: string; items: ItinerarioEntrada[] }) =>
      servicioCatalogo.definirItinerario(params.tourId, params.items),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: claves.catalogo.todas }),
  });
}

export function useSalidasAdmin(
  filtros?: ParametrosPagina & { tipo?: "TRANSPORTE" | "TOUR" },
) {
  return useQuery({
    queryKey: ["salidas-admin", filtros ?? {}],
    queryFn: () => servicioCatalogo.salidasAdmin(filtros),
    placeholderData: keepPreviousData,
  });
}

export function useActualizarSalida() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      tipo: "transporte" | "tour";
      id: string;
      cambios: ActualizarSalidaEntrada;
    }) => servicioCatalogo.actualizarSalida(params.tipo, params.id, params.cambios),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salidas-admin"] });
      queryClient.invalidateQueries({ queryKey: claves.catalogo.todas });
    },
  });
}

export function useTraducciones(
  tipo: "transportes" | "tours",
  id: string | undefined,
) {
  return useQuery({
    queryKey: ["traducciones", tipo, id],
    queryFn: () => servicioCatalogo.traducciones(tipo, id!),
    enabled: !!id,
  });
}

export function useEditarTraduccion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      tipo: "transportes" | "tours";
      id: string;
      idioma: string;
      datos: Partial<ContenidoEntrada> & { estado?: "BORRADOR" | "PUBLICADA" };
    }) =>
      servicioCatalogo.editarTraduccion(
        params.tipo,
        params.id,
        params.idioma,
        params.datos,
      ),
    onSuccess: (_, params) =>
      queryClient.invalidateQueries({
        queryKey: ["traducciones", params.tipo, params.id],
      }),
  });
}

export function useCrearSalida() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      tipo: "TRANSPORTE" | "TOUR";
      servicioId: string;
      datos: CrearSalidaEntrada;
    }) =>
      params.tipo === "TRANSPORTE"
        ? servicioCatalogo.crearSalidaTransporte(params.servicioId, params.datos)
        : servicioCatalogo.crearSalidaTour(params.servicioId, params.datos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: claves.catalogo.todas }),
  });
}

"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { servicioPromociones } from "@/lib/api";
import type { CrearPromocionEntrada, ParametrosPagina } from "@/lib/api";

const CLAVE = ["promociones"];

export function usePromociones(filtros?: ParametrosPagina) {
  return useQuery({
    queryKey: [...CLAVE, "admin", filtros ?? {}],
    queryFn: () => servicioPromociones.listar(filtros),
    placeholderData: keepPreviousData,
  });
}

export function useCrearPromocion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: servicioPromociones.crear,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLAVE }),
  });
}

export function useActualizarPromocion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; datos: Partial<CrearPromocionEntrada> }) =>
      servicioPromociones.actualizar(params.id, params.datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLAVE }),
  });
}

export function useEliminarPromocion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: servicioPromociones.eliminar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLAVE }),
  });
}

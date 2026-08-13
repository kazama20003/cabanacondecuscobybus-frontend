"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { claves, servicioUsuarios } from "@/lib/api";
import type {
  ActualizarUsuarioEntrada,
  ParametrosPagina,
  RolUsuario,
} from "@/lib/api";

export function useUsuarios(
  filtros?: ParametrosPagina & { rol?: RolUsuario; buscar?: string },
) {
  return useQuery({
    queryKey: claves.usuarios.lista(filtros),
    queryFn: () => servicioUsuarios.listar(filtros),
    placeholderData: keepPreviousData,
  });
}

export function useActualizarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; cambios: ActualizarUsuarioEntrada }) =>
      servicioUsuarios.actualizar(params.id, params.cambios),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: claves.usuarios.todas }),
  });
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { servicioPagos } from "@/lib/api";
import type { FiltrosPagosAdmin } from "@/lib/api";

export function usePagosAdministracion(filtros: FiltrosPagosAdmin = {}) {
  return useQuery({
    queryKey: ["pagos", "administracion", filtros],
    queryFn: () => servicioPagos.listarAdministracion(filtros),
  });
}

export function useConfirmarPago() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: servicioPagos.confirmar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pagos", "administracion"] }),
  });
}

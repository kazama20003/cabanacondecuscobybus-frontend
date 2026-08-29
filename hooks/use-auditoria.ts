"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { servicioAuditoria } from "@/lib/api";
import type { EntidadAuditoria, ParametrosPagina } from "@/lib/api";

export function useAuditoria(
  filtros?: ParametrosPagina & { entidad?: EntidadAuditoria },
) {
  return useQuery({
    queryKey: ["auditoria", filtros ?? {}],
    queryFn: () => servicioAuditoria.listar(filtros),
    placeholderData: keepPreviousData,
  });
}

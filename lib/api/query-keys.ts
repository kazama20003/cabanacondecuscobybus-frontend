/* Fábrica de query keys — jerárquicas, tipadas, sin strings duplicados.
   Invalidar todo un módulo: queryClient.invalidateQueries({ queryKey: claves.catalogo.todas }) */

export const claves = {
  autenticacion: {
    perfil: ["autenticacion", "perfil"] as const,
  },
  catalogo: {
    todas: ["catalogo"] as const,
    transportes: () => ["catalogo", "transportes"] as const,
    transporte: (slug: string) => ["catalogo", "transportes", slug] as const,
    tours: (destino?: string) => ["catalogo", "tours", destino ?? "todos"] as const,
    tour: (slug: string) => ["catalogo", "tours", "detalle", slug] as const,
  },
  usuarios: {
    todas: ["usuarios"] as const,
    lista: (filtros?: { rol?: string; buscar?: string }) =>
      ["usuarios", "lista", filtros ?? {}] as const,
  },
  reservas: {
    todas: ["reservas"] as const,
    detalle: (codigo: string, token?: string) =>
      ["reservas", codigo, token ?? "propia"] as const,
  },
} as const;

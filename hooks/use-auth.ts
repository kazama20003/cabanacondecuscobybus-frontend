"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { avatarStorage, claves, servicioAutenticacion, tokenStorage } from "@/lib/api";

export function useSesionGoogle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: servicioAutenticacion.iniciarSesionGoogle,
    onSuccess: (sesion) => {
      tokenStorage.guardar(sesion.tokenAcceso);
      tokenStorage.guardarRenovacion(sesion.tokenRenovacion);
      queryClient.invalidateQueries({ queryKey: claves.autenticacion.perfil });
    },
  });
}

export function useMiPerfil() {
  return useQuery({
    queryKey: claves.autenticacion.perfil,
    queryFn: servicioAutenticacion.miPerfil,
    enabled: typeof window !== "undefined" && !!tokenStorage.obtener(),
    retry: false,
  });
}

export function useCerrarSesion() {
  const queryClient = useQueryClient();
  return async () => {
    const tokenRenovacion = tokenStorage.obtenerRenovacion();
    try {
      if (tokenRenovacion) await servicioAutenticacion.cerrarSesion(tokenRenovacion);
    } catch {
      // Cierra la sesión local incluso si el servidor no está disponible.
    } finally {
      tokenStorage.limpiar();
      tokenStorage.limpiarRenovacion();
      avatarStorage.limpiar();
      queryClient.removeQueries({ queryKey: claves.autenticacion.perfil });
    }
  };
}

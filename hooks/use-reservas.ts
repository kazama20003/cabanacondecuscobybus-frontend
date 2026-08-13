"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { claves, servicioReservas } from "@/lib/api";
import type { ComprobanteSaldoEntrada } from "@/lib/api";

export function useCrearReserva() {
  return useMutation({ mutationFn: servicioReservas.crear });
}

export function useReservaInvitado(codigo: string, token: string) {
  return useQuery({
    queryKey: claves.reservas.detalle(codigo, token),
    queryFn: () => servicioReservas.verInvitado(codigo, token),
    enabled: !!codigo && !!token,
  });
}

export function useIniciarPagoAdelanto() {
  return useMutation({
    mutationFn: (codigo: string) => servicioReservas.iniciarPagoAdelanto(codigo),
  });
}

export function useRegistrarComprobanteSaldo() {
  return useMutation({
    mutationFn: (params: {
      codigo: string;
      token: string;
      datos: ComprobanteSaldoEntrada;
    }) =>
      servicioReservas.registrarComprobanteSaldo(
        params.codigo,
        params.token,
        params.datos,
      ),
  });
}

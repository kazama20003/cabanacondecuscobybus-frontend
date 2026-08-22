"use client";
/* eslint-disable react-hooks/set-state-in-effect -- hidratación desde localStorage al montar */

import { createContext, useContext, useEffect, useState } from "react";
import type { Moneda, TipoServicio } from "@/lib/api";

/**
 * Carrito de compras del cliente. Cada línea es UNA salida (el backend crea una
 * reserva por salida). Persiste en localStorage ("inca-cart"). El checkout
 * recorre las líneas y hace un POST /reservas por cada una.
 */
export interface ItemCarrito {
  salidaId: string;
  tipoServicio: TipoServicio;
  slug: string;
  titulo: string;
  fechaHoraSalida: string;
  precioPen: number;
  precioUsd: number;
  imagen?: string;
  pasajeros: number;
}

type CarritoContexto = {
  items: ItemCarrito[];
  agregar: (item: ItemCarrito) => void;
  quitar: (salidaId: string) => void;
  fijarPasajeros: (salidaId: string, pasajeros: number) => void;
  limpiar: () => void;
  contiene: (salidaId: string) => boolean;
  totalLineas: number;
  totalPasajeros: number;
  total: (moneda: Moneda) => number;
};

const CLAVE_STORAGE = "inca-cart";

const CarritoContext = createContext<CarritoContexto | null>(null);

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_STORAGE);
      if (guardado) setItems(JSON.parse(guardado) as ItemCarrito[]);
    } catch {
      /* ignora carrito corrupto */
    }
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
    } catch {
      /* almacenamiento lleno o bloqueado */
    }
  }, [items, hidratado]);

  const agregar = (item: ItemCarrito) =>
    setItems((prev) =>
      prev.some((x) => x.salidaId === item.salidaId)
        ? prev.map((x) =>
            x.salidaId === item.salidaId
              ? { ...x, pasajeros: Math.max(1, item.pasajeros) }
              : x,
          )
        : [...prev, { ...item, pasajeros: Math.max(1, item.pasajeros) }],
    );

  const quitar = (salidaId: string) =>
    setItems((prev) => prev.filter((x) => x.salidaId !== salidaId));

  const fijarPasajeros = (salidaId: string, pasajeros: number) =>
    setItems((prev) =>
      prev.map((x) =>
        x.salidaId === salidaId ? { ...x, pasajeros: Math.max(1, pasajeros) } : x,
      ),
    );

  const limpiar = () => setItems([]);

  const contiene = (salidaId: string) => items.some((x) => x.salidaId === salidaId);

  const total = (moneda: Moneda) =>
    items.reduce(
      (suma, x) =>
        suma + (moneda === "USD" ? Number(x.precioUsd) : Number(x.precioPen)) * x.pasajeros,
      0,
    );

  const valor: CarritoContexto = {
    items,
    agregar,
    quitar,
    fijarPasajeros,
    limpiar,
    contiene,
    totalLineas: items.length,
    totalPasajeros: items.reduce((s, x) => s + x.pasajeros, 0),
    total,
  };

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito(): CarritoContexto {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
}

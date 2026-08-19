"use client";

import { createContext, useContext, useEffect, useState } from "react";

/** Idiomas soportados por el catálogo (deben coincidir con IDIOMAS_CATALOGO del backend). */
export const IDIOMAS = [
  "es",
  "en",
  "fr",
  "it",
  "pt",
  "zh",
  "ja",
  "ru",
  "de",
] as const;

export type LangCode = (typeof IDIOMAS)[number];

const CLAVE_STORAGE = "inca-lang";

type IdiomaContexto = {
  idioma: LangCode;
  setIdioma: (code: LangCode) => void;
};

const IdiomaContext = createContext<IdiomaContexto | null>(null);

/**
 * Estado global de idioma. Persiste en localStorage ("inca-lang"). El LangSwitcher
 * lo actualiza; las vistas de consumo lo leen con useIdioma() y lo pasan a los
 * hooks del catálogo (useTransporte/useTour) para pedir ?idioma= al backend.
 */
export function IdiomaProvider({ children }: { children: React.ReactNode }) {
  const [idioma, setIdiomaState] = useState<LangCode>("es");

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_STORAGE) as LangCode | null;
      if (guardado && IDIOMAS.includes(guardado)) setIdiomaState(guardado);
    } catch {
      /* localStorage no disponible */
    }
  }, []);

  const setIdioma = (code: LangCode) => {
    setIdiomaState(code);
    try {
      localStorage.setItem(CLAVE_STORAGE, code);
    } catch {
      /* localStorage no disponible */
    }
  };

  return (
    <IdiomaContext.Provider value={{ idioma, setIdioma }}>
      {children}
    </IdiomaContext.Provider>
  );
}

export function useIdioma(): IdiomaContexto {
  const ctx = useContext(IdiomaContext);
  if (!ctx) {
    throw new Error("useIdioma debe usarse dentro de <IdiomaProvider>");
  }
  return ctx;
}

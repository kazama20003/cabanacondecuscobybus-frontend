"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isPrivatePath, localizedPath, normalizeLanguage, SUPPORTED_LANGUAGES, type LangCode } from "@/lib/language";

/** Idiomas habilitados en los diccionarios y en las traducciones del catálogo. */
export const IDIOMAS = SUPPORTED_LANGUAGES;
export type { LangCode };
export const IDIOMAS_HABILITADOS: readonly LangCode[] = (() => {
  const configurados = (process.env.NEXT_PUBLIC_IDIOMAS_SITIO ?? "es,en,fr,it,pt,zh,ja,ru,de")
    .split(",")
    .map((valor) => normalizeLanguage(valor))
    .filter((valor): valor is LangCode => Boolean(valor));
  return [...new Set<LangCode>(["es", ...configurados])];
})();

const CLAVE_STORAGE = "inca-lang";
const COOKIE_IDIOMA = "inca-lang";
const COOKIE_ORIGEN = "inca-lang-source";

type IdiomaContexto = {
  idioma: LangCode;
  setIdioma: (code: LangCode) => void;
};

const IdiomaContext = createContext<IdiomaContexto | null>(null);

function guardarPreferencia(code: LangCode) {
  try {
    localStorage.setItem(CLAVE_STORAGE, code);
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE_IDIOMA}=${code}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
    document.cookie = `${COOKIE_ORIGEN}=manual; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  } catch {
    /* La selección sigue funcionando aunque el navegador bloquee el almacenamiento. */
  }
}

function rutaConIdioma(pathname: string, code: LangCode): string {
  if (isPrivatePath(pathname)) return pathname;
  return localizedPath(pathname, code);
}

export function IdiomaProvider({ children, initialLanguage = "es" }: { children: React.ReactNode; initialLanguage?: LangCode }) {
  const [idioma, setIdiomaState] = useState<LangCode>(initialLanguage);
  const router = useRouter();
  const pathname = usePathname() || "/";

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  // Conserva preferencias guardadas por versiones anteriores, si el usuario ya eligió idioma.
  useEffect(() => {
    try {
      const guardado = normalizeLanguage(localStorage.getItem(CLAVE_STORAGE));
      if (guardado && IDIOMAS_HABILITADOS.includes(guardado)) {
        setIdiomaState(guardado);
        guardarPreferencia(guardado);
        const destino = `${rutaConIdioma(pathname, guardado)}${window.location.search}${window.location.hash}`;
        if (destino !== `${window.location.pathname}${window.location.search}${window.location.hash}`) router.replace(destino);
      }
    } catch {
      /* localStorage no disponible */
    }
    // Run once: changing route should not overwrite the visitor's saved preference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setIdioma = (code: LangCode) => {
    if (!IDIOMAS_HABILITADOS.includes(code)) return;
    setIdiomaState(code);
    guardarPreferencia(code);
    const destino = `${rutaConIdioma(pathname, code)}${window.location.search}${window.location.hash}`;
    if (destino !== `${window.location.pathname}${window.location.search}${window.location.hash}`) router.replace(destino);
  };

  return <IdiomaContext.Provider value={{ idioma, setIdioma }}>{children}</IdiomaContext.Provider>;
}

export function useIdioma(): IdiomaContexto {
  const ctx = useContext(IdiomaContext);
  if (!ctx) throw new Error("useIdioma debe usarse dentro de <IdiomaProvider>");
  return ctx;
}

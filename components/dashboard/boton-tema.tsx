"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/* Alterna el mismo data-theme que usa el sitio público (localStorage 'inca-theme'). */
export function BotonTema() {
  const [tema, setTema] = useState<"light" | "dark">("light");

  useEffect(() => {
    const actual = document.documentElement.getAttribute("data-theme");
    setTema(actual === "dark" ? "dark" : "light");
  }, []);

  const alternar = () => {
    const nuevo = tema === "dark" ? "light" : "dark";
    setTema(nuevo);
    document.documentElement.setAttribute("data-theme", nuevo);
    try {
      localStorage.setItem("inca-theme", nuevo);
    } catch {}
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={alternar}
      aria-label={tema === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      className="size-8"
    >
      <SunIcon className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <MoonIcon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  );
}

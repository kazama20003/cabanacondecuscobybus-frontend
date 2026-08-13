"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Paginado } from "@/lib/api";

/* Paginación estándar para todas las tablas del panel. */
export function Paginacion({
  resultado,
  onCambiarPagina,
}: {
  resultado: Pick<Paginado<unknown>, "pagina" | "totalPaginas" | "total">;
  onCambiarPagina: (pagina: number) => void;
}) {
  const { pagina, totalPaginas, total } = resultado;
  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-muted-foreground text-sm">
        {total} registro{total === 1 ? "" : "s"} · página {pagina} de {totalPaginas}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={pagina <= 1}
          onClick={() => onCambiarPagina(pagina - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={pagina >= totalPaginas}
          onClick={() => onCambiarPagina(pagina + 1)}
          aria-label="Página siguiente"
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}

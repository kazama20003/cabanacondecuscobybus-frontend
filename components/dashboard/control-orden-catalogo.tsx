"use client";

import { ArrowDown, ArrowUp, ListOrdered } from "lucide-react";
import { Button } from "@/components/native-ui/button";
import { useReordenarCatalogo } from "@/hooks/use-catalogo";

type Props = {
  id: string;
  tipo: "TRANSPORTE" | "TOUR" | "EVENTO";
  posicion: number;
  primero: boolean;
  ultimo: boolean;
};

export function ControlOrdenCatalogo({ id, tipo, posicion, primero, ultimo }: Props) {
  const reordenar = useReordenarCatalogo();
  const mover = (direccion: "ARRIBA" | "ABAJO") =>
    reordenar.mutate({ id, tipo, direccion });

  return (
    <div className="inline-flex items-center gap-1" aria-label={`Posición ${posicion}`}>
      <span className="text-muted-foreground mr-1 inline-flex min-w-7 items-center gap-1 text-xs" title="Orden en la página pública">
        <ListOrdered className="size-3.5" />{posicion}
      </span>
      <Button type="button" variant="outline" size="icon" className="size-8" aria-label="Subir en la página pública" title="Subir" disabled={primero || reordenar.isPending} onClick={() => mover("ARRIBA")}>
        <ArrowUp />
      </Button>
      <Button type="button" variant="outline" size="icon" className="size-8" aria-label="Bajar en la página pública" title="Bajar" disabled={ultimo || reordenar.isPending} onClick={() => mover("ABAJO")}>
        <ArrowDown />
      </Button>
    </div>
  );
}

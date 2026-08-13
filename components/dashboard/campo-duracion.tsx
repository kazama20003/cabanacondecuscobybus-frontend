"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* Entrada de duración en horas y minutos; el valor se maneja en minutos totales. */
export function CampoDuracion({
  etiqueta,
  minutosTotales,
  onCambiar,
  requerido = false,
}: {
  etiqueta: string;
  minutosTotales: string;
  onCambiar: (minutos: string) => void;
  requerido?: boolean;
}) {
  const total = Number(minutosTotales) || 0;
  const horas = Math.floor(total / 60);
  const minutos = total % 60;

  const actualizar = (h: number, m: number) => {
    const nuevo = h * 60 + m;
    onCambiar(nuevo > 0 ? String(nuevo) : "");
  };

  return (
    <div className="grid gap-2">
      <Label>{etiqueta}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          placeholder="0"
          className="w-20"
          required={requerido && total === 0}
          value={horas || ""}
          onChange={(e) => actualizar(Number(e.target.value) || 0, minutos)}
          aria-label={`${etiqueta}: horas`}
        />
        <span className="text-muted-foreground text-sm">h</span>
        <Input
          type="number"
          min={0}
          max={59}
          placeholder="0"
          className="w-20"
          value={minutos || ""}
          onChange={(e) =>
            actualizar(horas, Math.min(59, Number(e.target.value) || 0))
          }
          aria-label={`${etiqueta}: minutos`}
        />
        <span className="text-muted-foreground text-sm">min</span>
      </div>
    </div>
  );
}

/* Formatea minutos como "6 h 30 min" para mostrar en tablas. */
export function formatearDuracion(minutosTotales: number): string {
  const horas = Math.floor(minutosTotales / 60);
  const minutos = minutosTotales % 60;
  if (horas === 0) return `${minutos} min`;
  if (minutos === 0) return `${horas} h`;
  return `${horas} h ${minutos} min`;
}

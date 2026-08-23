"use client";

import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Editor de lista de ítems (uno por línea al persistir).
 * Maneja un arreglo de textos: agregar, quitar y reordenar.
 */
export function CampoLista({
  etiqueta,
  descripcion,
  items,
  onCambiar,
  placeholder,
  marca = "•",
  marcaColor = "var(--muted-foreground)",
}: {
  etiqueta: string;
  descripcion?: string;
  items: string[];
  onCambiar: (items: string[]) => void;
  placeholder?: string;
  marca?: string;
  marcaColor?: string;
}) {
  const [borrador, setBorrador] = useState("");

  const agregar = () => {
    const valor = borrador.trim();
    if (!valor) return;
    onCambiar([...items, valor]);
    setBorrador("");
  };

  const quitar = (indice: number) =>
    onCambiar(items.filter((_, i) => i !== indice));

  const mover = (indice: number, delta: number) => {
    const destino = indice + delta;
    if (destino < 0 || destino >= items.length) return;
    const copia = [...items];
    [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
    onCambiar(copia);
  };

  const editar = (indice: number, valor: string) =>
    onCambiar(items.map((item, i) => (i === indice ? valor : item)));

  return (
    <div className="grid gap-2">
      <Label>{etiqueta}</Label>
      {descripcion && (
        <p className="text-muted-foreground text-xs">{descripcion}</p>
      )}

      {items.length > 0 && (
        <ul className="grid gap-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span
                className="w-4 shrink-0 text-center text-sm font-bold"
                style={{ color: marcaColor }}
                aria-hidden
              >
                {marca}
              </span>
              <Input
                value={item}
                onChange={(e) => editar(i, e.target.value)}
                className="flex-1"
              />
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  disabled={i === 0}
                  onClick={() => mover(i, -1)}
                  aria-label="Subir"
                >
                  <ChevronUpIcon />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  disabled={i === items.length - 1}
                  onClick={() => mover(i, 1)}
                  aria-label="Bajar"
                >
                  <ChevronDownIcon />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive size-7"
                  onClick={() => quitar(i)}
                  aria-label="Quitar"
                >
                  <Trash2Icon />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2">
        <Input
          value={borrador}
          placeholder={placeholder ?? "Escribe un ítem y presiona Enter"}
          onChange={(e) => setBorrador(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              agregar();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={agregar} disabled={!borrador.trim()}>
          <PlusIcon />
          Agregar
        </Button>
      </div>
    </div>
  );
}

/** Convierte texto multilínea guardado en el backend a lista de ítems. */
export function aListaItems(texto?: string | null): string[] {
  if (!texto) return [];
  return texto
    .split(/\r?\n/)
    .map((linea) => linea.replace(/^[\s•\-*]+/, "").trim())
    .filter(Boolean);
}

/** Une la lista en el texto multilínea que espera el backend. */
export function deListaItems(items: string[]): string | undefined {
  const limpio = items.map((i) => i.trim()).filter(Boolean);
  return limpio.length ? limpio.join("\n") : undefined;
}

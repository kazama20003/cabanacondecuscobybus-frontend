"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* Un solo campo donde se pega directo lo que copia Google Maps:
   "-13.562564244226659, -72.6910262052409" → separa lat y lng. */
export function CampoCoordenadas({
  etiqueta,
  latitud,
  longitud,
  onCambiar,
  requerido = true,
}: {
  etiqueta: string;
  latitud: string;
  longitud: string;
  onCambiar: (latitud: string, longitud: string) => void;
  requerido?: boolean;
}) {
  const texto = latitud && longitud ? `${latitud}, ${longitud}` : latitud;

  const procesar = (valor: string) => {
    const partes = valor.split(/[,;\s]+/).filter(Boolean);
    if (partes.length >= 2) {
      const lat = partes[0];
      const lng = partes[1];
      if (!isNaN(Number(lat)) && !isNaN(Number(lng))) {
        onCambiar(lat, lng);
        return;
      }
    }
    onCambiar(valor, "");
  };

  const valida =
    latitud !== "" &&
    longitud !== "" &&
    Math.abs(Number(latitud)) <= 90 &&
    Math.abs(Number(longitud)) <= 180;

  return (
    <div className="grid gap-2">
      <Label>{etiqueta}</Label>
      <Input
        required={requerido}
        placeholder="-13.562564, -72.691026 (pega desde Google Maps)"
        value={texto}
        onChange={(e) => procesar(e.target.value)}
        aria-invalid={texto !== "" && !valida}
      />
      {texto !== "" && !valida && (
        <p className="text-destructive text-xs">
          Pega las dos coordenadas separadas por coma, como las copia Google Maps.
        </p>
      )}
    </div>
  );
}

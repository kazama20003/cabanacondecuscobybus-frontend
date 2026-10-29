"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/native-ui/card";
import { Input } from "@/components/native-ui/input";
import { Button } from "@/components/native-ui/button";
import { Skeleton } from "@/components/native-ui/skeleton";
import { useActualizarSalida, useSalidasAdmin } from "@/hooks/use-catalogo";
import type { SalidaAdminApi } from "@/lib/api";

function FilaPrecio({ salida, tipo }: { salida: SalidaAdminApi; tipo: "TRANSPORTE" | "TOUR" }) {
  const actualizar = useActualizarSalida();
  const [pen, setPen] = useState(String(salida.precioPen));
  const [usd, setUsd] = useState(String(salida.precioUsd));
  const guardar = () => {
    const precioPen = Number(pen);
    const precioUsd = Number(usd);
    if (!Number.isFinite(precioPen) || precioPen < 0 || !Number.isFinite(precioUsd) || precioUsd < 0) return;
    if (precioPen === Number(salida.precioPen) && precioUsd === Number(salida.precioUsd)) return;
    actualizar.mutate(
      { tipo: tipo === "TOUR" ? "tour" : "transporte", id: salida.id, cambios: { precioPen, precioUsd } },
      { onSuccess: (actualizada) => { setPen(String(actualizada.precioPen)); setUsd(String(actualizada.precioUsd)); } },
    );
  };

  return (
    <div className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_130px_130px_auto] sm:items-center">
      <div className="text-sm">
        <p className="font-medium">{new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(salida.fechaHoraSalida))}</p>
        <p className="text-muted-foreground text-xs">{salida.estado} · {salida.ocupados} pasajeros</p>
      </div>
      <label className="grid gap-1 text-xs">Precio S/
        <Input aria-label="Precio en soles" type="number" min="0" step="0.01" value={pen} onChange={(e) => setPen(e.target.value)} />
      </label>
      <label className="grid gap-1 text-xs">Precio US$
        <Input aria-label="Precio en dólares" type="number" min="0" step="0.01" value={usd} onChange={(e) => setUsd(e.target.value)} />
      </label>
      <Button type="button" size="sm" onClick={guardar} disabled={actualizar.isPending}>Guardar precio</Button>
      {actualizar.isError && <p role="alert" className="text-destructive text-xs sm:col-span-4">{actualizar.error.message}</p>}
    </div>
  );
}

export function PreciosServicio({ tipo, servicioId }: { tipo: "TRANSPORTE" | "TOUR"; servicioId: string }) {
  const { data, isLoading, isError, error } = useSalidasAdmin({ tipo, servicioId, pagina: 1, porPagina: 20 });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Precios por salida</CardTitle>
        <CardDescription>Cada fecha puede tener un precio distinto. Ajusta soles y dólares sin crear otra salida.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {isLoading && <Skeleton className="h-20 w-full" />}
        {isError && <p role="alert" className="text-destructive text-sm">No se pudieron cargar los precios: {error.message}</p>}
        {data?.datos.length === 0 && <p className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">Este producto aún no tiene salidas. Crea una salida o un horario recurrente para definir fechas y precios.</p>}
        {data?.datos.map((salida) => <FilaPrecio key={salida.id} salida={salida} tipo={tipo} />)}
        {data && data.total > data.datos.length && <p className="text-muted-foreground text-xs">Mostrando 20 salidas de {data.total}. El resto se administra en Control de salidas.</p>}
      </CardContent>
    </Card>
  );
}

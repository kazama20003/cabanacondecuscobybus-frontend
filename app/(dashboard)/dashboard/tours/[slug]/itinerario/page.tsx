"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { CampoCoordenadas } from "@/components/dashboard/campo-coordenadas";
import { CampoMedios } from "@/components/dashboard/campo-medios";
import { useDefinirItinerario, useTour } from "@/hooks/use-catalogo";
import type { ItinerarioApi, MedioEntrada } from "@/lib/api";

interface FilaItem {
  titulo: string;
  descripcion: string;
  latitud: string;
  longitud: string;
  medios: MedioEntrada[];
}

const itemVacio: FilaItem = { titulo: "", descripcion: "", latitud: "", longitud: "", medios: [] };

export default function PaginaItinerario({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: tour, isLoading } = useTour(slug);
  const [filas, setFilas] = useState<FilaItem[]>([]);
  const definir = useDefinirItinerario();

  useEffect(() => {
    if (!tour) return;
    const items = tour.itinerarios ?? [];
    setFilas(
      items.length
        ? items.map((i) => ({
            titulo: i.titulo,
            descripcion: i.descripcion,
            latitud: i.latitud != null ? String(i.latitud) : "",
            longitud: i.longitud != null ? String(i.longitud) : "",
            medios: i.imagenes?.map(({ url, clave, textoAlterno, tipo }) => ({ url, clave: clave ?? undefined, textoAlterno: textoAlterno ?? undefined, tipo })) ?? [],
          }))
        : [{ ...itemVacio }],
    );
  }, [tour]);

  const cambiar = (i: number, clave: keyof FilaItem, valor: string) =>
    setFilas((f) => f.map((fila, j) => (j === i ? { ...fila, [clave]: valor } : fila)));

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;
    definir.mutate(
      {
        tourId: tour.id,
        items: filas.map((f) => ({
          titulo: f.titulo,
          descripcion: f.descripcion,
          latitud: f.latitud ? Number(f.latitud) : undefined,
          longitud: f.longitud ? Number(f.longitud) : undefined,
          medios: f.medios.length ? f.medios : undefined,
        })),
      },
      { onSuccess: () => router.push("/dashboard/tours") },
    );
  };

  if (isLoading || !tour) {
    return (
      <div className="flex flex-col gap-4 p-4 lg:p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full max-w-3xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/tours">
            <ArrowLeftIcon />
            Volver a tours
          </Link>
        </Button>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Itinerario: {String(tour.nombre ?? tour.destinoNombre ?? tour.slug)}</CardTitle>
          <CardDescription>
            Paso a paso de lo que vive el turista. El orden de la lista es el
            orden del día. Las coordenadas son opcionales (para el mapa).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={guardar} className="grid gap-4">
            {filas.map((fila, i) => (
              <div key={i} className="grid gap-3 rounded-xl border bg-muted/20 p-4 md:grid-cols-2">
                <div className="flex items-center justify-between md:col-span-2">
                  <span className="text-muted-foreground text-xs font-semibold">
                    PASO {i + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive size-7"
                    onClick={() => setFilas((f) => f.filter((_, j) => j !== i))}
                    aria-label="Quitar paso"
                  >
                    <Trash2Icon />
                  </Button>
                </div>
                <div className="grid gap-2">
                  <Label>Título del paso</Label>
                  <Input
                    required
                    placeholder="Visita a las Salineras de Maras"
                    value={fila.titulo}
                    onChange={(e) => cambiar(i, "titulo", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Descripción</Label>
                  <Textarea
                    required
                    rows={3}
                    placeholder="Recorrido guiado de 1 hora por las pozas de sal, tiempo libre para fotos…"
                    value={fila.descripcion}
                    onChange={(e) => cambiar(i, "descripcion", e.target.value)}
                  />
                </div>
                <CampoCoordenadas
                  etiqueta="Coordenadas (opcional)"
                  requerido={false}
                  latitud={fila.latitud}
                  longitud={fila.longitud}
                  onCambiar={(lat, lng) => {
                    cambiar(i, "latitud", lat);
                    cambiar(i, "longitud", lng);
                  }}
                />
                <div className="md:col-span-2 rounded-lg border bg-background p-3">
                  <CampoMedios
                    categoria="tours"
                    medios={fila.medios}
                    onCambiar={(medios) => setFilas((actuales) => actuales.map((item, indice) => indice === i ? { ...item, medios } : item))}
                    soloImagenes
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => setFilas((f) => [...f, { ...itemVacio }])}
            >
              <PlusIcon />
              Agregar paso
            </Button>

            {definir.isError && (
              <p className="text-destructive text-sm">{definir.error.message}</p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={definir.isPending || filas.length === 0}>
                {definir.isPending ? "Guardando…" : "Guardar itinerario"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/tours">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

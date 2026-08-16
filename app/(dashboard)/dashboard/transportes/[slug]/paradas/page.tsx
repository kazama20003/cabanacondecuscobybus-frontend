"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ExternalLinkIcon, PlusIcon, Trash2Icon } from "lucide-react";
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
import { CampoCoordenadas } from "@/components/dashboard/campo-coordenadas";
import { CampoDuracion } from "@/components/dashboard/campo-duracion";
import { CampoMedios } from "@/components/dashboard/campo-medios";
import { useDefinirParadas, useTransporte } from "@/hooks/use-catalogo";
import type { MedioEntrada } from "@/lib/api";

interface FilaParada {
  nombre: string;
  latitud: string;
  longitud: string;
  minutos: string;
  duracionParadaMinutos: string;
  descripcion: string;
  medios: MedioEntrada[];
}

const filaVacia: FilaParada = {
  nombre: "",
  latitud: "",
  longitud: "",
  minutos: "",
  duracionParadaMinutos: "",
  descripcion: "",
  medios: [],
};

/* Link de Google Maps con la ruta completa: origen → paradas → destino */
function urlRutaMaps(
  origen: { lat: unknown; lng: unknown },
  destino: { lat: unknown; lng: unknown },
  paradas: FilaParada[],
): string {
  const punto = (lat: unknown, lng: unknown) => `${lat},${lng}`;
  const waypoints = paradas
    .filter((p) => p.latitud && p.longitud)
    .map((p) => punto(p.latitud, p.longitud))
    .join("|");
  const params = new URLSearchParams({
    api: "1",
    origin: punto(origen.lat, origen.lng),
    destination: punto(destino.lat, destino.lng),
  });
  if (waypoints) params.set("waypoints", waypoints);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export default function PaginaParadas({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: transporte, isLoading } = useTransporte(slug);
  const [filas, setFilas] = useState<FilaParada[]>([]);
  const definir = useDefinirParadas();

  useEffect(() => {
    if (!transporte) return;
    const existentes = (transporte.paradas ?? []).map((p) => ({
      nombre: p.nombre,
      latitud: String(p.latitud),
      longitud: String(p.longitud),
      minutos: String(p.minutos),
      duracionParadaMinutos: String(p.duracionParadaMinutos ?? 0),
      descripcion: p.descripcion ?? "",
      medios: p.imagenes?.map(({ url, clave, textoAlterno, tipo }) => ({ url, clave: clave ?? undefined, textoAlterno: textoAlterno ?? undefined, tipo })) ?? [],
    }));
    setFilas(existentes.length ? existentes : [{ ...filaVacia }]);
  }, [transporte]);

  const cambiar = (indice: number, clave: keyof FilaParada, valor: string) =>
    setFilas((f) =>
      f.map((fila, i) => (i === indice ? { ...fila, [clave]: valor } : fila)),
    );

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transporte) return;
    definir.mutate(
      {
        transporteId: transporte.id,
        paradas: filas.map((f) => ({
          nombre: f.nombre,
          latitud: Number(f.latitud),
          longitud: Number(f.longitud),
          minutos: Number(f.minutos),
          duracionParadaMinutos: f.duracionParadaMinutos
            ? Number(f.duracionParadaMinutos)
            : 0,
          descripcion: f.descripcion || undefined,
          medios: f.medios.length ? f.medios : undefined,
        })),
      },
      { onSuccess: () => router.push("/dashboard/transportes") },
    );
  };

  if (isLoading || !transporte) {
    return (
      <div className="flex flex-col gap-4 p-4 lg:p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/transportes">
            <ArrowLeftIcon />
            Volver a transportes
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a
            href={urlRutaMaps(
              { lat: transporte.origenLatitud, lng: transporte.origenLongitud },
              { lat: transporte.destinoLatitud, lng: transporte.destinoLongitud },
              filas,
            )}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLinkIcon />
            Ver ruta en Google Maps
          </a>
        </Button>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>
            Paradas: {transporte.origenNombre} → {transporte.destinoNombre}
          </CardTitle>
          <CardDescription>
            El orden de la lista es el orden del recorrido. "Minuto del viaje"
            es el tiempo desde la salida; "Duración" cuánto se detiene el bus
            (fotos, miradores, desayuno…).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={guardar} className="grid gap-4">
            {filas.map((fila, i) => (
              <div key={i} className="grid gap-3 rounded-xl border bg-muted/20 p-4 md:grid-cols-2">
                <div className="flex items-center justify-between md:col-span-2">
                  <span className="text-muted-foreground text-xs font-semibold">
                    PARADA {i + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive size-7"
                    onClick={() => setFilas((f) => f.filter((_, j) => j !== i))}
                    aria-label="Quitar parada"
                  >
                    <Trash2Icon />
                  </Button>
                </div>
                <div className="grid gap-2">
                  <Label>Nombre del punto</Label>
                  <Input
                    required
                    placeholder="Mirador de los Andes"
                    value={fila.nombre}
                    onChange={(e) => cambiar(i, "nombre", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 rounded-lg border bg-background p-3">
                  <CampoMedios
                    categoria="transportes"
                    medios={fila.medios}
                    onCambiar={(medios) => setFilas((actuales) => actuales.map((parada, indice) => indice === i ? { ...parada, medios } : parada))}
                    soloImagenes
                  />
                </div>
                <CampoCoordenadas
                  etiqueta="Coordenadas del punto"
                  latitud={fila.latitud}
                  longitud={fila.longitud}
                  onCambiar={(lat, lng) => {
                    cambiar(i, "latitud", lat);
                    cambiar(i, "longitud", lng);
                  }}
                />
                <div className="grid grid-cols-2 gap-2">
                  <CampoDuracion
                    etiqueta="Tiempo desde la salida"
                    minutosTotales={fila.minutos}
                    onCambiar={(v) => cambiar(i, "minutos", v)}
                  />
                  <CampoDuracion
                    etiqueta="Cuánto se detiene"
                    minutosTotales={fila.duracionParadaMinutos}
                    onCambiar={(v) => cambiar(i, "duracionParadaMinutos", v)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Qué se hace aquí</Label>
                  <Input
                    placeholder="Parada para fotos del cañón y baños"
                    value={fila.descripcion}
                    onChange={(e) => cambiar(i, "descripcion", e.target.value)}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => setFilas((f) => [...f, { ...filaVacia }])}
            >
              <PlusIcon />
              Agregar parada
            </Button>

            {definir.isError && (
              <p className="text-destructive text-sm">{definir.error.message}</p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={definir.isPending || filas.length === 0}>
                {definir.isPending ? "Guardando…" : "Guardar paradas"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/transportes">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDaysIcon, ImageIcon, PauseIcon, PlayIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Paginacion } from "@/components/dashboard/paginacion";
import ImageSlot from "@/components/image-slot";
import { useActualizarEstadoEvento, useEventosAdmin } from "@/hooks/use-catalogo";
import type { TourApi } from "@/lib/api";

function titulo(evento: TourApi) {
  return evento.traducciones?.find((item) => item.idioma === "es")?.titulo ??
    String(evento.destinoNombre ?? evento.slug);
}

function fecha(valor?: string | null) {
  if (!valor) return "Sin fecha";
  const date = new Date(valor);
  return Number.isNaN(date.getTime()) ? "Sin fecha" : date.toLocaleDateString("es-PE", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });
}

function estadoTemporada(evento: TourApi) {
  if (!evento.temporadaInicio || !evento.temporadaFin) return "Fechas incompletas";
  const hoy = new Date();
  hoy.setUTCHours(0, 0, 0, 0);
  const inicio = new Date(evento.temporadaInicio);
  const fin = new Date(evento.temporadaFin);
  if (fin < hoy) return "Temporada pasada";
  if (inicio > hoy) return "Programado";
  return "En temporada";
}

export default function PaginaEventosEspeciales() {
  const [pagina, setPagina] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } = useEventosAdmin({ pagina, porPagina: 10 });
  const cambiarEstado = useActualizarEstadoEvento();
  const eventos = data?.datos ?? [];

  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em]">
            <CalendarDaysIcon className="size-4" /> Calendario de temporada
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Eventos especiales</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Programa celebraciones con fechas limitadas, como la procesión del Señor de los Milagros o el aniversario de Arequipa. Añade imágenes y videos, y crea sus salidas con fecha y precio.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/eventos/nuevo"><PlusIcon /> Programar evento</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agenda de eventos</CardTitle>
          <CardDescription>Las fechas definen cuándo se muestra cada evento en el sitio. Las salidas y tarifas se programan por separado.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="space-y-2"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>}
          {isError && (
            <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
              <span className="text-destructive">No se pudieron cargar los eventos: {error.message}</span>
              <Button type="button" variant="outline" size="sm" disabled={isFetching} onClick={() => void refetch()}>
                {isFetching ? "Conectando…" : "Reintentar"}
              </Button>
            </div>
          )}
          {cambiarEstado.isError && <p role="alert" className="text-destructive mb-3 text-sm">{cambiarEstado.error.message}</p>}
          {data && eventos.length === 0 && (
            <div className="rounded-xl border border-dashed px-5 py-12 text-center">
              <CalendarDaysIcon className="text-muted-foreground mx-auto mb-3 size-8" />
              <p className="font-medium">Aún no hay eventos programados</p>
              <p className="text-muted-foreground mt-1 text-sm">Crea la primera fecha especial y añade su contenido multimedia.</p>
              <Button asChild className="mt-4"><Link href="/dashboard/eventos/nuevo"><PlusIcon /> Crear evento</Link></Button>
            </div>
          )}
          {eventos.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Evento</TableHead><TableHead>Temporada</TableHead><TableHead>Multimedia</TableHead><TableHead>Salidas</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">Acciones</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {eventos.map((evento) => {
                    const media = evento.imagenes?.[0];
                    const estado = estadoTemporada(evento);
                    return (
                      <TableRow key={evento.id}>
                        <TableCell>
                          <div className="flex min-w-56 items-center gap-3">
                            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                              <ImageSlot src={media?.tipo === "VIDEO" ? undefined : media?.url} video={media?.tipo === "VIDEO" ? media.url : undefined} placeholder={titulo(evento)} radius={8} />
                            </div>
                            <div className="min-w-0"><p className="truncate font-medium">{titulo(evento)}</p><p className="text-muted-foreground truncate text-xs">{String(evento.destinoNombre ?? "")}</p></div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-48 text-sm">
                          {fecha(evento.temporadaInicio)}<span className="text-muted-foreground mx-1">→</span>{fecha(evento.temporadaFin)}
                        </TableCell>
                        <TableCell><span className="inline-flex items-center gap-1.5 text-sm"><ImageIcon className="size-4" />{evento.imagenes?.length ?? 0}</span></TableCell>
                        <TableCell>{evento.salidas?.length ?? 0}</TableCell>
                        <TableCell><Badge variant={estado === "En temporada" ? "default" : estado === "Temporada pasada" ? "secondary" : "outline"}>{evento.activo === false ? "Inactivo" : estado}</Badge></TableCell>
                        <TableCell>
                          <div className="flex min-w-52 justify-end gap-2">
                            <Button variant="outline" size="sm" asChild><Link href={`/dashboard/tours/${evento.slug}/editar`}>Editar</Link></Button>
                            {evento.activo !== false ? (
                              <>
                                <Button size="sm" asChild><Link href={`/dashboard/salidas/nueva?tipo=TOUR&servicioId=${encodeURIComponent(evento.id)}`}>Programar salida</Link></Button>
                                <Button variant="ghost" size="icon" aria-label="Pausar evento" title="Pausar evento" disabled={cambiarEstado.isPending} onClick={() => cambiarEstado.mutate({ id: evento.id, activo: false })}><PauseIcon /></Button>
                              </>
                            ) : (
                              <Button size="sm" variant="outline" disabled={cambiarEstado.isPending} onClick={() => cambiarEstado.mutate({ id: evento.id, activo: true })}><PlayIcon /> Reactivar</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
          {data && <Paginacion resultado={data} onCambiarPagina={setPagina} />}
        </CardContent>
      </Card>
    </div>
  );
}

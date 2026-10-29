"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDaysIcon, ImageIcon, PauseIcon, PlayIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/native-ui/badge";
import { Button } from "@/components/native-ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/native-ui/card";
import { Skeleton } from "@/components/native-ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/native-ui/table";
import { Paginacion } from "@/components/dashboard/paginacion";
import ImageSlot from "@/components/image-slot";
import { useActualizarEstadoEvento, useEventosAdmin } from "@/hooks/use-catalogo";
import type { TourApi } from "@/lib/api";
import { ControlOrdenCatalogo } from "@/components/dashboard/control-orden-catalogo";

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
  const activos = eventos.filter((evento) => evento.activo !== false).length;
  const salidasProgramadas = eventos.reduce((total, evento) => total + (evento.salidas?.length ?? 0), 0);
  const mediosCargados = eventos.reduce((total, evento) => total + (evento.imagenes?.length ?? 0), 0);
  const proximos = eventos.filter((evento) => estadoTemporada(evento) === "Programado").length;

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

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: "Eventos activos", value: activos, hint: "En esta página", icon: CalendarDaysIcon },
          { label: "Próximas temporadas", value: proximos, hint: "Aún por comenzar", icon: PlayIcon },
          { label: "Salidas programadas", value: salidasProgramadas, hint: "Con fecha y tarifa", icon: PlusIcon },
          { label: "Fotos y videos", value: mediosCargados, hint: "Contenido cargado", icon: ImageIcon },
        ].map(({ label, value, hint, icon: Icon }) => (
          <Card key={label} className="overflow-hidden">
            <CardContent className="flex items-center justify-between gap-3 p-4 sm:p-5">
              <div className="min-w-0"><p className="text-muted-foreground truncate text-xs font-medium">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{isLoading ? "—" : value}</p><p className="text-muted-foreground mt-1 text-xs">{hint}</p></div>
              <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-xl"><Icon className="size-5" /></span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
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
            <>
            <div className="space-y-3 md:hidden">
              {eventos.map((evento) => {
                const media = evento.imagenes?.[0];
                const estado = estadoTemporada(evento);
                return (
                  <article key={evento.id} className="rounded-xl border p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted"><ImageSlot src={media?.tipo === "VIDEO" ? undefined : media?.url} video={media?.tipo === "VIDEO" ? media.url : undefined} placeholder={titulo(evento)} radius={8} /></div>
                      <div className="min-w-0 flex-1"><p className="truncate font-medium">{titulo(evento)}</p><p className="text-muted-foreground truncate text-xs">{String(evento.destinoNombre ?? "")}</p></div>
                      <Badge variant={evento.activo === false ? "secondary" : estado === "En temporada" ? "default" : "outline"}>{evento.activo === false ? "Inactivo" : estado}</Badge>
                    </div>
                    <div className="text-muted-foreground mt-3 grid grid-cols-2 gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5"><CalendarDaysIcon className="size-3.5" />{fecha(evento.temporadaInicio)} – {fecha(evento.temporadaFin)}</span>
                      <span className="inline-flex items-center gap-1.5"><ImageIcon className="size-3.5" />{evento.imagenes?.length ?? 0} medios · {evento.salidas?.length ?? 0} salidas</span>
                    </div>
                    <div className="mt-3 border-t pt-3">
                      <ControlOrdenCatalogo id={evento.id} tipo="EVENTO" posicion={(pagina - 1) * 10 + eventos.indexOf(evento) + 1} primero={pagina === 1 && eventos.indexOf(evento) === 0} ultimo={(pagina - 1) * 10 + eventos.indexOf(evento) + 1 === (data?.total ?? 0)} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                      <Button variant="outline" size="sm" asChild><Link href={`/dashboard/tours/${evento.slug}/editar`}>Editar evento</Link></Button>
                      <Button variant="outline" size="sm" asChild><Link href={`/dashboard/tours/${evento.slug}/itinerario`}>Itinerario y multimedia</Link></Button>
                      {evento.activo !== false ? <>
                        <Button size="sm" asChild><Link href={`/dashboard/salidas/nueva?tipo=TOUR&servicioId=${encodeURIComponent(evento.id)}`}>Programar salida</Link></Button>
                        <Button variant="ghost" size="icon" aria-label="Pausar evento" title="Pausar evento" disabled={cambiarEstado.isPending} onClick={() => cambiarEstado.mutate({ id: evento.id, activo: false })}><PauseIcon /></Button>
                      </> : <Button size="sm" variant="outline" disabled={cambiarEstado.isPending} onClick={() => cambiarEstado.mutate({ id: evento.id, activo: true })}><PlayIcon /> Reactivar</Button>}
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Evento</TableHead><TableHead>Temporada</TableHead><TableHead>Multimedia</TableHead><TableHead>Salidas</TableHead><TableHead>Estado</TableHead><TableHead>Orden público</TableHead><TableHead className="text-right">Acciones</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {eventos.map((evento, index) => {
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
                        <TableCell><ControlOrdenCatalogo id={evento.id} tipo="EVENTO" posicion={(pagina - 1) * 10 + index + 1} primero={pagina === 1 && index === 0} ultimo={(pagina - 1) * 10 + index + 1 === (data?.total ?? 0)} /></TableCell>
                        <TableCell>
                          <div className="flex min-w-52 justify-end gap-2">
                            <Button variant="outline" size="sm" asChild><Link href={`/dashboard/tours/${evento.slug}/editar`}>Editar</Link></Button>
                            <Button variant="outline" size="sm" asChild><Link href={`/dashboard/tours/${evento.slug}/itinerario`}>Itinerario</Link></Button>
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
            </>
          )}
          {data && <Paginacion resultado={data} onCambiarPagina={setPagina} />}
        </CardContent>
      </Card>
    </div>
  );
}

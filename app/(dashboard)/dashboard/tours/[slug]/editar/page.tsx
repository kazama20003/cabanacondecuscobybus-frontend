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
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { CampoCoordenadas } from "@/components/dashboard/campo-coordenadas";
import { CampoDuracion } from "@/components/dashboard/campo-duracion";
import { CampoMedios } from "@/components/dashboard/campo-medios";
import { useActualizarTour, useDefinirItinerario, useTour } from "@/hooks/use-catalogo";
import type { ContenidoEntrada, ImagenApi, MedioEntrada } from "@/lib/api";

const textoDe = (valor: unknown) => (valor == null ? "" : String(valor));

export default function PaginaEditarTour({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: tour, isLoading, isError, error } = useTour(slug);
  const actualizar = useActualizarTour();
  const definirItinerario = useDefinirItinerario();

  const [campos, setCampos] = useState({
    destinoNombre: "",
    destinoLatitud: "",
    destinoLongitud: "",
    duracionMinutos: "",
  });
  const [esEvento, setEsEvento] = useState(false);
  const [temporada, setTemporada] = useState({ inicio: "", fin: "" });
  const [medios, setMedios] = useState<MedioEntrada[]>([]);
  const [contenido, setContenido] = useState<ContenidoEntrada>({ titulo: "", resumen: "", descripcion: "", queLlevar: "", incluye: "", noIncluye: "" });
  const [puntos, setPuntos] = useState<{ titulo: string; descripcion: string; latitud: string; longitud: string; medios?: MedioEntrada[] }[]>([]);
  const [errorMedios, setErrorMedios] = useState<string | null>(null);
  const [errorDetalle, setErrorDetalle] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (!tour || listo) return;
    setCampos({
      destinoNombre: textoDe(tour.destinoNombre),
      destinoLatitud: textoDe(tour.destinoLatitud),
      destinoLongitud: textoDe(tour.destinoLongitud),
      duracionMinutos: textoDe(tour.duracionMinutos),
    });
    setEsEvento(Boolean(tour.esEvento));
    const traduccion = tour.traducciones?.find((item) => item.idioma === "es") ?? tour.traducciones?.[0];
    setContenido({
      titulo: textoDe(traduccion?.titulo),
      resumen: textoDe(traduccion?.resumen),
      descripcion: textoDe(traduccion?.descripcion),
      queLlevar: textoDe(traduccion?.queLlevar),
      incluye: textoDe(traduccion?.incluye),
      noIncluye: textoDe(traduccion?.noIncluye),
    });
    setTemporada({
      inicio: textoDe(tour.temporadaInicio).slice(0, 10),
      fin: textoDe(tour.temporadaFin).slice(0, 10),
    });
    setMedios(
      (tour.imagenes ?? []).map((imagen: ImagenApi) => ({
        url: imagen.url,
        clave: imagen.clave ?? undefined,
        textoAlterno: imagen.textoAlterno ?? undefined,
        tipo: imagen.tipo,
      })),
    );
    setPuntos((tour.itinerarios ?? []).map((punto) => ({
      titulo: punto.titulo,
      descripcion: punto.descripcion ?? "",
      latitud: textoDe(punto.latitud),
      longitud: textoDe(punto.longitud),
      medios: (punto.imagenes ?? []).map((imagen: ImagenApi) => ({ url: imagen.url, clave: imagen.clave ?? undefined, textoAlterno: imagen.textoAlterno ?? undefined, tipo: imagen.tipo })),
    })));
    setListo(true);
  }, [tour, listo]);

  const cambiar =
    (clave: keyof typeof campos) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setCampos((c) => ({ ...c, [clave]: e.target.value }));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;
    if (medios.length === 0) {
      setErrorMedios("Sube al menos una imagen o un video principal.");
      return;
    }
    setErrorMedios(null);
    setErrorDetalle(null);
    try {
      await actualizar.mutateAsync({
        id: String(tour.id),
        datos: {
          destinoNombre: campos.destinoNombre,
          destinoLatitud: Number(campos.destinoLatitud),
          destinoLongitud: Number(campos.destinoLongitud),
          duracionMinutos: Number(campos.duracionMinutos),
          esEvento,
          temporadaInicio: esEvento ? temporada.inicio || null : null,
          temporadaFin: esEvento ? temporada.fin || null : null,
          medios,
          ...(esEvento && { contenido: { ...contenido, titulo: contenido.titulo.trim() } }),
        },
      });
      if (esEvento) {
        await definirItinerario.mutateAsync({
          tourId: String(tour.id),
          items: puntos.map((punto) => ({
            titulo: punto.titulo.trim(),
            descripcion: punto.descripcion.trim(),
            ...(punto.latitud !== "" && { latitud: Number(punto.latitud) }),
            ...(punto.longitud !== "" && { longitud: Number(punto.longitud) }),
            ...(punto.medios?.length && { medios: punto.medios }),
          })),
        });
      }
      router.push(esEvento ? "/dashboard/eventos" : "/dashboard/tours");
    } catch (error) {
      setErrorDetalle(error instanceof Error ? error.message : "No se pudieron guardar todos los detalles.");
    }
  };

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

      {isLoading && <Skeleton className="h-96 w-full max-w-3xl" />}
      {isError && (
        <p className="text-destructive text-sm">
          No se pudo cargar el tour: {error.message}
        </p>
      )}

      {tour && (
        <form onSubmit={enviar} className="grid max-w-3xl gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{esEvento ? "Editar evento turístico" : "Editar tour"}</CardTitle>
              <CardDescription>
                Slug: <span className="font-mono">{textoDe(tour.slug)}</span> (no editable).
                {esEvento ? " Completa la información que necesita el viajero antes de reservar." : " Para textos y traducciones usa el botón \"Traducciones\" de la lista."}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="destinoNombre">Destino</Label>
                <Input
                  id="destinoNombre"
                  required
                  value={campos.destinoNombre}
                  onChange={cambiar("destinoNombre")}
                />
              </div>
              <CampoCoordenadas
                etiqueta="Coordenadas del destino"
                latitud={campos.destinoLatitud}
                longitud={campos.destinoLongitud}
                onCambiar={(lat, lng) =>
                  setCampos((c) => ({ ...c, destinoLatitud: lat, destinoLongitud: lng }))
                }
              />
              <CampoDuracion
                etiqueta="Duración del tour"
                requerido
                minutosTotales={campos.duracionMinutos}
                onCambiar={(minutos) =>
                  setCampos((c) => ({ ...c, duracionMinutos: minutos }))
                }
              />
              <div className="rounded-lg border bg-muted/20 p-3">
                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5 size-4"
                    checked={esEvento}
                    onChange={(e) => setEsEvento(e.target.checked)}
                  />
                  <span>
                    <span className="font-medium">Es un evento</span>
                    <span className="text-muted-foreground block text-xs">
                      Actividad estacional o de fechas puntuales. Aparece en la
                      sección Eventos del sitio.
                    </span>
                  </span>
                </label>
                {esEvento && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="temporadaInicio">Temporada desde</Label>
                      <Input
                        id="temporadaInicio"
                        type="date"
                        value={temporada.inicio}
                        onChange={(e) =>
                          setTemporada((t) => ({ ...t, inicio: e.target.value }))
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="temporadaFin">Temporada hasta</Label>
                      <Input
                        id="temporadaFin"
                        type="date"
                        value={temporada.fin}
                        onChange={(e) =>
                          setTemporada((t) => ({ ...t, fin: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {esEvento && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Información para viajeros</CardTitle>
                  <CardDescription>Estos textos aparecen en la ficha pública del evento y se preparan para los idiomas del sitio.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2"><Label htmlFor="event-title">Nombre del evento</Label><Input id="event-title" required maxLength={160} value={contenido.titulo} onChange={(e) => setContenido((c) => ({ ...c, titulo: e.target.value }))} /></div>
                  <div className="grid gap-2"><Label htmlFor="event-summary">Resumen</Label><Input id="event-summary" required maxLength={240} value={contenido.resumen} onChange={(e) => setContenido((c) => ({ ...c, resumen: e.target.value }))} /></div>
                  <div className="grid gap-2"><Label htmlFor="event-description">Descripción de la experiencia</Label><Textarea id="event-description" required rows={5} value={contenido.descripcion} onChange={(e) => setContenido((c) => ({ ...c, descripcion: e.target.value }))} /></div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2"><Label htmlFor="event-includes">Qué incluye · un concepto por línea</Label><Textarea id="event-includes" rows={4} value={contenido.incluye} onChange={(e) => setContenido((c) => ({ ...c, incluye: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="event-excludes">Qué no incluye · un concepto por línea</Label><Textarea id="event-excludes" rows={4} value={contenido.noIncluye} onChange={(e) => setContenido((c) => ({ ...c, noIncluye: e.target.value }))} /></div>
                  </div>
                  <div className="grid gap-2"><Label htmlFor="event-bring">Recomendaciones y qué llevar</Label><Textarea id="event-bring" rows={3} placeholder="Ropa adecuada, altitud, clima y recomendaciones para respetar las costumbres locales." value={contenido.queLlevar} onChange={(e) => setContenido((c) => ({ ...c, queLlevar: e.target.value }))} /></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div><CardTitle>Recorrido y experiencias</CardTitle><CardDescription>Describe las paradas, actividades y lugares que visitará el viajero.</CardDescription></div>
                    <Button type="button" variant="outline" size="sm" onClick={() => setPuntos((actuales) => [...actuales, { titulo: "", descripcion: "", latitud: "", longitud: "" }])}><PlusIcon /> Añadir punto</Button>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {puntos.length === 0 && <p className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">Aún no hay puntos. Añade el lugar de encuentro y las paradas del recorrido.</p>}
                  {puntos.map((punto, indice) => (
                    <div key={indice} className="grid gap-3 rounded-xl border bg-muted/20 p-3 sm:p-4">
                      <div className="flex items-center justify-between gap-2"><Label htmlFor={`event-stop-${indice}`}>Punto {indice + 1}</Label><Button type="button" variant="ghost" size="icon" aria-label={`Eliminar punto ${indice + 1}`} onClick={() => setPuntos((actuales) => actuales.filter((_, i) => i !== indice))}><Trash2Icon /></Button></div>
                      <Input id={`event-stop-${indice}`} required placeholder="Punto de encuentro o lugar" value={punto.titulo} onChange={(e) => setPuntos((actuales) => actuales.map((item, i) => i === indice ? { ...item, titulo: e.target.value } : item))} />
                      <Textarea required rows={3} aria-label={`Descripción del punto ${indice + 1}`} placeholder="Qué hará o conocerá el viajero en este punto" value={punto.descripcion} onChange={(e) => setPuntos((actuales) => actuales.map((item, i) => i === indice ? { ...item, descripcion: e.target.value } : item))} />
                      <div className="grid grid-cols-2 gap-2"><Input type="number" step="any" aria-label={`Latitud del punto ${indice + 1}`} placeholder="Latitud (opcional)" value={punto.latitud} onChange={(e) => setPuntos((actuales) => actuales.map((item, i) => i === indice ? { ...item, latitud: e.target.value } : item))} /><Input type="number" step="any" aria-label={`Longitud del punto ${indice + 1}`} placeholder="Longitud (opcional)" value={punto.longitud} onChange={(e) => setPuntos((actuales) => actuales.map((item, i) => i === indice ? { ...item, longitud: e.target.value } : item))} /></div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Fotos y videos</CardTitle>
              <CardDescription>
                Obligatorio: al menos una imagen o un video principal. Al guardar
                se eliminan de Cloudinary los medios que quites.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <CampoMedios
                categoria="tours"
                medios={medios}
                onCambiar={(m) => {
                  setMedios(m);
                  if (m.length) setErrorMedios(null);
                }}
              />
              {errorMedios && (
                <p className="text-destructive text-sm">{errorMedios}</p>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center gap-2">
            {(actualizar.isError || definirItinerario.isError || errorDetalle) && (
              <p role="alert" className="text-destructive text-sm">{errorDetalle ?? actualizar.error?.message ?? definirItinerario.error?.message}</p>
            )}
            <Button type="submit" disabled={actualizar.isPending || definirItinerario.isPending}>
              {actualizar.isPending || definirItinerario.isPending ? "Guardando detalles…" : "Guardar cambios"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/tours">Cancelar</Link>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CalendarDaysIcon, ImageIcon, MapPinIcon, PlusIcon, SparklesIcon, Trash2Icon } from "lucide-react";
import { TituloSeccion } from "@/components/dashboard/titulo-seccion";
import { CampoCoordenadas } from "@/components/dashboard/campo-coordenadas";
import { CampoDuracion } from "@/components/dashboard/campo-duracion";
import { CampoMedios } from "@/components/dashboard/campo-medios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCrearEventoEspecial } from "@/hooks/use-catalogo";
import type { ContenidoEntrada, MedioEntrada } from "@/lib/api";

function slugificar(texto: string) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function NuevoEventoEspecial() {
  const router = useRouter();
  const crear = useCrearEventoEspecial();
  const [campos, setCampos] = useState({ titulo: "", destino: "", latitud: "", longitud: "", duracion: "", inicio: "", fin: "" });
  const [contenido, setContenido] = useState<ContenidoEntrada>({ titulo: "", resumen: "", descripcion: "", queLlevar: "", incluye: "", noIncluye: "" });
  const [medios, setMedios] = useState<MedioEntrada[]>([]);
  const [puntos, setPuntos] = useState<{ titulo: string; descripcion: string; latitud: string; longitud: string }[]>([]);
  const [errorMedios, setErrorMedios] = useState("");

  const enviar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (campos.fin < campos.inicio) {
      setErrorMedios("La fecha final debe ser igual o posterior al inicio.");
      return;
    }
    if (!medios.length) {
      setErrorMedios("Añade al menos una imagen o video para presentar el evento.");
      return;
    }
    if (puntos.some((punto) => !punto.titulo.trim() || !punto.descripcion.trim())) {
      setErrorMedios("Completa el nombre y la descripción de cada punto del recorrido.");
      return;
    }
    setErrorMedios("");
    crear.mutate({
      slug: slugificar(campos.titulo),
      destinoNombre: campos.destino,
      destinoLatitud: Number(campos.latitud),
      destinoLongitud: Number(campos.longitud),
      duracionMinutos: Number(campos.duracion),
      temporadaInicio: campos.inicio,
      temporadaFin: campos.fin,
      medios,
      contenido: { ...contenido, titulo: campos.titulo },
      puntos: puntos.map((punto) => ({
        titulo: punto.titulo.trim(),
        descripcion: punto.descripcion.trim(),
        ...(punto.latitud !== "" && { latitud: Number(punto.latitud) }),
        ...(punto.longitud !== "" && { longitud: Number(punto.longitud) }),
      })),
    }, { onSuccess: () => router.push("/dashboard/eventos") });
  };

  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6">
      <div>
        <Button variant="ghost" size="sm" asChild><Link href="/dashboard/eventos"><ArrowLeftIcon /> Eventos especiales</Link></Button>
      </div>
      <div>
        <p className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em]"><SparklesIcon className="size-4" /> Nueva temporada</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Programar evento especial</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">Crea una experiencia para una celebración o fecha limitada. El evento aparecerá en la web durante las fechas elegidas; después podrás añadir cada salida con su hora, cupos y tarifa.</p>
      </div>

      <form onSubmit={enviar} className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-5">
          <Card>
            <CardHeader><TituloSeccion paso="1" titulo="Contenido para viajeros" icono={<SparklesIcon />} descripcion="El título, resumen y descripción se preparan para publicarse en los idiomas del sitio." /></CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2"><Label htmlFor="event-title">Nombre del evento</Label><Input id="event-title" required maxLength={160} placeholder="Procesión del Señor de los Milagros en Arequipa" value={campos.titulo} onChange={(e) => { setCampos((c) => ({ ...c, titulo: e.target.value })); setContenido((c) => ({ ...c, titulo: e.target.value })); }} /></div>
              <div className="grid gap-2"><Label htmlFor="event-summary">Resumen</Label><Input id="event-summary" required maxLength={240} placeholder="Vive una de las celebraciones más importantes del calendario peruano." value={contenido.resumen} onChange={(e) => setContenido((c) => ({ ...c, resumen: e.target.value }))} /></div>
              <div className="grid gap-2"><Label htmlFor="event-description">Descripción</Label><Textarea id="event-description" required rows={5} placeholder="Describe la celebración, el recorrido y lo que vivirá el viajero." value={contenido.descripcion} onChange={(e) => setContenido((c) => ({ ...c, descripcion: e.target.value }))} /></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2"><Label htmlFor="event-includes">Qué incluye</Label><Textarea id="event-includes" rows={4} placeholder={'Escribe un servicio por línea.\nTransporte turístico\nGuía local\nIngreso indicado en el programa'} value={contenido.incluye} onChange={(e) => setContenido((c) => ({ ...c, incluye: e.target.value }))} /></div>
                <div className="grid gap-2"><Label htmlFor="event-excludes">Qué no incluye</Label><Textarea id="event-excludes" rows={4} placeholder={'Escribe un concepto por línea.\nAlimentación no indicada\nGastos personales'} value={contenido.noIncluye} onChange={(e) => setContenido((c) => ({ ...c, noIncluye: e.target.value }))} /></div>
              </div>
              <div className="grid gap-2"><Label htmlFor="event-bring">Qué llevar (opcional)</Label><Textarea id="event-bring" rows={2} placeholder="Ropa cómoda, agua y protección solar." value={contenido.queLlevar} onChange={(e) => setContenido((c) => ({ ...c, queLlevar: e.target.value }))} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><TituloSeccion paso="2" titulo="Lugar y fechas" icono={<MapPinIcon />} descripcion="Indica el destino y la ventana en que el evento estará publicado." /></CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2"><Label htmlFor="event-destination">Lugar o destino</Label><Input id="event-destination" required placeholder="Arequipa, Perú" value={campos.destino} onChange={(e) => setCampos((c) => ({ ...c, destino: e.target.value }))} /></div>
              <CampoCoordenadas etiqueta="Punto principal del evento" latitud={campos.latitud} longitud={campos.longitud} onCambiar={(latitud, longitud) => setCampos((c) => ({ ...c, latitud, longitud }))} />
              <div className="grid gap-3 rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-sm font-medium">Puntos del recorrido</p><p className="text-muted-foreground mt-1 text-xs">Añade paradas en Arequipa, Cabanaconde, Chivay, Cusco u otros destinos.</p></div>
                  <Button type="button" size="sm" variant="outline" onClick={() => setPuntos((actuales) => [...actuales, { titulo: "", descripcion: "", latitud: "", longitud: "" }])}><PlusIcon /> Añadir punto</Button>
                </div>
                {puntos.map((punto, indice) => (
                  <div key={indice} className="grid gap-3 rounded-lg bg-muted/40 p-3">
                    <div className="flex items-center justify-between"><Label>Punto {indice + 1}</Label><Button type="button" size="icon" variant="ghost" aria-label={`Quitar punto ${indice + 1}`} onClick={() => setPuntos((actuales) => actuales.filter((_, i) => i !== indice))}><Trash2Icon /></Button></div>
                    <Input required aria-label={`Nombre del punto ${indice + 1}`} placeholder="Cabanaconde, mirador de la Cruz del Cóndor…" value={punto.titulo} onChange={(e) => setPuntos((actuales) => actuales.map((item, i) => i === indice ? { ...item, titulo: e.target.value } : item))} />
                    <Textarea required aria-label={`Descripción del punto ${indice + 1}`} rows={2} placeholder="Qué verá o hará el viajero en este punto." value={punto.descripcion} onChange={(e) => setPuntos((actuales) => actuales.map((item, i) => i === indice ? { ...item, descripcion: e.target.value } : item))} />
                    <div className="grid grid-cols-2 gap-2"><Input type="number" step="any" aria-label={`Latitud del punto ${indice + 1}`} placeholder="Latitud (opcional)" value={punto.latitud} onChange={(e) => setPuntos((actuales) => actuales.map((item, i) => i === indice ? { ...item, latitud: e.target.value } : item))} /><Input type="number" step="any" aria-label={`Longitud del punto ${indice + 1}`} placeholder="Longitud (opcional)" value={punto.longitud} onChange={(e) => setPuntos((actuales) => actuales.map((item, i) => i === indice ? { ...item, longitud: e.target.value } : item))} /></div>
                  </div>
                ))}
              </div>
              <CampoDuracion etiqueta="Duración estimada" requerido minutosTotales={campos.duracion} onCambiar={(duracion) => setCampos((c) => ({ ...c, duracion }))} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2"><Label htmlFor="event-start">Disponible desde</Label><Input id="event-start" required type="date" value={campos.inicio} onChange={(e) => setCampos((c) => ({ ...c, inicio: e.target.value }))} /></div>
                <div className="grid gap-2"><Label htmlFor="event-end">Disponible hasta</Label><Input id="event-end" required type="date" min={campos.inicio || undefined} value={campos.fin} onChange={(e) => setCampos((c) => ({ ...c, fin: e.target.value }))} /></div>
              </div>
              <p className="text-muted-foreground text-xs">Usa el calendario anual del evento. Las fechas pueden actualizarse para cada temporada y las salidas se programan por separado.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-5 lg:sticky lg:top-6">
          <Card>
            <CardHeader><TituloSeccion paso="3" titulo="Fotos y videos" icono={<ImageIcon />} descripcion="Selecciona una portada y añade medios para mostrar la celebración." /></CardHeader>
            <CardContent className="grid gap-2">
              <CampoMedios categoria="tours" medios={medios} onCambiar={(lista) => { setMedios(lista); if (lista.length) setErrorMedios(""); }} />
              {errorMedios && <p role="alert" className="text-destructive text-sm">{errorMedios}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><TituloSeccion paso="4" titulo="Publicación" icono={<CalendarDaysIcon />} descripcion="El periodo del evento controla su disponibilidad pública." /></CardHeader>
            <CardContent className="grid gap-3">
              <div className="rounded-lg border p-3 text-sm">
                <p className="font-medium">{campos.titulo || "Nombre del evento"}</p>
                <p className="text-muted-foreground mt-1">{campos.destino || "Destino"}</p>
                <p className="text-muted-foreground mt-2">{campos.inicio || "Inicio"} → {campos.fin || "Fin"}</p>
              </div>
              {crear.isError && <p role="alert" className="text-destructive text-sm">{crear.error.message}</p>}
              <Button type="submit" disabled={crear.isPending || medios.length === 0}>
                {crear.isPending ? "Guardando evento…" : "Guardar evento"}
              </Button>
              <Button type="button" variant="outline" asChild><Link href="/dashboard/eventos">Cancelar</Link></Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}

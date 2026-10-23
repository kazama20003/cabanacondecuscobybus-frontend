"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CalendarDaysIcon, ImageIcon, MapPinIcon, SparklesIcon } from "lucide-react";
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
              <div className="grid gap-2"><Label htmlFor="event-bring">Qué llevar (opcional)</Label><Textarea id="event-bring" rows={2} placeholder="Ropa cómoda, agua y protección solar." value={contenido.queLlevar} onChange={(e) => setContenido((c) => ({ ...c, queLlevar: e.target.value }))} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><TituloSeccion paso="2" titulo="Lugar y fechas" icono={<MapPinIcon />} descripcion="Indica el destino y la ventana en que el evento estará publicado." /></CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2"><Label htmlFor="event-destination">Lugar o destino</Label><Input id="event-destination" required placeholder="Arequipa, Perú" value={campos.destino} onChange={(e) => setCampos((c) => ({ ...c, destino: e.target.value }))} /></div>
              <CampoCoordenadas etiqueta="Punto principal del evento" latitud={campos.latitud} longitud={campos.longitud} onCambiar={(latitud, longitud) => setCampos((c) => ({ ...c, latitud, longitud }))} />
              <CampoDuracion etiqueta="Duración estimada" requerido minutosTotales={campos.duracion} onCambiar={(duracion) => setCampos((c) => ({ ...c, duracion }))} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2"><Label htmlFor="event-start">Disponible desde</Label><Input id="event-start" required type="date" value={campos.inicio} onChange={(e) => setCampos((c) => ({ ...c, inicio: e.target.value }))} /></div>
                <div className="grid gap-2"><Label htmlFor="event-end">Disponible hasta</Label><Input id="event-end" required type="date" min={campos.inicio || undefined} value={campos.fin} onChange={(e) => setCampos((c) => ({ ...c, fin: e.target.value }))} /></div>
              </div>
              <p className="text-muted-foreground text-xs">Usa fechas concretas de este año. Para la siguiente temporada, podrás editar las fechas y volver a programar sus salidas.</p>
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

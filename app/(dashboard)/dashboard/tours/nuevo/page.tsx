"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
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
import { CampoCoordenadas } from "@/components/dashboard/campo-coordenadas";
import { CampoDuracion } from "@/components/dashboard/campo-duracion";
import { CampoMedios } from "@/components/dashboard/campo-medios";
import {
  CampoLista,
  aListaItems,
  deListaItems,
} from "@/components/dashboard/campo-lista";
import { useCrearTour } from "@/hooks/use-catalogo";
import type { MedioEntrada } from "@/lib/api";

function slugificar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const inicial = {
  nombre: "",
  destinoNombre: "",
  destinoLatitud: "",
  destinoLongitud: "",
  duracionMinutos: "",
};

export default function PaginaNuevoTour() {
  const router = useRouter();
  const [campos, setCampos] = useState(inicial);
  const [contenido, setContenido] = useState({ titulo: "", resumen: "", descripcion: "", queLlevar: "", incluye: "", noIncluye: "" });
  const [medios, setMedios] = useState<MedioEntrada[]>([]);
  const [errorMedios, setErrorMedios] = useState<string | null>(null);
  const crear = useCrearTour();

  const cambiar = (clave: keyof typeof inicial) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setCampos((c) => ({ ...c, [clave]: e.target.value }));

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (medios.length === 0) {
      setErrorMedios("Sube al menos una imagen o un video principal.");
      return;
    }
    setErrorMedios(null);
    crear.mutate(
      {
        slug: slugificar(campos.nombre || campos.destinoNombre),
        destinoNombre: campos.destinoNombre,
        destinoLatitud: Number(campos.destinoLatitud),
        destinoLongitud: Number(campos.destinoLongitud),
        duracionMinutos: Number(campos.duracionMinutos),
        medios: medios.length ? medios : undefined,
        contenido: contenido.titulo ? contenido : undefined,
      },
      { onSuccess: () => router.push("/dashboard/tours") },
    );
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
      <form onSubmit={enviar} className="grid max-w-6xl gap-6 lg:grid-cols-3">
        <div className="grid gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>1 · Experiencia del viajero</CardTitle>
              <CardDescription>Este contenido se publica en la ficha del tour y se traduce automáticamente al inglés.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2"><Label htmlFor="titulo">Título comercial</Label><Input id="titulo" required placeholder="Valle Sagrado: historia, cultura y paisajes" value={contenido.titulo} onChange={(e) => setContenido((actual) => ({ ...actual, titulo: e.target.value }))} /></div>
              <div className="grid gap-2"><Label htmlFor="resumen">Resumen corto</Label><Input id="resumen" required placeholder="Un día entre sitios arqueológicos y pueblos andinos" value={contenido.resumen} onChange={(e) => setContenido((actual) => ({ ...actual, resumen: e.target.value }))} /></div>
              <div className="grid gap-2"><Label htmlFor="descripcion">Descripción completa</Label><Textarea id="descripcion" required rows={5} placeholder="Explica qué verá y vivirá el viajero durante el tour…" value={contenido.descripcion} onChange={(e) => setContenido((actual) => ({ ...actual, descripcion: e.target.value }))} /></div>
              <div className="grid gap-2"><Label htmlFor="queLlevar">Qué llevar</Label><Input id="queLlevar" placeholder="Bloqueador, agua, casaca ligera y documento de identidad" value={contenido.queLlevar} onChange={(e) => setContenido((actual) => ({ ...actual, queLlevar: e.target.value }))} /></div>
              <CampoLista
                etiqueta="Qué incluye"
                descripcion="Un ítem por fila. Se muestra como lista con check en la ficha del tour."
                placeholder="Ej.: Transporte turístico ida y vuelta"
                marca="✓"
                marcaColor="#16a34a"
                items={aListaItems(contenido.incluye)}
                onCambiar={(items) =>
                  setContenido((actual) => ({ ...actual, incluye: deListaItems(items) ?? "" }))
                }
              />
              <CampoLista
                etiqueta="Qué NO incluye"
                descripcion="Deja claro lo que el turista paga aparte: entradas, almuerzo, propinas, etc."
                placeholder="Ej.: Tarifa de ingreso a la reserva"
                marca="✕"
                items={aListaItems(contenido.noIncluye)}
                onCambiar={(items) =>
                  setContenido((actual) => ({ ...actual, noIncluye: deListaItems(items) ?? "" }))
                }
              />
            </CardContent>
          </Card>
        </div>
        <div className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle>2 · Datos del tour</CardTitle>
              <CardDescription>El slug se genera automáticamente desde el nombre.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nombreTour">Nombre del tour</Label>
              <Input id="nombreTour" required placeholder="Valle Sagrado full day" value={campos.nombre} onChange={cambiar("nombre")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destinoTour">Destino</Label>
              <Input id="destinoTour" required placeholder="Valle Sagrado" value={campos.destinoNombre} onChange={cambiar("destinoNombre")} />
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

            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>3 · Fotos y videos</CardTitle><CardDescription>Obligatorio: sube al menos una imagen o un video principal. Después podrás añadir fotos a cada paso del itinerario.</CardDescription></CardHeader>
            <CardContent className="grid gap-2">
              <CampoMedios categoria="tours" medios={medios} onCambiar={(m) => { setMedios(m); if (m.length) setErrorMedios(null); }} />
              {errorMedios && <p className="text-destructive text-sm">{errorMedios}</p>}
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-2 lg:col-span-3">
            {crear.isError && (
              <p className="text-destructive text-sm">{crear.error.message}</p>
            )}

            <Button type="submit" disabled={crear.isPending}>
              {crear.isPending ? "Guardando…" : "Crear tour"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/tours">Cancelar</Link>
            </Button>
        </div>
      </form>
    </div>
  );
}

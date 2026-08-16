"use client";

import { useState } from "react";
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
import { CampoCoordenadas } from "@/components/dashboard/campo-coordenadas";
import { CampoDuracion } from "@/components/dashboard/campo-duracion";
import { CampoMedios } from "@/components/dashboard/campo-medios";
import { useCrearTransporte } from "@/hooks/use-catalogo";
import type { MedioEntrada } from "@/lib/api";

function slugificar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface FilaParada {
  nombre: string;
  latitud: string;
  longitud: string;
  minutos: string;
  duracionParadaMinutos: string;
  descripcion: string;
  medios: MedioEntrada[];
}

const paradaVacia: FilaParada = {
  nombre: "",
  latitud: "",
  longitud: "",
  minutos: "",
  duracionParadaMinutos: "",
  descripcion: "",
  medios: [],
};

const inicial = {
  origenNombre: "",
  origenLatitud: "",
  origenLongitud: "",
  destinoNombre: "",
  destinoLatitud: "",
  destinoLongitud: "",
  duracionMinutosEstimada: "",
};

export default function PaginaNuevaRuta() {
  const router = useRouter();
  const [campos, setCampos] = useState(inicial);
  const [tituloAutomatico, setTituloAutomatico] = useState(true);
  const [contenido, setContenido] = useState({
    titulo: "",
    resumen: "",
    descripcion: "",
  });
  const [paradas, setParadas] = useState<FilaParada[]>([]);
  const [medios, setMedios] = useState<MedioEntrada[]>([]);
  const crear = useCrearTransporte();

  const tituloRuta = [campos.origenNombre, campos.destinoNombre]
    .filter(Boolean)
    .join(" → ");

  const cambiarLugar = (clave: "origenNombre" | "destinoNombre", valor: string) => {
    const siguiente = { ...campos, [clave]: valor };
    setCampos(siguiente);
    if (tituloAutomatico) {
      setContenido((actual) => ({
        ...actual,
        titulo: [siguiente.origenNombre, siguiente.destinoNombre]
          .filter(Boolean)
          .join(" → "),
      }));
    }
  };

  const cambiarParada = (i: number, clave: keyof FilaParada, valor: string) =>
    setParadas((f) =>
      f.map((fila, j) => (j === i ? { ...fila, [clave]: valor } : fila)),
    );

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    crear.mutate(
      {
        slug: slugificar(`${campos.origenNombre}-${campos.destinoNombre}`),
        origenNombre: campos.origenNombre,
        origenLatitud: Number(campos.origenLatitud),
        origenLongitud: Number(campos.origenLongitud),
        destinoNombre: campos.destinoNombre,
        destinoLatitud: Number(campos.destinoLatitud),
        destinoLongitud: Number(campos.destinoLongitud),
        duracionMinutosEstimada: Number(campos.duracionMinutosEstimada),
        paradas: paradas.length
          ? paradas.map((p) => ({
              nombre: p.nombre,
              latitud: Number(p.latitud),
              longitud: Number(p.longitud),
              minutos: Number(p.minutos),
              duracionParadaMinutos: p.duracionParadaMinutos
                ? Number(p.duracionParadaMinutos)
                : 0,
              descripcion: p.descripcion || undefined,
              medios: p.medios.length ? p.medios : undefined,
            }))
          : undefined,
        medios: medios.length ? medios : undefined,
        contenido: {
          ...contenido,
          titulo: contenido.titulo.trim() || tituloRuta,
        },
      },
      { onSuccess: () => router.push("/dashboard/transportes") },
    );
  };

  return (
    <form onSubmit={enviar} className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Barra superior: navegación + acciones siempre a la vista */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/transportes">
              <ArrowLeftIcon />
              Transportes
            </Link>
          </Button>
          <div>
            <h2 className="text-lg font-semibold">Nueva ruta de transporte</h2>
            <p className="text-muted-foreground text-sm">
              Contenido, recorrido, paradas y medios en un solo guardado.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/transportes">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={crear.isPending}>
            {crear.isPending ? "Guardando…" : "Crear ruta completa"}
          </Button>
        </div>
      </div>

      {crear.isError && (
        <p className="text-destructive text-sm">{crear.error.message}</p>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-3">
        {/* Columna principal */}
        <div className="grid gap-6 xl:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>1 · Información para el turista</CardTitle>
            <CardDescription>
              Escribe todo en español. Al guardar, se traduce automáticamente
              al inglés y podrás revisar o corregir la traducción después desde
              el botón "Traducciones" de la lista.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="rounded-xl border bg-muted/30 px-4 py-3">
              <p className="text-muted-foreground text-xs font-medium">Nombre de la ruta</p>
              <p className="mt-1 text-lg font-semibold">{tituloRuta || "Origen → Destino"}</p>
              <p className="text-muted-foreground mt-1 text-xs">Se genera automáticamente con el origen y destino.</p>
            </div>
            <details className="group rounded-lg border">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium">
                Personalizar título comercial <span className="text-muted-foreground font-normal">(opcional)</span>
              </summary>
              <div className="grid gap-2 border-t px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="titulo">Título personalizado</Label>
                  {!tituloAutomatico && (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-xs"
                      onClick={() => {
                        setTituloAutomatico(true);
                        setContenido((actual) => ({ ...actual, titulo: tituloRuta }));
                      }}
                    >
                      Restablecer automático
                    </Button>
                  )}
                </div>
                <Input
                  id="titulo"
                  placeholder="Viaje panorámico Cabanaconde → Cusco"
                  value={contenido.titulo}
                  onChange={(e) => {
                    setTituloAutomatico(false);
                    setContenido((c) => ({ ...c, titulo: e.target.value }));
                  }}
                />
              </div>
            </details>
            <div className="grid gap-2">
              <Label htmlFor="resumen">Resumen corto</Label>
              <Input id="resumen" required placeholder="Viaje panorámico con paradas para fotos en los miradores del Colca" value={contenido.resumen} onChange={(e) => setContenido((c) => ({ ...c, resumen: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción completa</Label>
              <Textarea id="descripcion" required rows={5} placeholder="Describe la experiencia: el recorrido, los paisajes, qué incluye, recomendaciones…" value={contenido.descripcion} onChange={(e) => setContenido((c) => ({ ...c, descripcion: e.target.value }))} />
            </div>
          </CardContent>
        </Card>

          <Card>
          <CardHeader>
            <CardTitle>2 · Paradas turísticas</CardTitle>
            <CardDescription>
              Puntos donde el bus se detiene (miradores, fotos, desayuno). El
              orden de la lista es el orden del recorrido. Opcional — también
              puedes agregarlas después.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {paradas.length === 0 && (
              <p className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
                Sin paradas aún. Agrega los miradores y puntos de fotos del
                recorrido.
              </p>
            )}
            {paradas.map((fila, i) => (
              <div key={i} className="grid gap-4 rounded-xl border bg-muted/20 p-4 md:grid-cols-2">
                <div className="flex items-center justify-between md:col-span-2">
                  <span className="text-muted-foreground text-xs font-semibold">
                    PARADA {i + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive size-7"
                    onClick={() => setParadas((f) => f.filter((_, j) => j !== i))}
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
                    onChange={(e) => cambiarParada(i, "nombre", e.target.value)}
                  />
                </div>
                <CampoCoordenadas
                  etiqueta="Coordenadas del punto"
                  latitud={fila.latitud}
                  longitud={fila.longitud}
                  onCambiar={(lat, lng) => {
                    cambiarParada(i, "latitud", lat);
                    cambiarParada(i, "longitud", lng);
                  }}
                />
                <CampoDuracion
                  etiqueta="Tiempo desde la salida"
                  minutosTotales={fila.minutos}
                  onCambiar={(v) => cambiarParada(i, "minutos", v)}
                />
                <CampoDuracion
                  etiqueta="Cuánto se detiene"
                  minutosTotales={fila.duracionParadaMinutos}
                  onCambiar={(v) => cambiarParada(i, "duracionParadaMinutos", v)}
                />
                <div className="grid gap-2 md:col-span-2">
                  <Label>Qué se hace aquí</Label>
                  <Input
                    placeholder="Parada para fotos del cañón y baños"
                    value={fila.descripcion}
                    onChange={(e) => cambiarParada(i, "descripcion", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 rounded-lg border bg-background p-3">
                  <CampoMedios
                    categoria="transportes"
                    medios={fila.medios}
                    onCambiar={(mediosParada) =>
                      setParadas((actuales) => actuales.map((parada, indice) =>
                        indice === i ? { ...parada, medios: mediosParada } : parada,
                      ))
                    }
                    soloImagenes
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setParadas((f) => [...f, { ...paradaVacia }])}
            >
              <PlusIcon />
              Agregar parada
            </Button>
          </CardContent>
          </Card>
        </div>

        {/* Columna lateral */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>3 · Recorrido</CardTitle>
              <CardDescription>
                Pega las coordenadas tal cual las copias de Google Maps. El
                slug se genera solo.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="origenNombre">Origen</Label>
               <Input id="origenNombre" required placeholder="Cabanaconde" value={campos.origenNombre} onChange={(e) => cambiarLugar("origenNombre", e.target.value)} />
              </div>
              <CampoCoordenadas
                etiqueta="Coordenadas del origen"
                latitud={campos.origenLatitud}
                longitud={campos.origenLongitud}
                onCambiar={(lat, lng) =>
                  setCampos((c) => ({ ...c, origenLatitud: lat, origenLongitud: lng }))
                }
              />
              <div className="grid gap-2">
                <Label htmlFor="destinoNombre">Destino</Label>
               <Input id="destinoNombre" required placeholder="Cusco" value={campos.destinoNombre} onChange={(e) => cambiarLugar("destinoNombre", e.target.value)} />
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
                etiqueta="Duración estimada del viaje"
                requerido
                minutosTotales={campos.duracionMinutosEstimada}
                onCambiar={(minutos) =>
                  setCampos((c) => ({ ...c, duracionMinutosEstimada: minutos }))
                }
               />
               <div className="rounded-lg border border-dashed bg-muted/30 p-3">
                 <p className="text-muted-foreground text-xs font-medium">Así verá el cliente la dirección</p>
                 <p className="mt-1 text-base font-semibold">{tituloRuta || "Origen → Destino"}</p>
               </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4 · Fotos y videos</CardTitle>
              <CardDescription>
                Lo que verá el turista en la página de la ruta. Opcional.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CampoMedios
                categoria="transportes"
                medios={medios}
                onCambiar={setMedios}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/transportes">Cancelar</Link>
        </Button>
        <Button type="submit" disabled={crear.isPending}>
          {crear.isPending ? "Guardando…" : "Crear ruta completa"}
        </Button>
      </div>
    </form>
  );
}

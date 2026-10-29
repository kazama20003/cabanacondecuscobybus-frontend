"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/native-ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/native-ui/card";
import { Input } from "@/components/native-ui/input";
import { Textarea } from "@/components/native-ui/textarea";
import { Label } from "@/components/native-ui/label";
import { Skeleton } from "@/components/native-ui/skeleton";
import { CampoCoordenadas } from "@/components/dashboard/campo-coordenadas";
import { CampoDuracion } from "@/components/dashboard/campo-duracion";
import { CampoMedios } from "@/components/dashboard/campo-medios";
import { useActualizarTransporte, useTransporte } from "@/hooks/use-catalogo";
import type { ContenidoEntrada, ImagenApi, MedioEntrada } from "@/lib/api";

const textoDe = (valor: unknown) => (valor == null ? "" : String(valor));

export default function PaginaEditarTransporte({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: transporte, isLoading, isError, error } = useTransporte(slug);
  const actualizar = useActualizarTransporte();

  const [campos, setCampos] = useState({
    origenNombre: "",
    origenLatitud: "",
    origenLongitud: "",
    destinoNombre: "",
    destinoLatitud: "",
    destinoLongitud: "",
    duracionMinutosEstimada: "",
  });
  const [medios, setMedios] = useState<MedioEntrada[]>([]);
  const [contenido, setContenido] = useState<ContenidoEntrada>({ titulo: "", resumen: "", descripcion: "", queLlevar: "", incluye: "", noIncluye: "" });
  const [errorMedios, setErrorMedios] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (!transporte || listo) return;
    setCampos({
      origenNombre: textoDe(transporte.origenNombre),
      origenLatitud: textoDe(transporte.origenLatitud),
      origenLongitud: textoDe(transporte.origenLongitud),
      destinoNombre: textoDe(transporte.destinoNombre),
      destinoLatitud: textoDe(transporte.destinoLatitud),
      destinoLongitud: textoDe(transporte.destinoLongitud),
      duracionMinutosEstimada: textoDe(transporte.duracionMinutosEstimada),
    });
    const traduccion = transporte.traducciones?.find((item) => item.idioma === "es") ?? transporte.traducciones?.[0];
    setContenido({ titulo: textoDe(traduccion?.titulo), resumen: textoDe(traduccion?.resumen), descripcion: textoDe(traduccion?.descripcion), queLlevar: textoDe(traduccion?.queLlevar), incluye: textoDe(traduccion?.incluye), noIncluye: textoDe(traduccion?.noIncluye) });
    setMedios(
      (transporte.imagenes ?? []).map((imagen: ImagenApi) => ({
        url: imagen.url,
        clave: imagen.clave ?? undefined,
        textoAlterno: imagen.textoAlterno ?? undefined,
        tipo: imagen.tipo,
      })),
    );
    setListo(true);
  }, [transporte, listo]);

  const cambiar =
    (clave: keyof typeof campos) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setCampos((c) => ({ ...c, [clave]: e.target.value }));

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transporte) return;
    if (medios.length === 0) {
      setErrorMedios("Sube al menos una imagen o un video principal.");
      return;
    }
    setErrorMedios(null);
    actualizar.mutate(
      {
        id: String(transporte.id),
        datos: {
          origenNombre: campos.origenNombre,
          origenLatitud: Number(campos.origenLatitud),
          origenLongitud: Number(campos.origenLongitud),
          destinoNombre: campos.destinoNombre,
          destinoLatitud: Number(campos.destinoLatitud),
          destinoLongitud: Number(campos.destinoLongitud),
          duracionMinutosEstimada: Number(campos.duracionMinutosEstimada),
          medios,
          contenido: { ...contenido, titulo: contenido.titulo.trim(), resumen: contenido.resumen.trim(), descripcion: contenido.descripcion.trim() },
        },
      },
      { onSuccess: () => router.push("/dashboard/transportes") },
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/transportes">
            <ArrowLeftIcon />
            Volver a transportes
          </Link>
        </Button>
      </div>

      {isLoading && <Skeleton className="h-96 w-full max-w-3xl" />}
      {isError && (
        <p className="text-destructive text-sm">
          No se pudo cargar la ruta: {error.message}
        </p>
      )}

      {transporte && (
        <form onSubmit={enviar} className="grid max-w-3xl gap-6">
          <Card>
            <CardHeader><CardTitle>Más opciones de edición</CardTitle><CardDescription>El itinerario, los precios por salida y las traducciones están en estas secciones.</CardDescription></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" asChild><Link href={`/dashboard/transportes/${slug}/paradas`}>Paradas e itinerario</Link></Button>
              <Button type="button" variant="outline" asChild><Link href="/dashboard/salidas?tipo=TRANSPORTE">Salidas y precios</Link></Button>
              <Button type="button" variant="outline" asChild><Link href={`/dashboard/transportes/${slug}/traducciones`}>Traducciones</Link></Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Información para viajeros</CardTitle>
              <CardDescription>Textos comerciales de la ruta, incluidos y recomendaciones. Se guardan en español; las otras traducciones se editan en su pantalla.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2"><Label htmlFor="transporte-titulo">Título comercial</Label><Input id="transporte-titulo" value={contenido.titulo} onChange={(e) => setContenido((c) => ({ ...c, titulo: e.target.value }))} /></div>
              <div className="grid gap-2"><Label htmlFor="transporte-resumen">Resumen</Label><Input id="transporte-resumen" value={contenido.resumen} onChange={(e) => setContenido((c) => ({ ...c, resumen: e.target.value }))} /></div>
              <div className="grid gap-2"><Label htmlFor="transporte-descripcion">Descripción</Label><Textarea id="transporte-descripcion" rows={5} value={contenido.descripcion} onChange={(e) => setContenido((c) => ({ ...c, descripcion: e.target.value }))} /></div>
              <div className="grid gap-3 sm:grid-cols-2"><div className="grid gap-2"><Label htmlFor="transporte-incluye">Qué incluye · un concepto por línea</Label><Textarea id="transporte-incluye" rows={4} value={contenido.incluye} onChange={(e) => setContenido((c) => ({ ...c, incluye: e.target.value }))} /></div><div className="grid gap-2"><Label htmlFor="transporte-no-incluye">Qué no incluye · un concepto por línea</Label><Textarea id="transporte-no-incluye" rows={4} value={contenido.noIncluye} onChange={(e) => setContenido((c) => ({ ...c, noIncluye: e.target.value }))} /></div></div>
              <div className="grid gap-2"><Label htmlFor="transporte-que-llevar">Recomendaciones y qué llevar</Label><Textarea id="transporte-que-llevar" rows={3} value={contenido.queLlevar} onChange={(e) => setContenido((c) => ({ ...c, queLlevar: e.target.value }))} /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Editar ruta</CardTitle>
              <CardDescription>
                Slug: <span className="font-mono">{textoDe(transporte.slug)}</span>{" "}
                (no editable). Para traducciones, usa la sección de traducciones.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="origenNombre">Origen</Label>
                <Input
                  id="origenNombre"
                  required
                  value={campos.origenNombre}
                  onChange={cambiar("origenNombre")}
                />
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
                etiqueta="Duración estimada del viaje"
                requerido
                minutosTotales={campos.duracionMinutosEstimada}
                onCambiar={(minutos) =>
                  setCampos((c) => ({ ...c, duracionMinutosEstimada: minutos }))
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fotos y videos</CardTitle>
              <CardDescription>
                Obligatorio: al menos una imagen o un video principal. Al guardar
                se eliminan del almacenamiento los medios que quites.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <CampoMedios
                categoria="transportes"
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

          <div className="flex items-center gap-2">
            {actualizar.isError && (
              <p className="text-destructive text-sm">{actualizar.error.message}</p>
            )}
            <Button type="submit" disabled={actualizar.isPending}>
              {actualizar.isPending ? "Guardando…" : "Guardar cambios"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/transportes">Cancelar</Link>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

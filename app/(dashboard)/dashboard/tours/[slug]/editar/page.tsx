"use client";

import { use, useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { CampoCoordenadas } from "@/components/dashboard/campo-coordenadas";
import { CampoDuracion } from "@/components/dashboard/campo-duracion";
import { CampoMedios } from "@/components/dashboard/campo-medios";
import { useActualizarTour, useTour } from "@/hooks/use-catalogo";
import type { ImagenApi, MedioEntrada } from "@/lib/api";

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

  const [campos, setCampos] = useState({
    destinoNombre: "",
    destinoLatitud: "",
    destinoLongitud: "",
    duracionMinutos: "",
  });
  const [medios, setMedios] = useState<MedioEntrada[]>([]);
  const [errorMedios, setErrorMedios] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (!tour || listo) return;
    setCampos({
      destinoNombre: textoDe(tour.destinoNombre),
      destinoLatitud: textoDe(tour.destinoLatitud),
      destinoLongitud: textoDe(tour.destinoLongitud),
      duracionMinutos: textoDe(tour.duracionMinutos),
    });
    setMedios(
      (tour.imagenes ?? []).map((imagen: ImagenApi) => ({
        url: imagen.url,
        clave: imagen.clave ?? undefined,
        textoAlterno: imagen.textoAlterno ?? undefined,
        tipo: imagen.tipo,
      })),
    );
    setListo(true);
  }, [tour, listo]);

  const cambiar =
    (clave: keyof typeof campos) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setCampos((c) => ({ ...c, [clave]: e.target.value }));

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;
    if (medios.length === 0) {
      setErrorMedios("Sube al menos una imagen o un video principal.");
      return;
    }
    setErrorMedios(null);
    actualizar.mutate(
      {
        id: String(tour.id),
        datos: {
          destinoNombre: campos.destinoNombre,
          destinoLatitud: Number(campos.destinoLatitud),
          destinoLongitud: Number(campos.destinoLongitud),
          duracionMinutos: Number(campos.duracionMinutos),
          medios,
        },
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
              <CardTitle>Editar tour</CardTitle>
              <CardDescription>
                Slug: <span className="font-mono">{textoDe(tour.slug)}</span> (no
                editable). Para textos y traducciones usa el botón "Traducciones"
                de la lista.
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
            </CardContent>
          </Card>

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

          <div className="flex items-center gap-2">
            {actualizar.isError && (
              <p className="text-destructive text-sm">{actualizar.error.message}</p>
            )}
            <Button type="submit" disabled={actualizar.isPending}>
              {actualizar.isPending ? "Guardando…" : "Guardar cambios"}
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

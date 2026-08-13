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
import { CampoCoordenadas } from "@/components/dashboard/campo-coordenadas";
import { CampoDuracion } from "@/components/dashboard/campo-duracion";
import { CampoMedios } from "@/components/dashboard/campo-medios";
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
  const [medios, setMedios] = useState<MedioEntrada[]>([]);
  const crear = useCrearTour();

  const cambiar = (clave: keyof typeof inicial) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setCampos((c) => ({ ...c, [clave]: e.target.value }));

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    crear.mutate(
      {
        slug: slugificar(campos.nombre || campos.destinoNombre),
        destinoNombre: campos.destinoNombre,
        destinoLatitud: Number(campos.destinoLatitud),
        destinoLongitud: Number(campos.destinoLongitud),
        duracionMinutos: Number(campos.duracionMinutos),
        medios: medios.length ? medios : undefined,
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
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Nuevo tour</CardTitle>
          <CardDescription>
            El slug se genera a partir del nombre del tour.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={enviar} className="grid gap-4">
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

            <CampoMedios categoria="tours" medios={medios} onCambiar={setMedios} />

            {crear.isError && (
              <p className="text-destructive text-sm">{crear.error.message}</p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={crear.isPending}>
                {crear.isPending ? "Guardando…" : "Crear tour"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/tours">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

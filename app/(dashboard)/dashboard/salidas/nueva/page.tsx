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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCrearSalida, useTours, useTransportes } from "@/hooks/use-catalogo";

const inicial = {
  tipo: "TRANSPORTE" as "TRANSPORTE" | "TOUR",
  servicioId: "",
  fechaHoraSalida: "",
  capacidad: "",
  minimoPasajeros: "",
  precioPen: "",
  precioUsd: "",
};

export default function PaginaNuevaSalida() {
  const router = useRouter();
  const [campos, setCampos] = useState(inicial);
  const crear = useCrearSalida();
  const { data: transportes } = useTransportes({ porPagina: 100 });
  const { data: tours } = useTours({ porPagina: 100 });

  const opciones =
    campos.tipo === "TRANSPORTE"
      ? (transportes?.datos ?? []).map((t) => ({
          id: t.id,
          nombre: `${t.origenNombre} → ${t.destinoNombre}`,
        }))
      : (tours?.datos ?? []).map((t) => ({
          id: t.id,
          nombre: String(t.nombre ?? t.destinoNombre ?? t.slug),
        }));

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    crear.mutate(
      {
        tipo: campos.tipo,
        servicioId: campos.servicioId,
        datos: {
          fechaHoraSalida: new Date(campos.fechaHoraSalida).toISOString(),
          capacidad: Number(campos.capacidad),
          minimoPasajeros: campos.minimoPasajeros
            ? Number(campos.minimoPasajeros)
            : undefined,
          precioPen: Number(campos.precioPen),
          precioUsd: Number(campos.precioUsd),
        },
      },
      { onSuccess: () => router.push("/dashboard/salidas") },
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/salidas">
            <ArrowLeftIcon />
            Volver a salidas
          </Link>
        </Button>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Programar salida</CardTitle>
          <CardDescription>
            Publica una fecha con precio y capacidad para una ruta o tour.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={enviar} className="grid gap-4">
            <div className="grid gap-2">
              <Label>Tipo de servicio</Label>
              <Select
                value={campos.tipo}
                onValueChange={(tipo) =>
                  setCampos((c) => ({
                    ...c,
                    tipo: tipo as "TRANSPORTE" | "TOUR",
                    servicioId: "",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRANSPORTE">Transporte</SelectItem>
                  <SelectItem value="TOUR">Tour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>{campos.tipo === "TRANSPORTE" ? "Ruta" : "Tour"}</Label>
              <Select
                value={campos.servicioId}
                onValueChange={(servicioId) =>
                  setCampos((c) => ({ ...c, servicioId }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona…" />
                </SelectTrigger>
                <SelectContent>
                  {opciones.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fechaSalida">Fecha y hora de salida</Label>
              <Input
                id="fechaSalida"
                required
                type="datetime-local"
                value={campos.fechaHoraSalida}
                onChange={(e) =>
                  setCampos((c) => ({ ...c, fechaHoraSalida: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="capacidad">Capacidad</Label>
                <Input id="capacidad" required type="number" min={1} placeholder="20" value={campos.capacidad} onChange={(e) => setCampos((c) => ({ ...c, capacidad: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minimo">Mínimo pasajeros</Label>
                <Input id="minimo" type="number" min={1} placeholder="2" value={campos.minimoPasajeros} onChange={(e) => setCampos((c) => ({ ...c, minimoPasajeros: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="precioPen">Precio S/</Label>
                <Input id="precioPen" required type="number" min={0} step="0.01" placeholder="150" value={campos.precioPen} onChange={(e) => setCampos((c) => ({ ...c, precioPen: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="precioUsd">Precio US$</Label>
                <Input id="precioUsd" required type="number" min={0} step="0.01" placeholder="45" value={campos.precioUsd} onChange={(e) => setCampos((c) => ({ ...c, precioUsd: e.target.value }))} />
              </div>
            </div>

            {crear.isError && (
              <p className="text-destructive text-sm">{crear.error.message}</p>
            )}

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={crear.isPending || !campos.servicioId}
              >
                {crear.isPending ? "Guardando…" : "Programar salida"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/salidas">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

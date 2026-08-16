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
import { Textarea } from "@/components/ui/textarea";
import { CampoMedios } from "@/components/dashboard/campo-medios";
import { useCrearPromocion } from "@/hooks/use-promociones";
import type { MedioEntrada, ObjetivoPromocion, TipoPromocion } from "@/lib/api";

const TIPOS: { valor: TipoPromocion; nombre: string }[] = [
  { valor: "DESCUENTO", nombre: "Descuento con cupón" },
  { valor: "OFERTA", nombre: "Oferta" },
  { valor: "EVENTO_ESPECIAL", nombre: "Evento especial" },
  { valor: "ANIVERSARIO", nombre: "Aniversario de la localidad" },
];

export default function PaginaNuevaPromocion() {
  const router = useRouter();
  const crear = useCrearPromocion();
  const [campos, setCampos] = useState({
    titulo: "",
    descripcion: "",
    tipo: "DESCUENTO" as TipoPromocion,
    objetivo: "TODOS" as ObjetivoPromocion,
    codigo: "",
    modoDescuento: "PORCENTAJE" as "PORCENTAJE" | "MONTO",
    porcentajeDescuento: "",
    montoDescuento: "",
    fechaInicio: "",
    fechaFin: "",
    limiteUsos: "",
  });
  const [medios, setMedios] = useState<MedioEntrada[]>([]);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    crear.mutate(
      {
        titulo: campos.titulo,
        descripcion: campos.descripcion || undefined,
        tipo: campos.tipo,
        objetivo: campos.objetivo,
        codigo: campos.codigo || undefined,
        porcentajeDescuento:
          campos.modoDescuento === "PORCENTAJE" && campos.porcentajeDescuento
            ? Number(campos.porcentajeDescuento)
            : undefined,
        montoDescuento:
          campos.modoDescuento === "MONTO" && campos.montoDescuento
            ? Number(campos.montoDescuento)
            : undefined,
        fechaInicio: new Date(campos.fechaInicio).toISOString(),
        fechaFin: new Date(campos.fechaFin).toISOString(),
        limiteUsos: campos.limiteUsos ? Number(campos.limiteUsos) : undefined,
        imagenUrl: medios[0]?.url,
        imagenClave: medios[0]?.clave,
      },
      { onSuccess: () => router.push("/dashboard/promociones") },
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/promociones">
            <ArrowLeftIcon />
            Volver a promociones
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Nueva promoción</CardTitle>
          <CardDescription>
            Ej.: "20% por aniversario de Cabanaconde" con cupón ANIV20, vigente
            del 10 al 20 de julio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={enviar} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="tituloPromo">Título</Label>
              <Input id="tituloPromo" required placeholder="20% de descuento por aniversario" value={campos.titulo} onChange={(e) => setCampos((c) => ({ ...c, titulo: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descPromo">Descripción (opcional)</Label>
              <Textarea id="descPromo" rows={2} placeholder="Celebramos el aniversario de la localidad con descuento en todas las rutas" value={campos.descripcion} onChange={(e) => setCampos((c) => ({ ...c, descripcion: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select value={campos.tipo} onValueChange={(tipo) => setCampos((c) => ({ ...c, tipo: tipo as TipoPromocion }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIPOS.map((t) => (
                      <SelectItem key={t.valor} value={t.valor}>{t.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Aplica a</Label>
                <Select value={campos.objetivo} onValueChange={(objetivo) => setCampos((c) => ({ ...c, objetivo: objetivo as ObjetivoPromocion }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todo (transportes y tours)</SelectItem>
                    <SelectItem value="TRANSPORTES">Solo transportes</SelectItem>
                    <SelectItem value="TOURS">Solo tours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CampoMedios categoria="promociones" medios={medios} onCambiar={setMedios} soloImagenes maximo={1} />
            <div className="grid gap-2">
              <Label htmlFor="cuponPromo">Cupón (opcional)</Label>
              <Input id="cuponPromo" placeholder="ANIV20 — el cliente lo escribe al reservar" value={campos.codigo} onChange={(e) => setCampos((c) => ({ ...c, codigo: e.target.value.toUpperCase() }))} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="grid gap-2">
                <Label>Descuento</Label>
                <Select value={campos.modoDescuento} onValueChange={(m) => setCampos((c) => ({ ...c, modoDescuento: m as "PORCENTAJE" | "MONTO" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PORCENTAJE">Porcentaje %</SelectItem>
                    <SelectItem value="MONTO">Monto fijo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {campos.modoDescuento === "PORCENTAJE" ? (
                <div className="grid gap-2">
                  <Label htmlFor="pct">%</Label>
                  <Input id="pct" required type="number" min={1} max={100} placeholder="20" value={campos.porcentajeDescuento} onChange={(e) => setCampos((c) => ({ ...c, porcentajeDescuento: e.target.value }))} />
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="monto">Monto</Label>
                  <Input id="monto" required type="number" min={0.01} step="0.01" placeholder="30.00" value={campos.montoDescuento} onChange={(e) => setCampos((c) => ({ ...c, montoDescuento: e.target.value }))} />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="limite">Límite de usos</Label>
                <Input id="limite" type="number" min={1} placeholder="Sin límite" value={campos.limiteUsos} onChange={(e) => setCampos((c) => ({ ...c, limiteUsos: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="inicio">Inicio</Label>
                <Input id="inicio" required type="datetime-local" value={campos.fechaInicio} onChange={(e) => setCampos((c) => ({ ...c, fechaInicio: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fin">Fin</Label>
                <Input id="fin" required type="datetime-local" value={campos.fechaFin} onChange={(e) => setCampos((c) => ({ ...c, fechaFin: e.target.value }))} />
              </div>
            </div>

            {crear.isError && (
              <p className="text-destructive text-sm">{crear.error.message}</p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={crear.isPending}>
                {crear.isPending ? "Guardando…" : "Crear promoción"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/promociones">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

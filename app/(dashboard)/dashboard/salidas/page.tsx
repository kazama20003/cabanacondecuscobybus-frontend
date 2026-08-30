"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paginacion } from "@/components/dashboard/paginacion";
import {
  useActualizarPlantilla,
  useActualizarSalida,
  useEliminarPlantilla,
  usePlantillasSalida,
  useSalidasAdmin,
} from "@/hooks/use-catalogo";
import type { EstadoSalida } from "@/lib/api";

const NOMBRES_DIAS = ["", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const ESTADOS: { valor: EstadoSalida; nombre: string }[] = [
  { valor: "BORRADOR", nombre: "Borrador" },
  { valor: "A_LA_VENTA", nombre: "A la venta" },
  { valor: "PENDIENTE_DE_MINIMO", nombre: "Pendiente de mínimo" },
  { valor: "CONFIRMADA", nombre: "Confirmada (sale sí o sí)" },
  { valor: "EN_CURSO", nombre: "En curso" },
  { valor: "FINALIZADA", nombre: "Finalizada" },
  { valor: "CANCELADA", nombre: "Cancelada" },
];

/** Convierte un ISO a valor para <input type="datetime-local"> en hora local. */
function aInputLocal(iso: string): string {
  const d = new Date(iso);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

const colorEstado: Record<EstadoSalida, "default" | "secondary" | "destructive" | "outline"> = {
  BORRADOR: "outline",
  A_LA_VENTA: "default",
  PENDIENTE_DE_MINIMO: "secondary",
  CONFIRMADA: "default",
  EN_CURSO: "secondary",
  FINALIZADA: "outline",
  CANCELADA: "destructive",
};

export default function PaginaSalidas() {
  const [tipo, setTipo] = useState<"TRANSPORTE" | "TOUR">("TRANSPORTE");
  const [pagina, setPagina] = useState(1);
  const { data: resultado, isLoading, isError, error } = useSalidasAdmin({
    tipo,
    pagina,
    porPagina: 10,
  });
  const actualizar = useActualizarSalida();
  const salidas = resultado?.datos ?? [];

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Control de salidas</CardTitle>
            <CardDescription>
              Decide qué sale y qué no: cambia el estado de cada salida
              (a la venta, confirmada, cancelada…) y mira la ocupación.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/salidas/nueva">
              <PlusIcon />
              Nueva salida
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Tabs
            value={tipo}
            onValueChange={(v) => {
              setTipo(v as "TRANSPORTE" | "TOUR");
              setPagina(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="TRANSPORTE">Transportes</TabsTrigger>
              <TabsTrigger value="TOUR">Tours</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading && <Skeleton className="h-48 w-full" />}
          {isError && (
            <p className="text-destructive text-sm">{error.message}</p>
          )}
          {actualizar.isError && (
            <p className="text-destructive text-sm">
              {actualizar.error.message}
            </p>
          )}

          {resultado && salidas.length === 0 && (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No hay salidas de este tipo todavía.
            </p>
          )}

          {salidas.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Fecha y hora</TableHead>
                  <TableHead>Ocupación</TableHead>
                  <TableHead>Precio S/</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-56">Cambiar estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salidas.map((s) => {
                  const nombre = s.transporte
                    ? `${s.transporte.origenNombre} → ${s.transporte.destinoNombre}`
                    : (s.tour?.destinoNombre ?? "—");
                  const llena = s.ocupados >= s.capacidad;
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{nombre}</TableCell>
                      <TableCell>
                        <Input
                          type="datetime-local"
                          defaultValue={aInputLocal(s.fechaHoraSalida)}
                          disabled={actualizar.isPending}
                          className="h-8 w-48"
                          onBlur={(e) => {
                            const valor = e.target.value;
                            if (!valor) return;
                            const iso = new Date(valor).toISOString();
                            if (iso === s.fechaHoraSalida) return;
                            actualizar.mutate({
                              tipo: tipo === "TOUR" ? "tour" : "transporte",
                              id: s.id,
                              cambios: { fechaHoraSalida: iso },
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <span className={llena ? "text-destructive font-semibold" : ""}>
                          {s.ocupados}/{s.capacidad}
                        </span>
                        <span className="text-muted-foreground ml-2 inline-flex items-center gap-1 text-xs">
                          mín.
                          <Input
                            type="number"
                            min={1}
                            defaultValue={s.minimoPasajeros}
                            disabled={actualizar.isPending}
                            className="h-6 w-16 text-xs"
                            onBlur={(e) => {
                              const n = Number(e.target.value);
                              if (n < 1 || n === s.minimoPasajeros) return;
                              actualizar.mutate({
                                tipo: tipo === "TOUR" ? "tour" : "transporte",
                                id: s.id,
                                cambios: { minimoPasajeros: n },
                              });
                            }}
                          />
                        </span>
                      </TableCell>
                      <TableCell>S/ {s.precioPen}</TableCell>
                      <TableCell>
                        <Badge variant={colorEstado[s.estado]}>
                          {ESTADOS.find((e) => e.valor === s.estado)?.nombre ??
                            s.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={s.estado}
                          disabled={actualizar.isPending}
                          onValueChange={(estado) =>
                            actualizar.mutate({
                              tipo: tipo === "TOUR" ? "tour" : "transporte",
                              id: s.id,
                              cambios: { estado: estado as EstadoSalida },
                            })
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ESTADOS.map((e) => (
                              <SelectItem key={e.valor} value={e.valor}>
                                {e.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          {resultado && (
            <Paginacion resultado={resultado} onCambiarPagina={setPagina} />
          )}
        </CardContent>
      </Card>

      <TarjetaPlantillas tipo={tipo} />
    </div>
  );
}

function TarjetaPlantillas({ tipo }: { tipo: "TRANSPORTE" | "TOUR" }) {
  const { data: plantillas, isLoading } = usePlantillasSalida(tipo);
  const actualizar = useActualizarPlantilla();
  const eliminar = useEliminarPlantilla();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horarios recurrentes</CardTitle>
        <CardDescription>
          Servicios que salen ciertos días de la semana: las salidas se generan
          solas dentro de su vigencia. Apaga un horario para dejar de generar.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading && <Skeleton className="h-24 w-full" />}
        {(actualizar.isError || eliminar.isError) && (
          <p className="text-destructive text-sm">
            {actualizar.error?.message ?? eliminar.error?.message}
          </p>
        )}
        {plantillas && plantillas.length === 0 && (
          <p className="text-muted-foreground py-4 text-center text-sm">
            No hay horarios recurrentes. Créalos desde “Nueva salida → Horario
            recurrente”.
          </p>
        )}
        {plantillas && plantillas.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead>Días</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Vigencia</TableHead>
                <TableHead>Precio S/</TableHead>
                <TableHead>Salidas</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {plantillas.map((p) => {
                const nombre = p.transporte
                  ? `${p.transporte.origenNombre} → ${p.transporte.destinoNombre}`
                  : (p.tour?.destinoNombre ?? "—");
                const generadas =
                  (p._count?.salidasTransporte ?? 0) +
                  (p._count?.salidasTour ?? 0);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{nombre}</TableCell>
                    <TableCell>
                      {p.diasSemana.map((d) => NOMBRES_DIAS[d]).join(", ")}
                    </TableCell>
                    <TableCell>{p.horaSalida}</TableCell>
                    <TableCell className="text-xs">
                      {p.fechaDesde.slice(0, 10)}
                      {" → "}
                      {p.fechaHasta ? p.fechaHasta.slice(0, 10) : "indefinida"}
                    </TableCell>
                    <TableCell>S/ {p.precioPen}</TableCell>
                    <TableCell>{generadas}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={p.activo ? "default" : "outline"}
                        disabled={actualizar.isPending}
                        onClick={() =>
                          actualizar.mutate({
                            id: p.id,
                            cambios: { activo: !p.activo },
                          })
                        }
                      >
                        {p.activo ? "Activo" : "Pausado"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={eliminar.isPending}
                        onClick={() => {
                          if (
                            confirm(
                              "¿Eliminar este horario? Se borran sus salidas futuras sin reservas.",
                            )
                          )
                            eliminar.mutate(p.id);
                        }}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

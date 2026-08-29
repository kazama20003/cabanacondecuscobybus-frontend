"use client";

import { Fragment, useState } from "react";
import { ChevronDownIcon, ChevronRightIcon, HistoryIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Paginacion } from "@/components/dashboard/paginacion";
import { useAuditoria } from "@/hooks/use-auditoria";
import type { EntidadAuditoria } from "@/lib/api";

const ENTIDADES: { valor: EntidadAuditoria | "TODAS"; nombre: string }[] = [
  { valor: "TODAS", nombre: "Todas las entidades" },
  { valor: "TRANSPORTE", nombre: "Transportes" },
  { valor: "TOUR", nombre: "Tours" },
  { valor: "SALIDA", nombre: "Salidas" },
  { valor: "PLANTILLA_SALIDA", nombre: "Horarios recurrentes" },
  { valor: "PROMOCION", nombre: "Promociones" },
  { valor: "USUARIO", nombre: "Usuarios" },
  { valor: "PAGO", nombre: "Pagos" },
];

const COLOR_ACCION: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  CREAR: "default",
  ACTUALIZAR: "secondary",
  ELIMINAR: "destructive",
  DESACTIVAR: "destructive",
  CONFIRMAR: "default",
};

function fechaLegible(iso: string) {
  return new Date(iso).toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const NOMBRES_CAMPOS: Record<string, string> = {
  origenNombre: "Origen",
  destinoNombre: "Destino",
  duracionMinutosEstimada: "Duración estimada (min)",
  duracionMinutos: "Duración (min)",
  capacidad: "Capacidad",
  minimoPasajeros: "Mínimo de pasajeros",
  precioPen: "Precio S/",
  precioUsd: "Precio US$",
  fechaHoraSalida: "Fecha y hora de salida",
  estado: "Estado",
  vehiculoId: "Vehículo",
  horaSalida: "Hora de salida",
  diasSemana: "Días de la semana",
  fechaDesde: "Vigente desde",
  fechaHasta: "Vigente hasta",
  activo: "Activo",
  rol: "Rol",
  titulo: "Título",
  descripcion: "Descripción",
  tipo: "Tipo",
  codigo: "Código",
  porcentajeDescuento: "% de descuento",
  montoDescuento: "Monto de descuento",
  fechaInicio: "Fecha de inicio",
  fechaFin: "Fecha de fin",
  limiteUsos: "Límite de usos",
  salidasGeneradas: "Salidas generadas",
  origen: "Origen",
  destino: "Destino",
  paradas: "Paradas",
  medios: "Fotos/videos",
  permiteAdelanto: "Permite adelanto",
  porcentajeAdelanto: "% de adelanto",
  objetivo: "Objetivo",
};

function valorLegible(valor: unknown): string {
  if (valor === null || valor === undefined) return "—";
  if (typeof valor === "boolean") return valor ? "Sí" : "No";
  if (Array.isArray(valor)) return valor.map((v) => valorLegible(v)).join(", ");
  if (typeof valor === "object") return JSON.stringify(valor);
  return String(valor);
}

/** Aplana el detalle: los valores nuevos van en `cambios`; el resto son metadatos. */
function filasDetalle(detalle: Record<string, unknown>) {
  const { cambios, ...resto } = detalle;
  const filas: { campo: string; valor: string }[] = [];
  const agregar = (obj: Record<string, unknown>) => {
    for (const [clave, valor] of Object.entries(obj)) {
      if (valor === undefined) continue;
      filas.push({
        campo: NOMBRES_CAMPOS[clave] ?? clave,
        valor: valorLegible(valor),
      });
    }
  };
  if (cambios && typeof cambios === "object") {
    agregar(cambios as Record<string, unknown>);
  }
  agregar(resto);
  return filas;
}

export default function PaginaAuditoria() {
  const [entidad, setEntidad] = useState<EntidadAuditoria | "TODAS">("TODAS");
  const [pagina, setPagina] = useState(1);
  const [expandido, setExpandido] = useState<string | null>(null);
  const { data: resultado, isLoading, isError, error } = useAuditoria({
    pagina,
    porPagina: 20,
    ...(entidad !== "TODAS" ? { entidad } : {}),
  });
  const registros = resultado?.datos ?? [];

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 [&_svg]:size-4">
              <HistoryIcon /> Auditoría
            </CardTitle>
            <CardDescription>
              Quién hizo qué en el panel. El historial se conserva 30 días y
              luego se purga automáticamente.
            </CardDescription>
          </div>
          <Select
            value={entidad}
            onValueChange={(v) => {
              setEntidad(v as EntidadAuditoria | "TODAS");
              setPagina(1);
            }}
          >
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ENTIDADES.map((e) => (
                <SelectItem key={e.valor} value={e.valor}>
                  {e.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {isLoading && <Skeleton className="h-48 w-full" />}
          {isError && (
            <p className="text-destructive text-sm">{error.message}</p>
          )}
          {resultado && registros.length === 0 && (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Sin actividad registrada{entidad !== "TODAS" ? " para este filtro" : ""}.
            </p>
          )}
          {registros.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Entidad</TableHead>
                  <TableHead>Descripción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registros.map((r) => {
                  const filas = r.detalle ? filasDetalle(r.detalle) : [];
                  const abierto = expandido === r.id;
                  return (
                    <Fragment key={r.id}>
                      <TableRow
                        className="cursor-pointer"
                        onClick={() => setExpandido(abierto ? null : r.id)}
                      >
                        <TableCell className="text-muted-foreground">
                          {abierto ? (
                            <ChevronDownIcon className="size-4" />
                          ) : (
                            <ChevronRightIcon className="size-4" />
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap text-xs">
                          {fechaLegible(r.creadoEn)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {r.usuario
                            ? `${r.usuario.nombres} ${r.usuario.apellidos}`.trim() ||
                              r.usuario.correo
                            : "Sistema"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={COLOR_ACCION[r.accion] ?? "outline"}>
                            {r.accion.toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {ENTIDADES.find((e) => e.valor === r.entidad)
                            ?.nombre ?? r.entidad}
                        </TableCell>
                        <TableCell>{r.descripcion}</TableCell>
                      </TableRow>
                      {abierto && (
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableCell />
                          <TableCell colSpan={5} className="py-3">
                            <div className="text-muted-foreground mb-3 grid gap-x-8 gap-y-1 text-xs sm:grid-cols-2 lg:grid-cols-3">
                              <span>
                                Fecha exacta:{" "}
                                <span className="text-foreground font-medium">
                                  {new Date(r.creadoEn).toLocaleString("es-PE", {
                                    dateStyle: "full",
                                    timeStyle: "medium",
                                  })}
                                </span>
                              </span>
                              <span>
                                Usuario:{" "}
                                <span className="text-foreground font-medium">
                                  {r.usuario?.correo ?? "Sistema"}
                                </span>
                              </span>
                              {r.entidadId && (
                                <span>
                                  ID de la entidad:{" "}
                                  <span className="text-foreground font-mono text-[11px] font-medium">
                                    {r.entidadId}
                                  </span>
                                </span>
                              )}
                            </div>
                            {filas.length > 0 ? (
                              <>
                                <p className="text-muted-foreground mb-2 text-xs font-medium">
                                  Valores registrados en ese momento
                                </p>
                                <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                                  {filas.map((f, i) => (
                                    <div
                                      key={i}
                                      className="flex justify-between gap-3 text-sm"
                                    >
                                      <span className="text-muted-foreground">
                                        {f.campo}
                                      </span>
                                      <span className="text-right font-medium break-all">
                                        {f.valor}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <p className="text-muted-foreground text-sm">
                                Este registro no guardó valores de cambio (se
                                creó antes de activar el detalle o la acción no
                                los requiere).
                              </p>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
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
    </div>
  );
}

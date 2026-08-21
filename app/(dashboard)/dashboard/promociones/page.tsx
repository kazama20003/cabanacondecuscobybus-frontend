"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import ImageSlot from "@/components/image-slot";
import {
  useActualizarPromocion,
  useEliminarPromocion,
  usePromociones,
} from "@/hooks/use-promociones";
import type { TipoPromocion } from "@/lib/api";

const nombreTipo: Record<TipoPromocion, string> = {
  OFERTA: "Oferta",
  DESCUENTO: "Descuento",
  EVENTO_ESPECIAL: "Evento especial",
  ANIVERSARIO: "Aniversario",
};

export default function PaginaPromociones() {
  const [pagina, setPagina] = useState(1);
  const { data: resultado, isLoading, isError, error } = usePromociones({
    pagina,
    porPagina: 10,
  });
  const actualizar = useActualizarPromocion();
  const eliminar = useEliminarPromocion();
  const promociones = resultado?.datos ?? [];

  const vigente = (inicio: string, fin: string) => {
    const ahora = Date.now();
    return ahora >= new Date(inicio).getTime() && ahora <= new Date(fin).getTime();
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Ofertas y promociones</CardTitle>
            <CardDescription>
              Descuentos con cupón, ofertas, eventos especiales y aniversarios.
              El descuento se aplica automáticamente al reservar con el cupón.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/promociones/nueva">
              <PlusIcon />
              Nueva promoción
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {isLoading && <Skeleton className="h-48 w-full" />}
          {isError && <p className="text-destructive text-sm">{error.message}</p>}
          {(actualizar.isError || eliminar.isError) && (
            <p className="text-destructive text-sm">
              {actualizar.error?.message ?? eliminar.error?.message}
            </p>
          )}

          {resultado && promociones.length === 0 && (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Sin promociones aún. Crea la primera, por ejemplo un descuento por
              el aniversario de la localidad.
            </p>
          )}

          {promociones.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Imagen</TableHead>
                  <TableHead>Promoción</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cupón</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Vigencia</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Activa</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {promociones.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="relative h-11 w-11">
                        <ImageSlot
                          radius={8}
                          src={p.imagenUrl ?? undefined}
                          placeholder="—"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {p.titulo}
                      {vigente(p.fechaInicio, p.fechaFin) && p.activo && (
                        <Badge className="ml-2">vigente</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{nombreTipo[p.tipo]}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {p.codigo ?? "—"}
                    </TableCell>
                    <TableCell>
                      {p.porcentajeDescuento
                        ? `${p.porcentajeDescuento}%`
                        : p.montoDescuento
                          ? `- ${p.montoDescuento}`
                          : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(p.fechaInicio).toLocaleDateString("es-PE")} –{" "}
                      {new Date(p.fechaFin).toLocaleDateString("es-PE")}
                    </TableCell>
                    <TableCell>
                      {p.usos}
                      {p.limiteUsos ? `/${p.limiteUsos}` : ""}
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={p.activo}
                        disabled={actualizar.isPending}
                        onCheckedChange={(marcado) =>
                          actualizar.mutate({
                            id: p.id,
                            datos: { activo: marcado === true },
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive size-7"
                        disabled={eliminar.isPending}
                        onClick={() => eliminar.mutate(p.id)}
                        aria-label="Desactivar promoción"
                      >
                        <Trash2Icon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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

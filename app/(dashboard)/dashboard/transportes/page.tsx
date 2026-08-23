"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { LanguagesIcon, MapPinIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Paginacion } from "@/components/dashboard/paginacion";
import ImageSlot from "@/components/image-slot";
import { useEliminarTransporte, useTransportes } from "@/hooks/use-catalogo";

export default function PaginaTransportes() {
  const [pagina, setPagina] = useState(1);
  const { data: resultado, isLoading, isError, error } = useTransportes({
    pagina,
    porPagina: 10,
  });
  const transportes = resultado?.datos ?? [];
  const eliminar = useEliminarTransporte();

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Rutas de transporte</CardTitle>
            <CardDescription>
              Rutas turísticas publicadas en el sitio.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/transportes/nuevo">
              <PlusIcon />
              Nueva ruta
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
          {isError && (
            <p className="text-destructive text-sm">
              No se pudo cargar el catálogo: {error.message}
            </p>
          )}
          {resultado && transportes.length === 0 && (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Aún no hay rutas registradas. Crea la primera con "Nueva ruta".
            </p>
          )}
          {transportes.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Imagen</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Salidas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transportes.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="relative h-11 w-11">
                        <ImageSlot
                          radius={8}
                          src={
                            t.imagenes?.[0]?.tipo === "VIDEO"
                              ? undefined
                              : t.imagenes?.[0]?.url
                          }
                          video={
                            t.imagenes?.[0]?.tipo === "VIDEO"
                              ? t.imagenes?.[0]?.url
                              : undefined
                          }
                          placeholder="—"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {t.origenNombre} → {t.destinoNombre}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{t.slug}</TableCell>
                    <TableCell>{t.salidas?.length ?? 0}</TableCell>
                    <TableCell>
                      <Badge variant={t.activo ? "default" : "secondary"}>
                        {t.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/transportes/${t.slug}/editar`}>
                            <PencilIcon />
                            Editar
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/transportes/${t.slug}/paradas`}>
                            <MapPinIcon />
                            Paradas ({t.paradas?.length ?? 0})
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          disabled={eliminar.isPending || (t.salidas?.length ?? 0) > 0}
                          onClick={() => {
                            if (window.confirm("Se eliminará la ruta y todos sus medios de Cloudinary. ¿Continuar?")) eliminar.mutate(t.id);
                          }}
                        >
                          <Trash2Icon /> Eliminar
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/transportes/${t.slug}/traducciones`}>
                            <LanguagesIcon />
                            Traducciones
                          </Link>
                        </Button>
                      </div>
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

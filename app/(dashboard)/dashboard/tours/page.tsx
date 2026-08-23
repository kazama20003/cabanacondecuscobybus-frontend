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
import { LanguagesIcon, ListOrderedIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Paginacion } from "@/components/dashboard/paginacion";
import ImageSlot from "@/components/image-slot";
import { useEliminarTour, useTours } from "@/hooks/use-catalogo";

export default function PaginaTours() {
  const [pagina, setPagina] = useState(1);
  const { data: resultado, isLoading, isError, error } = useTours({
    pagina,
    porPagina: 10,
  });
  const tours = resultado?.datos ?? [];
  const eliminar = useEliminarTour();

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tours</CardTitle>
            <CardDescription>Tours publicados en el sitio.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/tours/nuevo">
              <PlusIcon />
              Nuevo tour
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
              No se pudo cargar los tours: {error.message}
            </p>
          )}
          {resultado && tours.length === 0 && (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Aún no hay tours registrados. Crea el primero con "Nuevo tour".
            </p>
          )}
          {tours.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Imagen</TableHead>
                  <TableHead>Tour</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Salidas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tours.map((tour) => (
                  <TableRow key={tour.id}>
                    <TableCell>
                      <div className="relative h-11 w-11">
                        <ImageSlot
                          radius={8}
                          src={
                            tour.imagenes?.[0]?.tipo === "VIDEO"
                              ? undefined
                              : tour.imagenes?.[0]?.url
                          }
                          video={
                            tour.imagenes?.[0]?.tipo === "VIDEO"
                              ? tour.imagenes?.[0]?.url
                              : undefined
                          }
                          placeholder="—"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {String(tour.nombre ?? tour.destinoNombre ?? tour.slug)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{tour.slug}</TableCell>
                    <TableCell>{tour.salidas?.length ?? 0}</TableCell>
                    <TableCell>
                      <Badge variant={tour.activo ? "default" : "secondary"}>
                        {tour.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/tours/${tour.slug}/editar`}>
                            <PencilIcon />
                            Editar
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/tours/${tour.slug}/itinerario`}>
                            <ListOrderedIcon />
                            Itinerario
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          disabled={eliminar.isPending || (tour.salidas?.length ?? 0) > 0}
                          onClick={() => {
                            if (window.confirm("Se eliminará el tour y todos sus medios de Cloudinary. ¿Continuar?")) eliminar.mutate(tour.id);
                          }}
                        >
                          <Trash2Icon /> Eliminar
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/tours/${tour.slug}/traducciones`}>
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

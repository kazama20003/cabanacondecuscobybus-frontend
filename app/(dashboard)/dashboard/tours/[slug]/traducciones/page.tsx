"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useEditarTraduccion,
  useTraducciones,
  useTour,
} from "@/hooks/use-catalogo";
import type { TraduccionApi } from "@/lib/api";

const NOMBRES_IDIOMA: Record<string, string> = {
  es: "Español",
  en: "English",
};

function FormularioIdioma({
  traduccion,
  tourId,
}: {
  traduccion: TraduccionApi;
  tourId: string;
}) {
  const [campos, setCampos] = useState({
    titulo: traduccion.titulo,
    resumen: traduccion.resumen,
    descripcion: traduccion.descripcion,
    queLlevar: traduccion.queLlevar ?? "",
  });
  const [guardado, setGuardado] = useState(false);
  const editar = useEditarTraduccion();

  useEffect(() => {
    setCampos({
      titulo: traduccion.titulo,
      resumen: traduccion.resumen,
      descripcion: traduccion.descripcion,
      queLlevar: traduccion.queLlevar ?? "",
    });
  }, [traduccion]);

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    setGuardado(false);
    editar.mutate(
      {
        tipo: "tours",
        id: tourId,
        idioma: traduccion.idioma,
        datos: {
          titulo: campos.titulo,
          resumen: campos.resumen,
          descripcion: campos.descripcion,
          queLlevar: campos.queLlevar || undefined,
          estado: "PUBLICADA",
        },
      },
      { onSuccess: () => setGuardado(true) },
    );
  };

  return (
    <form onSubmit={guardar} className="grid gap-4">
      <div className="grid gap-2">
        <Label>Título</Label>
        <Input
          required
          value={campos.titulo}
          onChange={(e) => setCampos((c) => ({ ...c, titulo: e.target.value }))}
        />
      </div>
      <div className="grid gap-2">
        <Label>Resumen</Label>
        <Input
          required
          value={campos.resumen}
          onChange={(e) => setCampos((c) => ({ ...c, resumen: e.target.value }))}
        />
      </div>
      <div className="grid gap-2">
        <Label>Descripción</Label>
        <Textarea
          required
          rows={6}
          value={campos.descripcion}
          onChange={(e) =>
            setCampos((c) => ({ ...c, descripcion: e.target.value }))
          }
        />
      </div>
      <div className="grid gap-2">
        <Label>Qué llevar (opcional)</Label>
        <Textarea
          rows={3}
          value={campos.queLlevar}
          onChange={(e) =>
            setCampos((c) => ({ ...c, queLlevar: e.target.value }))
          }
        />
      </div>

      {editar.isError && (
        <p className="text-destructive text-sm">{editar.error.message}</p>
      )}
      {guardado && !editar.isPending && (
        <p className="flex items-center gap-1 text-sm text-green-600">
          <CheckIcon className="size-4" /> Traducción guardada
        </p>
      )}

      <div>
        <Button type="submit" disabled={editar.isPending}>
          {editar.isPending ? "Guardando…" : "Guardar traducción"}
        </Button>
      </div>
    </form>
  );
}

export default function PaginaTraduccionesTour({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: tour } = useTour(slug);
  const { data: traducciones, isLoading } = useTraducciones("tours", tour?.id);
  const crearTraduccion = useEditarTraduccion();

  if (isLoading || !tour || !traducciones) {
    return (
      <div className="flex flex-col gap-4 p-4 lg:p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full max-w-2xl" />
      </div>
    );
  }

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
          <CardTitle>
            Traducciones: {String(tour.nombre ?? tour.destinoNombre ?? tour.slug)}
          </CardTitle>
          <CardDescription>
            Redacta y publica las traducciones manualmente. El sitio usa español
            mientras una traducción publicada no esté disponible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {traducciones.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              Este tour no tiene contenido todavía.
            </p>
          ) : (
            <Tabs defaultValue={traducciones[0].idioma}>
              <div className="flex flex-wrap items-center gap-2">
              <TabsList>
                {traducciones.map((t) => (
                  <TabsTrigger key={t.idioma} value={t.idioma}>
                    {NOMBRES_IDIOMA[t.idioma] ?? t.idioma.toUpperCase()}
                    <Badge
                      variant={t.estado === "PUBLICADA" ? "default" : "secondary"}
                      className="ml-1"
                    >
                      {t.estado === "PUBLICADA" ? "publicada" : "borrador"}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
              {!traducciones.some((t) => t.idioma === "en") && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={crearTraduccion.isPending}
                  onClick={() => {
                    const espanol = traducciones.find((t) => t.idioma === "es");
                    if (!espanol) return;
                    crearTraduccion.mutate({
                      tipo: "tours",
                      id: tour.id,
                      idioma: "en",
                      datos: { titulo: espanol.titulo, resumen: espanol.resumen, descripcion: espanol.descripcion, queLlevar: espanol.queLlevar ?? undefined, estado: "BORRADOR" },
                    });
                  }}
                >
                  Añadir inglés
                </Button>
              )}
              </div>
              {traducciones.map((t) => (
                <TabsContent key={t.idioma} value={t.idioma} className="pt-4">
                  <FormularioIdioma traduccion={t} tourId={tour.id} />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

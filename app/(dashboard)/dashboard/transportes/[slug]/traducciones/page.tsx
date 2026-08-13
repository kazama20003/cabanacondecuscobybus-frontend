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
  useTransporte,
} from "@/hooks/use-catalogo";
import type { TraduccionApi } from "@/lib/api";

const NOMBRES_IDIOMA: Record<string, string> = {
  es: "Español",
  en: "English",
};

function FormularioIdioma({
  traduccion,
  transporteId,
}: {
  traduccion: TraduccionApi;
  transporteId: string;
}) {
  const [campos, setCampos] = useState({
    titulo: traduccion.titulo,
    resumen: traduccion.resumen,
    descripcion: traduccion.descripcion,
  });
  const [guardado, setGuardado] = useState(false);
  const editar = useEditarTraduccion();

  useEffect(() => {
    setCampos({
      titulo: traduccion.titulo,
      resumen: traduccion.resumen,
      descripcion: traduccion.descripcion,
    });
  }, [traduccion]);

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    setGuardado(false);
    editar.mutate(
      {
        tipo: "transportes",
        id: transporteId,
        idioma: traduccion.idioma,
        datos: { ...campos, estado: "PUBLICADA" },
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

export default function PaginaTraducciones({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: transporte } = useTransporte(slug);
  const { data: traducciones, isLoading } = useTraducciones(
    "transportes",
    transporte?.id,
  );

  if (isLoading || !transporte || !traducciones) {
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
          <Link href="/dashboard/transportes">
            <ArrowLeftIcon />
            Volver a transportes
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>
            Traducciones: {transporte.origenNombre} → {transporte.destinoNombre}
          </CardTitle>
          <CardDescription>
            El inglés se generó automáticamente con Google Translate — revisa y
            corrige lo que suene raro. Los cambios se publican al guardar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {traducciones.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              Esta ruta no tiene contenido todavía (se creó sin la sección de
              información para el turista).
            </p>
          ) : (
            <Tabs defaultValue={traducciones[0].idioma}>
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
              {traducciones.map((t) => (
                <TabsContent key={t.idioma} value={t.idioma} className="pt-4">
                  <FormularioIdioma
                    traduccion={t}
                    transporteId={transporte.id}
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

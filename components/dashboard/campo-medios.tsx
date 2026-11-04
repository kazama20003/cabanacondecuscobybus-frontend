"use client";

import { useRef, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, FilmIcon, ImageIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import { Badge } from "@/components/native-ui/badge";
import { Button } from "@/components/native-ui/button";
import { Label } from "@/components/native-ui/label";
import { servicioArchivos } from "@/lib/api";
import type { MedioEntrada } from "@/lib/api";

/* Los medios del catálogo se guardan en Google Cloud Storage desde el backend. */
export function CampoMedios({
  categoria,
  medios,
  onCambiar,
  soloImagenes = false,
  maximo,
}: {
  categoria: "transportes" | "tours" | "eventos" | "promociones";
  medios: MedioEntrada[];
  onCambiar: (medios: MedioEntrada[]) => void;
  soloImagenes?: boolean;
  maximo?: number;
}) {
  const imagenesRef = useRef<HTMLInputElement>(null);
  const videosRef = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const subirArchivos = async (archivos: FileList | null) => {
    if (!archivos?.length) return;
    setError(null);
    setSubiendo(archivos.length);
    const nuevos: MedioEntrada[] = [];
    try {
      const disponibles = maximo === undefined ? archivos.length : Math.max(0, maximo - medios.length);
      for (const archivo of Array.from(archivos).slice(0, disponibles)) {
        const carga = await servicioArchivos.subir(archivo, categoria);
        nuevos.push({ url: carga.urlPublica, clave: carga.clave, tipo: carga.tipo });
        setSubiendo((n) => n - 1);
      }
      onCambiar([...medios, ...nuevos]);
    } catch (e) {
      onCambiar([...medios, ...nuevos]);
      setError(e instanceof Error ? e.message : "No se pudo subir el archivo");
    } finally {
      setSubiendo(0);
      if (imagenesRef.current) imagenesRef.current.value = "";
      if (videosRef.current) videosRef.current.value = "";
    }
  };

  const mover = (indice: number, desplazamiento: -1 | 1) => {
    const destino = indice + desplazamiento;
    if (destino < 0 || destino >= medios.length) return;
    const ordenados = [...medios];
    [ordenados[indice], ordenados[destino]] = [ordenados[destino], ordenados[indice]];
    onCambiar(ordenados);
  };

  const primeraImagen = medios.findIndex((medio) => medio.tipo !== "VIDEO");

  return (
    <div className="grid gap-2">
      <Label>Imágenes y videos</Label>
      <input ref={imagenesRef} type="file" hidden multiple accept="image/jpeg,image/png,image/webp" onChange={(e) => subirArchivos(e.target.files)} />
      {!soloImagenes && <input ref={videosRef} type="file" hidden multiple accept="video/mp4,video/webm,video/quicktime" onChange={(e) => subirArchivos(e.target.files)} />}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={subiendo > 0 || (maximo !== undefined && medios.length >= maximo)}
          onClick={() => imagenesRef.current?.click()}
        >
          {subiendo > 0 ? (
            <>
              <Loader2Icon className="animate-spin" />
              Subiendo {subiendo}…
            </>
          ) : (
            <>
              <ImageIcon />
              Añadir imágenes
            </>
          )}
        </Button>
        {!soloImagenes && <Button type="button" variant="outline" disabled={subiendo > 0 || (maximo !== undefined && medios.length >= maximo)} onClick={() => videosRef.current?.click()}>
          {subiendo > 0 ? <Loader2Icon className="animate-spin" /> : <FilmIcon />}
          Añadir videos
        </Button>}
      </div>

      <p className="text-muted-foreground text-xs">
        La primera imagen se usa como portada. Los videos quedan asociados únicamente a este producto.
      </p>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {medios.length > 0 && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {medios.map((medio, i) => (
            <li
              key={`${medio.url}-${i}`}
              className="flex items-center gap-2 rounded-lg border p-2"
            >
              {medio.tipo === "VIDEO" ? (
                <div className="bg-muted flex size-14 shrink-0 items-center justify-center rounded-md">
                  <FilmIcon className="text-muted-foreground size-6" />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={medio.url || undefined}
                  alt={medio.textoAlterno ?? ""}
                  className="size-14 shrink-0 rounded-md object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <Badge variant="secondary" className="mb-1">
                  {medio.tipo === "VIDEO" ? (
                    <>
                      <FilmIcon /> Video
                    </>
                  ) : (
                    <>
                      <ImageIcon /> Imagen
                    </>
                  )}
                </Badge>
                {medio.tipo !== "VIDEO" && i === primeraImagen && <Badge className="mb-1 ml-1">Portada</Badge>}
                <p className="text-muted-foreground truncate text-xs">{medio.url}</p>
              </div>
              <div className="flex shrink-0 flex-col">
                <Button type="button" variant="ghost" size="icon" className="size-7" disabled={i === 0 || subiendo > 0} onClick={() => mover(i, -1)} aria-label="Subir posición del medio"><ArrowUpIcon /></Button>
                <Button type="button" variant="ghost" size="icon" className="size-7" disabled={i === medios.length - 1 || subiendo > 0} onClick={() => mover(i, 1)} aria-label="Bajar posición del medio"><ArrowDownIcon /></Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive size-7"
                onClick={async () => {
                  try {
                    if (medio.clave) await servicioArchivos.eliminar(medio.clave, medio.tipo ?? "IMAGEN", categoria);
                    onCambiar(medios.filter((_, j) => j !== i));
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "No se pudo eliminar el archivo");
                  }
                }}
                aria-label="Quitar"
              >
                <Trash2Icon />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-muted-foreground text-xs">{soloImagenes ? "JPG, PNG o WebP." : "Imágenes JPG, PNG o WebP. Videos MP4, WebM o MOV."} Se almacenan en Google Cloud Storage.</p>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { FilmIcon, ImageIcon, Loader2Icon, Trash2Icon, UploadIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { servicioArchivos } from "@/lib/api";
import type { MedioEntrada } from "@/lib/api";

/* El backend carga los medios a Cloudinary y devuelve la clave para su limpieza. */
export function CampoMedios({
  categoria,
  medios,
  onCambiar,
  soloImagenes = false,
  maximo,
}: {
  categoria: "transportes" | "tours" | "promociones";
  medios: MedioEntrada[];
  onCambiar: (medios: MedioEntrada[]) => void;
  soloImagenes?: boolean;
  maximo?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
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
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="grid gap-2">
      <Label>Imágenes y videos</Label>
      <input
        ref={inputRef}
        type="file"
        hidden
        multiple
        accept={soloImagenes ? "image/jpeg,image/png,image/webp" : "image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"}
        onChange={(e) => subirArchivos(e.target.files)}
      />
      <div>
        <Button
          type="button"
          variant="outline"
          disabled={subiendo > 0 || (maximo !== undefined && medios.length >= maximo)}
          onClick={() => inputRef.current?.click()}
        >
          {subiendo > 0 ? (
            <>
              <Loader2Icon className="animate-spin" />
              Subiendo {subiendo}…
            </>
          ) : (
            <>
              <UploadIcon />
              Subir imágenes o videos
            </>
          )}
        </Button>
      </div>

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
                  src={medio.url}
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
                <p className="text-muted-foreground truncate text-xs">{medio.url}</p>
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
      <p className="text-muted-foreground text-xs">
        {soloImagenes ? "JPG, PNG o WebP." : "JPG, PNG, WebP, MP4, WebM o MOV."} Se almacenan de forma segura en Cloudinary.
      </p>
    </div>
  );
}

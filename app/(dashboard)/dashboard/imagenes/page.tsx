"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PaginaImagenes() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Imágenes</CardTitle>
          <CardDescription>
            El backend genera URLs firmadas de carga a AWS S3 vía
            POST /api/administracion/archivos/cargas (admin y operador). Las
            imágenes se suben desde los formularios de rutas y tours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Requiere en el backend: AWS_REGION, AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY y S3_BUCKET.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

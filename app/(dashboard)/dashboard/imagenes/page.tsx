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
            Las imágenes y videos se cargan de forma segura a Cloudinary desde
            los formularios de rutas, tours y promociones. Al eliminar un medio
            antes de guardar, también se elimina su recurso remoto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Requiere CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y
            CLOUDINARY_API_SECRET en el backend.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

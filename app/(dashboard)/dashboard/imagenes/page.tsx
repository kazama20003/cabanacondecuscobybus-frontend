"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/native-ui/card";

export default function PaginaImagenes() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Imágenes</CardTitle>
          <CardDescription>
            Las imágenes y videos del catálogo se guardan en Google Cloud Storage desde
            los formularios de rutas, tours y promociones. Al eliminar un medio
            antes de guardar, también se elimina su recurso remoto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Requiere GCS_BUCKET_MEDIA y credenciales ADC o una cuenta de servicio con acceso al bucket en el backend.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

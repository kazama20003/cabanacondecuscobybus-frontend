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
            El backend genera URLs firmadas de carga a Cloudflare R2 vía
            POST /api/administracion/archivos/cargas-imagen (solo administrador).
            Aquí va el cargador de imágenes para transportes y tours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Pendiente de conectar: requiere las credenciales R2 configuradas en el
            backend (R2_CUENTA_ID, R2_LLAVE_ACCESO_ID, R2_LLAVE_SECRETA).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

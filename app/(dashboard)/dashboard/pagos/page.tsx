"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PaginaPagos() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Confirmación de pagos</CardTitle>
          <CardDescription>
            El backend expone POST /api/reservas/administracion/pagos/:pagoId/confirmar
            (solo administrador). Falta el endpoint de listado de pagos pendientes
            para poblar esta vista.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 text-sm">
          <Badge variant="secondary">IZIPAY</Badge>
          <Badge variant="secondary">TRANSFERENCIA</Badge>
          <Badge variant="secondary">EFECTIVO_OFICINA</Badge>
        </CardContent>
      </Card>
    </div>
  );
}

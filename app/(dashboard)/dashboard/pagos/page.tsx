"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConfirmarPago, usePagosAdministracion } from "@/hooks/use-pagos";
import type { MetodoPago } from "@/lib/api";

export default function PaginaPagos() {
  const [metodo, setMetodo] = useState<MetodoPago | "">("");
  const pagos = usePagosAdministracion({ metodo: metodo || undefined });
  const confirmar = useConfirmarPago();

  const confirmarPago = (pagoId: string) => {
    if (window.confirm("¿Confirmar este pago manual? Esta acción aprobará la reserva.")) {
      confirmar.mutate(pagoId);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Confirmación de pagos</CardTitle>
          <CardDescription>
            Los pagos Izipay se confirman exclusivamente por IPN firmado. Solo los
            comprobantes manuales pueden confirmarse desde este panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex max-w-xs flex-col gap-1 text-sm font-medium">
            Método de pago
            <select
              className="rounded-md border bg-background px-3 py-2 font-normal"
              value={metodo}
              onChange={(event) => setMetodo(event.target.value as MetodoPago | "")}
            >
              <option value="">Todos</option>
              <option value="IZIPAY">Izipay</option>
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="EFECTIVO_OFICINA">Efectivo en oficina</option>
            </select>
          </label>

          {pagos.isLoading && <p className="text-sm text-muted-foreground">Cargando pagos...</p>}
          {pagos.isError && <p className="text-sm text-destructive">No se pudieron cargar los pagos.</p>}
          {pagos.data && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reserva</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Referencia</TableHead>
                  <TableHead>Confirmado</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagos.data.datos.map((pago) => (
                  <TableRow key={pago.id}>
                    <TableCell className="font-medium">{pago.reserva.codigo}</TableCell>
                    <TableCell>{pago.reserva.correoContacto}</TableCell>
                    <TableCell><Badge variant="secondary">{pago.metodo}</Badge></TableCell>
                    <TableCell>{pago.moneda === "USD" ? "US$" : "S/"} {Number(pago.monto).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={pago.estado === "APROBADO" ? "default" : "secondary"}>
                        {pago.metodo === "IZIPAY" && pago.estado === "APROBADO" ? "IPN confirmado" : pago.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>{pago.referenciaProveedor ?? pago.codigoOperacion ?? "-"}</TableCell>
                    <TableCell>{pago.confirmadoEn ? new Date(pago.confirmadoEn).toLocaleString("es-PE") : "-"}</TableCell>
                    <TableCell>
                      {pago.metodo !== "IZIPAY" && pago.estado === "PENDIENTE" && (
                        <Button size="sm" onClick={() => confirmarPago(pago.id)} disabled={confirmar.isPending}>
                          Confirmar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {pagos.data?.datos.length === 0 && <p className="text-sm text-muted-foreground">No hay pagos para este filtro.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

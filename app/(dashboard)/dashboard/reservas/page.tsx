"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
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
import { useReservaInvitado } from "@/hooks/use-reservas";

export default function PaginaReservas() {
  const [codigo, setCodigo] = useState("");
  const [token, setToken] = useState("");
  const [busqueda, setBusqueda] = useState<{ codigo: string; token: string } | null>(null);
  const { data: reserva, isFetching, isError, error } = useReservaInvitado(
    busqueda?.codigo ?? "",
    busqueda?.token ?? "",
  );

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Buscar reserva</CardTitle>
          <CardDescription>
            Consulta una reserva por su código y token de gestión.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              if (codigo && token) setBusqueda({ codigo, token });
            }}
          >
            <div className="grid flex-1 gap-2">
              <Label htmlFor="codigo">Código de reserva</Label>
              <Input
                id="codigo"
                placeholder="RSV-ABC123"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.trim())}
              />
            </div>
            <div className="grid flex-1 gap-2">
              <Label htmlFor="token">Token de gestión</Label>
              <Input
                id="token"
                placeholder="token del correo de confirmación"
                value={token}
                onChange={(e) => setToken(e.target.value.trim())}
              />
            </div>
            <Button type="submit" disabled={!codigo || !token || isFetching}>
              <SearchIcon />
              {isFetching ? "Buscando…" : "Buscar"}
            </Button>
          </form>

          {isError && (
            <p className="text-destructive mt-4 text-sm">{error.message}</p>
          )}

          {reserva && (
            <div className="mt-6 grid gap-2 rounded-lg border p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{reserva.codigo}</span>
                <Badge>{reserva.estado}</Badge>
              </div>
              <pre className="bg-muted overflow-x-auto rounded-md p-3 text-xs">
                {JSON.stringify(reserva, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado de reservas</CardTitle>
          <CardDescription>
            Pendiente: el backend aún no expone un endpoint de listado para
            administración (GET /api/administracion/reservas). Cuando exista, esta
            tabla se conecta con un hook igual que Transportes y Tours.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

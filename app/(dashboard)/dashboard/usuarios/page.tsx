"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Paginacion } from "@/components/dashboard/paginacion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMiPerfil } from "@/hooks/use-auth";
import { useActualizarUsuario, useUsuarios } from "@/hooks/use-usuarios";
import type { RolUsuario } from "@/lib/api";

const ROLES: RolUsuario[] = ["CLIENTE", "OPERADOR", "ADMINISTRADOR"];

const colorRol: Record<RolUsuario, "default" | "secondary" | "outline"> = {
  ADMINISTRADOR: "default",
  OPERADOR: "secondary",
  CLIENTE: "outline",
};

export default function PaginaUsuarios() {
  const [buscar, setBuscar] = useState("");
  const [rolFiltro, setRolFiltro] = useState<RolUsuario | "TODOS">("TODOS");
  const [pagina, setPagina] = useState(1);
  const { data: perfil } = useMiPerfil();
  const { data: resultado, isLoading, isError, error } = useUsuarios({
    pagina,
    porPagina: 10,
    buscar: buscar || undefined,
    rol: rolFiltro === "TODOS" ? undefined : rolFiltro,
  });
  const usuarios = resultado?.datos;
  const actualizar = useActualizarUsuario();

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>
            Cambia roles y activa o desactiva cuentas. Los OPERADOR pueden
            gestionar catálogo (tours, transportes, salidas e imágenes).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                className="pl-8"
                placeholder="Buscar por correo o nombre…"
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
              />
            </div>
            <Select
              value={rolFiltro}
              onValueChange={(v) => setRolFiltro(v as RolUsuario | "TODOS")}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos los roles</SelectItem>
                {ROLES.map((rol) => (
                  <SelectItem key={rol} value={rol}>
                    {rol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
          {isError && (
            <p className="text-destructive text-sm">{error.message}</p>
          )}
          {actualizar.isError && (
            <p className="text-destructive text-sm">
              {actualizar.error.message}
            </p>
          )}

          {usuarios && usuarios.length === 0 && (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Sin resultados.
            </p>
          )}

          {usuarios && usuarios.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead>Registrado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((u) => {
                  const esYo = u.id === perfil?.id;
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        {u.nombres} {u.apellidos}
                        {esYo && (
                          <Badge variant="outline" className="ml-2">
                            tú
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {u.correo}
                      </TableCell>
                      <TableCell>
                        {esYo ? (
                          <Badge variant={colorRol[u.rol]}>{u.rol}</Badge>
                        ) : (
                          <Select
                            value={u.rol}
                            disabled={actualizar.isPending}
                            onValueChange={(rol) =>
                              actualizar.mutate({
                                id: u.id,
                                cambios: { rol: rol as RolUsuario },
                              })
                            }
                          >
                            <SelectTrigger className="h-8 w-44">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLES.map((rol) => (
                                <SelectItem key={rol} value={rol}>
                                  {rol}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={u.activo}
                          disabled={esYo || actualizar.isPending}
                          onCheckedChange={(marcado) =>
                            actualizar.mutate({
                              id: u.id,
                              cambios: { activo: marcado === true },
                            })
                          }
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(u.creadoEn).toLocaleDateString("es-PE")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          {resultado && (
            <Paginacion resultado={resultado} onCambiarPagina={setPagina} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

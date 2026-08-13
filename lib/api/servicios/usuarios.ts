import { solicitar } from "../cliente";
import { endpoints } from "../config";
import type {
  ActualizarUsuarioEntrada,
  Paginado,
  ParametrosPagina,
  RolUsuario,
  UsuarioAdmin,
} from "../tipos";

export const servicioUsuarios = {
  listar: (
    filtros?: ParametrosPagina & { rol?: RolUsuario; buscar?: string },
  ) =>
    solicitar<Paginado<UsuarioAdmin>>(endpoints.usuarios.listar, {
      query: filtros,
    }),

  actualizar: (id: string, cambios: ActualizarUsuarioEntrada) =>
    solicitar<UsuarioAdmin>(endpoints.usuarios.actualizar(id), {
      metodo: "PATCH",
      cuerpo: cambios,
    }),
};

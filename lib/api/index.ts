/* Punto de entrada único de la capa API:
   import { servicioCatalogo, claves, ApiError } from "@/lib/api"; */

export { apiConfig, endpoints } from "./config";
export { ApiError, avatarStorage, solicitar, tokenStorage } from "./cliente";
export { claves } from "./query-keys";
export * from "./tipos";
export { servicioArchivos } from "./servicios/archivos";
export { servicioAuditoria } from "./servicios/auditoria";
export { servicioAutenticacion } from "./servicios/autenticacion";
export { servicioCatalogo } from "./servicios/catalogo";
export { servicioPromociones } from "./servicios/promociones";
export { servicioPagos } from "./servicios/pagos";
export { servicioReservas } from "./servicios/reservas";
export { servicioCarritos } from "./servicios/carritos";
export { servicioUsuarios } from "./servicios/usuarios";

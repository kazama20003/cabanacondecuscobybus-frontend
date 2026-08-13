/* Punto de entrada único de la capa API:
   import { servicioCatalogo, claves, ApiError } from "@/lib/api"; */

export { apiConfig, endpoints } from "./config";
export { ApiError, avatarStorage, solicitar, tokenStorage } from "./cliente";
export { claves } from "./query-keys";
export * from "./tipos";
export { servicioArchivos } from "./servicios/archivos";
export { servicioAutenticacion } from "./servicios/autenticacion";
export { servicioCatalogo } from "./servicios/catalogo";
export { servicioReservas } from "./servicios/reservas";
export { servicioUsuarios } from "./servicios/usuarios";

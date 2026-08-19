/* Contratos de datos del backend (espejo de los DTOs/respuestas de NestJS). */

export type RolUsuario = "CLIENTE" | "OPERADOR" | "ADMINISTRADOR";
export type Moneda = "PEN" | "USD";
export type MetodoPago = "IZIPAY" | "TRANSFERENCIA" | "EFECTIVO_OFICINA";
export type TipoServicio = "TRANSPORTE" | "TOUR";

/* --- Paginación estándar del backend --- */

export interface Paginado<T> {
  datos: T[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export interface ParametrosPagina {
  pagina?: number;
  porPagina?: number;
}

/* --- Autenticación --- */

export interface Sesion {
  tokenAcceso: string;
  usuario: { id: string; correo: string; rol: RolUsuario };
}

export interface Perfil {
  id: string;
  correo: string;
  nombres: string;
  apellidos: string;
  telefonoWhatsApp: string | null;
  paisResidencia: string | null;
  rol: RolUsuario;
}

/* --- Usuarios (administración) --- */

export interface UsuarioAdmin {
  id: string;
  correo: string;
  nombres: string;
  apellidos: string;
  telefonoWhatsApp: string | null;
  paisResidencia: string | null;
  rol: RolUsuario;
  activo: boolean;
  creadoEn: string;
}

export interface ActualizarUsuarioEntrada {
  rol?: RolUsuario;
  activo?: boolean;
}

/* --- Catálogo --- */

export type TipoMedio = "IMAGEN" | "VIDEO";

export interface ImagenApi {
  url: string;
  clave?: string | null;
  textoAlterno?: string | null;
  tipo?: TipoMedio;
  orden?: number;
}

export interface MedioEntrada {
  url: string;
  clave?: string;
  textoAlterno?: string;
  tipo?: TipoMedio;
}

export interface CargaArchivo {
  clave: string;
  tipo: TipoMedio;
  urlPublica: string;
}

export interface SalidaApi {
  id: string;
  fechaHoraSalida: string;
  precioPen: number;
  precioUsd: number;
  capacidad: number;
  minimoPasajeros?: number;
  estado: string;
}

export interface ParadaApi {
  id: string;
  orden: number;
  nombre: string;
  latitud: string | number;
  longitud: string | number;
  minutos: number;
  duracionParadaMinutos: number;
  descripcion: string | null;
  imagenes?: ImagenApi[];
}

export interface ParadaEntrada {
  nombre: string;
  latitud: number;
  longitud: number;
  minutos: number;
  duracionParadaMinutos?: number;
  descripcion?: string;
  medios?: MedioEntrada[];
}

export interface TransporteApi {
  id: string;
  slug: string;
  origenNombre: string;
  destinoNombre: string;
  duracionMinutos?: number;
  imagenes?: ImagenApi[];
  salidas?: SalidaApi[];
  paradas?: ParadaApi[];
  [clave: string]: unknown;
}

export interface TourApi {
  id: string;
  slug: string;
  nombre?: string;
  imagenes?: ImagenApi[];
  salidas?: SalidaApi[];
  itinerarios?: ItinerarioApi[];
  [clave: string]: unknown;
}

/* --- Traducciones --- */

export interface ContenidoEntrada {
  titulo: string;
  resumen: string;
  descripcion: string;
  queLlevar?: string;
}

export interface TraduccionApi {
  id: string;
  idioma: string;
  titulo: string;
  resumen: string;
  descripcion: string;
  queLlevar?: string | null;
  estado: "BORRADOR" | "PUBLICADA";
}

/* --- Catálogo: creación (administración) --- */

export interface CrearTransporteEntrada {
  slug: string;
  origenNombre: string;
  origenLatitud: number;
  origenLongitud: number;
  destinoNombre: string;
  destinoLatitud: number;
  destinoLongitud: number;
  duracionMinutosEstimada: number;
  paradas?: ParadaEntrada[];
  medios?: MedioEntrada[];
  contenido?: ContenidoEntrada;
}

export interface CrearTourEntrada {
  slug: string;
  destinoNombre: string;
  destinoLatitud: number;
  destinoLongitud: number;
  duracionMinutos: number;
  medios?: MedioEntrada[];
  contenido?: ContenidoEntrada;
}

export interface CrearSalidaEntrada {
  fechaHoraSalida: string;
  capacidad: number;
  minimoPasajeros?: number;
  precioPen: number;
  precioUsd: number;
}

/* --- Itinerario de tour --- */

export interface ItinerarioEntrada {
  titulo: string;
  descripcion: string;
  latitud?: number;
  longitud?: number;
  medios?: MedioEntrada[];
}

export interface ItinerarioApi {
  id: string;
  orden: number;
  titulo: string;
  descripcion: string;
  latitud?: number | string | null;
  longitud?: number | string | null;
  imagenes?: ImagenApi[];
}

/* --- Salidas (administración) --- */

export type EstadoSalida =
  | "BORRADOR"
  | "A_LA_VENTA"
  | "PENDIENTE_DE_MINIMO"
  | "CONFIRMADA"
  | "EN_CURSO"
  | "FINALIZADA"
  | "CANCELADA";

export interface SalidaAdminApi {
  id: string;
  fechaHoraSalida: string;
  capacidad: number;
  minimoPasajeros: number;
  precioPen: string | number;
  precioUsd: string | number;
  estado: EstadoSalida;
  ocupados: number;
  transporte?: { origenNombre: string; destinoNombre: string; slug: string };
  tour?: { destinoNombre: string; slug: string };
  vehiculo?: { placa: string } | null;
}

export interface ActualizarSalidaEntrada {
  estado?: EstadoSalida;
  vehiculoId?: string;
  capacidad?: number;
  minimoPasajeros?: number;
  precioPen?: number;
  precioUsd?: number;
  fechaHoraSalida?: string;
}

/* --- Promociones --- */

export type TipoPromocion = "OFERTA" | "DESCUENTO" | "EVENTO_ESPECIAL" | "ANIVERSARIO";
export type ObjetivoPromocion = "TODOS" | "TRANSPORTES" | "TOURS";

export interface PromocionApi {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: TipoPromocion;
  objetivo: ObjetivoPromocion;
  codigo: string | null;
  porcentajeDescuento: number | null;
  montoDescuento: string | number | null;
  fechaInicio: string;
  fechaFin: string;
  limiteUsos: number | null;
  usos: number;
  imagenUrl: string | null;
  imagenClave?: string | null;
  activo: boolean;
}

export interface CrearPromocionEntrada {
  titulo: string;
  descripcion?: string;
  tipo: TipoPromocion;
  objetivo?: ObjetivoPromocion;
  codigo?: string;
  porcentajeDescuento?: number;
  montoDescuento?: number;
  fechaInicio: string;
  fechaFin: string;
  limiteUsos?: number;
  imagenUrl?: string;
  imagenClave?: string;
  activo?: boolean;
}

/* --- Reservas --- */

export interface PasajeroEntrada {
  nombres: string;
  apellidos: string;
  nacionalidad: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

export interface CrearReservaEntrada {
  tipoServicio: TipoServicio;
  salidaId: string;
  correoContacto: string;
  telefonoWhatsApp: string;
  paisResidencia?: string;
  moneda: Moneda;
  pasajeros: PasajeroEntrada[];
}

export interface ReservaApi {
  id: string;
  codigo: string;
  estado: string;
  tokenGestionInvitado?: string;
  montoTotal?: number;
  montoAdelanto?: number;
  [clave: string]: unknown;
}

export interface ComprobanteSaldoEntrada {
  codigoOperacion: string;
  urlComprobante: string;
  metodo: MetodoPago;
}

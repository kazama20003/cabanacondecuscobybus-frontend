/* Configuración central de la API. Un solo lugar para cambiar entornos. */

export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
  timeoutMs: 15_000,
  tokenStorageKey: "inca-token",
} as const;

/* Rutas de la API por módulo — evita strings sueltos por todo el código. */
export const endpoints = {
  autenticacion: {
    google: "/autenticacion/google",
    miPerfil: "/autenticacion/mi-perfil",
  },
  catalogo: {
    transportes: "/transportes",
    transporte: (slug: string) => `/transportes/${slug}`,
    buscarTransportes: "/transportes/buscar",
    tours: "/tours",
    tour: (slug: string) => `/tours/${slug}`,
    crearTransporte: "/administracion/transportes",
    crearTour: "/administracion/tours",
    actualizarTransporte: (id: string) => `/administracion/transportes/${id}`,
    actualizarTour: (id: string) => `/administracion/tours/${id}`,
    eliminarTransporte: (id: string) => `/administracion/transportes/${id}`,
    eliminarTour: (id: string) => `/administracion/tours/${id}`,
    definirParadas: (id: string) => `/administracion/transportes/${id}/paradas`,
    traducciones: (tipo: "transportes" | "tours", id: string) =>
      `/administracion/${tipo}/${id}/traducciones`,
    editarTraduccion: (tipo: "transportes" | "tours", id: string, idioma: string) =>
      `/administracion/${tipo}/${id}/traducciones/${idioma}`,
    crearSalidaTransporte: (id: string) =>
      `/administracion/transportes/${id}/salidas`,
    crearSalidaTour: (id: string) => `/administracion/tours/${id}/salidas`,
    definirItinerario: (id: string) => `/administracion/tours/${id}/itinerario`,
    salidasAdmin: "/administracion/salidas",
    actualizarSalida: (tipo: "transporte" | "tour", id: string) =>
      `/administracion/salidas/${tipo}/${id}`,
  },
  uploads: {
    subir: (categoria: "transportes" | "tours" | "promociones" | "comprobantes") =>
      `/administracion/uploads/${categoria}`,
  },
  usuarios: {
    listar: "/administracion/usuarios",
    actualizar: (id: string) => `/administracion/usuarios/${id}`,
  },
  promociones: {
    vigentes: "/promociones",
    listar: "/administracion/promociones",
    crear: "/administracion/promociones",
    actualizar: (id: string) => `/administracion/promociones/${id}`,
    eliminar: (id: string) => `/administracion/promociones/${id}`,
  },
  reservas: {
    crear: "/reservas",
    mias: "/reservas/mias",
    verInvitado: (codigo: string) => `/reservas/${codigo}`,
    iniciarPagoAdelanto: (codigo: string) => `/reservas/${codigo}/iniciar-pago-adelanto`,
    comprobanteSaldo: (codigo: string) => `/reservas/${codigo}/comprobantes-saldo`,
  },
} as const;

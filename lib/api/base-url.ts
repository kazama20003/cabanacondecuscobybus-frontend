const URL_API_LOCAL = "http://localhost:8000/api";
const URL_API_PRODUCCION = "https://api.cabanacondecuscobybus.com/api";

const configurada = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");
const enProduccion = process.env.NODE_ENV === "production";
const apuntaALocal = configurada
  ? /^https?:\/\/(localhost|127(?:\.\d{1,3}){3}|0\.0\.0\.0)(:\d+)?(?:\/|$)/i.test(configurada)
  : false;

/** La URL pública se resuelve al compilar Next; producción nunca debe caer en localhost. */
export const API_BASE_URL = enProduccion
  ? configurada?.startsWith("https://") && !apuntaALocal
    ? configurada
    : URL_API_PRODUCCION
  : configurada || URL_API_LOCAL;

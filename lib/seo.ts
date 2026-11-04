import type { Metadata } from "next";
import { headers } from "next/headers";
import { API_BASE_URL } from "./api/base-url";
import { languageForRequest, localizedPath, normalizeLanguage, SUPPORTED_LANGUAGES, type LangCode } from "./language";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cabanacondecuscobybus.com").replace(/\/$/, "");
export const API_URL = API_BASE_URL;
const NOMBRE_SITIO = "Cabanaconde Cusco By Bus";

type SeoText = { title: string; description: string; transport: string; tours: string; events: string; destinations: string; about: string; contact: string };
const DESCRIPCIONES: Record<LangCode, SeoText> = {
  es: { title: "Transporte turístico, tours y viajes por el sur del Perú", description: "Reserva transporte turístico, tours y experiencias entre Arequipa, el Cañón del Colca, Cabanaconde, Cusco y Puno.", transport: "Consulta rutas, horarios y reservas de transporte turístico entre Arequipa, el Colca, Cusco y otros destinos del Perú.", tours: "Descubre y reserva tours en Arequipa, el Cañón del Colca, Cusco y los principales destinos del sur del Perú.", events: "Conoce celebraciones y eventos especiales del sur del Perú y consulta sus próximas fechas.", destinations: "Explora Arequipa, el Cañón del Colca, Cabanaconde, Cusco, Puno y otros destinos del sur del Perú.", about: "Agencia de turismo en el sur del Perú especializada en transporte turístico, tours y experiencias locales.", contact: "Contacta a Inca Travel Peru para consultar y reservar transporte turístico, tours y experiencias en el sur del Perú." },
  en: { title: "Tourist transport, tours and trips in southern Peru", description: "Book tourist transport, tours and experiences between Arequipa, Colca Canyon, Cabanaconde, Cusco and Puno.", transport: "Explore routes, schedules and bookings for tourist transport between Arequipa, Colca, Cusco and other Peruvian destinations.", tours: "Discover and book tours in Arequipa, Colca Canyon, Cusco and southern Peru's top destinations.", events: "Explore celebrations and special events in southern Peru and check upcoming dates.", destinations: "Explore Arequipa, Colca Canyon, Cabanaconde, Cusco, Puno and other destinations in southern Peru.", about: "A southern Peru travel agency for tourist transport, tours and local experiences.", contact: "Contact Inca Travel Peru to ask about and book tourist transport, tours and experiences in southern Peru." },
  fr: { title: "Transports touristiques, excursions et voyages dans le sud du Pérou", description: "Réservez des transports touristiques, des excursions et des expériences entre Arequipa, le canyon de Colca, Cabanaconde, Cusco et Puno.", transport: "Consultez les itinéraires, horaires et réservations de transport touristique entre Arequipa, Colca, Cusco et d'autres destinations péruviennes.", tours: "Découvrez et réservez des excursions à Arequipa, dans le canyon de Colca, à Cusco et dans le sud du Pérou.", events: "Découvrez les célébrations et événements spéciaux du sud du Pérou ainsi que leurs prochaines dates.", destinations: "Explorez Arequipa, le canyon de Colca, Cabanaconde, Cusco, Puno et d'autres destinations du sud du Pérou.", about: "Une agence de voyages du sud du Pérou spécialisée dans les transports touristiques, les excursions et les expériences locales.", contact: "Contactez Inca Travel Peru pour demander et réserver des transports touristiques, des excursions et des expériences dans le sud du Pérou." },
  it: { title: "Trasporti turistici, tour e viaggi nel Perù meridionale", description: "Prenota trasporti turistici, tour ed esperienze tra Arequipa, il Canyon del Colca, Cabanaconde, Cusco e Puno.", transport: "Consulta itinerari, orari e prenotazioni dei trasporti turistici tra Arequipa, Colca, Cusco e altre destinazioni peruviane.", tours: "Scopri e prenota tour ad Arequipa, nel Canyon del Colca, a Cusco e nelle principali destinazioni del Perù meridionale.", events: "Scopri celebrazioni ed eventi speciali nel Perù meridionale e consulta le prossime date.", destinations: "Esplora Arequipa, il Canyon del Colca, Cabanaconde, Cusco, Puno e altre destinazioni del Perù meridionale.", about: "Un'agenzia di viaggi del Perù meridionale specializzata in trasporti turistici, tour ed esperienze locali.", contact: "Contatta Inca Travel Peru per informazioni e prenotazioni di trasporti turistici, tour ed esperienze nel Perù meridionale." },
  pt: { title: "Transporte turístico, passeios e viagens no sul do Peru", description: "Reserve transporte turístico, passeios e experiências entre Arequipa, o Cânion do Colca, Cabanaconde, Cusco e Puno.", transport: "Consulte rotas, horários e reservas de transporte turístico entre Arequipa, Colca, Cusco e outros destinos peruanos.", tours: "Descubra e reserve passeios em Arequipa, no Cânion do Colca, em Cusco e nos principais destinos do sul do Peru.", events: "Conheça celebrações e eventos especiais no sul do Peru e consulte as próximas datas.", destinations: "Explore Arequipa, o Cânion do Colca, Cabanaconde, Cusco, Puno e outros destinos do sul do Peru.", about: "Agência de viagens do sul do Peru especializada em transporte turístico, passeios e experiências locais.", contact: "Fale com a Inca Travel Peru para consultar e reservar transporte turístico, passeios e experiências no sul do Peru." },
  zh: { title: "秘鲁南部旅游交通、旅行团与行程", description: "预订阿雷基帕、科尔卡峡谷、卡瓦纳孔德、库斯科和普诺之间的旅游交通、旅行团与体验。", transport: "查看阿雷基帕、科尔卡、库斯科及秘鲁其他目的地之间的旅游交通路线、时间和预订信息。", tours: "探索并预订阿雷基帕、科尔卡峡谷、库斯科及秘鲁南部热门目的地的旅行团。", events: "了解秘鲁南部的庆典与特别活动，并查看即将举行的日期。", destinations: "探索阿雷基帕、科尔卡峡谷、卡瓦纳孔德、库斯科、普诺及秘鲁南部其他目的地。", about: "专注于旅游交通、旅行团和当地体验的秘鲁南部旅行社。", contact: "联系 Inca Travel Peru，咨询并预订秘鲁南部的旅游交通、旅行团和体验。" },
  ja: { title: "ペルー南部の観光交通・ツアー・旅行", description: "アレキパ、コルカ渓谷、カバナコンデ、クスコ、プーノ間の観光交通、ツアー、体験を予約できます。", transport: "アレキパ、コルカ、クスコなど、ペルー各地を結ぶ観光交通のルート、時刻、予約をご確認ください。", tours: "アレキパ、コルカ渓谷、クスコ、ペルー南部の人気スポットのツアーを見つけて予約しましょう。", events: "ペルー南部の祭典や特別イベント、開催予定日をご覧ください。", destinations: "アレキパ、コルカ渓谷、カバナコンデ、クスコ、プーノなど、ペルー南部の目的地を探索しましょう。", about: "観光交通、ツアー、現地体験を専門とするペルー南部の旅行会社です。", contact: "ペルー南部の観光交通、ツアー、体験について、Inca Travel Peru までお問い合わせください。" },
  ru: { title: "Туристический транспорт, туры и поездки по югу Перу", description: "Бронируйте туристический транспорт, туры и впечатления между Арекипой, каньоном Колка, Кабанаконде, Куско и Пуно.", transport: "Маршруты, расписание и бронирование туристического транспорта между Арекипой, Колкой, Куско и другими местами Перу.", tours: "Откройте для себя и бронируйте туры в Арекипе, каньоне Колка, Куско и популярных местах юга Перу.", events: "Узнайте о праздниках и особых событиях на юге Перу и их ближайших датах.", destinations: "Исследуйте Арекипу, каньон Колка, Кабанаконде, Куско, Пуно и другие места юга Перу.", about: "Туристическое агентство на юге Перу, специализирующееся на транспорте, турах и местных впечатлениях.", contact: "Свяжитесь с Inca Travel Peru, чтобы узнать о туристическом транспорте, турах и поездках по югу Перу." },
  de: { title: "Touristische Transporte, Touren und Reisen in Südperu", description: "Buchen Sie touristische Transporte, Touren und Erlebnisse zwischen Arequipa, dem Colca-Canyon, Cabanaconde, Cusco und Puno.", transport: "Routen, Fahrpläne und Buchungen für touristische Transporte zwischen Arequipa, Colca, Cusco und weiteren Reisezielen in Peru.", tours: "Entdecken und buchen Sie Touren in Arequipa, im Colca-Canyon, in Cusco und an den schönsten Orten Südperus.", events: "Entdecken Sie Feste und besondere Veranstaltungen in Südperu und sehen Sie die nächsten Termine.", destinations: "Entdecken Sie Arequipa, den Colca-Canyon, Cabanaconde, Cusco, Puno und weitere Reiseziele in Südperu.", about: "Ein Reiseveranstalter in Südperu für touristische Transporte, Touren und lokale Erlebnisse.", contact: "Kontaktieren Sie Inca Travel Peru für Informationen und Buchungen zu Transporten, Touren und Erlebnissen in Südperu." },
};

export async function requestLanguage(): Promise<LangCode> {
  const requestHeaders = await headers();
  return normalizeLanguage(requestHeaders.get("x-inca-language"))
    ?? languageForRequest(requestHeaders.get("x-vercel-ip-country"), requestHeaders.get("accept-language"));
}

export function urlForPath(path: string, language: LangCode): string {
  return `${SITE_URL}${localizedPath(path, language)}`;
}

export function languageAlternates(path: string, languages: readonly string[] = SUPPORTED_LANGUAGES): Record<string, string> {
  const accepted = new Set(languages.map(normalizeLanguage).filter((item): item is LangCode => Boolean(item)));
  accepted.add("es");
  return {
    ...Object.fromEntries([...accepted].map((language) => [language, urlForPath(path, language)])),
    "x-default": urlForPath(path, "es"),
  };
}

export function siteMetadata(language: LangCode): Metadata {
  const text = DESCRIPCIONES[language];
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: text.title, template: `%s | ${NOMBRE_SITIO}` },
    description: text.description,
    applicationName: NOMBRE_SITIO,
    category: "travel",
    creator: NOMBRE_SITIO,
    publisher: NOMBRE_SITIO,
    keywords: ["Perú", "Arequipa", "Cañón del Colca", "Cabanaconde", "Cusco", "Puno", "transporte turístico", "tours"],
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: { type: "website", siteName: NOMBRE_SITIO, locale: language.replace("-", "_"), title: text.title, description: text.description },
    twitter: { card: "summary_large_image", title: text.title, description: text.description },
  };
}

export function metadataForListing(language: LangCode, kind: "transport" | "tours" | "events" | "destinations", path: string): Metadata {
  const text = DESCRIPCIONES[language];
  const title = {
    transport: language === "es" ? "Transporte turístico" : text.title.split(",")[0],
    tours: language === "es" ? "Tours en el sur del Perú" : language === "en" ? "Tours in Southern Peru" : language === "fr" ? "Excursions dans le sud du Pérou" : language === "it" ? "Tour nel Perù meridionale" : language === "pt" ? "Passeios no sul do Peru" : language === "zh" ? "秘鲁南部旅行团" : language === "ja" ? "ペルー南部のツアー" : language === "ru" ? "Туры по югу Перу" : "Touren in Südperu",
    events: language === "es" ? "Eventos especiales en Perú" : language === "en" ? "Special events in Peru" : language === "fr" ? "Événements spéciaux au Pérou" : language === "it" ? "Eventi speciali in Perù" : language === "pt" ? "Eventos especiais no Peru" : language === "zh" ? "秘鲁特别活动" : language === "ja" ? "ペルーの特別イベント" : language === "ru" ? "Особые события в Перу" : "Besondere Veranstaltungen in Peru",
    destinations: language === "es" ? "Destinos del sur del Perú" : language === "en" ? "Destinations in Southern Peru" : language === "fr" ? "Destinations du sud du Pérou" : language === "it" ? "Destinazioni del Perù meridionale" : language === "pt" ? "Destinos do sul do Peru" : language === "zh" ? "秘鲁南部目的地" : language === "ja" ? "ペルー南部の目的地" : language === "ru" ? "Направления юга Перу" : "Reiseziele in Südperu",
  }[kind];
  const description = text[kind];
  return { title, description, alternates: { canonical: urlForPath(path, language), languages: languageAlternates(path) }, openGraph: { title, description, url: urlForPath(path, language), type: "website", siteName: NOMBRE_SITIO }, twitter: { card: "summary_large_image", title, description } };
}

export function metadataForStaticPage(language: LangCode, kind: "about" | "contact", path: string): Metadata {
  const title = kind === "about"
    ? ({ es: "Nosotros", en: "About us", fr: "À propos", it: "Chi siamo", pt: "Sobre nós", zh: "关于我们", ja: "私たちについて", ru: "О нас", de: "Über uns" } as const)[language]
    : ({ es: "Contacto", en: "Contact", fr: "Contact", it: "Contatti", pt: "Contato", zh: "联系", ja: "お問い合わせ", ru: "Контакты", de: "Kontakt" } as const)[language];
  const description = DESCRIPCIONES[language][kind];
  return { title, description, alternates: { canonical: urlForPath(path, language), languages: languageAlternates(path) }, openGraph: { title, description, url: urlForPath(path, language), type: "website", siteName: NOMBRE_SITIO }, twitter: { card: "summary", title, description } };
}

export interface TraduccionSeo {
  idioma: string;
  titulo: string;
  resumen: string;
  descripcion: string;
}

export interface TransporteSeo {
  slug: string;
  origenNombre: string;
  destinoNombre: string;
  duracionMinutosEstimada?: number;
  traducciones?: TraduccionSeo[];
  imagenes?: { url: string }[];
}

export interface TourSeo {
  slug: string;
  destinoNombre: string;
  duracionMinutos?: number;
  traducciones?: TraduccionSeo[];
  imagenes?: { url: string }[];
}

/** Fetch solo lee texto ya traducido y guardado por el backend; no llama a servicios de traducción. */
export async function obtenerJson<T>(ruta: string, revalidate = 3600): Promise<T | null> {
  try {
    const respuesta = await fetch(`${API_URL}${ruta}`, { next: { revalidate } });
    if (!respuesta.ok) return null;
    return (await respuesta.json()) as T;
  } catch {
    return null;
  }
}

export function traduccionEn<T extends TraduccionSeo>(traducciones: T[] | undefined, language: LangCode): T | undefined {
  return traducciones?.find((item) => item.idioma === language) ?? traducciones?.find((item) => item.idioma === "es") ?? traducciones?.[0];
}

export function tituloTransporte(t: TransporteSeo, language: LangCode = "es"): string {
  return traduccionEn(t.traducciones, language)?.titulo || `Transporte de ${t.origenNombre} a ${t.destinoNombre}`;
}

export function tituloTour(t: TourSeo, language: LangCode = "es"): string {
  return traduccionEn(t.traducciones, language)?.titulo || `Tour ${t.destinoNombre}`;
}

export function recortar(texto: string | undefined, max = 160): string | undefined {
  if (!texto) return undefined;
  const limpio = texto.replace(/\s+/g, " ").trim();
  return limpio.length <= max ? limpio : `${limpio.slice(0, max - 1).trimEnd()}…`;
}

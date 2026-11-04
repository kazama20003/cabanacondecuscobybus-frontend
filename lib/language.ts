export const SUPPORTED_LANGUAGES = ["es", "en", "fr", "it", "pt", "zh", "ja", "ru", "de"] as const;
export type LangCode = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_BY_COUNTRY: Record<string, LangCode> = {
  PE: "es", ES: "es", MX: "es", AR: "es", BO: "es", CL: "es", CO: "es", CR: "es", CU: "es", DO: "es", EC: "es", GT: "es", HN: "es", NI: "es", PA: "es", PY: "es", SV: "es", UY: "es", VE: "es",
  US: "en", GB: "en", IE: "en", AU: "en", NZ: "en", IN: "en", SG: "en", ZA: "en", NG: "en", KE: "en", PH: "en",
  FR: "fr", MC: "fr", SN: "fr", CI: "fr", CM: "fr", MA: "fr", TN: "fr", DZ: "fr",
  IT: "it", BR: "pt", PT: "pt", CN: "zh", TW: "zh", HK: "zh", JP: "ja", RU: "ru", DE: "de", AT: "de",
};

export function normalizeLanguage(value?: string | null): LangCode | undefined {
  if (!value) return undefined;
  const code = value.trim().toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.find((language) => language === code);
}

export function languageFromAcceptLanguage(value?: string | null): LangCode | undefined {
  if (!value) return undefined;
  const ordered = value.split(",").map((part, index) => {
    const [tag, quality] = part.trim().split(";q=");
    return { tag, quality: quality === undefined ? 1 : Number(quality), index };
  }).filter((item) => Number.isFinite(item.quality) && item.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);
  for (const item of ordered) {
    const language = normalizeLanguage(item.tag);
    if (language) return language;
  }
  return undefined;
}

export function languageForRequest(country?: string | null, acceptLanguage?: string | null): LangCode {
  const countryCode = country?.trim().toUpperCase();
  // Prefer the browser's language in countries with multiple official languages.
  if (["CA", "CH", "BE", "LU"].includes(countryCode ?? "")) {
    return languageFromAcceptLanguage(acceptLanguage) ?? LANGUAGE_BY_COUNTRY[countryCode!] ?? "en";
  }
  return (countryCode ? LANGUAGE_BY_COUNTRY[countryCode] : undefined)
    ?? languageFromAcceptLanguage(acceptLanguage)
    ?? "en";
}

export function localizedPath(path: string, language: LangCode): string {
  const cleanPath = `/${path}`.replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/";
  const withoutLocale = cleanPath.replace(/^\/(?:es|en|fr|it|pt|zh|ja|ru|de)(?=\/|$)/, "") || "/";
  return language === "es" ? withoutLocale : `/${language}${withoutLocale === "/" ? "" : withoutLocale}`;
}

export function isPrivatePath(path: string): boolean {
  return /^\/(?:dashboard|cuenta|checkout|carrito|reserva|login|registro)(?:\/|$)/i.test(path);
}

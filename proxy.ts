import { NextRequest, NextResponse } from "next/server";
import { isPrivatePath, languageForRequest, normalizeLanguage, type LangCode } from "@/lib/language";

const LANGUAGE_COOKIE = "inca-lang";
const SOURCE_COOKIE = "inca-lang-source";
function withLocaleHeaders(request: NextRequest, language: LangCode) {
  const headers = new Headers(request.headers);
  headers.set("x-inca-language", language);
  return headers;
}

function saveLanguage(response: NextResponse, request: NextRequest, language: LangCode, source: "manual" | "auto") {
  response.cookies.set(LANGUAGE_COOKIE, language, {
    path: "/",
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    maxAge: source === "manual" ? 60 * 60 * 24 * 365 : 60 * 60 * 24,
  });
  response.cookies.set(SOURCE_COOKIE, source, {
    path: "/",
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    maxAge: source === "manual" ? 60 * 60 * 24 * 365 : 60 * 60 * 24,
  });
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const prefix = path.match(/^\/(es|en|fr|it|pt|zh|ja|ru|de)(?=\/|$)/)?.[1] as LangCode | undefined;
  const pathWithoutLocale = prefix ? path.replace(/^\/(?:es|en|fr|it|pt|zh|ja|ru|de)(?=\/|$)/, "") || "/" : path;
  const cookieLanguage = normalizeLanguage(request.cookies.get(LANGUAGE_COOKIE)?.value);
  const manual = request.cookies.get(SOURCE_COOKIE)?.value === "manual";
  const autoCookieIsUsable = request.cookies.get(SOURCE_COOKIE)?.value === "auto" && cookieLanguage;

  // Private areas keep their existing URLs; they are not public SEO landing pages.
  if (isPrivatePath(pathWithoutLocale)) {
    const headers = withLocaleHeaders(request, prefix ?? (manual ? cookieLanguage : undefined) ?? languageForRequest(
      request.headers.get("x-vercel-ip-country"),
      request.headers.get("accept-language"),
    ));
    if (prefix) {
      const destination = request.nextUrl.clone();
      destination.pathname = pathWithoutLocale;
      return NextResponse.redirect(destination);
    }
    return NextResponse.next({ request: { headers } });
  }

  const language = prefix
    ?? (manual ? cookieLanguage : undefined)
    ?? (autoCookieIsUsable ? cookieLanguage : undefined)
    ?? languageForRequest(request.headers.get("x-vercel-ip-country"), request.headers.get("accept-language"));
  const headers = withLocaleHeaders(request, language);

  if (prefix === "es") {
    const destination = request.nextUrl.clone();
    destination.pathname = pathWithoutLocale;
    return NextResponse.redirect(destination);
  }

  if (!prefix && language !== "es") {
    const destination = request.nextUrl.clone();
    destination.pathname = `/${language}${path === "/" ? "" : path}`;
    const response = NextResponse.redirect(destination);
    saveLanguage(response, request, language, manual ? "manual" : "auto");
    return response;
  }

  if (prefix) {
    const destination = request.nextUrl.clone();
    destination.pathname = pathWithoutLocale;
    const response = NextResponse.rewrite(destination, { request: { headers } });
    saveLanguage(response, request, language, manual ? "manual" : "auto");
    return response;
  }

  const response = NextResponse.next({ request: { headers } });
  saveLanguage(response, request, language, manual ? "manual" : "auto");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

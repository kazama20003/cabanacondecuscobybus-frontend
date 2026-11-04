import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { localizedPath, SUPPORTED_LANGUAGES } from "@/lib/language";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard", "/cuenta", "/checkout", "/carrito", "/reserva", "/login", "/registro",
          ...SUPPORTED_LANGUAGES.flatMap((language) => ["/dashboard", "/cuenta", "/checkout", "/carrito", "/reserva", "/login", "/registro"].map((path) => localizedPath(path, language))),
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

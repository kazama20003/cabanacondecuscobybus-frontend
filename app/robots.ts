import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/cuenta", "/checkout", "/carrito", "/reserva"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

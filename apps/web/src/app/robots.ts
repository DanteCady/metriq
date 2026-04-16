import type { MetadataRoute } from "next";

import { getSiteUrl } from "../lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteUrl().origin;

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login"],
      disallow: ["/candidate/", "/employer/", "/admin/", "/dept/", "/api/"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}

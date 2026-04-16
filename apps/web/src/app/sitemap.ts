import type { MetadataRoute } from "next";

import { getSiteUrl } from "../lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl().origin;
  const now = new Date();

  // `/` currently redirects to `/login`; list the destination as the public entry point.
  return [{ url: `${base}/login`, lastModified: now, changeFrequency: "monthly", priority: 1 }];
}

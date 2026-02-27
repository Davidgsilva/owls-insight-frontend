import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/verify-email", "/reset-password"],
      },
    ],
    sitemap: "https://owlsinsight.com/sitemap.xml",
  };
}

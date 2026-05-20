import type { MetadataRoute } from "next";

const siteUrl = "https://saranwak.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin",
                "/admin/",
                "/api",
                "/api/",
                "/login",
            ],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
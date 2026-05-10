import { MetadataRoute } from "next";

const siteUrl = "https://saranwak.vercel.app";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin", "/api"],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
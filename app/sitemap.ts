import { promises as fs } from "fs";
import path from "path";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";
export const revalidate = 3600;

const siteUrl = "https://saranwak.com";

type SitemapPlace = {
    slug: string;
    is_published?: boolean | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified: now,
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${siteUrl}/places`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${siteUrl}/rekomendasi`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${siteUrl}/about`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.6,
        },
    ];

    const places = await getPlacesFromJson();

    const placePages: MetadataRoute.Sitemap = places
        .filter((place) => Boolean(place.slug))
        .filter((place) => place.is_published !== false)
        .map((place) => ({
            url: `${siteUrl}/places/${place.slug}`,
            lastModified: place.updated_at || place.created_at || now,
            changeFrequency: "weekly",
            priority: 0.8,
        }));

    return [...staticPages, ...placePages];
}

async function getPlacesFromJson(): Promise<SitemapPlace[]> {
    try {
        const filePath = path.join(
            process.cwd(),
            "public",
            "data",
            "places.json"
        );

        const fileContent = await fs.readFile(filePath, "utf8");
        const places = JSON.parse(fileContent) as SitemapPlace[];

        if (!Array.isArray(places)) {
            return [];
        }

        return places;
    } catch (error) {
        console.error("Sitemap static places JSON read error:", error);
        return [];
    }
}
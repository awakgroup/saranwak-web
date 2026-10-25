import type { MetadataRoute } from "next";
import { promises as fs } from "fs";
import path from "path";
import { getPlaces } from "@/lib/api/places";
import { CURATED_COLLECTIONS } from "@/lib/curated-collections";

export const dynamic = "force-static";

const siteUrl = "https://saranwak.com";

type SitemapPlace = {
    slug: string;
    updated_at?: string | null;
    created_at?: string | null;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${siteUrl}/places`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${siteUrl}/rekomendasi`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.85,
        },
        {
            url: `${siteUrl}/about`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.6,
        },
    ];

    const curatedPages: MetadataRoute.Sitemap = CURATED_COLLECTIONS.map((c) => ({
        url: `${siteUrl}/rekomendasi/${c.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
    }));

    const placePages = await getPlaceSitemapPages();

    return [...staticPages, ...curatedPages, ...placePages];
}

async function getPlaceSitemapPages(): Promise<MetadataRoute.Sitemap> {
    const map = new Map<string, SitemapPlace>();

    try {
        const filePath = path.join(process.cwd(), "public", "data", "places.json");
        const fileContent = await fs.readFile(filePath, "utf8");
        const jsonPlaces = JSON.parse(fileContent) as SitemapPlace[];
        jsonPlaces.forEach((p) => {
            if (p.slug) map.set(p.slug, p);
        });
    } catch (err) {
        console.error("Sitemap JSON read error:", err);
    }

    try {
        const places = await getPlaces({
            limit: 500,
        });

        places.forEach((place) => {
            if (place.slug) {
                map.set(place.slug, place as SitemapPlace);
            }
        });
    } catch (error) {
        console.error("Sitemap D1 fetch error:", error);
    }

    return Array.from(map.values()).map((place) => ({
        url: `${siteUrl}/places/${place.slug}`,
        lastModified: getSafeDate(place.updated_at ?? place.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));
}

function getSafeDate(value?: string | null) {
    if (!value) return new Date();

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return new Date();
    }

    return date;
}
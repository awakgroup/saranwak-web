import type { MetadataRoute } from "next";
import { getPlaces } from "@/lib/api/places";

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
            priority: 0.8,
        },
        {
            url: `${siteUrl}/about`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.6,
        },
    ];

    const placePages = await getPlaceSitemapPages();

    return [...staticPages, ...placePages];
}

async function getPlaceSitemapPages(): Promise<MetadataRoute.Sitemap> {
    try {
        const places = await getPlaces({
            limit: 500,
        });

        return places
            .filter((place): place is SitemapPlace & typeof place =>
                Boolean(place.slug)
            )
            .map((place) => ({
                url: `${siteUrl}/places/${place.slug}`,
                lastModified: getSafeDate(place.updated_at ?? place.created_at),
                changeFrequency: "weekly" as const,
                priority: 0.7,
            }));
    } catch (error) {
        console.error("Sitemap D1 fetch error:", error);
        return [];
    }
}

function getSafeDate(value?: string | null) {
    if (!value) return new Date();

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return new Date();
    }

    return date;
}
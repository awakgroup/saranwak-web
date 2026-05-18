import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const siteUrl = "https://saranwak.com";

type SitemapPlace = {
    slug: string;
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
            url: `${siteUrl}/places?category=coffee-shop`,
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

    const { data, error } = await supabase
        .from("places")
        .select("slug, updated_at, created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Sitemap places error:", error.message);
        return staticPages;
    }

    const placePages: MetadataRoute.Sitemap =
        (data as SitemapPlace[] | null)?.map((place) => ({
            url: `${siteUrl}/places/${place.slug}`,
            lastModified: place.updated_at || place.created_at || now,
            changeFrequency: "weekly",
            priority: 0.8,
        })) ?? [];

    return [...staticPages, ...placePages];
}
import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const siteUrl = "https://saranwak.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { data: places } = await supabase
        .from("places")
        .select("slug, updated_at, created_at")
        .eq("is_published", true);

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${siteUrl}/places?category=coffee-shop`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${siteUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
    ];

    const placePages: MetadataRoute.Sitemap =
        places?.map((place) => ({
            url: `${siteUrl}/places/${place.slug}`,
            lastModified: place.updated_at || place.created_at || new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        })) ?? [];

    return [...staticPages, ...placePages];
}
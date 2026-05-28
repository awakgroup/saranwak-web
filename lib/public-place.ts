// lib/public-places.ts
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";

export const getFeaturedPlaces = unstable_cache(
    async () => {
        const { data, error } = await supabase
            .from("places")
            .select(
                `
        id,
        name,
        slug,
        short_description,
        area,
        city,
        image_url,
        price_min,
        price_max,
        is_featured,
        categories (
          id,
          name,
          slug
        ),
        place_tags (
          id,
          tags (
            id,
            name,
            slug,
            type
          )
        )
      `
            )
            .eq("is_published", true)
            .eq("is_featured", true)
            .order("created_at", { ascending: false })
            .limit(6);

        if (error) {
            console.error("getFeaturedPlaces error:", error.message);
            return [];
        }

        return data ?? [];
    },
    ["featured-places"],
    {
        revalidate: 300,
        tags: ["places", "featured-places"],
    }
);

export const getPublishedPlaces = unstable_cache(
    async () => {
        const { data, error } = await supabase
            .from("places")
            .select(
                `
        id,
        name,
        slug,
        short_description,
        area,
        city,
        image_url,
        price_min,
        price_max,
        is_featured,
        categories (
          id,
          name,
          slug
        ),
        place_tags (
          id,
          tags (
            id,
            name,
            slug,
            type
          )
        )
      `
            )
            .eq("is_published", true)
            .order("is_featured", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(30);

        if (error) {
            console.error("getPublishedPlaces error:", error.message);
            return [];
        }

        return data ?? [];
    },
    ["published-places"],
    {
        revalidate: 300,
        tags: ["places"],
    }
);

export const getPlaceBySlug = unstable_cache(
    async (slug: string) => {
        const { data, error } = await supabase
            .from("places")
            .select(
                `
        id,
        name,
        slug,
        description,
        short_description,
        area,
        city,
        address,
        google_maps_url,
        instagram_url,
        whatsapp_url,
        website_url,
        image_url,
        gallery_images,
        price_min,
        price_max,
        opening_hours,
        is_featured,
        categories (
          id,
          name,
          slug
        ),
        place_tags (
          id,
          tags (
            id,
            name,
            slug,
            type
          )
        )
      `
            )
            .eq("is_published", true)
            .eq("slug", slug)
            .single();

        if (error) {
            console.error("getPlaceBySlug error:", error.message);
            return null;
        }

        return data;
    },
    ["place-by-slug"],
    {
        revalidate: 300,
        tags: ["places", "place-detail"],
    }
);
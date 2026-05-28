import { unstable_cache } from "next/cache";

import { supabase } from "@/lib/supabase";
import type { Place } from "@/types/database";

const getCachedFeaturedPlaces = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from("places")
      .select(
        `
        id,
        name,
        slug,
        short_description,
        description,
        area,
        city,
        address,
        image_url,
        price_min,
        price_max,
        is_featured,
        is_published,
        created_at,
        categories!inner (
          id,
          name,
          slug,
          icon
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
      .eq("categories.slug", "coffee-shop")
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error("getFeaturedPlaces Supabase error:", error.message);
      return [];
    }

    return (data ?? []) as unknown as Place[];
  },
  ["featured-coffee-shop-places"],
  {
    revalidate: 300,
    tags: ["places", "featured-places"],
  }
);

export async function getFeaturedPlaces() {
  return getCachedFeaturedPlaces();
}
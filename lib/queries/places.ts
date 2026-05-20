import { supabase } from "@/lib/supabase";
import type { Place } from "@/types/database";

export async function getFeaturedPlaces() {
    const { data, error } = await supabase
        .from("places")
        .select(`
      *,
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
    `)
        .eq("is_published", true)
        .eq("is_featured", true)
        .eq("categories.slug", "coffee-shop")
        .order("created_at", { ascending: false })
        .limit(6);

    if (error) {
        console.error("Supabase error:", error.message);
        return [];
    }

    return data as unknown as Place[];
}
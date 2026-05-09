import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlaceCard } from "@/components/PlaceCard";
import type { Category, Place } from "@/types/database";

type PlacesPageProps = {
    searchParams: Promise<{
        category?: string;
        area?: string;
        mood?: string;
    }>;
};

async function getCategories() {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("Categories error:", error.message);
        return [];
    }

    return data as Category[];
}

async function getCategoryId(categorySlug?: string) {
    if (!categorySlug) return null;

    const { data, error } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();

    if (error) {
        console.error("Category id error:", error.message);
        return null;
    }

    return data?.id || null;
}

async function getPlaces(category?: string, area?: string, mood?: string) {
    const categoryId = await getCategoryId(category);

    let query = supabase
        .from("places")
        .select(`
      *,
      categories (
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
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

    if (categoryId) {
        query = query.eq("category_id", categoryId);
    }

    if (area) {
        query = query.ilike("area", `%${area}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Places error:", error.message);
        return [];
    }

    let places = data as Place[];

    if (mood) {
        places = places.filter((place) =>
            place.place_tags?.some((item) => item.tags?.slug === mood)
        );
    }

    return places;
}

export default async function PlacesPage({ searchParams }: PlacesPageProps) {
    const params = await searchParams;

    const [categories, places] = await Promise.all([
        getCategories(),
        getPlaces(params.category, params.area, params.mood),
    ]);

    return (
        <main className="min-h-screen bg-[#F6F0E7] px-5 py-12 text-[#201813]">
            <section className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C8784A]">
                        Explore Places
                    </p>

                    <h1 className="mt-2 text-5xl font-black tracking-tight">
                        Cari tempat di Padang
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-[#756A60]">
                        Pilih berdasarkan kategori, area, mood, dan kebutuhan. Mulai dari
                        coffee shop, resto, wisata, padel, badminton, sampai coworking.
                    </p>
                </div>

                <div className="mb-8 flex flex-wrap gap-3">
                    <Link
                        href="/places"
                        className="rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-4 py-2 text-sm font-bold text-[#1F5A4A] transition hover:bg-[#1F5A4A] hover:text-white"
                    >
                        Semua
                    </Link>

                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/places?category=${category.slug}`}
                            className="rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-4 py-2 text-sm font-bold text-[#4B4038] transition hover:bg-[#1F5A4A] hover:text-white"
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>

                {places.length === 0 ? (
                    <div className="rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8] p-10 text-center">
                        <p className="text-lg font-black">Belum ada tempat.</p>
                        <p className="mt-2 text-[#756A60]">
                            Coba pilih kategori lain atau cek data di Supabase.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-3">
                        {places.map((place) => (
                            <PlaceCard key={place.id} place={place} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
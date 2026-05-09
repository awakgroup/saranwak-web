import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlaceCard } from "@/components/PlaceCard";
import type { Place } from "@/types/database";

type PlacesPageProps = {
    searchParams?: Promise<{
        q?: string;
        tag?: string;
        area?: string;
        category?: string;
    }>;
};

type TagItem = {
    id: string;
    name: string;
    slug: string;
    type?: string | null;
};

type PlaceTagItem = {
    tag_id?: string | null;
    tags?: TagItem | TagItem[] | null;
};

function normalizeText(value?: string | null) {
    return value?.toLowerCase().trim() || "";
}

function getSingleTag(item: PlaceTagItem) {
    if (Array.isArray(item.tags)) {
        return item.tags[0] ?? null;
    }

    return item.tags ?? null;
}

function matchKeyword(place: Place, keyword?: string) {
    const q = normalizeText(keyword);

    if (!q) return true;

    const searchableText = [
        place.name,
        place.description,
        place.short_description,
        place.area,
        place.city,
    ]
        .map(normalizeText)
        .join(" ");

    return searchableText.includes(q);
}

function matchArea(place: Place, selectedArea?: string) {
    if (!selectedArea) return true;

    return normalizeText(place.area) === normalizeText(selectedArea);
}

function matchTag(place: Place, selectedTag?: string) {
    if (!selectedTag) return true;

    return (
        place.place_tags?.some((item) => {
            const tag = getSingleTag(item as PlaceTagItem);
            return tag?.slug === selectedTag;
        }) ?? false
    );
}

function getTitle(params: { q?: string; tag?: string; area?: string }) {
    if (params.q) {
        return `Hasil pencarian "${params.q}"`;
    }

    if (params.area) {
        return `Coffee shop di ${params.area}`;
    }

    if (params.tag) {
        const label = params.tag
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        return `Coffee shop untuk ${label}`;
    }

    return "Coffee Shop di Padang";
}

async function getPlaces(params: {
    q?: string;
    tag?: string;
    area?: string;
    category?: string;
}) {
    const { data, error } = await supabase
        .from("places")
        .select(
            `
      id,
      category_id,
      name,
      slug,
      description,
      short_description,
      address,
      area,
      city,
      image_url,
      main_image_url,
      price_min,
      price_max,
      price_range,
      opening_hours,
      is_featured,
      is_verified,
      is_published,
      categories!inner (
        id,
        name,
        slug
      ),
      place_tags (
        tag_id,
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
        .eq("categories.slug", "coffee-shop")
        .order("created_at", { ascending: false });

    if (error || !data) {
        console.error("GET places error:", error);
        return [];
    }
    let places = data as unknown as Place[];

    if (params.q) {
        places = places.filter((place) => matchKeyword(place, params.q));
    }

    if (params.area) {
        places = places.filter((place) => matchArea(place, params.area));
    }

    if (params.tag) {
        places = places.filter((place) => matchTag(place, params.tag));
    }

    return places;
}

export default async function PlacesPage({ searchParams }: PlacesPageProps) {
    const params = searchParams ? await searchParams : {};
    const places = await getPlaces(params);

    const hasFilter = Boolean(params.q || params.tag || params.area);

    return (
        <main className="min-h-screen bg-neutral-950 px-5 py-16 text-white">
            <section className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.35em] text-neutral-500">
                            Saranwak Places
                        </p>

                        <h1 className="mt-4 max-w-5xl text-5xl font-black tracking-tight md:text-7xl">
                            {getTitle(params)}
                        </h1>

                        <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-400">
                            Untuk sementara, tempat yang ditampilkan hanya coffee shop di
                            Padang.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {hasFilter ? (
                            <Link
                                href="/places?category=coffee-shop"
                                className="rounded-full border border-white/10 bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-neutral-200"
                            >
                                Reset Filter
                            </Link>
                        ) : null}

                        <Link
                            href="/rekomendasi"
                            className="rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-neutral-200"
                        >
                            Cari Rekomendasi
                        </Link>
                    </div>
                </div>

                <div className="mb-8 flex flex-wrap gap-2">
                    <FilterLink label="Semua" href="/places?category=coffee-shop" />
                    <FilterLink
                        label="Nugas"
                        href="/places?category=coffee-shop&tag=nugas"
                    />
                    <FilterLink
                        label="Healing"
                        href="/places?category=coffee-shop&tag=healing"
                    />
                    <FilterLink
                        label="First Date"
                        href="/places?category=coffee-shop&tag=first-date"
                    />
                    <FilterLink
                        label="Budget Mahasiswa"
                        href="/places?category=coffee-shop&tag=budget-mahasiswa"
                    />
                    <FilterLink
                        label="Outdoor"
                        href="/places?category=coffee-shop&tag=outdoor"
                    />
                </div>

                {places.length === 0 ? (
                    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-10">
                        <h2 className="text-2xl font-black">Belum ada tempat cocok.</h2>

                        <p className="mt-3 max-w-2xl text-neutral-400">
                            Coba filter lain atau cek slug tag di Supabase. Bisa jadi data
                            coffee shop belum punya tag tersebut.
                        </p>

                        <Link
                            href="/places?category=coffee-shop"
                            className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-neutral-200"
                        >
                            Lihat Semua Coffee Shop
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {places.map((place) => (
                            <PlaceCard key={place.id} place={place} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

function FilterLink({ label, href }: { label: string; href: string }) {
    return (
        <Link
            href={href}
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-black text-neutral-300 transition hover:bg-white hover:text-black"
        >
            {label}
        </Link>
    );
}
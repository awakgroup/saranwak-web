import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlaceCard } from "@/components/PlaceCard";
import type { Place } from "@/types/database";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PlacesPageProps = {
    searchParams?: Promise<{
        q?: string;
        tag?: string;
        tags?: string;
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

const filterOptions = [
    { label: "Nugas", tag: "nugas" },
    { label: "Healing", tag: "healing" },
    { label: "First Date", tag: "first-date" },
    { label: "Budget Mahasiswa", tag: "budget-mahasiswa" },
    { label: "Outdoor", tag: "outdoor" },
    { label: "WiFi", tag: "wifi" },
    { label: "Nongkrong", tag: "nongkrong" },
    { label: "Colokan", tag: "colokan" },
    { label: "Indoor", tag: "indoor" },
    { label: "Buka Pagi", tag: "buka-pagi" },
    { label: "Buka Malam", tag: "buka-malam" },
    { label: "24 Jam", tag: "24-jam" },
];

function normalizeText(value?: string | null) {
    return value?.toLowerCase().trim() || "";
}

function getSingleTag(item: PlaceTagItem) {
    if (Array.isArray(item.tags)) {
        return item.tags[0] ?? null;
    }

    return item.tags ?? null;
}

function getSelectedTags(params: { tag?: string; tags?: string }) {
    if (params.tags) {
        return params.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
    }

    if (params.tag) {
        return [params.tag];
    }

    return [];
}

function getPlaceTagSlugs(place: Place) {
    return (
        place.place_tags
            ?.map((item) => {
                const tag = getSingleTag(item as PlaceTagItem);
                return tag?.slug;
            })
            .filter((slug): slug is string => Boolean(slug)) ?? []
    );
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

function matchAllSelectedTags(place: Place, selectedTags: string[]) {
    if (selectedTags.length === 0) return true;

    const placeTagSlugs = getPlaceTagSlugs(place);

    return selectedTags.every((selectedTag) =>
        placeTagSlugs.includes(selectedTag)
    );
}

function makeTitle(params: {
    q?: string;
    tag?: string;
    tags?: string;
    area?: string;
}) {
    if (params.q) {
        return `Hasil pencarian "${params.q}"`;
    }

    if (params.area) {
        return `Coffee shop di ${params.area}`;
    }

    const selectedTags = getSelectedTags(params);

    if (selectedTags.length > 0) {
        return `Coffee shop sesuai ${selectedTags.length} filter`;
    }

    return "Coffee Shop di Padang";
}

function makeFilterHref(
    params: {
        q?: string;
        tag?: string;
        tags?: string;
        area?: string;
        category?: string;
    },
    targetTag: string
) {
    const selectedTags = getSelectedTags(params);
    const isActive = selectedTags.includes(targetTag);

    const nextTags = isActive
        ? selectedTags.filter((tag) => tag !== targetTag)
        : [...selectedTags, targetTag];

    const urlParams = new URLSearchParams();

    urlParams.set("category", "coffee-shop");

    if (params.q) {
        urlParams.set("q", params.q);
    }

    if (params.area) {
        urlParams.set("area", params.area);
    }

    if (nextTags.length > 0) {
        urlParams.set("tags", nextTags.join(","));
    }

    return `/places?${urlParams.toString()}`;
}

async function getPlaces(params: {
    q?: string;
    tag?: string;
    tags?: string;
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

    const selectedTags = getSelectedTags(params);

    if (params.q) {
        places = places.filter((place) => matchKeyword(place, params.q));
    }

    if (params.area) {
        places = places.filter((place) => matchArea(place, params.area));
    }

    if (selectedTags.length > 0) {
        places = places.filter((place) =>
            matchAllSelectedTags(place, selectedTags)
        );
    }

    return places;
}

export default async function PlacesPage({ searchParams }: PlacesPageProps) {
    const params = searchParams ? await searchParams : {};
    const places = await getPlaces(params);

    const selectedTags = getSelectedTags(params);
    const hasFilter = Boolean(params.q || params.tag || params.tags || params.area);

    return (
        <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white sm:px-5 sm:py-14 md:py-16">
            <section className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.35em] text-neutral-500">
                            Saranwak Places
                        </p>

                        <h1 className="mt-4 max-w-5xl text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
                            {makeTitle(params)}
                        </h1>

                        <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-400 sm:text-lg sm:leading-8">
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

                <div className="mb-8 rounded-[24px] border border-white/10 bg-white/[0.03] p-4 sm:rounded-[28px]">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-black text-white">Multi Filter</p>
                            <p className="mt-1 text-xs font-semibold leading-5 text-neutral-500">
                                Klik beberapa filter. Cafe hanya muncul kalau punya semua tag
                                yang kamu pilih.
                            </p>
                        </div>

                        <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-black">
                            {selectedTags.length} dipilih
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/places?category=coffee-shop"
                            className={`rounded-full border px-4 py-2 text-sm font-black transition ${selectedTags.length === 0
                                    ? "border-white bg-white text-black"
                                    : "border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-white hover:text-black"
                                }`}
                        >
                            Semua
                        </Link>

                        {filterOptions.map((filter) => {
                            const active = selectedTags.includes(filter.tag);

                            return (
                                <Link
                                    key={filter.tag}
                                    href={makeFilterHref(params, filter.tag)}
                                    className={`rounded-full border px-4 py-2 text-sm font-black transition ${active
                                            ? "border-white bg-white text-black"
                                            : "border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-white hover:text-black"
                                        }`}
                                >
                                    <span className="mr-2">{active ? "✓" : "+"}</span>
                                    {filter.label}
                                </Link>
                            );
                        })}
                    </div>

                    {selectedTags.length > 0 ? (
                        <p className="mt-4 text-sm font-bold text-neutral-400">
                            Filter aktif:{" "}
                            <span className="text-white">
                                {filterOptions
                                    .filter((option) => selectedTags.includes(option.tag))
                                    .map((option) => option.label)
                                    .join(", ")}
                            </span>
                        </p>
                    ) : null}
                </div>

                {places.length === 0 ? (
                    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 sm:rounded-[32px] sm:p-10">
                        <h2 className="text-2xl font-black">Belum ada tempat cocok.</h2>

                        <p className="mt-3 max-w-2xl text-neutral-400">
                            Coba kurangi filter, pakai keyword lain, atau cek slug tag di
                            Supabase. Bisa jadi data coffee shop belum punya kombinasi tag
                            tersebut.
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
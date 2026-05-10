import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlaceCard } from "@/components/PlaceCard";
import {
    placeFilterOptions,
    priceFilterOptions,
    type PriceFilterValue,
} from "@/lib/place-filters";
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
        price?: string;
    }>;
};

type PageParams = {
    q?: string;
    tag?: string;
    tags?: string;
    area?: string;
    category?: string;
    price?: string;
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

function getSelectedPrice(price?: string): PriceFilterValue {
    const allowedPrices = priceFilterOptions.map((item) => item.value);

    if (allowedPrices.includes(price as PriceFilterValue)) {
        return price as PriceFilterValue;
    }

    return "all";
}

function getPriceLabel(price?: string) {
    const selectedPrice = getSelectedPrice(price);

    return (
        priceFilterOptions.find((option) => option.value === selectedPrice)?.label ||
        "Semua Harga"
    );
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
        place.address,
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

    return selectedTags.every((selectedTag) => placeTagSlugs.includes(selectedTag));
}

/**
 * Bisa membaca:
 * - 15000
 * - "15000"
 * - "15k"
 * - "15rb"
 * - "15 ribu"
 * - "Rp15.000"
 */
function parsePriceToNumber(value?: number | string | null) {
    if (typeof value === "number") {
        return value;
    }

    if (!value) {
        return null;
    }

    const raw = String(value).toLowerCase().trim();

    const cleaned = raw
        .replace(/rp/g, "")
        .replace(/\./g, "")
        .replace(/,/g, "")
        .replace(/\s/g, "")
        .replace(/ribu/g, "000")
        .replace(/rb/g, "000")
        .replace(/k/g, "000");

    const result = Number(cleaned);

    return Number.isNaN(result) ? null : result;
}

/**
 * Bisa membaca:
 * - "15k - 25k"
 * - "Rp30k - Rp70k"
 * - "Rp50k - Rp100k"
 * - "15000 - 25000"
 */
function parsePriceRange(priceRange?: string | null) {
    if (!priceRange) {
        return {
            min: null,
            max: null,
        };
    }

    const matches = String(priceRange)
        .toLowerCase()
        .match(/\d+\s*(k|rb|ribu)?|\d+[.,]\d+/g);

    if (!matches || matches.length === 0) {
        return {
            min: null,
            max: null,
        };
    }

    const prices = matches
        .map((item) => parsePriceToNumber(item))
        .filter((item): item is number => typeof item === "number");

    if (prices.length === 0) {
        return {
            min: null,
            max: null,
        };
    }

    return {
        min: Math.min(...prices),
        max: Math.max(...prices),
    };
}

/**
 * Logic filter pakai range overlap.
 *
 * Contoh:
 * - Cafe 15k - 25k masuk ke under-20k dan 20k-40k
 * - Cafe 30k - 70k masuk ke 20k-40k dan above-40k
 * - Cafe 50k - 100k masuk ke above-40k saja
 */
function matchPrice(place: Place, price?: string) {
    const selectedPrice = getSelectedPrice(price);

    if (selectedPrice === "all") return true;

    const priceMinFromColumn = parsePriceToNumber(place.price_min);
    const priceMaxFromColumn = parsePriceToNumber(place.price_max);

    const priceRange = parsePriceRange(place.price_range);

    const min = priceMinFromColumn ?? priceRange.min;
    const max = priceMaxFromColumn ?? priceRange.max ?? min;

    if (typeof min !== "number" || typeof max !== "number") {
        return false;
    }

    if (selectedPrice === "under-20k") {
        return min < 20000;
    }

    if (selectedPrice === "20k-40k") {
        return min <= 40000 && max >= 20000;
    }

    if (selectedPrice === "above-40k") {
        return max > 40000;
    }

    return true;
}

function makeTitle(params: PageParams) {
    if (params.q) {
        return `Hasil pencarian "${params.q}"`;
    }

    if (params.area) {
        return `Coffee shop di ${params.area}`;
    }

    const selectedTags = getSelectedTags(params);
    const selectedPrice = getSelectedPrice(params.price);

    if (selectedTags.length > 0 || selectedPrice !== "all") {
        return "Coffee shop sesuai filter";
    }

    return "Coffee Shop di Padang";
}

function makeDescription(params: PageParams) {
    const selectedTags = getSelectedTags(params);
    const selectedPrice = getSelectedPrice(params.price);

    if (params.q) {
        return "Hasil pencarian berdasarkan nama tempat, area, alamat, atau deskripsi coffee shop.";
    }

    if (selectedTags.length > 0 || selectedPrice !== "all") {
        return "Cafe hanya muncul kalau cocok dengan filter yang kamu pilih. Jadi hasilnya lebih strict dan relevan.";
    }

    if (params.area) {
        return "Tempat yang muncul difilter berdasarkan area yang kamu pilih.";
    }

    return "Untuk sementara, tempat yang ditampilkan hanya coffee shop di Padang.";
}

function makeFilterHref(params: PageParams, targetTag: string) {
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

    const selectedPrice = getSelectedPrice(params.price);

    if (selectedPrice !== "all") {
        urlParams.set("price", selectedPrice);
    }

    return `/places?${urlParams.toString()}`;
}

function makePriceHref(params: PageParams, targetPrice: PriceFilterValue) {
    const urlParams = new URLSearchParams();

    urlParams.set("category", "coffee-shop");

    if (params.q) {
        urlParams.set("q", params.q);
    }

    if (params.area) {
        urlParams.set("area", params.area);
    }

    const selectedTags = getSelectedTags(params);

    if (selectedTags.length > 0) {
        urlParams.set("tags", selectedTags.join(","));
    }

    if (targetPrice !== "all") {
        urlParams.set("price", targetPrice);
    }

    return `/places?${urlParams.toString()}`;
}

function makeRemoveTagHref(params: PageParams, targetTag: string) {
    const selectedTags = getSelectedTags(params);
    const nextTags = selectedTags.filter((tag) => tag !== targetTag);

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

    const selectedPrice = getSelectedPrice(params.price);

    if (selectedPrice !== "all") {
        urlParams.set("price", selectedPrice);
    }

    return `/places?${urlParams.toString()}`;
}

function makeRemoveKeywordHref(params: PageParams) {
    const selectedTags = getSelectedTags(params);
    const selectedPrice = getSelectedPrice(params.price);
    const urlParams = new URLSearchParams();

    urlParams.set("category", "coffee-shop");

    if (params.area) {
        urlParams.set("area", params.area);
    }

    if (selectedTags.length > 0) {
        urlParams.set("tags", selectedTags.join(","));
    }

    if (selectedPrice !== "all") {
        urlParams.set("price", selectedPrice);
    }

    return `/places?${urlParams.toString()}`;
}

function makeRemoveAreaHref(params: PageParams) {
    const selectedTags = getSelectedTags(params);
    const selectedPrice = getSelectedPrice(params.price);
    const urlParams = new URLSearchParams();

    urlParams.set("category", "coffee-shop");

    if (params.q) {
        urlParams.set("q", params.q);
    }

    if (selectedTags.length > 0) {
        urlParams.set("tags", selectedTags.join(","));
    }

    if (selectedPrice !== "all") {
        urlParams.set("price", selectedPrice);
    }

    return `/places?${urlParams.toString()}`;
}

function makeRemovePriceHref(params: PageParams) {
    const selectedTags = getSelectedTags(params);
    const urlParams = new URLSearchParams();

    urlParams.set("category", "coffee-shop");

    if (params.q) {
        urlParams.set("q", params.q);
    }

    if (params.area) {
        urlParams.set("area", params.area);
    }

    if (selectedTags.length > 0) {
        urlParams.set("tags", selectedTags.join(","));
    }

    return `/places?${urlParams.toString()}`;
}

function getFilterLabel(tag: string) {
    return placeFilterOptions.find((option) => option.tag === tag)?.label || tag;
}

async function getPlaces(params: PageParams) {
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
    const selectedPrice = getSelectedPrice(params.price);

    if (params.q) {
        places = places.filter((place) => matchKeyword(place, params.q));
    }

    if (params.area) {
        places = places.filter((place) => matchArea(place, params.area));
    }

    if (selectedTags.length > 0) {
        places = places.filter((place) => matchAllSelectedTags(place, selectedTags));
    }

    if (selectedPrice !== "all") {
        places = places.filter((place) => matchPrice(place, params.price));
    }

    return places;
}

export default async function PlacesPage({ searchParams }: PlacesPageProps) {
    const params = searchParams ? await searchParams : {};
    const places = await getPlaces(params);

    const selectedTags = getSelectedTags(params);
    const selectedPrice = getSelectedPrice(params.price);

    const hasFilter = Boolean(
        params.q || params.tag || params.tags || params.area || selectedPrice !== "all"
    );

    const activeFilterCount =
        selectedTags.length + (selectedPrice !== "all" ? 1 : 0);

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
                            {makeDescription(params)}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {hasFilter ? (
                            <Link
                                href="/places?category=coffee-shop"
                                className="rounded-full border border-white/10 bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-neutral-200"
                            >
                                Reset Semua
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

                <div className="mb-6 rounded-[24px] border border-white/10 bg-white/[0.04] p-4 sm:rounded-[28px] sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.22em] text-neutral-500">
                                Hasil
                            </p>

                            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                                {places.length} coffee shop ditemukan
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-neutral-400">
                                {hasFilter
                                    ? "Hasil ini sudah mengikuti filter aktif yang kamu pilih."
                                    : "Menampilkan semua coffee shop yang sudah published."}
                            </p>
                        </div>

                        {hasFilter ? (
                            <div className="flex flex-wrap gap-2">
                                {params.q ? (
                                    <Link
                                        href={makeRemoveKeywordHref(params)}
                                        className="rounded-full border border-white/10 bg-white px-3 py-2 text-xs font-black text-black transition hover:bg-neutral-200"
                                    >
                                        Search: {params.q} ×
                                    </Link>
                                ) : null}

                                {selectedTags.map((tag) => (
                                    <Link
                                        key={tag}
                                        href={makeRemoveTagHref(params, tag)}
                                        className="rounded-full border border-white/10 bg-white px-3 py-2 text-xs font-black text-black transition hover:bg-neutral-200"
                                    >
                                        {getFilterLabel(tag)} ×
                                    </Link>
                                ))}

                                {selectedPrice !== "all" ? (
                                    <Link
                                        href={makeRemovePriceHref(params)}
                                        className="rounded-full border border-white/10 bg-white px-3 py-2 text-xs font-black text-black transition hover:bg-neutral-200"
                                    >
                                        Harga: {getPriceLabel(params.price)} ×
                                    </Link>
                                ) : null}

                                {params.area ? (
                                    <Link
                                        href={makeRemoveAreaHref(params)}
                                        className="rounded-full border border-white/10 bg-white px-3 py-2 text-xs font-black text-black transition hover:bg-neutral-200"
                                    >
                                        Area: {params.area} ×
                                    </Link>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="mb-8 rounded-[24px] border border-white/10 bg-white/[0.03] p-4 sm:rounded-[28px] sm:p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-black text-white">Multi Filter</p>

                            <p className="mt-1 text-xs font-semibold leading-5 text-neutral-500">
                                Klik beberapa filter. Cafe hanya muncul kalau cocok dengan
                                filter yang kamu pilih.
                            </p>
                        </div>

                        <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-black">
                            {activeFilterCount} dipilih
                        </span>
                    </div>

                    <div className="mb-5">
                        <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-neutral-500">
                            Harga
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {priceFilterOptions.map((filter) => {
                                const active = selectedPrice === filter.value;

                                return (
                                    <Link
                                        key={filter.value}
                                        href={makePriceHref(params, filter.value)}
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
                    </div>

                    <div>
                        <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-neutral-500">
                            Kebutuhan
                        </p>

                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/places?category=coffee-shop"
                                className={`rounded-full border px-4 py-2 text-sm font-black transition ${selectedTags.length === 0 &&
                                        !params.q &&
                                        !params.area &&
                                        selectedPrice === "all"
                                        ? "border-white bg-white text-black"
                                        : "border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-white hover:text-black"
                                    }`}
                            >
                                Semua
                            </Link>

                            {placeFilterOptions.map((filter) => {
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
                    </div>

                    {activeFilterCount > 0 ? (
                        <p className="mt-4 text-sm font-bold text-neutral-400">
                            Filter aktif:{" "}
                            <span className="text-white">
                                {[
                                    ...selectedTags.map((tag) => getFilterLabel(tag)),
                                    selectedPrice !== "all" ? getPriceLabel(params.price) : null,
                                ]
                                    .filter(Boolean)
                                    .join(", ")}
                            </span>
                        </p>
                    ) : null}
                </div>

                {places.length === 0 ? (
                    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 sm:rounded-[32px] sm:p-10">
                        <h2 className="text-2xl font-black">Belum ada tempat cocok.</h2>

                        <p className="mt-3 max-w-2xl text-neutral-400">
                            Coba hapus beberapa filter aktif, pakai keyword lain, atau lihat
                            semua coffee shop dulu. Kadang tempat yang pas nggak selalu punya
                            semua tag yang kita pilih.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/places?category=coffee-shop"
                                className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-neutral-200"
                            >
                                Lihat Semua Coffee Shop
                            </Link>

                            <Link
                                href="/"
                                className="inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-black"
                            >
                                Kembali ke Home
                            </Link>
                        </div>
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
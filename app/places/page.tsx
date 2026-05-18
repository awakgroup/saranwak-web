import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlaceCard } from "@/components/PlaceCard";
import {
    placeFilterGroups,
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

    const tagText =
        place.place_tags
            ?.map((item) => {
                const tag = getSingleTag(item as PlaceTagItem);
                return [tag?.name, tag?.slug].filter(Boolean).join(" ");
            })
            .join(" ") ?? "";

    const searchableText = [
        place.name,
        place.description,
        place.short_description,
        place.address,
        place.area,
        place.city,
        tagText,
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
        return "Hasil berdasarkan nama tempat, area, alamat, deskripsi, dan tag coffee shop.";
    }

    if (selectedTags.length > 0 || selectedPrice !== "all") {
        return "Tempat yang muncul sudah mengikuti aktivitas, fasilitas, vibes, dan budget yang kamu pilih.";
    }

    if (params.area) {
        return "Tempat yang muncul difilter berdasarkan area yang kamu pilih.";
    }

    return "Temukan coffee shop di Padang berdasarkan budget, aktivitas, fasilitas, dan vibes.";
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
        <main className="min-h-screen bg-[#F4F1EA] px-4 pb-12 pt-8 text-[#201813] sm:px-5 sm:pb-16 sm:pt-10">
            <section className="mx-auto max-w-6xl">
                <div className="mb-6 rounded-[30px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 shadow-[0_18px_60px_rgba(47,35,25,0.08)] sm:p-6 md:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E7D8C8] bg-[#F8F1E8] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-[#C8784A]">
                                <span className="h-2 w-2 rounded-full bg-[#1F5A4A]" />
                                Saranwak Places
                            </div>

                            <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] text-[#201813] sm:text-5xl md:text-6xl">
                                {makeTitle(params)}
                            </h1>

                            <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#756A60] sm:text-base">
                                {makeDescription(params)}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
                            {hasFilter ? (
                                <Link
                                    href="/places?category=coffee-shop"
                                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#E7D8C8] bg-white px-5 py-3 text-sm font-black text-[#201813] transition duration-300 hover:-translate-y-0.5 hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
                                >
                                    Reset Semua
                                </Link>
                            ) : null}

                            <Link
                                href="/"
                                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#181818] px-5 py-3 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#1F5A4A]"
                            >
                                Kembali ke Home
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3 border-t border-[#E7D8C8] pt-5 sm:grid-cols-3">
                        <div className="rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8]/80 p-4">
                            <p className="text-2xl font-black text-[#1F5A4A]">
                                {places.length}
                            </p>
                            <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#756A60]">
                                Ditemukan
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8]/80 p-4">
                            <p className="text-2xl font-black text-[#1F5A4A]">
                                {activeFilterCount}
                            </p>
                            <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#756A60]">
                                Filter aktif
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8]/80 p-4">
                            <p className="text-2xl font-black text-[#1F5A4A]">Padang</p>
                            <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#756A60]">
                                Area awal
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-6 rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-4 shadow-[0_14px_45px_rgba(47,35,25,0.06)] sm:p-5">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm font-black text-[#201813]">
                                Filter Coffee Shop
                            </p>

                            <p className="mt-1 max-w-2xl text-xs font-semibold leading-5 text-[#756A60]">
                                Klik beberapa filter. Tempat akan muncul kalau cocok dengan
                                aktivitas, fasilitas, vibes, dan budget yang kamu pilih.
                            </p>
                        </div>

                        <span className="w-fit rounded-full bg-[#181818] px-3 py-2 text-xs font-black text-white">
                            {activeFilterCount} dipilih
                        </span>
                    </div>

                    <div className="mb-5">
                        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                            Harga
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {priceFilterOptions.map((filter) => {
                                const active = selectedPrice === filter.value;

                                return (
                                    <Link
                                        key={filter.value}
                                        href={makePriceHref(params, filter.value)}
                                        className={`inline-flex items-center rounded-full border px-3.5 py-2 text-xs font-black transition duration-200 sm:text-sm ${active
                                                ? "border-[#1F5A4A] bg-[#1F5A4A] text-white shadow-[0_8px_20px_rgba(31,90,74,0.18)]"
                                                : "border-[#E7D8C8] bg-white text-[#4B4038] hover:border-[#1F5A4A] hover:text-[#1F5A4A]"
                                            }`}
                                    >
                                        <span className="mr-2">{active ? "✓" : "+"}</span>
                                        {filter.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                                Semua Filter
                            </p>

                            <Link
                                href="/places?category=coffee-shop"
                                className={`inline-flex rounded-full border px-3.5 py-2 text-xs font-black transition duration-200 sm:text-sm ${selectedTags.length === 0 &&
                                        !params.q &&
                                        !params.area &&
                                        selectedPrice === "all"
                                        ? "border-[#1F5A4A] bg-[#1F5A4A] text-white"
                                        : "border-[#E7D8C8] bg-white text-[#4B4038] hover:border-[#1F5A4A] hover:text-[#1F5A4A]"
                                    }`}
                            >
                                Semua Coffee Shop
                            </Link>
                        </div>

                        {placeFilterGroups.map((group) => (
                            <div key={group.title}>
                                <div className="mb-2 flex items-center gap-3">
                                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                                        {group.title}
                                    </p>
                                    <div className="hidden h-px flex-1 bg-[#E7D8C8] sm:block" />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {group.options.map((filter) => {
                                        const active = selectedTags.includes(filter.tag);

                                        return (
                                            <Link
                                                key={filter.tag}
                                                href={makeFilterHref(params, filter.tag)}
                                                className={`inline-flex items-center rounded-full border px-3.5 py-2 text-xs font-black transition duration-200 sm:text-sm ${active
                                                        ? "border-[#1F5A4A] bg-[#1F5A4A] text-white shadow-[0_8px_20px_rgba(31,90,74,0.18)]"
                                                        : "border-[#E7D8C8] bg-white text-[#4B4038] hover:border-[#1F5A4A] hover:text-[#1F5A4A]"
                                                    }`}
                                            >
                                                <span className="mr-2">{active ? "✓" : "+"}</span>
                                                {filter.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {hasFilter ? (
                        <div className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8]/80 p-3">
                            {params.q ? (
                                <Link
                                    href={makeRemoveKeywordHref(params)}
                                    className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#201813] ring-1 ring-[#E7D8C8] transition hover:bg-[#181818] hover:text-white"
                                >
                                    Search: {params.q} ×
                                </Link>
                            ) : null}

                            {selectedTags.map((tag) => (
                                <Link
                                    key={tag}
                                    href={makeRemoveTagHref(params, tag)}
                                    className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#201813] ring-1 ring-[#E7D8C8] transition hover:bg-[#181818] hover:text-white"
                                >
                                    {getFilterLabel(tag)} ×
                                </Link>
                            ))}

                            {selectedPrice !== "all" ? (
                                <Link
                                    href={makeRemovePriceHref(params)}
                                    className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#201813] ring-1 ring-[#E7D8C8] transition hover:bg-[#181818] hover:text-white"
                                >
                                    Harga: {getPriceLabel(params.price)} ×
                                </Link>
                            ) : null}

                            {params.area ? (
                                <Link
                                    href={makeRemoveAreaHref(params)}
                                    className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#201813] ring-1 ring-[#E7D8C8] transition hover:bg-[#181818] hover:text-white"
                                >
                                    Area: {params.area} ×
                                </Link>
                            ) : null}
                        </div>
                    ) : null}
                </div>

                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C8784A]">
                            Hasil tempat
                        </p>

                        <h2 className="mt-1 text-2xl font-black tracking-[-0.035em] text-[#201813] sm:text-3xl">
                            {places.length} coffee shop ditemukan
                        </h2>
                    </div>

                    <p className="max-w-md text-sm font-semibold leading-6 text-[#756A60]">
                        {hasFilter
                            ? "Hasil ini sudah mengikuti filter aktif yang kamu pilih."
                            : "Menampilkan semua coffee shop yang sudah published."}
                    </p>
                </div>

                {places.length === 0 ? (
                    <div className="rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-8 shadow-[0_18px_60px_rgba(47,35,25,0.06)] sm:rounded-[32px] sm:p-10">
                        <h2 className="text-2xl font-black text-[#201813]">
                            Belum ada tempat cocok.
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#756A60] sm:text-base">
                            Coba hapus beberapa filter aktif atau lihat semua coffee shop
                            dulu. Kadang tempat yang pas nggak selalu punya semua tag yang
                            kita pilih. Namanya juga hidup, kadang cocoknya nggak full spec.
                        </p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <Link
                                href="/places?category=coffee-shop"
                                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#181818] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1F5A4A]"
                            >
                                Lihat Semua Coffee Shop
                            </Link>

                            <Link
                                href="/"
                                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#E7D8C8] bg-white px-5 py-3 text-sm font-black text-[#201813] transition hover:bg-[#181818] hover:text-white"
                            >
                                Kembali ke Home
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {places.map((place, index) => (
                            <PlaceCard
                                key={place.id}
                                place={place}
                                source="places_list"
                                position={index + 1}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
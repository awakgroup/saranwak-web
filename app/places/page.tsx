import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlaceCard } from "@/components/PlaceCard";
import {
    placeFilterGroups,
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

export default async function PlacesPage({ searchParams }: PlacesPageProps) {
    const params = ((await searchParams) ?? {}) as PageParams;

    const selectedTags = getSelectedTags(params);
    const selectedPrice = getSelectedPrice(params.price);

    const placesData = await getPlaces();

    const places = placesData
        .filter((place) => matchKeyword(place, params.q))
        .filter((place) => matchArea(place, params.area))
        .filter((place) => matchAllSelectedTags(place, selectedTags))
        .filter((place) => matchPrice(place, params.price))
        .sort((a, b) => {
            return (
                new Date(b.created_at ?? 0).getTime() -
                new Date(a.created_at ?? 0).getTime()
            );
        });

    const hasFilter = Boolean(
        params.q ||
        params.area ||
        selectedTags.length > 0 ||
        selectedPrice !== "all"
    );

    const activeFilterCount =
        Number(Boolean(params.q)) +
        Number(Boolean(params.area)) +
        selectedTags.length +
        Number(selectedPrice !== "all");

    return (
        <main className="min-h-screen bg-[#F4F1EA] px-4 pb-12 pt-6 text-[#201813] sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
            <section className="mx-auto max-w-7xl">
                <div className="mb-5 overflow-hidden rounded-[30px] border border-[#E7D8C8] bg-[#201813] p-5 text-white shadow-[0_22px_70px_rgba(32,24,19,0.13)] sm:p-6 lg:p-7">
                    <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div className="max-w-4xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#F2C38B] sm:text-xs">
                                <span className="h-2 w-2 rounded-full bg-[#F2C38B]" />
                                Saranwak Places
                            </div>

                            <h1 className="mt-4 max-w-4xl text-[36px] font-black leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl lg:text-[64px]">
                                {makeTitle(params)}
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-white/68 sm:text-base">
                                {makeDescription(params)}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 lg:min-w-[360px]">
                            <MiniStat value={places.length} label="Ditemukan" />
                            <MiniStat value={activeFilterCount} label="Filter" />
                            <MiniStat value="Terbaru" label="Urutan" />
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 sm:flex-row sm:flex-wrap">
                        {hasFilter ? (
                            <Link
                                href="/places?category=coffee-shop"
                                className="inline-flex min-h-10 items-center justify-center rounded-full bg-white px-4 py-2.5 text-xs font-black text-[#201813] transition hover:bg-[#F2C38B]"
                            >
                                Reset Semua
                            </Link>
                        ) : null}

                        <Link
                            href="/"
                            className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-xs font-black text-white transition hover:bg-white hover:text-[#201813]"
                        >
                            Kembali ke Home
                        </Link>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[320px_1fr] lg:items-start">
                    <aside className="lg:sticky lg:top-24">
                        <details className="group rounded-[26px] border border-[#E7D8C8] bg-[#FFFDF8] p-4 shadow-[0_14px_45px_rgba(47,35,25,0.06)] lg:hidden">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-black text-[#201813]">
                                        Filter Coffee Shop
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-[#756A60]">
                                        {activeFilterCount} filter dipilih
                                    </p>
                                </div>

                                <span className="rounded-full bg-[#201813] px-3 py-2 text-xs font-black text-white">
                                    Buka
                                </span>
                            </summary>

                            <div className="mt-4 border-t border-[#E7D8C8] pt-4">
                                <FilterContent
                                    params={params}
                                    selectedTags={selectedTags}
                                    selectedPrice={selectedPrice}
                                    hasFilter={hasFilter}
                                />
                            </div>
                        </details>

                        <div className="hidden rounded-[26px] border border-[#E7D8C8] bg-[#FFFDF8] p-4 shadow-[0_14px_45px_rgba(47,35,25,0.06)] lg:block">
                            <div className="mb-4">
                                <p className="text-sm font-black text-[#201813]">
                                    Filter Coffee Shop
                                </p>

                                <p className="mt-1 text-xs font-semibold leading-5 text-[#756A60]">
                                    Pilih aktivitas, fasilitas, vibes, dan budget.
                                </p>
                            </div>

                            <FilterContent
                                params={params}
                                selectedTags={selectedTags}
                                selectedPrice={selectedPrice}
                                hasFilter={hasFilter}
                            />
                        </div>
                    </aside>

                    <section>
                        {hasFilter ? (
                            <ActiveFilters
                                params={params}
                                selectedTags={selectedTags}
                                selectedPrice={selectedPrice}
                            />
                        ) : null}

                        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                                    Hasil tempat
                                </p>

                                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#201813] sm:text-3xl">
                                    {places.length} coffee shop ditemukan
                                </h2>
                            </div>

                            <p className="max-w-md text-sm font-semibold leading-6 text-[#756A60]">
                                {hasFilter
                                    ? "Hasil sudah mengikuti filter aktif dan diurutkan dari data terbaru."
                                    : "Menampilkan semua coffee shop published, diurutkan dari data terbaru."}
                            </p>
                        </div>

                        {places.length === 0 ? (
                            <EmptyPlacesState />
                        ) : (
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
                </div>
            </section>
        </main>
    );
}

async function getPlaces() {
    const { data, error } = await supabase
        .from("places")
        .select(
            `
      *,
      categories (
        id,
        name,
        slug,
        icon
      ),
      place_tags (
        id,
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
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Places query error:", error.message);
        return [];
    }

    return (data ?? []) as unknown as Place[];
}

function MiniStat({
    value,
    label,
}: {
    value: number | string;
    label: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3 text-center backdrop-blur">
            <p className="text-lg font-black text-[#F2C38B] sm:text-xl">{value}</p>
            <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/45">
                {label}
            </p>
        </div>
    );
}

function FilterContent({
    params,
    selectedTags,
    selectedPrice,
    hasFilter,
}: {
    params: PageParams;
    selectedTags: string[];
    selectedPrice: PriceFilterValue;
    hasFilter: boolean;
}) {
    return (
        <div>
            <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                    Harga
                </p>

                <div className="flex flex-wrap gap-2">
                    {priceFilterOptions.map((filter) => {
                        const active = selectedPrice === filter.value;

                        return (
                            <Link
                                key={filter.value}
                                href={makePriceHref(params, filter.value)}
                                className={`inline-flex items-center rounded-full border px-3 py-2 text-xs font-black transition ${active
                                        ? "border-[#1F5A4A] bg-[#1F5A4A] text-white"
                                        : "border-[#E7D8C8] bg-white text-[#4B4038] hover:border-[#1F5A4A] hover:text-[#1F5A4A]"
                                    }`}
                            >
                                <span className="mr-1.5">{active ? "✓" : "+"}</span>
                                {filter.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                    Semua
                </p>

                <Link
                    href="/places?category=coffee-shop"
                    className={`inline-flex rounded-full border px-3 py-2 text-xs font-black transition ${!hasFilter
                            ? "border-[#1F5A4A] bg-[#1F5A4A] text-white"
                            : "border-[#E7D8C8] bg-white text-[#4B4038] hover:border-[#1F5A4A] hover:text-[#1F5A4A]"
                        }`}
                >
                    Semua Coffee Shop
                </Link>
            </div>

            <div className="mt-4 space-y-4">
                {placeFilterGroups.map((group) => (
                    <div key={group.title}>
                        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                            {group.title}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {group.options.map((filter) => {
                                const active = selectedTags.includes(filter.tag);

                                return (
                                    <Link
                                        key={filter.tag}
                                        href={makeFilterHref(params, filter.tag)}
                                        className={`inline-flex items-center rounded-full border px-3 py-2 text-xs font-black transition ${active
                                                ? "border-[#1F5A4A] bg-[#1F5A4A] text-white"
                                                : "border-[#E7D8C8] bg-white text-[#4B4038] hover:border-[#1F5A4A] hover:text-[#1F5A4A]"
                                            }`}
                                    >
                                        <span className="mr-1.5">{active ? "✓" : "+"}</span>
                                        {filter.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ActiveFilters({
    params,
    selectedTags,
    selectedPrice,
}: {
    params: PageParams;
    selectedTags: string[];
    selectedPrice: PriceFilterValue;
}) {
    return (
        <div className="mb-4 flex flex-wrap gap-2 rounded-[22px] border border-[#E7D8C8] bg-[#FFFDF8] p-3 shadow-sm">
            {params.q ? (
                <Link
                    href={makeRemoveKeywordHref(params)}
                    className="rounded-full bg-[#F8F1E8] px-3 py-2 text-xs font-black text-[#201813] ring-1 ring-[#E7D8C8] transition hover:bg-[#201813] hover:text-white"
                >
                    Search: {params.q} ×
                </Link>
            ) : null}

            {selectedTags.map((tag) => (
                <Link
                    key={tag}
                    href={makeRemoveTagHref(params, tag)}
                    className="rounded-full bg-[#F8F1E8] px-3 py-2 text-xs font-black text-[#201813] ring-1 ring-[#E7D8C8] transition hover:bg-[#201813] hover:text-white"
                >
                    {getFilterLabel(tag)} ×
                </Link>
            ))}

            {selectedPrice !== "all" ? (
                <Link
                    href={makeRemovePriceHref(params)}
                    className="rounded-full bg-[#F8F1E8] px-3 py-2 text-xs font-black text-[#201813] ring-1 ring-[#E7D8C8] transition hover:bg-[#201813] hover:text-white"
                >
                    Harga: {getPriceLabel(params.price)} ×
                </Link>
            ) : null}

            {params.area ? (
                <Link
                    href={makeRemoveAreaHref(params)}
                    className="rounded-full bg-[#F8F1E8] px-3 py-2 text-xs font-black text-[#201813] ring-1 ring-[#E7D8C8] transition hover:bg-[#201813] hover:text-white"
                >
                    Area: {params.area} ×
                </Link>
            ) : null}
        </div>
    );
}

function EmptyPlacesState() {
    return (
        <div className="rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-7 shadow-[0_18px_60px_rgba(47,35,25,0.06)] sm:p-9">
            <h2 className="text-2xl font-black text-[#201813]">
                Belum ada tempat cocok.
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#756A60] sm:text-base">
                Coba hapus beberapa filter aktif atau lihat semua coffee shop dulu.
                Kadang tempat yang pas nggak selalu full spec.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                    href="/places?category=coffee-shop"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#201813] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1F5A4A]"
                >
                    Lihat Semua Coffee Shop
                </Link>

                <Link
                    href="/"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#E7D8C8] bg-white px-5 py-3 text-sm font-black text-[#201813] transition hover:bg-[#201813] hover:text-white"
                >
                    Kembali ke Home
                </Link>
            </div>
        </div>
    );
}

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

function getFilterLabel(tag: string) {
    for (const group of placeFilterGroups) {
        const option = group.options.find((item) => item.tag === tag);

        if (option) {
            return option.label;
        }
    }

    return tag;
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
        .map((item) => normalizeText(item))
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

    if (params.price && getSelectedPrice(params.price) !== "all") {
        return `Coffee shop ${getPriceLabel(params.price)}`;
    }

    const selectedTags = getSelectedTags(params);

    if (selectedTags.length > 0) {
        return `Coffee shop untuk ${getFilterLabel(selectedTags[0])}`;
    }

    return "Explore coffee shop di Padang";
}

function makeDescription(params: PageParams) {
    const selectedTags = getSelectedTags(params);

    if (params.q) {
        return "Temukan coffee shop yang sesuai dengan kata kunci pencarian kamu.";
    }

    if (selectedTags.length > 0 || params.price || params.area) {
        return "Hasil sudah disesuaikan berdasarkan filter yang kamu pilih.";
    }

    return "Cari coffee shop berdasarkan mood, fasilitas, area, budget, dan vibes.";
}

function createPlacesHref(params: PageParams, overrides: Partial<PageParams>) {
    const nextParams: PageParams = {
        category: params.category || "coffee-shop",
        q: params.q,
        tags: params.tags,
        area: params.area,
        price: params.price,
        ...overrides,
    };

    delete nextParams.tag;

    const urlParams = new URLSearchParams();

    Object.entries(nextParams).forEach(([key, value]) => {
        if (value && value !== "all") {
            urlParams.set(key, value);
        }
    });

    const queryString = urlParams.toString();

    return queryString ? `/places?${queryString}` : "/places?category=coffee-shop";
}

function makeFilterHref(params: PageParams, tag: string) {
    const selectedTags = getSelectedTags(params);
    const nextTags = selectedTags.includes(tag)
        ? selectedTags.filter((item) => item !== tag)
        : [...selectedTags, tag];

    return createPlacesHref(params, {
        tags: nextTags.join(",") || undefined,
    });
}

function makePriceHref(params: PageParams, price: PriceFilterValue) {
    return createPlacesHref(params, {
        price: price === "all" ? undefined : price,
    });
}

function makeRemoveKeywordHref(params: PageParams) {
    return createPlacesHref(params, {
        q: undefined,
    });
}

function makeRemoveTagHref(params: PageParams, tag: string) {
    const selectedTags = getSelectedTags(params);
    const nextTags = selectedTags.filter((item) => item !== tag);

    return createPlacesHref(params, {
        tags: nextTags.join(",") || undefined,
    });
}

function makeRemovePriceHref(params: PageParams) {
    return createPlacesHref(params, {
        price: undefined,
    });
}

function makeRemoveAreaHref(params: PageParams) {
    return createPlacesHref(params, {
        area: undefined,
    });
}
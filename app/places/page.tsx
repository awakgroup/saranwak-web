import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import { PlaceCard } from "@/components/PlaceCard";
import {
    placeFilterGroups,
    priceFilterOptions,
    type PriceFilterValue,
} from "@/lib/place-filters";
import type { Place } from "@/types/database";

export const revalidate = 3600;

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
        .filter((place) => matchCategory(place, params.category))
        .filter((place) => matchAllSelectedTags(place, selectedTags))
        .filter((place) => matchPrice(place, selectedPrice))
        .sort((a, b) => {
            return (
                new Date(b.created_at ?? 0).getTime() -
                new Date(a.created_at ?? 0).getTime()
            );
        });

    const hasFilter = Boolean(
        params.q ||
        params.area ||
        params.category ||
        selectedTags.length > 0 ||
        selectedPrice !== "all"
    );

    const activeFilterCount =
        Number(Boolean(params.q)) +
        Number(Boolean(params.area)) +
        Number(Boolean(params.category)) +
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
    try {
        const filePath = path.join(
            process.cwd(),
            "public",
            "data",
            "places.json"
        );

        const fileContent = await fs.readFile(filePath, "utf8");
        const places = JSON.parse(fileContent) as Place[];

        return places.filter((place) => place.is_published);
    } catch (error) {
        console.error("Static places JSON read error:", error);
        return [];
    }
}

function MiniStat({
    value,
    label,
}: {
    value: number | string;
    label: string;
}) {
    return (
        <div className="rounded-[22px] border border-white/10 bg-white/[0.07] px-3 py-4 text-center">
            <p className="text-xl font-black tracking-[-0.04em] text-white sm:text-2xl">
                {value}
            </p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
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
        <div className="space-y-5">
            <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                    Budget
                </p>

                <div className="grid gap-2">
                    {priceFilterOptions.map((option) => {
                        const active = selectedPrice === option.value;

                        return (
                            <Link
                                key={option.value}
                                href={buildFilterHref(params, {
                                    price: option.value,
                                })}
                                className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${active
                                        ? "border-[#1F5A4A] bg-[#1F5A4A] text-white"
                                        : "border-[#E7D8C8] bg-white text-[#4B4038] hover:border-[#1F5A4A] hover:text-[#1F5A4A]"
                                    }`}
                            >
                                {option.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {placeFilterGroups.map((group) => (
                <div key={group.title}>
                    <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                        {group.title}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {group.options.map((option) => {
                            const active = selectedTags.includes(option.tag);

                            return (
                                <Link
                                    key={option.tag}
                                    href={buildTagHref(params, option.tag)}
                                    className={`rounded-full border px-3 py-2 text-xs font-black transition ${active
                                            ? "border-[#1F5A4A] bg-[#1F5A4A] text-white"
                                            : "border-[#E7D8C8] bg-white text-[#4B4038] hover:border-[#1F5A4A] hover:text-[#1F5A4A]"
                                        }`}
                                >
                                    {active ? "✓ " : "+ "}
                                    {option.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}

            {hasFilter ? (
                <Link
                    href="/places?category=coffee-shop"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-[#201813] px-4 py-3 text-sm font-black text-white transition hover:bg-[#3A2D25]"
                >
                    Reset Filter
                </Link>
            ) : null}
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
    const activeItems: string[] = [];

    if (params.q) activeItems.push(`Search: ${params.q}`);
    if (params.area) activeItems.push(`Area: ${params.area}`);
    if (params.category) activeItems.push(`Kategori: ${params.category}`);

    selectedTags.forEach((tag) => {
        activeItems.push(getTagLabel(tag));
    });

    if (selectedPrice !== "all") {
        const label =
            priceFilterOptions.find((option) => option.value === selectedPrice)
                ?.label || selectedPrice;

        activeItems.push(label);
    }

    if (activeItems.length === 0) return null;

    return (
        <div className="mb-5 rounded-[24px] border border-[#E7D8C8] bg-[#FFFDF8] p-4 shadow-[0_12px_34px_rgba(47,35,25,0.05)]">
            <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#C8784A]">
                    Filter Aktif
                </p>

                <Link
                    href="/places?category=coffee-shop"
                    className="text-xs font-black text-[#1F5A4A] hover:underline"
                >
                    Reset
                </Link>
            </div>

            <div className="flex flex-wrap gap-2">
                {activeItems.map((item) => (
                    <span
                        key={item}
                        className="rounded-full border border-[#E7D8C8] bg-[#F8F1E8] px-3 py-1.5 text-xs font-black text-[#4B4038]"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}

function EmptyPlacesState() {
    return (
        <div className="rounded-[30px] border border-dashed border-[#D7C5B2] bg-[#FFFDF8] px-6 py-14 text-center shadow-[0_14px_45px_rgba(47,35,25,0.04)]">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#F8F1E8] text-3xl">
                ☕
            </div>

            <h3 className="mt-5 text-2xl font-black tracking-[-0.04em] text-[#201813]">
                Belum ada tempat yang cocok
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-7 text-[#756A60]">
                Coba reset filter atau pilih kombinasi lain. Kadang tempat hidden gem
                itu bukan hilang, cuma filter-nya lagi terlalu picky.
            </p>

            <div className="mt-6 flex justify-center">
                <Link
                    href="/places?category=coffee-shop"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#201813] px-5 py-3 text-sm font-black text-white transition hover:bg-[#3A2D25]"
                >
                    Lihat Semua Coffee Shop
                </Link>
            </div>
        </div>
    );
}

function getSelectedTags(params: PageParams) {
    const tags = [
        ...(params.tags ? params.tags.split(",") : []),
        ...(params.tag ? [params.tag] : []),
    ];

    return Array.from(
        new Set(
            tags
                .map((item) => item.trim())
                .filter(Boolean)
        )
    );
}

function getSelectedPrice(price?: string): PriceFilterValue {
    const allowedValues = priceFilterOptions.map((option) => option.value);

    if (price && allowedValues.includes(price as PriceFilterValue)) {
        return price as PriceFilterValue;
    }

    return "all";
}

function matchKeyword(place: Place, keyword?: string) {
    if (!keyword) return true;

    const normalizedKeyword = normalizeText(keyword);

    const searchableText = [
        place.name,
        place.short_description,
        place.description,
        place.area,
        place.city,
        getCategorySlug(place),
        getCategoryName(place),
        ...getPlaceTags(place).flatMap((tag) => [tag.name, tag.slug, tag.type]),
    ]
        .filter(Boolean)
        .join(" ");

    return normalizeText(searchableText).includes(normalizedKeyword);
}

function matchArea(place: Place, area?: string) {
    if (!area) return true;

    const normalizedArea = normalizeText(area);

    return [place.area, place.city]
        .filter(Boolean)
        .some((item) => normalizeText(item).includes(normalizedArea));
}

function matchCategory(place: Place, category?: string) {
    if (!category) return true;

    const normalizedCategory = normalizeText(category);

    return [getCategorySlug(place), getCategoryName(place)]
        .filter(Boolean)
        .some((item) => normalizeText(item).includes(normalizedCategory));
}

function matchAllSelectedTags(place: Place, selectedTags: string[]) {
    if (selectedTags.length === 0) return true;

    const placeTags = getPlaceTags(place).map((tag) => normalizeText(tag.slug));

    return selectedTags.every((selectedTag) =>
        placeTags.includes(normalizeText(selectedTag))
    );
}

function matchPrice(place: Place, selectedPrice: PriceFilterValue) {
    if (selectedPrice === "all") return true;

    const min = Number(place.price_min ?? 0);
    const max = Number(place.price_max ?? place.price_min ?? 0);

    if (!min && !max) return false;

    const placeMin = min || max;
    const placeMax = max || min;

    if (selectedPrice === "under-20k") {
        return rangeOverlaps(placeMin, placeMax, 0, 20000);
    }

    if (selectedPrice === "20k-40k") {
        return rangeOverlaps(placeMin, placeMax, 20000, 40000);
    }

    if (selectedPrice === "above-40k") {
        return placeMax > 40000;
    }

    return true;
}

function rangeOverlaps(
    placeMin: number,
    placeMax: number,
    filterMin: number,
    filterMax: number
) {
    return placeMin <= filterMax && placeMax >= filterMin;
}

function getPlaceTags(place: Place): TagItem[] {
    const placeTags = (place.place_tags ?? []) as PlaceTagItem[];

    return placeTags
        .flatMap((item) => {
            if (!item.tags) return [];

            if (Array.isArray(item.tags)) {
                return item.tags;
            }

            return [item.tags];
        })
        .filter(Boolean);
}

function getCategorySlug(place: Place) {
    const categories = place.categories;

    if (Array.isArray(categories)) {
        return categories[0]?.slug || "";
    }

    return categories?.slug || "";
}

function getCategoryName(place: Place) {
    const categories = place.categories;

    if (Array.isArray(categories)) {
        return categories[0]?.name || "";
    }

    return categories?.name || "";
}

function makeTitle(params: PageParams) {
    if (params.q) {
        return `Hasil pencarian “${params.q}”`;
    }

    if (params.area) {
        return `Coffee shop di ${params.area}`;
    }

    return "Cari coffee shop yang paling pas di Padang";
}

function makeDescription(params: PageParams) {
    if (params.q) {
        return "Saranwak menampilkan tempat yang cocok berdasarkan keyword, aktivitas, fasilitas, vibes, dan budget yang kamu pilih.";
    }

    if (params.area) {
        return `Rekomendasi coffee shop di area ${params.area}, lengkap dengan filter budget, fasilitas, dan vibes.`;
    }

    return "Pilih coffee shop berdasarkan aktivitas, fasilitas, vibes, dan budget. Cocok buat nugas, WFC, nongkrong, meeting, atau first date yang tidak awkward.";
}

function buildTagHref(params: PageParams, tag: string) {
    const selectedTags = getSelectedTags(params);
    const isActive = selectedTags.includes(tag);

    const nextTags = isActive
        ? selectedTags.filter((item) => item !== tag)
        : [...selectedTags, tag];

    return buildFilterHref(params, {
        tags: nextTags.join(","),
    });
}

function buildFilterHref(
    params: PageParams,
    updates: Partial<PageParams & { price: PriceFilterValue }>
) {
    const nextParams = new URLSearchParams();

    const mergedParams: PageParams = {
        ...params,
        ...updates,
    };

    if (mergedParams.q) nextParams.set("q", mergedParams.q);
    if (mergedParams.area) nextParams.set("area", mergedParams.area);
    if (mergedParams.category) nextParams.set("category", mergedParams.category);

    if (mergedParams.tags) {
        nextParams.set("tags", mergedParams.tags);
    }

    if (mergedParams.price && mergedParams.price !== "all") {
        nextParams.set("price", mergedParams.price);
    }

    const query = nextParams.toString();

    return query ? `/places?${query}` : "/places";
}

function normalizeText(value?: string | null) {
    return String(value ?? "")
        .toLowerCase()
        .trim();
}

function getTagLabel(tag: string) {
    for (const group of placeFilterGroups) {
        const option = group.options.find((item) => item.tag === tag);

        if (option) {
            return option.label;
        }
    }

    return tag;
}
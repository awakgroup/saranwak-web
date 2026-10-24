"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    X,
    SlidersHorizontal,
    RotateCcw,
    Check,
    Coffee,
} from "lucide-react";
import { PlaceCard } from "@/components/PlaceCard";
import {
    placeFilterGroups,
    priceFilterOptions,
    type PriceFilterValue,
} from "@/lib/place-filters";
import type { Place } from "@/types/database";

type PlacesClientPageProps = {
    placesData: Place[];
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
    id?: string | null;
    name?: string | null;
    slug?: string | null;
    type?: string | null;
};

type PlaceTagItem = {
    tag_id?: string | null;
    tag?: TagItem | TagItem[] | null;
    tags?: TagItem | TagItem[] | null;
};

type PlaceWithFlexibleTags = Place & {
    tags?: TagItem[] | string[] | null;
    place_tags?: PlaceTagItem[] | null;
    categories?:
    | {
        id?: string | null;
        name?: string | null;
        slug?: string | null;
    }
    | string
    | null;
    category_id?: string | null;
    category_name?: string | null;
    category_slug?: string | null;
};

export function PlacesClientPage({ placesData }: PlacesClientPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const params: PageParams = {
        q: searchParams.get("q") || undefined,
        tag: searchParams.get("tag") || undefined,
        tags: searchParams.get("tags") || undefined,
        area: searchParams.get("area") || undefined,
        category: searchParams.get("category") || undefined,
        price: searchParams.get("price") || undefined,
    };

    const [searchQuery, setSearchQuery] = useState(params.q || "");
    const [prevQ, setPrevQ] = useState(params.q);

    if (params.q !== prevQ) {
        setPrevQ(params.q);
        setSearchQuery(params.q || "");
    }

    const selectedTags = getSelectedTags(params);
    const selectedPrice = getSelectedPrice(params.price);
    const selectedTagsKey = selectedTags.join(",");

    const places = useMemo(() => {
        return placesData
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        placesData,
        params.q,
        params.area,
        params.category,
        selectedPrice,
        selectedTagsKey,
    ]);

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

    function handleSearchSubmit(e: FormEvent) {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        const targetHref = buildFilterHref(params, {
            q: trimmed || undefined,
        });
        router.push(targetHref);
    }

    function handleClearSearch() {
        setSearchQuery("");
        const targetHref = buildFilterHref(params, {
            q: undefined,
        });
        router.push(targetHref);
    }

    const { prefix: titlePrefix, suffix: titleSuffix } = makeTitleParts(params);

    return (
        <main className="min-h-screen bg-[#F4F1EA] px-4 pb-14 pt-4 text-[#201813] sm:px-6 sm:pt-6 lg:px-8 lg:pb-20 lg:pt-8">
            <section className="mx-auto max-w-7xl">
                {/* Editorial Hero Header */}
                <div className="relative mb-8 overflow-hidden rounded-[32px] border border-[#E7D8C8] bg-[#191614] p-6 text-white shadow-[0_24px_80px_rgba(32,24,19,0.18)] sm:p-8 lg:p-10">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C8784A]/25 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#1F5A4A]/20 blur-3xl" />

                    <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F2C38B] backdrop-blur">
                                <Coffee className="h-3.5 w-3.5 text-[#F2C38B]" />
                                Padang Coffee Directory
                            </div>

                            <h1 className="mt-4 font-serif text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
                                {titlePrefix}
                                <span className="block italic text-[#F2C38B]">{titleSuffix}</span>
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-white/70 sm:text-base">
                                {makeDescription(params)}
                            </p>

                            {/* Search Form inside Hero */}
                            <form
                                onSubmit={handleSearchSubmit}
                                className="relative mt-6 max-w-xl"
                            >
                                <div className="relative flex items-center overflow-hidden rounded-full border border-white/20 bg-white/[0.10] shadow-inner backdrop-blur transition duration-200 focus-within:border-[#F2C38B] focus-within:bg-white/[0.16]">
                                    <Search className="ml-4 h-4 w-4 shrink-0 text-white/50 sm:h-5 sm:w-5" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Cari nama cafe, menu, area, vibes..."
                                        className="w-full bg-transparent px-3 py-3 text-sm font-medium text-white placeholder-white/45 outline-none sm:py-3.5 sm:text-base"
                                    />
                                    {searchQuery ? (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            aria-label="Hapus kata kunci pencarian"
                                            className="mr-2 grid h-7 w-7 place-items-center rounded-full bg-white/15 text-white/80 transition hover:bg-white/25 hover:text-white"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    ) : null}
                                    <button
                                        type="submit"
                                        className="mr-1.5 shrink-0 rounded-full bg-[#F2C38B] px-4 py-2 text-xs font-bold text-[#201813] transition hover:bg-white sm:px-5 sm:py-2.5 sm:text-sm"
                                    >
                                        Cari
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Stats pill counter */}
                        <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end">
                            <div className="flex gap-2.5">
                                <div className="rounded-2xl border border-white/12 bg-white/[0.08] px-4 py-3 text-center backdrop-blur sm:min-w-[100px]">
                                    <p className="font-serif text-2xl font-bold leading-none text-[#F2C38B] sm:text-3xl">
                                        {places.length}
                                    </p>
                                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                                        Tempat
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/12 bg-white/[0.08] px-4 py-3 text-center backdrop-blur sm:min-w-[100px]">
                                    <p className="font-serif text-2xl font-bold leading-none text-white sm:text-3xl">
                                        {activeFilterCount}
                                    </p>
                                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                                        Filter Aktif
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {hasFilter ? (
                                    <Link
                                        href="/places/?category=coffee-shop"
                                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#201813] transition hover:bg-[#F2C38B]"
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        Reset Filter
                                    </Link>
                                ) : null}

                                <Link
                                    href="/"
                                    className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-bold text-white transition hover:bg-white hover:text-[#201813]"
                                >
                                    Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content: Sidebar + Places Grid */}
                <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start xl:grid-cols-[320px_1fr]">
                    <aside className="lg:sticky lg:top-24">
                        {/* Mobile Collapsible Filter Drawer */}
                        <details className="group rounded-[26px] border border-[#E7D8C8] bg-[#FFFDF8] p-4 shadow-[0_14px_45px_rgba(47,35,25,0.06)] lg:hidden">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#F4F1EA] text-[#1F5A4A]">
                                        <SlidersHorizontal className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#201813]">
                                            Filter Pilihan
                                        </p>
                                        <p className="text-xs font-medium text-[#756A60]">
                                            {activeFilterCount > 0
                                                ? `${activeFilterCount} filter aktif`
                                                : "Pilih budget, fasilitas, & suasana"}
                                        </p>
                                    </div>
                                </div>

                                <span className="rounded-full bg-[#201813] px-3.5 py-1.5 text-xs font-bold text-white transition group-open:bg-[#1F5A4A]">
                                    Pilih Filter
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

                        {/* Desktop Sticky Filter Card */}
                        <div className="hidden rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 shadow-[0_16px_45px_rgba(47,35,25,0.06)] lg:block">
                            <div className="mb-5 flex items-center justify-between border-b border-[#E7D8C8] pb-4">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4 text-[#C8784A]" />
                                    <h2 className="font-serif text-lg font-bold text-[#201813]">
                                        Filter Pilihan
                                    </h2>
                                </div>

                                {hasFilter ? (
                                    <Link
                                        href="/places/?category=coffee-shop"
                                        className="text-xs font-bold text-[#1F5A4A] transition hover:underline"
                                    >
                                        Reset
                                    </Link>
                                ) : null}
                            </div>

                            <FilterContent
                                params={params}
                                selectedTags={selectedTags}
                                selectedPrice={selectedPrice}
                                hasFilter={hasFilter}
                            />
                        </div>
                    </aside>

                    <section className="min-w-0">
                        {/* Interactive Active Filters Bar */}
                        {hasFilter ? (
                            <ActiveFilters
                                params={params}
                                selectedTags={selectedTags}
                                selectedPrice={selectedPrice}
                            />
                        ) : null}

                        {/* Results Count Header */}
                        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                                    Koleksi Terverifikasi
                                </p>

                                <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-3xl">
                                    {places.length} Coffee Shop Pilihan
                                </h2>
                            </div>

                            <p className="text-xs font-semibold text-[#756A60] sm:text-sm">
                                {hasFilter
                                    ? "Hasil disaring berdasarkan kriteria pilihan kamu."
                                    : "Menampilkan semua tempat yang tersedia di Padang."}
                            </p>
                        </div>

                        {/* Places Grid or Empty State */}
                        {places.length === 0 ? (
                            <EmptyPlacesState params={params} />
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
        <div className="space-y-6">
            {/* Budget Section */}
            <div>
                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                    Budget / Harga
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
                                className={`flex items-center justify-between rounded-2xl border px-3.5 py-2.5 text-xs font-bold transition duration-200 ${active
                                        ? "border-[#1F5A4A] bg-[#1F5A4A] text-white shadow-sm"
                                        : "border-[#E7D8C8] bg-white text-[#4B4038] hover:border-[#1F5A4A]/40 hover:bg-[#F8F1E8]"
                                    }`}
                            >
                                <span>{option.label}</span>
                                {active ? (
                                    <Check className="h-3.5 w-3.5 shrink-0 text-white" />
                                ) : null}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Filter Groups (Aktivitas, Fasilitas, Vibes) */}
            {placeFilterGroups.map((group) => (
                <div key={group.title}>
                    <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                        {group.title}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {group.options.map((option) => {
                            const active = selectedTags.includes(option.tag);

                            return (
                                <Link
                                    key={option.tag}
                                    href={buildTagHref(params, option.tag)}
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition duration-200 ${active
                                            ? "border-[#1F5A4A] bg-[#1F5A4A] text-white shadow-sm"
                                            : "border-[#E7D8C8] bg-white text-[#4B4038] hover:border-[#1F5A4A]/40 hover:bg-[#F8F1E8]"
                                        }`}
                                >
                                    {active ? (
                                        <Check className="h-3 w-3 shrink-0" />
                                    ) : (
                                        <span className="text-[#C8784A]">+</span>
                                    )}
                                    <span>{option.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}

            {hasFilter ? (
                <div className="pt-2">
                    <Link
                        href="/places/?category=coffee-shop"
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#201813] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#3A2D25]"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset Semua Filter
                    </Link>
                </div>
            ) : null}
        </div>
    );
}

type ActiveFilterChip = {
    id: string;
    label: string;
    removeHref: string;
};

function ActiveFilters({
    params,
    selectedTags,
    selectedPrice,
}: {
    params: PageParams;
    selectedTags: string[];
    selectedPrice: PriceFilterValue;
}) {
    const chips: ActiveFilterChip[] = [];

    if (params.q) {
        chips.push({
            id: `q-${params.q}`,
            label: `Pencarian: "${params.q}"`,
            removeHref: buildFilterHref(params, { q: undefined }),
        });
    }

    if (params.area) {
        chips.push({
            id: `area-${params.area}`,
            label: `Area: ${params.area}`,
            removeHref: buildFilterHref(params, { area: undefined }),
        });
    }

    if (params.category && params.category !== "coffee-shop") {
        chips.push({
            id: `cat-${params.category}`,
            label: `Kategori: ${params.category}`,
            removeHref: buildFilterHref(params, { category: undefined }),
        });
    }

    if (selectedPrice !== "all") {
        const priceLabel =
            priceFilterOptions.find((opt) => opt.value === selectedPrice)?.label ||
            selectedPrice;
        chips.push({
            id: `price-${selectedPrice}`,
            label: priceLabel,
            removeHref: buildFilterHref(params, { price: "all" }),
        });
    }

    selectedTags.forEach((tag) => {
        chips.push({
            id: `tag-${tag}`,
            label: getTagLabel(tag),
            removeHref: buildTagHref(params, tag),
        });
    });

    if (chips.length === 0) return null;

    return (
        <div className="mb-6 rounded-[24px] border border-[#E7D8C8] bg-[#FFFDF8] p-4 shadow-[0_12px_36px_rgba(47,35,25,0.05)]">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#1F5A4A]" />
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#C8784A]">
                        Filter Aktif ({chips.length})
                    </p>
                </div>

                <Link
                    href="/places/?category=coffee-shop"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1F5A4A] transition hover:underline"
                >
                    <RotateCcw className="h-3 w-3" />
                    Reset Semua
                </Link>
            </div>

            <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                    <Link
                        key={chip.id}
                        href={chip.removeHref}
                        title={`Hapus filter ${chip.label}`}
                        className="group inline-flex items-center gap-1.5 rounded-full border border-[#E7D8C8] bg-[#F8F1E8] px-3 py-1.5 text-xs font-bold text-[#4B4038] transition hover:border-[#C8784A] hover:bg-[#F0E6D8]"
                    >
                        <span>{chip.label}</span>
                        <X className="h-3.5 w-3.5 text-[#756A60] transition group-hover:text-[#C8784A]" />
                    </Link>
                ))}
            </div>
        </div>
    );
}

function EmptyPlacesState({ params }: { params: PageParams }) {
    const popularTags = [
        { label: "WFC & Nugas", tag: "wfc" },
        { label: "Nongkrong", tag: "nongkrong" },
        { label: "Budget < 20rb", price: "under-20k" },
        { label: "Outdoor", tag: "outdoor" },
    ];

    return (
        <div className="relative overflow-hidden rounded-[32px] border border-dashed border-[#D7C5B2] bg-[#FFFDF8] px-6 py-14 text-center shadow-[0_16px_50px_rgba(47,35,25,0.04)] sm:px-10 sm:py-16">
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#F2C38B]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-[#1F5A4A]/10 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-md">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#F8F1E8] text-3xl shadow-sm">
                    ☕
                </div>

                <h3 className="mt-5 font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-3xl">
                    Belum Ada Tempat yang Cocok
                </h3>

                <p className="mt-3 text-sm font-medium leading-7 text-[#756A60]">
                    Kombinasi filter yang kamu pilih belum menemukan hasil. Coba hapus beberapa kriteria atau coba rekomendasi filter populer di bawah.
                </p>

                {/* Popular Tags Quick Shortcuts */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {popularTags.map((item) => (
                        <Link
                            key={item.label}
                            href={
                                item.tag
                                    ? buildTagHref(params, item.tag)
                                    : buildFilterHref(params, { price: item.price as PriceFilterValue })
                            }
                            className="rounded-full border border-[#E7D8C8] bg-white px-3.5 py-1.5 text-xs font-bold text-[#201813] shadow-sm transition hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
                        >
                            + {item.label}
                        </Link>
                    ))}
                </div>

                <div className="mt-7 flex justify-center">
                    <Link
                        href="/places/?category=coffee-shop"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#201813] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#3A2D25]"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Tampilkan Semua Coffee Shop
                    </Link>
                </div>
            </div>
        </div>
    );
}

function makeTitleParts(params: PageParams): { prefix: string; suffix: string } {
    const selectedTags = getSelectedTags(params);

    if (params.q) {
        return {
            prefix: "Hasil pencarian",
            suffix: `"${params.q}"`,
        };
    }

    if (selectedTags.length > 0) {
        return {
            prefix: "Rekomendasi spot",
            suffix: `${getTagLabel(selectedTags[0])} di Padang.`,
        };
    }

    if (params.area) {
        return {
            prefix: "Coffee shop di area",
            suffix: `${params.area}, Padang.`,
        };
    }

    return {
        prefix: "Explore Coffee Shop",
        suffix: "di Padang.",
    };
}

function getSelectedTags(params: PageParams) {
    const tags = [
        ...(params.tags ? params.tags.split(",") : []),
        ...(params.tag ? [params.tag] : []),
    ];

    return Array.from(
        new Set(tags.map((item) => normalizeSlug(item)).filter(Boolean))
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
        .some((item) => normalizeText(String(item)).includes(normalizedArea));
}

function matchCategory(place: Place, category?: string) {
    if (!category) return true;

    const normalizedCategory = normalizeSlug(category);

    return [getCategorySlug(place), getCategoryName(place)]
        .filter(Boolean)
        .some((item) => normalizeSlug(String(item)).includes(normalizedCategory));
}

function matchAllSelectedTags(place: Place, selectedTags: string[]) {
    if (selectedTags.length === 0) return true;

    const placeTagKeys = getPlaceTagKeys(place);

    return selectedTags.every((selectedTag) =>
        placeTagKeys.includes(normalizeSlug(selectedTag))
    );
}

function getPlaceTagKeys(place: Place) {
    const placeTags = getPlaceTags(place);

    return placeTags.flatMap((tag) => {
        const keys = [tag.id, tag.slug, tag.name, tag.type];

        return keys.filter(Boolean).map((item) => normalizeSlug(String(item)));
    });
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
    const flexiblePlace = place as PlaceWithFlexibleTags;
    const result: TagItem[] = [];

    const directTags = flexiblePlace.tags ?? [];

    for (const tag of directTags) {
        if (typeof tag === "string") {
            result.push({
                id: tag,
                name: tag,
                slug: tag,
            });
        } else if (tag) {
            result.push(tag);
        }
    }

    const relationalTags = flexiblePlace.place_tags ?? [];

    for (const relation of relationalTags) {
        const maybeTags = relation.tags ?? relation.tag;

        if (Array.isArray(maybeTags)) {
            maybeTags.forEach((tag) => {
                if (tag) result.push(tag);
            });
        } else if (maybeTags) {
            result.push(maybeTags);
        }

        if (relation.tag_id) {
            result.push({
                id: relation.tag_id,
                slug: relation.tag_id,
                name: relation.tag_id,
            });
        }
    }

    return dedupeTags(result);
}

function dedupeTags(tags: TagItem[]) {
    const map = new Map<string, TagItem>();

    for (const tag of tags) {
        const key = normalizeSlug(
            String(tag.slug || tag.id || tag.name || Math.random())
        );

        if (!map.has(key)) {
            map.set(key, tag);
        }
    }

    return Array.from(map.values());
}

function getCategorySlug(place: Place) {
    const flexiblePlace = place as PlaceWithFlexibleTags;

    if (typeof flexiblePlace.categories === "string") {
        return flexiblePlace.categories;
    }

    return (
        flexiblePlace.categories?.slug ||
        flexiblePlace.category_slug ||
        flexiblePlace.category_id ||
        ""
    );
}

function getCategoryName(place: Place) {
    const flexiblePlace = place as PlaceWithFlexibleTags;

    if (typeof flexiblePlace.categories === "string") {
        return flexiblePlace.categories;
    }

    return flexiblePlace.categories?.name || flexiblePlace.category_name || "";
}

function buildTagHref(params: PageParams, tag: string) {
    const selectedTags = getSelectedTags(params);
    const normalizedTag = normalizeSlug(tag);

    const nextTags = selectedTags.includes(normalizedTag)
        ? selectedTags.filter((item) => item !== normalizedTag)
        : [...selectedTags, normalizedTag];

    return buildFilterHref(params, {
        tags: nextTags.length > 0 ? nextTags.join(",") : undefined,
        tag: undefined,
    });
}

function buildFilterHref(params: PageParams, updates: Partial<PageParams>) {
    const searchParams = new URLSearchParams();

    const nextParams: PageParams = {
        ...params,
        ...updates,
    };

    if (nextParams.q) searchParams.set("q", nextParams.q);
    if (nextParams.area) searchParams.set("area", nextParams.area);
    if (nextParams.category) searchParams.set("category", nextParams.category);

    if (nextParams.tags) {
        searchParams.set("tags", nextParams.tags);
    }

    if (nextParams.tag) {
        searchParams.set("tag", nextParams.tag);
    }

    if (nextParams.price && nextParams.price !== "all") {
        searchParams.set("price", nextParams.price);
    }

    const queryString = searchParams.toString();

    return `/places/${queryString ? `?${queryString}` : ""}`;
}

function getTagLabel(tag: string) {
    const normalizedTag = normalizeSlug(tag);

    for (const group of placeFilterGroups) {
        const option = group.options.find(
            (item) => normalizeSlug(item.tag) === normalizedTag
        );

        if (option) {
            return option.label;
        }
    }

    return tag
        .split("-")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function makeDescription(params: PageParams) {
    const selectedTags = getSelectedTags(params);

    if (params.q) {
        return "Temukan coffee shop yang paling cocok dari hasil pencarian kamu.";
    }

    if (selectedTags.length > 0) {
        return "Rekomendasi tempat berdasarkan aktivitas, fasilitas, vibes, dan kebutuhan kamu.";
    }

    if (params.area) {
        return "Cari tempat ngopi berdasarkan area favorit kamu di Padang.";
    }

    return "Jelajahi coffee shop di Padang berdasarkan kebutuhan, budget, dan suasana.";
}

function normalizeText(value?: string | null) {
    return normalizeSlug(value);
}

function normalizeSlug(value?: string | null) {
    return String(value ?? "")
        .toLowerCase()
        .trim()
        .replace(/_/g, "-")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Bookmark,
    Star,
    ArrowRight,
    Navigation,
    Zap,
    Wifi,
    Armchair,
    Coffee,
    Sun,
    Moon,
    Users,
    Utensils,
} from "lucide-react";
import type { Place } from "@/types/database";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import { useSavedPlaces, savePlaceToStorage } from "@/lib/saved-places";
import { OpenStatusBadge } from "@/components/OpenStatusBadge";

type PlaceCardProps = {
    place: Place;
    source?: "homepage_featured" | "places_list" | "related_places" | "place_card";
    position?: number;
    userDistance?: string | null;
};

type HighlightItem = {
    label: string;
    iconType: "power" | "wifi" | "chair" | "coffee" | "sun" | "moon" | "meeting" | "food";
};

export function PlaceCard({ place, userDistance }: PlaceCardProps) {
    const router = useRouter();
    const { isPlaceSaved } = useSavedPlaces();
    const isSaved = isPlaceSaved(place.slug);
    const detailHref = `/places/${place.slug}`;
    const imageUrl = getSafePlaceImageUrl(place.image_url || place.main_image_url);
    const district = getPlaceArea(place);
    const subtitle = getPlaceSubtitle(place);
    const priceText = getDisplayPrice(place);
    const highlights = getPlaceHighlights(place);

    return (
        <article
            onClick={() => router.push(detailHref)}
            className="group relative flex min-h-[260px] sm:min-h-[380px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0d0401] p-4 sm:p-5 text-white shadow-xs sm:shadow-bento transition-all duration-300 hover:-translate-y-1 hover:border-[#ac3311]/50 hover:shadow-xl active:scale-[0.99]"
        >
            {/* Full Card Clickable Link */}
            <Link
                href={detailHref}
                prefetch={false}
                className="absolute inset-0 z-10"
                aria-label={`Buka detail ${place.name}`}
            />

            {/* Cover Photo */}
            <Image
                src={imageUrl}
                alt={place.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="pointer-events-none object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlays */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0401] via-[#0d0401]/50 to-transparent" />

            {/* Top Badges & Controls */}
            <div className="pointer-events-none relative z-20 flex items-center justify-between w-full">
                <div className="flex flex-wrap items-center gap-1.5">
                    <OpenStatusBadge openingHours={place.opening_hours} mode="compact" />

                    {place.is_featured ? (
                        <span
                            title="Tempat Pilihan"
                            className="grid h-5 w-5 sm:h-6 sm:w-6 place-items-center rounded-full bg-white shadow-xs"
                        >
                            <Star className="h-3 w-3 fill-amber-400 text-amber-500 sm:h-3.5 sm:w-3.5" />
                        </span>
                    ) : null}
                </div>

                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        savePlaceToStorage(place);
                    }}
                    aria-label={`Simpan ${place.name}`}
                    className={`pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/20 backdrop-blur-md transition-all active:scale-90 cursor-pointer ${
                        isSaved
                            ? "bg-[#ac3311] text-white"
                            : "bg-white/20 text-white hover:text-[#ffdbd1] hover:bg-white/30"
                    }`}
                >
                    <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                </button>
            </div>

            {/* Bottom Information */}
            <div className="pointer-events-none relative z-20 flex flex-col gap-2 mt-16 sm:mt-20">
                <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0 flex-1 pr-1">
                        <span className="font-bold text-[10px] sm:text-[11px] uppercase tracking-wider text-[#ffdbd1] block mb-0.5">
                            {district}
                        </span>
                        <h2 className="font-bold text-[18px] sm:text-[20px] leading-tight text-white tracking-tight truncate group-hover:text-[#ffddb8] transition-colors">
                            {place.name}
                        </h2>
                        <p className="text-[12px] text-white/90 mt-0.5 truncate">
                            {subtitle}
                        </p>
                    </div>

                    <div className="shrink-0 text-right">
                        <span className="block text-[10px] uppercase tracking-wider text-white/70">
                            MULAI
                        </span>
                        <span className="font-extrabold text-[15px] sm:text-[16px] text-[#ffb95f]">
                            {priceText}
                        </span>
                    </div>
                </div>

                {/* Facility Highlight Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                    {highlights.map((h, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white text-[11px] shrink-0 font-medium"
                        >
                            {renderHighlightIcon(h.iconType)}
                            <span>{h.label}</span>
                        </div>
                    ))}
                </div>

                {/* Distance / Location + Detail Pill */}
                <div className="flex items-center justify-between pt-2 border-t border-white/15 mt-0.5">
                    <span className="text-[11px] font-medium text-white/90 flex items-center gap-1">
                        <Navigation className="h-3 w-3 text-[#ff6e48]" />
                        <span>{userDistance ? `${userDistance} dari lokasimu` : `${district}, Padang`}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ac3311] text-white text-[11px] font-semibold active:scale-95 transition-all shadow-xs">
                        <span>Detail</span>
                        <ArrowRight className="h-3 w-3" />
                    </span>
                </div>
            </div>
        </article>
    );
}

function renderHighlightIcon(type: HighlightItem["iconType"]) {
    switch (type) {
        case "power":
            return <Zap className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "wifi":
            return <Wifi className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "chair":
            return <Armchair className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "coffee":
            return <Coffee className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "sun":
            return <Sun className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "moon":
            return <Moon className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "meeting":
            return <Users className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "food":
            return <Utensils className="h-3.5 w-3.5 text-[#ff6e48]" />;
        default:
            return <Coffee className="h-3.5 w-3.5 text-[#ff6e48]" />;
    }
}

function getPlaceHighlights(place: Place): HighlightItem[] {
    const highlights: HighlightItem[] = [];

    const text = [
        place.name,
        place.short_description || "",
        place.description || "",
        place.vibe || "",
        ...(Array.isArray(place.characteristics)
            ? place.characteristics.map((c) =>
                  typeof c === "string" ? c : `${c.title} ${c.description}`
              )
            : []),
    ]
        .join(" ")
        .toLowerCase();

    const tagSlugs = new Set<string>();
    if (Array.isArray(place.place_tags)) {
        for (const pt of place.place_tags) {
            const t = pt.tags || (pt as any).tag;
            if (Array.isArray(t)) {
                t.forEach((x) => x?.slug && tagSlugs.add(x.slug.toLowerCase()));
            } else if (t?.slug) {
                tagSlugs.add(t.slug.toLowerCase());
            }
            if (pt.tag_id) tagSlugs.add(pt.tag_id.toLowerCase());
        }
    }
    if (Array.isArray((place as any).tags)) {
        for (const t of (place as any).tags) {
            if (typeof t === "string") tagSlugs.add(t.toLowerCase());
            else if (t?.slug) tagSlugs.add(t.slug.toLowerCase());
        }
    }

    if (tagSlugs.has("colokan") || text.includes("colokan") || text.includes("stopkontak")) {
        highlights.push({ label: "Banyak Colokan", iconType: "power" });
    }
    if (tagSlugs.has("wifi") || text.includes("wifi") || text.includes("internet")) {
        highlights.push({ label: "WiFi Kencang", iconType: "wifi" });
    }
    if (
        tagSlugs.has("24-jam") ||
        text.includes("24 jam") ||
        (place.opening_hours && place.opening_hours.toLowerCase().includes("24 jam"))
    ) {
        highlights.push({ label: "Buka Nonstop", iconType: "moon" });
    }
    if (
        tagSlugs.has("specialty-coffee") ||
        text.includes("specialty") ||
        text.includes("manual brew") ||
        text.includes("roastery")
    ) {
        highlights.push({ label: "Specialty Roastery", iconType: "coffee" });
    }
    if (tagSlugs.has("outdoor") || text.includes("outdoor") || text.includes("rooftop") || text.includes("sunset")) {
        highlights.push({ label: "Outdoor Luas", iconType: "sun" });
    }
    if (tagSlugs.has("meeting") || text.includes("meeting") || text.includes("vip")) {
        highlights.push({ label: "Ruang Meeting", iconType: "meeting" });
    }
    if (
        tagSlugs.has("kursi-ergonomis") ||
        text.includes("kursi") ||
        text.includes("ergonomis") ||
        text.includes("wfc") ||
        tagSlugs.has("wfc")
    ) {
        highlights.push({ label: "Kursi Ergonomis", iconType: "chair" });
    }
    if (text.includes("makanan") || text.includes("food") || text.includes("toast") || text.includes("snack")) {
        highlights.push({ label: "Menu Makanan", iconType: "food" });
    }

    if (highlights.length === 0) {
        highlights.push({ label: "Co-Working & WFC", iconType: "chair" });
        highlights.push({ label: "Kopi Berkualitas", iconType: "coffee" });
    } else if (highlights.length === 1) {
        highlights.push({ label: "Kopi Berkualitas", iconType: "coffee" });
    }

    return highlights.slice(0, 3);
}

function getPlaceArea(place: Place): string {
    if (place.area) {
        return place.area;
    }
    if (place.address) {
        const match = place.address.match(/Kec\.?\s*([a-zA-Z\s]+?)(?:,|$)/i);
        if (match?.[1]) {
            return match[1].trim();
        }
    }
    return place.city || "Padang";
}

function getPlaceSubtitle(place: Place): string {
    if (place.short_description) {
        return place.short_description.slice(0, 42);
    }
    if (place.description) {
        return place.description.slice(0, 42);
    }
    return "Tempat ngopi & ruang kerja santai";
}

function getDisplayPrice(place: Place): string {
    if (place.price_range) {
        if (place.price_range.includes("15k") || place.price_range.includes("18k")) {
            return "Rp 18k";
        }
        if (place.price_range.includes("20k") || place.price_range.includes("22k")) {
            return "Rp 22k";
        }
        if (place.price_range.includes("25k")) {
            return "Rp 25k";
        }
        if (place.price_range.includes("30k") || place.price_range.includes("35k")) {
            return "Rp 30k";
        }
    }
    if (place.price_min) {
        return `Rp ${Math.round(place.price_min / 1000)}k`;
    }
    return "Rp 20k";
}

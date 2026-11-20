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
    Laptop,
    BookOpen,
    Users,
    Heart,
    User,
    Music,
    Sun,
    Wind,
    Compass,
    VolumeX,
    Coffee,
    Sparkles,
    Camera,
    Dices,
    Home,
    Cigarette,
    Building2,
    Trees,
    Flame,
    Layers,
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
    iconType: string;
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

const OFFICIAL_TAG_MAP: Record<string, HighlightItem> = {
    colokan: { label: "Colokan", iconType: "power" },
    wifi: { label: "WiFi", iconType: "wifi" },
    wfc: { label: "WFC", iconType: "laptop" },
    nugas: { label: "Nugas", iconType: "book" },
    outdoor: { label: "Outdoor", iconType: "sun" },
    ac: { label: "AC", iconType: "wind" },
    tenang: { label: "Tenang", iconType: "volume-x" },
    cozy: { label: "Cozy", iconType: "coffee" },
    nongkrong: { label: "Nongkrong", iconType: "users" },
    meeting: { label: "Meeting", iconType: "users" },
    aesthetic: { label: "Aesthetic", iconType: "sparkles" },
    "live-musik": { label: "Live Musik", iconType: "music" },
    photobox: { label: "Photobox", iconType: "camera" },
    "board-game": { label: "Board Game", iconType: "dices" },
    musholla: { label: "Musholla", iconType: "compass" },
    indoor: { label: "Indoor", iconType: "home" },
    "smoking-area": { label: "Smoking Area", iconType: "cigarette" },
    "indoor-smoking": { label: "Indoor Smoking", iconType: "cigarette" },
    minimalis: { label: "Minimalis", iconType: "layers" },
    industrial: { label: "Industrial", iconType: "building" },
    "nge-date": { label: "Nge-date", iconType: "heart" },
    "me-time": { label: "Me-time", iconType: "user" },
    healing: { label: "Healing", iconType: "trees" },
    rame: { label: "Rame", iconType: "flame" },
    toilet: { label: "Toilet", iconType: "sparkles" },
};

const TAG_PRIORITY: string[] = [
    "colokan",
    "wifi",
    "wfc",
    "nugas",
    "outdoor",
    "ac",
    "tenang",
    "cozy",
    "nongkrong",
    "meeting",
    "aesthetic",
    "live-musik",
    "photobox",
    "board-game",
    "musholla",
    "indoor",
    "smoking-area",
    "indoor-smoking",
    "minimalis",
    "industrial",
    "nge-date",
    "me-time",
    "healing",
    "rame",
    "toilet",
];

function renderHighlightIcon(type: string) {
    switch (type) {
        case "power":
            return <Zap className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "wifi":
            return <Wifi className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "laptop":
            return <Laptop className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "book":
            return <BookOpen className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "users":
            return <Users className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "heart":
            return <Heart className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "user":
            return <User className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "sun":
            return <Sun className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "wind":
            return <Wind className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "volume-x":
            return <VolumeX className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "coffee":
            return <Coffee className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "music":
            return <Music className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "sparkles":
            return <Sparkles className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "camera":
            return <Camera className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "dices":
            return <Dices className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "home":
            return <Home className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "cigarette":
            return <Cigarette className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "compass":
            return <Compass className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "trees":
            return <Trees className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "flame":
            return <Flame className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "building":
            return <Building2 className="h-3.5 w-3.5 text-[#ff6e48]" />;
        case "layers":
            return <Layers className="h-3.5 w-3.5 text-[#ff6e48]" />;
        default:
            return <Coffee className="h-3.5 w-3.5 text-[#ff6e48]" />;
    }
}

function getPlaceHighlights(place: Place): HighlightItem[] {
    const highlights: HighlightItem[] = [];

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

    // Fallback deteksi tag jika data relasi place_tags kosong
    if (tagSlugs.size === 0) {
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

        for (const slug of Object.keys(OFFICIAL_TAG_MAP)) {
            const normalized = slug.replace(/-/g, " ");
            if (text.includes(slug) || text.includes(normalized)) {
                tagSlugs.add(slug);
            }
        }
        if (text.includes("colokan") || text.includes("stopkontak")) tagSlugs.add("colokan");
        if (text.includes("wifi") || text.includes("internet")) tagSlugs.add("wifi");
    }

    // Ambil maksimal 3 badge tag resmi yang dimiliki kafe
    for (const slug of TAG_PRIORITY) {
        if (tagSlugs.has(slug) && OFFICIAL_TAG_MAP[slug]) {
            highlights.push(OFFICIAL_TAG_MAP[slug]);
            if (highlights.length >= 3) break;
        }
    }

    if (highlights.length === 0) {
        highlights.push(OFFICIAL_TAG_MAP["wfc"]);
        highlights.push(OFFICIAL_TAG_MAP["wifi"]);
    }

    return highlights;
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

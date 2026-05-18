"use client";

import Link from "next/link";
import type { Place } from "@/types/database";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import { trackEvent } from "@/lib/track-event";

type PlaceCardProps = {
    place: Place;
    source?: "homepage_featured" | "places_list" | "related_places" | "place_card";
    position?: number;
};

function formatPrice(place: Place) {
    if (place.price_range) {
        return place.price_range;
    }

    if (place.price_min && place.price_max) {
        return `Rp${place.price_min.toLocaleString("id-ID")} - Rp${place.price_max.toLocaleString("id-ID")}`;
    }

    if (place.price_min) {
        return `Mulai Rp${place.price_min.toLocaleString("id-ID")}`;
    }

    if (place.price_max) {
        return `Sampai Rp${place.price_max.toLocaleString("id-ID")}`;
    }

    return "Belum ada info";
}

function getCategoryLabel(place: Place) {
    if (Array.isArray(place.categories)) {
        return place.categories[0]?.name || "Tempat";
    }

    return place.categories?.name || "Tempat";
}

function getPlaceTags(place: Place) {
    return (
        place.place_tags
            ?.map((item) => {
                if (Array.isArray(item.tags)) {
                    return item.tags[0];
                }

                return item.tags;
            })
            .filter(Boolean) || []
    );
}

function getMainTags(place: Place, limit = 4) {
    return getPlaceTags(place).slice(0, limit);
}

function getPlaceArea(place: Place) {
    return place.area || place.city || "Padang";
}

function getImageAlt(place: Place) {
    const area = getPlaceArea(place);
    const category = getCategoryLabel(place);

    if (category.toLowerCase().includes("coffee")) {
        return `${place.name} coffee shop di ${area}`;
    }

    return `${place.name} tempat rekomendasi di ${area}`;
}

function getBestForLabels(place: Place) {
    const tags = getPlaceTags(place);

    const priorityKeywords = [
        "nugas",
        "wfc",
        "nongkrong",
        "me-time",
        "me time",
        "first-date",
        "first date",
        "meeting",
        "live-music",
        "live music",
    ];

    const priorityTags = tags.filter((tag) => {
        const slug = tag?.slug?.toLowerCase() || "";
        const name = tag?.name?.toLowerCase() || "";

        return priorityKeywords.some(
            (keyword) => slug.includes(keyword) || name.includes(keyword)
        );
    });

    const selected = priorityTags.length > 0 ? priorityTags : tags;

    return selected.slice(0, 3);
}

export function PlaceCard({
    place,
    source = "place_card",
    position,
}: PlaceCardProps) {
    const tags = getMainTags(place, 4);
    const bestForTags = getBestForLabels(place);
    const area = getPlaceArea(place);
    const category = getCategoryLabel(place);
    const detailHref = `/places/${place.slug}`;
    const imageUrl = getSafePlaceImageUrl(place.image_url || place.main_image_url);

    function handleCardClick() {
        void trackEvent({
            event_name: "place_card_clicked",
            place_id: place.id,
            place_name: place.name,
            place_slug: place.slug,
            source,
            metadata: {
                href: detailHref,
                area: place.area,
                city: place.city,
                category,
                price_range: place.price_range,
                opening_hours: place.opening_hours,
                is_featured: place.is_featured,
                is_verified: place.is_verified,
                position,
                tags: tags.map((tag) => tag?.slug).filter(Boolean),
            },
        }).catch((error) => {
            console.error("Failed to track place card click:", error);
        });
    }

    return (
        <Link
            href={detailHref}
            onClick={handleCardClick}
            className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[#EADCCB] bg-[#FFFDF8] shadow-[0_14px_40px_rgba(47,35,25,0.07)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#1F5A4A]/35 hover:shadow-[0_28px_80px_rgba(47,35,25,0.15)]"
        >
            <div className="relative h-52 overflow-hidden bg-[#E3DED4] sm:h-56">
                <img
                    src={imageUrl}
                    alt={getImageAlt(place)}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    loading="eager"
                    referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/22 to-black/5" />

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {place.is_featured ? (
                        <span className="rounded-full bg-[#F3C48E] px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#201813] shadow-sm">
                            Featured
                        </span>
                    ) : null}

                    {place.is_verified ? (
                        <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#1F5A4A] shadow-sm backdrop-blur">
                            Verified
                        </span>
                    ) : null}
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-white/85 backdrop-blur">
                            {area}
                        </span>

                        <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-white/85 backdrop-blur">
                            {category}
                        </span>
                    </div>

                    <h3 className="line-clamp-2 text-[22px] font-black leading-[1.05] tracking-[-0.04em] text-white drop-shadow-sm">
                        {place.name}
                    </h3>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="rounded-[22px] border border-[#EADCCB] bg-[#F8F1E8]/80 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#C8784A]">
                        Cocok untuk
                    </p>

                    {bestForTags.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {bestForTags.map((tag) => (
                                <span
                                    key={tag?.id}
                                    className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#201813] ring-1 ring-[#EADCCB]"
                                >
                                    {tag?.name}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-2 text-sm font-semibold leading-6 text-[#756A60]">
                            Tempat santai yang bisa kamu cek sesuai kebutuhan hari ini.
                        </p>
                    )}
                </div>

                <p className="mt-4 line-clamp-2 min-h-[48px] text-sm font-medium leading-6 text-[#756A60]">
                    {place.short_description ||
                        place.description ||
                        `Rekomendasi tempat di ${area} yang bisa kamu cek berdasarkan budget, fasilitas, dan vibes.`}
                </p>

                {tags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag?.id}
                                className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#6F6A61] ring-1 ring-[#EADCCB]"
                            >
                                {tag?.name}
                            </span>
                        ))}
                    </div>
                ) : null}

                <div className="mt-auto pt-5">
                    <div className="flex items-end justify-between gap-4 border-t border-[#EADCCB] pt-4">
                        <div className="min-w-0">
                            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#9B8B7E]">
                                Range harga
                            </p>

                            <p className="mt-1 line-clamp-1 text-base font-black text-[#201813]">
                                {formatPrice(place)}
                            </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-[#181818] px-4 py-2.5 text-xs font-black text-[#FFFDF8] transition duration-300 group-hover:bg-[#1F5A4A]">
                            Detail →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
import Link from "next/link";
import type { Place } from "@/types/database";
import { getSafePlaceImageUrl } from "@/lib/image-url";

type PlaceCardProps = {
    place: Place;
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

function getMainTags(place: Place) {
    return (
        place.place_tags
            ?.map((item) => {
                if (Array.isArray(item.tags)) {
                    return item.tags[0];
                }

                return item.tags;
            })
            .filter(Boolean)
            .slice(0, 2) || []
    );
}

export function PlaceCard({ place }: PlaceCardProps) {
    const tags = getMainTags(place);

    const imageUrl = getSafePlaceImageUrl(
        place.image_url || place.main_image_url
    );

    return (
        <Link
            href={`/places/${place.slug}`}
            className="group relative overflow-hidden rounded-[32px] border border-[#E3DED4] bg-[#FFFDF8] shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#181818]/20 hover:shadow-[0_28px_80px_rgba(20,20,20,0.14)]"
        >
            <div className="relative h-56 overflow-hidden bg-[#E3DED4]">
                <img
                    src={imageUrl}
                    alt={place.name}
                    className="h-full w-full object-cover grayscale-[20%] transition duration-700 group-hover:scale-110 group-hover:grayscale-0"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute left-4 top-4 flex gap-2">
                    {place.is_featured && (
                        <div className="rounded-full bg-[#FFFDF8] px-3 py-1 text-xs font-black text-[#181818] shadow-sm">
                            Featured
                        </div>
                    )}

                    {place.is_verified && (
                        <div className="rounded-full bg-black/70 px-3 py-1 text-xs font-black text-white backdrop-blur">
                            Verified
                        </div>
                    )}
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
                        {place.area || place.city || "Padang"}
                    </p>

                    <h3 className="mt-1 text-2xl font-black leading-tight text-white">
                        {place.name}
                    </h3>
                </div>
            </div>

            <div className="p-5">
                <p className="line-clamp-2 min-h-12 text-sm leading-6 text-[#6F6A61]">
                    {place.short_description ||
                        place.description ||
                        "Tempat pilihan yang bisa kamu cek sesuai kebutuhan hari ini."}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#F4F1EA] px-3 py-1 text-xs font-black text-[#181818] ring-1 ring-[#E3DED4]">
                        {getCategoryLabel(place)}
                    </span>

                    {tags.map((tag) => (
                        <span
                            key={tag?.id}
                            className="rounded-full bg-[#F4F1EA] px-3 py-1 text-xs font-bold text-[#6F6A61] ring-1 ring-[#E3DED4]"
                        >
                            {tag?.name}
                        </span>
                    ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#E3DED4] pt-4">
                    <div>
                        <p className="text-xs font-bold text-[#6F6A61]">Mulai dari</p>
                        <p className="font-black text-[#181818]">
                            {formatPrice(place)}
                        </p>
                    </div>

                    <span className="rounded-full bg-[#181818] px-4 py-2 text-xs font-black text-[#FFFDF8] transition duration-300 group-hover:bg-[#2A2A2A]">
                        Detail →
                    </span>
                </div>
            </div>
        </Link>
    );
}
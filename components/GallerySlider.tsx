"use client";

import { useState } from "react";
import { getSafePlaceImageUrl } from "@/lib/image-url";

type GalleryPhoto = {
    id: string;
    image_url: string;
    caption?: string | null;
    sort_order?: number | null;
};

type GallerySliderProps = {
    photos: GalleryPhoto[];
    placeName: string;
};

function getGalleryAltText({
    placeName,
    caption,
    index,
    type = "photo",
}: {
    placeName: string;
    caption?: string | null;
    index: number;
    type?: "photo" | "thumbnail";
}) {
    if (caption?.trim()) {
        return `${caption.trim()} - ${placeName} coffee shop di Padang`;
    }

    if (type === "thumbnail") {
        return `Thumbnail foto ${index + 1} ${placeName} coffee shop di Padang`;
    }

    return `Foto ${index + 1} ${placeName} coffee shop di Padang`;
}

export function GallerySlider({ photos, placeName }: GallerySliderProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const sortedPhotos = photos
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

    if (sortedPhotos.length === 0) return null;

    const activePhoto = sortedPhotos[activeIndex];
    const activeImageUrl = getSafePlaceImageUrl(activePhoto.image_url);

    function goPrev() {
        setActiveIndex((prev) =>
            prev === 0 ? sortedPhotos.length - 1 : prev - 1
        );
    }

    function goNext() {
        setActiveIndex((prev) =>
            prev === sortedPhotos.length - 1 ? 0 : prev + 1
        );
    }

    return (
        <div className="border-b border-white/10 bg-black/30 p-4 md:p-6">
            <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">
                        Gallery
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                        Suasana {placeName}
                    </h2>
                </div>

                <p className="hidden text-sm font-bold text-neutral-500 md:block">
                    {activeIndex + 1} / {sortedPhotos.length} foto
                </p>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
                <img
                    src={activeImageUrl}
                    alt={getGalleryAltText({
                        placeName,
                        caption: activePhoto.caption,
                        index: activeIndex,
                    })}
                    className="h-[280px] w-full object-cover transition duration-500 md:h-[520px]"
                    referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                {activePhoto.caption ? (
                    <div className="absolute bottom-5 left-5 right-5">
                        <p className="w-fit rounded-full bg-black/60 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                            {activePhoto.caption}
                        </p>
                    </div>
                ) : null}

                {sortedPhotos.length > 1 ? (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-xl font-black text-white backdrop-blur transition hover:bg-white hover:text-black"
                            aria-label={`Lihat foto sebelumnya dari ${placeName}`}
                        >
                            ←
                        </button>

                        <button
                            type="button"
                            onClick={goNext}
                            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-xl font-black text-white backdrop-blur transition hover:bg-white hover:text-black"
                            aria-label={`Lihat foto berikutnya dari ${placeName}`}
                        >
                            →
                        </button>
                    </>
                ) : null}
            </div>

            {sortedPhotos.length > 1 ? (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                    {sortedPhotos.map((photo, index) => {
                        const active = index === activeIndex;

                        return (
                            <button
                                key={photo.id}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border transition md:h-24 md:w-36 ${active
                                        ? "border-white opacity-100"
                                        : "border-white/10 opacity-60 hover:opacity-100"
                                    }`}
                                aria-label={`Pilih foto ${index + 1} dari ${placeName}`}
                            >
                                <img
                                    src={getSafePlaceImageUrl(photo.image_url)}
                                    alt={getGalleryAltText({
                                        placeName,
                                        caption: photo.caption,
                                        index,
                                        type: "thumbnail",
                                    })}
                                    className="h-full w-full object-cover"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                />

                                {active ? (
                                    <div className="absolute inset-0 ring-2 ring-inset ring-white" />
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}
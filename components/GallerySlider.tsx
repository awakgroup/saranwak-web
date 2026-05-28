"use client";

import { useEffect, useMemo, useState } from "react";
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

function getSafeIndex(index: number, length: number) {
    if (length <= 0) return 0;
    if (index < 0) return length - 1;
    if (index >= length) return 0;

    return index;
}

export function GallerySlider({ photos, placeName }: GallerySliderProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);

    const sortedPhotos = useMemo(() => {
        return photos
            .slice()
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    }, [photos]);

    const totalPhotos = sortedPhotos.length;
    const safeActiveIndex = getSafeIndex(activeIndex, totalPhotos);
    const activePhoto = sortedPhotos[safeActiveIndex];

    const activeImageUrl = activePhoto
        ? getSafePlaceImageUrl(activePhoto.image_url)
        : "";

    const hasMultiplePhotos = totalPhotos > 1;

    const prevIndex = hasMultiplePhotos
        ? getSafeIndex(safeActiveIndex - 1, totalPhotos)
        : safeActiveIndex;

    const nextIndex = hasMultiplePhotos
        ? getSafeIndex(safeActiveIndex + 1, totalPhotos)
        : safeActiveIndex;

    useEffect(() => {
        setImageLoaded(false);
    }, [activeImageUrl]);

    useEffect(() => {
        if (!hasMultiplePhotos) return;

        const nextPhoto = sortedPhotos[nextIndex];
        const prevPhoto = sortedPhotos[prevIndex];

        const preloadUrls = [nextPhoto?.image_url, prevPhoto?.image_url]
            .filter(Boolean)
            .map((url) => getSafePlaceImageUrl(url as string));

        preloadUrls.forEach((url) => {
            const image = new Image();
            image.src = url;
        });
    }, [hasMultiplePhotos, nextIndex, prevIndex, sortedPhotos]);

    if (totalPhotos === 0 || !activePhoto) return null;

    function goPrev(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        event.stopPropagation();

        if (!hasMultiplePhotos) return;

        setActiveIndex((prev) => getSafeIndex(prev - 1, totalPhotos));
    }

    function goNext(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        event.stopPropagation();

        if (!hasMultiplePhotos) return;

        setActiveIndex((prev) => getSafeIndex(prev + 1, totalPhotos));
    }

    function selectPhoto(
        event: React.MouseEvent<HTMLButtonElement>,
        index: number
    ) {
        event.preventDefault();
        event.stopPropagation();

        if (index === safeActiveIndex) return;

        setActiveIndex(index);
    }

    return (
        <section className="border-b border-[#E7D8C8] bg-[#FFFDF8] p-4 sm:p-5 md:p-7">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#C8784A]">
                        Gallery
                    </p>

                    <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-[#201813] sm:text-3xl">
                        Suasana {placeName}
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#756A60]">
                        Lihat gambaran tempat sebelum datang, biar ekspektasi nggak
                        berantem sama realita.
                    </p>
                </div>

                <div className="flex w-fit items-center gap-2 rounded-full border border-[#E7D8C8] bg-[#F8F1E8] px-3 py-2 text-xs font-black text-[#4B4038]">
                    <span className="text-[#1F5A4A]">{safeActiveIndex + 1}</span>
                    <span className="text-[#9B8B7E]">/</span>
                    <span>{totalPhotos} foto</span>
                </div>
            </div>

            <div className="relative overflow-hidden rounded-[26px] border border-[#E7D8C8] bg-[#181818] shadow-[0_18px_55px_rgba(47,35,25,0.08)] sm:rounded-[32px]">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#181818] sm:aspect-[16/10] md:aspect-[16/9]">
                    {!imageLoaded ? (
                        <div className="absolute inset-0 z-[1] animate-pulse bg-gradient-to-br from-[#2A2A2A] via-[#3A3028] to-[#181818]" />
                    ) : null}

                    <img
                        key={activeImageUrl}
                        src={activeImageUrl}
                        alt={getGalleryAltText({
                            placeName,
                            caption: activePhoto.caption,
                            index: safeActiveIndex,
                        })}
                        className={`relative z-[2] h-full w-full object-cover object-center transition duration-500 ${imageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                            }`}
                        referrerPolicy="no-referrer"
                        loading={safeActiveIndex === 0 ? "eager" : "lazy"}
                        decoding="async"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(true)}
                    />

                    <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-black/58 via-black/10 to-transparent" />
                </div>

                <div className="pointer-events-none absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-white backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-[#F2C38B]" />
                    Foto {safeActiveIndex + 1}
                </div>

                {activePhoto.caption ? (
                    <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 sm:bottom-5 sm:left-5 sm:right-5">
                        <p className="w-fit max-w-full rounded-2xl border border-white/15 bg-black/45 px-4 py-3 text-sm font-bold leading-6 text-white shadow-lg backdrop-blur">
                            {activePhoto.caption}
                        </p>
                    </div>
                ) : null}

                {hasMultiplePhotos ? (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            className="absolute left-3 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-xl font-black text-white shadow-lg backdrop-blur transition hover:bg-white hover:text-[#181818] active:scale-95 sm:left-5"
                            aria-label={`Lihat foto sebelumnya dari ${placeName}`}
                        >
                            ←
                        </button>

                        <button
                            type="button"
                            onClick={goNext}
                            className="absolute right-3 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-xl font-black text-white shadow-lg backdrop-blur transition hover:bg-white hover:text-[#181818] active:scale-95 sm:right-5"
                            aria-label={`Lihat foto berikutnya dari ${placeName}`}
                        >
                            →
                        </button>
                    </>
                ) : null}
            </div>

            {hasMultiplePhotos ? (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {sortedPhotos.map((photo, index) => {
                        const active = index === safeActiveIndex;
                        const thumbnailUrl = getSafePlaceImageUrl(photo.image_url);

                        return (
                            <button
                                key={photo.id}
                                type="button"
                                onClick={(event) => selectPhoto(event, index)}
                                className={`group relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border bg-[#F8F1E8] transition duration-300 active:scale-95 sm:h-24 sm:w-36 ${active
                                        ? "border-[#1F5A4A] opacity-100 shadow-[0_12px_30px_rgba(31,90,74,0.16)]"
                                        : "border-[#E7D8C8] opacity-70 hover:-translate-y-0.5 hover:border-[#1F5A4A]/50 hover:opacity-100"
                                    }`}
                                aria-label={`Pilih foto ${index + 1} dari ${placeName}`}
                                aria-current={active ? "true" : undefined}
                            >
                                <div className="absolute inset-0 animate-pulse bg-[#E7D8C8]" />

                                <img
                                    src={thumbnailUrl}
                                    alt={getGalleryAltText({
                                        placeName,
                                        caption: photo.caption,
                                        index,
                                        type: "thumbnail",
                                    })}
                                    className="relative z-[1] h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                                    referrerPolicy="no-referrer"
                                    loading={index <= 2 ? "eager" : "lazy"}
                                    decoding="async"
                                />

                                <div
                                    className={`pointer-events-none absolute inset-0 z-[2] transition ${active ? "bg-[#1F5A4A]/10" : "bg-black/10"
                                        }`}
                                />

                                <div className="pointer-events-none absolute left-2 top-2 z-[3] grid h-6 min-w-6 place-items-center rounded-full bg-white/90 px-2 text-[10px] font-black text-[#201813] shadow-sm">
                                    {index + 1}
                                </div>

                                {active ? (
                                    <div className="pointer-events-none absolute inset-0 z-[4] ring-2 ring-inset ring-[#1F5A4A]" />
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </section>
    );
}
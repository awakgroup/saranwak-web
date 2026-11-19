"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import { ImageLightboxModal } from "./ImageLightboxModal";

export type DesktopGalleryPhoto = {
    id?: string;
    image_url: string;
    caption?: string | null;
    sort_order?: number | null;
};

export type DesktopGallerySectionProps = {
    images: DesktopGalleryPhoto[];
    placeName: string;
};

export function DesktopGallerySection({
    images,
    placeName,
}: DesktopGallerySectionProps) {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    if (!images || images.length === 0) return null;

    return (
        <>
            <section className="rounded-2xl border border-[#EBE5DC] bg-white p-4 shadow-xs sm:p-7">
                <div className="mb-3.5 flex items-center justify-between sm:mb-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#756A63]">
                            Dokumentasi
                        </p>

                        <h2 className="mt-1 font-sans text-lg font-extrabold text-[#19120D] sm:text-2xl">
                            Foto &amp; Suasana Tempat
                        </h2>
                    </div>

                    <span className="rounded-full bg-[#FAF6F0] px-3 py-1 text-xs font-bold text-[#19120D]">
                        {images.length} Foto
                    </span>
                </div>

                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    {images.map((photo, index) => (
                        <figure
                            key={photo.id || `${photo.image_url}-${index}`}
                            onClick={() => setSelectedPhotoIndex(index)}
                            className="group relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border border-[#EBE5DC] bg-[#FAF6F0] transition-all hover:border-[#FF5C35]/50 hover:shadow-md"
                        >
                            <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-[#EAE4DC]">
                                <Image
                                    src={getSafePlaceImageUrl(photo.image_url)}
                                    alt={photo.caption || `${placeName} ${index + 1}`}
                                    fill
                                    sizes="(max-width: 640px) 100vw, 50vw"
                                    className="object-cover transition duration-500 group-hover:scale-105"
                                />

                                {/* Hover Zoom Overlay */}
                                <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#19120D] shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                                        <Maximize2 className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>

                            {photo.caption ? (
                                <figcaption className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-[#756A63] sm:px-4 sm:py-2.5">
                                    <span className="truncate">{photo.caption}</span>
                                    <span className="text-[10px] font-bold text-[#FF5C35] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                                        Klik untuk perbesar
                                    </span>
                                </figcaption>
                            ) : null}
                        </figure>
                    ))}
                </div>
            </section>

            {/* Lightbox Popup Modal */}
            <ImageLightboxModal
                isOpen={selectedPhotoIndex !== null}
                onClose={() => setSelectedPhotoIndex(null)}
                photos={images}
                initialIndex={selectedPhotoIndex ?? 0}
                placeName={placeName}
            />
        </>
    );
}

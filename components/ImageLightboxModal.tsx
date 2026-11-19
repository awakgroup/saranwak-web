"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { getSafePlaceImageUrl } from "@/lib/image-url";

export type LightboxPhoto = {
    image_url: string;
    caption?: string | null;
    id?: string;
};

export type ImageLightboxModalProps = {
    isOpen: boolean;
    onClose: () => void;
    photos: LightboxPhoto[];
    initialIndex?: number;
    placeName?: string;
};

export function ImageLightboxModal({
    isOpen,
    onClose,
    photos,
    initialIndex = 0,
    placeName = "Saranwak",
}: ImageLightboxModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const touchStartX = useRef<number | null>(null);

    // Sync currentIndex with initialIndex when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(Math.max(0, Math.min(initialIndex, photos.length - 1)));
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, initialIndex, photos.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    }, [photos.length]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
    }, [photos.length]);

    // Keyboard navigation (Escape, ArrowLeft, ArrowRight)
    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowLeft") {
                handlePrev();
            } else if (e.key === "ArrowRight") {
                handleNext();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose, handlePrev, handleNext]);

    // Touch swipe handling for mobile
    function handleTouchStart(e: React.TouchEvent) {
        touchStartX.current = e.touches[0].clientX;
    }

    function handleTouchEnd(e: React.TouchEvent) {
        if (touchStartX.current === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartX.current - touchEndX;

        // Minimum swipe threshold 45px
        if (Math.abs(diffX) > 45) {
            if (diffX > 0) {
                handleNext(); // swipe left -> next
            } else {
                handlePrev(); // swipe right -> prev
            }
        }
        touchStartX.current = null;
    }

    if (!isOpen || photos.length === 0) return null;

    const currentPhoto = photos[currentIndex] || photos[0];
    const safeUrl = getSafePlaceImageUrl(currentPhoto.image_url);
    const hasMultiple = photos.length > 1;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={`Galeri foto ${placeName}`}
            className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 backdrop-blur-md select-none transition-opacity duration-200"
            onClick={onClose}
        >
            {/* Top Bar: Title, Counter & Close Button */}
            <header
                className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 text-white"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col min-w-0 pr-4">
                    <span className="text-[13px] sm:text-sm font-bold truncate text-white/95">
                        {placeName}
                    </span>
                    {hasMultiple && (
                        <span className="text-[11px] sm:text-xs text-white/70 font-medium">
                            Foto {currentIndex + 1} dari {photos.length}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup galeri"
                        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all hover:bg-white/30 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* Main Stage: Image & Left/Right Navigation Buttons */}
            <div
                className="relative flex-1 flex items-center justify-center px-2 sm:px-12 my-auto max-h-[75vh] sm:max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Previous Button */}
                {hasMultiple && (
                    <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Foto sebelumnya"
                        className="absolute left-2 sm:left-4 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-md transition-all hover:bg-black/75 hover:scale-110 active:scale-90 cursor-pointer shadow-lg"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                )}

                {/* Central Image Container */}
                <div className="relative w-full h-full max-w-5xl flex items-center justify-center overflow-hidden">
                    <Image
                        key={safeUrl}
                        src={safeUrl}
                        alt={currentPhoto.caption || `${placeName} - Foto ${currentIndex + 1}`}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                        className="object-contain transition-transform duration-300"
                    />
                </div>

                {/* Next Button */}
                {hasMultiple && (
                    <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Foto selanjutnya"
                        className="absolute right-2 sm:right-4 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-md transition-all hover:bg-black/75 hover:scale-110 active:scale-90 cursor-pointer shadow-lg"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                )}
            </div>

            {/* Bottom Bar: Caption & Thumbnail Strip */}
            <footer
                className="relative z-10 flex flex-col items-center gap-2 px-4 py-3 sm:px-6 sm:py-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Caption */}
                {currentPhoto.caption ? (
                    <p className="text-center text-xs sm:text-sm text-white/90 max-w-2xl px-2 leading-relaxed drop-shadow-md">
                        {currentPhoto.caption}
                    </p>
                ) : (
                    <p className="text-center text-xs text-white/60">
                        {placeName}
                    </p>
                )}

                {/* Thumbnails Navigation Strip */}
                {hasMultiple && (
                    <div className="no-scrollbar mt-1 flex items-center gap-2 overflow-x-auto max-w-full px-2 py-1 overscroll-x-contain">
                        {photos.map((photo, idx) => {
                            const isSelected = idx === currentIndex;
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setCurrentIndex(idx)}
                                    aria-label={`Pilih foto ${idx + 1}`}
                                    className={`relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                        isSelected
                                            ? "border-[#FF5C35] scale-105 shadow-md"
                                            : "border-white/30 opacity-60 hover:opacity-100"
                                    }`}
                                >
                                    <Image
                                        src={getSafePlaceImageUrl(photo.image_url)}
                                        alt={photo.caption || `Thumbnail ${idx + 1}`}
                                        fill
                                        sizes="56px"
                                        className="object-cover"
                                    />
                                </button>
                            );
                        })}
                    </div>
                )}
            </footer>
        </div>
    );
}

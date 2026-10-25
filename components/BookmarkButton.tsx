"use client";

import { useMemo, useState } from "react";
import { Bookmark } from "lucide-react";
import type { Place } from "@/types/database";
import { useSavedPlaces } from "@/lib/saved-places";

interface BookmarkButtonProps {
    place: Place;
    variant?: "icon" | "button";
    className?: string;
}

export function BookmarkButton({
    place,
    variant = "icon",
    className = "",
}: BookmarkButtonProps) {
    const { isPlaceSaved, togglePlace, isLoaded } = useSavedPlaces();
    const [animate, setAnimate] = useState(false);

    const saved = useMemo(() => {
        if (!isLoaded) return false;
        return isPlaceSaved(place.slug);
    }, [isLoaded, isPlaceSaved, place.slug]);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setAnimate(true);
        setTimeout(() => setAnimate(false), 350);

        togglePlace(place);
    };

    if (variant === "button") {
        return (
            <button
                type="button"
                onClick={handleClick}
                aria-label={saved ? "Hapus dari tempat tersimpan" : "Simpan cafe ini"}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-bold transition duration-300 active:scale-95 sm:text-sm ${
                    saved
                        ? "bg-[#C8784A] text-white shadow-md hover:bg-[#B3683D]"
                        : "border border-[#E7D8C8] bg-white text-[#201813] hover:bg-[#FAF4ED] hover:border-[#C8784A]"
                } ${className}`}
            >
                <Bookmark
                    className={`h-4 w-4 transition-transform duration-300 ${
                        animate ? "scale-125 rotate-12" : "scale-100"
                    } ${saved ? "fill-current" : ""}`}
                />
                <span>{saved ? "Tersimpan di Wishlist" : "Simpan Cafe"}</span>
            </button>
        );
    }

    // Default: "icon" circular button for PlaceCard
    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={saved ? `Hapus ${place.name} dari tersimpan` : `Simpan ${place.name}`}
            title={saved ? "Tersimpan" : "Simpan cafe"}
            className={`group/btn grid h-9 w-9 place-items-center rounded-full border shadow-sm backdrop-blur transition-all duration-300 active:scale-90 ${
                saved
                    ? "border-[#C8784A] bg-[#C8784A] text-white shadow-md hover:bg-[#B3683D]"
                    : "border-white/20 bg-black/40 text-white hover:bg-black/60 hover:scale-105"
            } ${className}`}
        >
            <Bookmark
                className={`h-4 w-4 transition-all duration-300 ${
                    animate ? "scale-125" : "scale-100"
                } ${saved ? "fill-current text-white" : "group-hover/btn:text-[#F2C38B]"}`}
            />
        </button>
    );
}

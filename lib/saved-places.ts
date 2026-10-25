"use client";

import { useEffect, useState, useCallback } from "react";
import type { Place } from "@/types/database";

export interface SavedPlaceItem {
    id: string;
    slug: string;
    name: string;
    area: string;
    image_url: string;
    price_range?: string | null;
    opening_hours?: string | null;
    google_maps_url?: string | null;
}

const STORAGE_KEY = "saranwak_saved_places";
const CHANGE_EVENT = "saranwak:saved_places_changed";

export function getSavedPlacesFromStorage(): SavedPlaceItem[] {
    if (typeof window === "undefined") return [];
    try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        if (!item) return [];
        return JSON.parse(item) as SavedPlaceItem[];
    } catch (err) {
        console.error("Gagal membaca saved places:", err);
        return [];
    }
}

export function savePlaceToStorage(place: Place): boolean {
    if (typeof window === "undefined") return false;
    try {
        const current = getSavedPlacesFromStorage();
        const exists = current.some((p) => p.slug === place.slug);

        let updated: SavedPlaceItem[];
        let nowSaved: boolean;

        if (exists) {
            updated = current.filter((p) => p.slug !== place.slug);
            nowSaved = false;
        } else {
            const newItem: SavedPlaceItem = {
                id: place.id,
                slug: place.slug,
                name: place.name,
                area: place.area || place.city || "Padang",
                image_url: place.image_url || place.main_image_url || "",
                price_range: place.price_range || null,
                opening_hours: place.opening_hours || null,
                google_maps_url: place.google_maps_url || null,
            };
            updated = [newItem, ...current];
            nowSaved = true;
        }

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event(CHANGE_EVENT));
        return nowSaved;
    } catch (err) {
        console.error("Gagal update saved places:", err);
        return false;
    }
}

export function removeSavedPlace(slug: string): void {
    if (typeof window === "undefined") return;
    try {
        const current = getSavedPlacesFromStorage();
        const updated = current.filter((p) => p.slug !== slug);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch (err) {
        console.error("Gagal menghapus saved place:", err);
    }
}

export function clearAllSavedPlaces(): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch (err) {
        console.error("Gagal mengosongkan saved places:", err);
    }
}

/**
 * React Hook untuk mendengarkan perubahan daftar saved places secara reaktif di semua komponen.
 */
export function useSavedPlaces() {
    const [savedPlaces, setSavedPlaces] = useState<SavedPlaceItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const refresh = useCallback(() => {
        setSavedPlaces(getSavedPlacesFromStorage());
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        refresh();

        const handleStorageOrCustom = () => {
            refresh();
        };

        window.addEventListener(CHANGE_EVENT, handleStorageOrCustom);
        window.addEventListener("storage", handleStorageOrCustom);

        return () => {
            window.removeEventListener(CHANGE_EVENT, handleStorageOrCustom);
            window.removeEventListener("storage", handleStorageOrCustom);
        };
    }, [refresh]);

    const isPlaceSaved = useCallback(
        (slug: string) => {
            return savedPlaces.some((p) => p.slug === slug);
        },
        [savedPlaces]
    );

    const togglePlace = useCallback((place: Place) => {
        return savePlaceToStorage(place);
    }, []);

    return {
        savedPlaces,
        savedCount: savedPlaces.length,
        isLoaded,
        isPlaceSaved,
        togglePlace,
        removePlace: removeSavedPlace,
        clearAll: clearAllSavedPlaces,
    };
}

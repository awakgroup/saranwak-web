"use client";

type PlaceDetailTrackerProps = {
    placeId: string;
    placeName: string;
    placeSlug: string;
    metadata?: Record<string, unknown>;
};

/**
 * EMERGENCY MODE SARANWAK
 *
 * Detail page tracking dimatikan sementara karena:
 * - Supabase restricted / exceeding usage limit
 * - Vercel paused / exceeding usage limit
 *
 * Component ini tetap dipertahankan supaya import di halaman detail
 * tidak error, tapi tidak menjalankan useEffect dan tidak memanggil API.
 */
export function PlaceDetailTracker(_props: PlaceDetailTrackerProps) {
    return null;
}
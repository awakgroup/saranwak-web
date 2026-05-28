type TrackEventName =
    | "page_view"
    | "place_detail_view"
    | "place_card_clicked"
    | "related_place_clicked"
    | "google_maps_clicked"
    | "instagram_clicked"
    | "whatsapp_contact_clicked"
    | "website_service_clicked"
    | "search_submitted"
    | "filter_applied"
    | "empty_result_viewed";

export type TrackEventPayload = {
    event_name: TrackEventName;
    place_id?: string | null;
    place_name?: string | null;
    place_slug?: string | null;
    source?: string | null;
    page_path?: string | null;
    referrer?: string | null;
    session_id?: string | null;
    metadata?: Record<string, unknown> | null;
};

/**
 * EMERGENCY MODE SARANWAK
 *
 * Tracking dimatikan sementara karena Supabase dan Vercel kena usage limit.
 *
 * Fungsi ini sengaja tetap dipertahankan agar semua komponen yang memanggil
 * trackEvent(...) tidak error, tapi tidak ada request ke /api/track.
 */
export function trackEvent(_payload: TrackEventPayload) {
    return;
}
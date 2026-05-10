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

function getSessionId() {
    if (typeof window === "undefined") return null;

    const key = "saranwak_session_id";
    const existing = window.localStorage.getItem(key);

    if (existing) return existing;

    const nextValue =
        typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    window.localStorage.setItem(key, nextValue);

    return nextValue;
}

export async function trackEvent(payload: TrackEventPayload) {
    if (typeof window === "undefined") return;

    const currentPath = window.location.pathname + window.location.search;
    const currentReferrer = document.referrer || null;

    try {
        await fetch("/api/track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            keepalive: true,
            body: JSON.stringify({
                ...payload,
                page_path: payload.page_path ?? currentPath,
                referrer: payload.referrer ?? currentReferrer,
                session_id: payload.session_id ?? getSessionId(),
            }),
        });
    } catch {
        // Tracking jangan sampai ganggu user.
    }
}
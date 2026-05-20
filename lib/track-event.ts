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

type TrackEventBody = TrackEventPayload & {
    screen_width?: number | null;
    screen_height?: number | null;
    viewport_width?: number | null;
    viewport_height?: number | null;
};

type IdleWindow = Window &
    typeof globalThis & {
        requestIdleCallback?: (
            callback: () => void,
            options?: { timeout?: number }
        ) => number;
    };

const recentEventMap = new Map<string, number>();

function shouldSkipDuplicateEvent(key: string, delay = 1500) {
    const now = Date.now();
    const lastTime = recentEventMap.get(key) ?? 0;

    if (now - lastTime < delay) {
        return true;
    }

    recentEventMap.set(key, now);

    /**
     * Biar map tidak membesar terus kalau session panjang.
     */
    if (recentEventMap.size > 80) {
        const entries = Array.from(recentEventMap.entries());
        const oldEntries = entries.slice(0, 30);

        oldEntries.forEach(([oldKey]) => {
            recentEventMap.delete(oldKey);
        });
    }

    return false;
}

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

function getScreenData() {
    if (typeof window === "undefined") {
        return {
            screen_width: null,
            screen_height: null,
            viewport_width: null,
            viewport_height: null,
        };
    }

    return {
        screen_width: window.screen?.width ?? null,
        screen_height: window.screen?.height ?? null,
        viewport_width: window.innerWidth ?? null,
        viewport_height: window.innerHeight ?? null,
    };
}

function sendTracking(body: TrackEventBody) {
    const jsonBody = JSON.stringify(body);

    /**
     * sendBeacon cocok untuk analytics:
     * - tidak blocking UI
     * - lebih aman saat user pindah halaman
     * - tidak perlu await
     */
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([jsonBody], {
            type: "application/json",
        });

        const sent = navigator.sendBeacon("/api/track", blob);

        if (sent) return;
    }

    /**
     * Fallback kalau sendBeacon gagal/tidak tersedia.
     */
    void fetch("/api/track", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        keepalive: true,
        body: jsonBody,
    }).catch(() => {
        // Tracking jangan sampai ganggu user.
    });
}

function runWhenBrowserIdle(callback: () => void) {
    if (typeof window === "undefined") return;

    const idleWindow = window as IdleWindow;

    if (typeof idleWindow.requestIdleCallback === "function") {
        idleWindow.requestIdleCallback(callback, {
            timeout: 3000,
        });
        return;
    }

    window.setTimeout(callback, 800);
}

export function trackEvent(payload: TrackEventPayload) {
    if (typeof window === "undefined") return;

    const currentPath = window.location.pathname + window.location.search;
    const currentReferrer = document.referrer || null;

    const body: TrackEventBody = {
        ...payload,
        page_path: payload.page_path ?? currentPath,
        referrer: payload.referrer ?? currentReferrer,
        session_id: payload.session_id ?? getSessionId(),
        ...getScreenData(),
    };

    /**
     * Dedupe event yang sama dalam waktu dekat.
     * Ini mencegah double tracking karena double click, re-render,
     * atau component mount ulang terlalu cepat.
     */
    const dedupeKey = [
        body.event_name,
        body.place_id ?? "",
        body.place_slug ?? "",
        body.source ?? "",
        body.page_path ?? "",
    ].join("|");

    if (shouldSkipDuplicateEvent(dedupeKey)) return;

    runWhenBrowserIdle(() => {
        sendTracking(body);
    });
}
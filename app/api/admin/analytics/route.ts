import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type AnalyticsEvent = {
    id: string;
    event_name: string;
    place_id: string | null;
    place_name: string | null;
    place_slug: string | null;
    source: string | null;
    page_path: string | null;
    referrer: string | null;
    metadata: Record<string, unknown> | null;
    session_id: string | null;
    created_at: string;

    country: string | null;
    region: string | null;
    city: string | null;
    timezone: string | null;
    device_type: string | null;
    os: string | null;
    browser: string | null;
    screen_width: number | null;
    screen_height: number | null;
};

type TopPlaceAnalytics = {
    place_id: string | null;
    place_name: string;
    place_slug: string;
    detail_views: number;
    maps_clicks: number;
    instagram_clicks: number;
    whatsapp_clicks: number;
    card_clicks: number;
    action_clicks: number;
    action_click_rate: number;
    maps_click_rate: number;
    instagram_click_rate: number;
    total_events: number;
    last_event_at: string | null;
};

type SimpleStat = {
    label: string;
    total: number;
    percentage: number;
};

type CityStat = {
    city: string;
    region: string;
    country: string;
    total: number;
    percentage: number;
};

const EVENT_NAMES = {
    detailView: ["place_detail_view"],
    mapsClick: ["google_maps_clicked", "maps_clicked", "google_maps_click"],
    instagramClick: ["instagram_clicked", "instagram_click"],
    whatsappClick: [
        "whatsapp_contact_clicked",
        "whatsapp_clicked",
        "whatsapp_click",
        "contact_whatsapp_clicked",
    ],
    cardClick: ["place_card_clicked", "card_clicked", "place_card_click"],
};

function parseDateInput(value: string | null) {
    if (!value) return null;

    const date = new Date(`${value}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) return null;

    return date;
}

function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
}

function getDateRange(searchParams: URLSearchParams) {
    const period = searchParams.get("period") || "monthly";
    const now = new Date();

    if (period === "daily") {
        const date = parseDateInput(searchParams.get("date")) ?? now;

        const start = new Date(
            Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
        );

        const end = addDays(start, 1);

        return {
            period,
            start: start.toISOString(),
            end: end.toISOString(),
            label: start.toISOString().slice(0, 10),
        };
    }

    if (period === "weekly") {
        const startDate = parseDateInput(searchParams.get("start")) ?? now;

        const start = new Date(
            Date.UTC(
                startDate.getUTCFullYear(),
                startDate.getUTCMonth(),
                startDate.getUTCDate()
            )
        );

        const end = addDays(start, 7);

        return {
            period,
            start: start.toISOString(),
            end: end.toISOString(),
            label: `${start.toISOString().slice(0, 10)} - ${addDays(start, 6)
                .toISOString()
                .slice(0, 10)}`,
        };
    }

    if (period === "yearly") {
        const year = Number(searchParams.get("year")) || now.getUTCFullYear();

        const start = new Date(Date.UTC(year, 0, 1));
        const end = new Date(Date.UTC(year + 1, 0, 1));

        return {
            period,
            start: start.toISOString(),
            end: end.toISOString(),
            label: String(year),
        };
    }

    if (period === "custom") {
        const startDate = parseDateInput(searchParams.get("start"));
        const endDate = parseDateInput(searchParams.get("end"));

        if (!startDate || !endDate) {
            throw new Error("Tanggal custom tidak valid.");
        }

        const start = new Date(
            Date.UTC(
                startDate.getUTCFullYear(),
                startDate.getUTCMonth(),
                startDate.getUTCDate()
            )
        );

        const end = addDays(
            new Date(
                Date.UTC(
                    endDate.getUTCFullYear(),
                    endDate.getUTCMonth(),
                    endDate.getUTCDate()
                )
            ),
            1
        );

        return {
            period,
            start: start.toISOString(),
            end: end.toISOString(),
            label: `${start.toISOString().slice(0, 10)} - ${addDays(end, -1)
                .toISOString()
                .slice(0, 10)}`,
        };
    }

    const year = Number(searchParams.get("year")) || now.getUTCFullYear();
    const month = Number(searchParams.get("month")) || now.getUTCMonth() + 1;

    if (month < 1 || month > 12) {
        throw new Error("Bulan tidak valid.");
    }

    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));

    return {
        period: "monthly",
        start: start.toISOString(),
        end: end.toISOString(),
        label: `${year}-${String(month).padStart(2, "0")}`,
    };
}

function isEventName(event: AnalyticsEvent, eventNames: string[]) {
    return eventNames.includes(event.event_name);
}

function countEvents(events: AnalyticsEvent[], eventNames: string[]) {
    return events.filter((event) => isEventName(event, eventNames)).length;
}

function getRate(part: number, total: number) {
    if (!total) return 0;

    return Number(((part / total) * 100).toFixed(1));
}

function buildSummary(events: AnalyticsEvent[]) {
    const detailViews = countEvents(events, EVENT_NAMES.detailView);
    const mapsClicks = countEvents(events, EVENT_NAMES.mapsClick);
    const instagramClicks = countEvents(events, EVENT_NAMES.instagramClick);
    const whatsappClicks = countEvents(events, EVENT_NAMES.whatsappClick);
    const cardClicks = countEvents(events, EVENT_NAMES.cardClick);

    const actionClicks = mapsClicks + instagramClicks + whatsappClicks;

    return {
        total_events: events.length,
        detail_views: detailViews,
        maps_clicks: mapsClicks,
        instagram_clicks: instagramClicks,
        whatsapp_clicks: whatsappClicks,
        card_clicks: cardClicks,
        action_clicks: actionClicks,
        action_click_rate: getRate(actionClicks, detailViews),
        maps_click_rate: getRate(mapsClicks, detailViews),
        instagram_click_rate: getRate(instagramClicks, detailViews),
        whatsapp_click_rate: getRate(whatsappClicks, detailViews),
        card_to_detail_rate: getRate(detailViews, cardClicks),
    };
}

function buildTopPlaces(events: AnalyticsEvent[]): TopPlaceAnalytics[] {
    const map = new Map<string, TopPlaceAnalytics>();

    for (const event of events) {
        if (!event.place_id) continue;

        const key = event.place_id;

        if (!map.has(key)) {
            map.set(key, {
                place_id: event.place_id,
                place_name: event.place_name || "-",
                place_slug: event.place_slug || "-",
                detail_views: 0,
                maps_clicks: 0,
                instagram_clicks: 0,
                whatsapp_clicks: 0,
                card_clicks: 0,
                action_clicks: 0,
                action_click_rate: 0,
                maps_click_rate: 0,
                instagram_click_rate: 0,
                total_events: 0,
                last_event_at: event.created_at,
            });
        }

        const current = map.get(key)!;

        current.total_events += 1;
        current.last_event_at = event.created_at;

        if (isEventName(event, EVENT_NAMES.detailView)) {
            current.detail_views += 1;
        }

        if (isEventName(event, EVENT_NAMES.mapsClick)) {
            current.maps_clicks += 1;
        }

        if (isEventName(event, EVENT_NAMES.instagramClick)) {
            current.instagram_clicks += 1;
        }

        if (isEventName(event, EVENT_NAMES.whatsappClick)) {
            current.whatsapp_clicks += 1;
        }

        if (isEventName(event, EVENT_NAMES.cardClick)) {
            current.card_clicks += 1;
        }

        current.action_clicks =
            current.maps_clicks + current.instagram_clicks + current.whatsapp_clicks;

        current.action_click_rate = getRate(
            current.action_clicks,
            current.detail_views
        );

        current.maps_click_rate = getRate(
            current.maps_clicks,
            current.detail_views
        );

        current.instagram_click_rate = getRate(
            current.instagram_clicks,
            current.detail_views
        );
    }

    return [...map.values()]
        .sort((a, b) => {
            if (b.action_clicks !== a.action_clicks) {
                return b.action_clicks - a.action_clicks;
            }

            return b.total_events - a.total_events;
        })
        .slice(0, 10);
}

function buildSimpleStats(
    events: AnalyticsEvent[],
    getter: (event: AnalyticsEvent) => string | null | undefined,
    fallback = "Unknown"
): SimpleStat[] {
    const map = new Map<string, number>();

    for (const event of events) {
        const rawLabel = getter(event);
        const label = rawLabel && rawLabel.trim() ? rawLabel.trim() : fallback;

        map.set(label, (map.get(label) ?? 0) + 1);
    }

    return [...map.entries()]
        .map(([label, total]) => ({
            label,
            total,
            percentage: getRate(total, events.length),
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);
}

function buildCityStats(events: AnalyticsEvent[]): CityStat[] {
    const map = new Map<string, CityStat>();

    for (const event of events) {
        const city = event.city?.trim() || "Unknown";
        const region = event.region?.trim() || "-";
        const country = event.country?.trim() || "-";
        const key = `${city}|${region}|${country}`;

        if (!map.has(key)) {
            map.set(key, {
                city,
                region,
                country,
                total: 0,
                percentage: 0,
            });
        }

        const current = map.get(key)!;
        current.total += 1;
    }

    return [...map.values()]
        .map((item) => ({
            ...item,
            percentage: getRate(item.total, events.length),
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const range = getDateRange(searchParams);

        const { data, error } = await supabaseAdmin
            .from("analytics_events")
            .select(
                `
        id,
        event_name,
        place_id,
        place_name,
        place_slug,
        source,
        page_path,
        referrer,
        metadata,
        session_id,
        created_at,
        country,
        region,
        city,
        timezone,
        device_type,
        os,
        browser,
        screen_width,
        screen_height
      `
            )
            .gte("created_at", range.start)
            .lt("created_at", range.end)
            .order("created_at", { ascending: false })
            .limit(5000);

        if (error) {
            throw error;
        }

        const events = (data ?? []) as AnalyticsEvent[];

        return NextResponse.json({
            period: range,
            summary: buildSummary(events),
            top_places: buildTopPlaces(events),
            recent_events: events.slice(0, 20),

            device_stats: buildSimpleStats(events, (event) => event.device_type),
            city_stats: buildCityStats(events),
            browser_stats: buildSimpleStats(events, (event) => event.browser),
            os_stats: buildSimpleStats(events, (event) => event.os),
        });
    } catch (error) {
        console.error("ADMIN ANALYTICS ERROR:", error);

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Gagal mengambil data analytics.",
            },
            { status: 500 }
        );
    }
}
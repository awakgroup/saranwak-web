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

function countEvent(events: AnalyticsEvent[], eventName: string) {
    return events.filter((event) => event.event_name === eventName).length;
}

function buildTopPlaces(events: AnalyticsEvent[]) {
    const map = new Map<
        string,
        {
            place_id: string | null;
            place_name: string;
            place_slug: string;
            detail_views: number;
            maps_clicks: number;
            instagram_clicks: number;
            whatsapp_clicks: number;
            card_clicks: number;
            total_events: number;
            last_event_at: string | null;
        }
    >();

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
                total_events: 0,
                last_event_at: event.created_at,
            });
        }

        const current = map.get(key)!;

        current.total_events += 1;
        current.last_event_at = event.created_at;

        if (event.event_name === "place_detail_view") current.detail_views += 1;
        if (event.event_name === "google_maps_clicked") current.maps_clicks += 1;
        if (event.event_name === "instagram_clicked") current.instagram_clicks += 1;
        if (event.event_name === "whatsapp_contact_clicked") {
            current.whatsapp_clicks += 1;
        }
        if (event.event_name === "place_card_clicked") current.card_clicks += 1;
    }

    return [...map.values()]
        .sort((a, b) => b.total_events - a.total_events)
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
        created_at
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
            summary: {
                total_events: events.length,
                detail_views: countEvent(events, "place_detail_view"),
                maps_clicks: countEvent(events, "google_maps_clicked"),
                instagram_clicks: countEvent(events, "instagram_clicked"),
                whatsapp_clicks: countEvent(events, "whatsapp_contact_clicked"),
                card_clicks: countEvent(events, "place_card_clicked"),
            },
            top_places: buildTopPlaces(events),
            recent_events: events.slice(0, 20),
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
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
    user_agent: string | null;
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
            label: `${start.toISOString().slice(0, 10)}_to_${addDays(start, 6)
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
            label: `${start.toISOString().slice(0, 10)}_to_${addDays(end, -1)
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

function escapeCsvValue(value: unknown) {
    if (value === null || value === undefined) return "";

    const stringValue =
        typeof value === "object" ? JSON.stringify(value) : String(value);

    const escaped = stringValue.replace(/"/g, '""');

    return `"${escaped}"`;
}

function formatDateTime(value?: string | null) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "medium",
        timeZone: "Asia/Jakarta",
    }).format(date);
}

function getIntentCategory(eventName: string) {
    if (
        eventName === "google_maps_clicked" ||
        eventName === "instagram_clicked" ||
        eventName === "whatsapp_contact_clicked"
    ) {
        return "high_intent";
    }

    if (eventName === "place_detail_view") {
        return "listing_view";
    }

    if (eventName === "place_card_clicked") {
        return "discovery";
    }

    if (eventName === "filter_applied" || eventName === "search_submitted") {
        return "search_behavior";
    }

    return "general";
}

function buildCsv(events: AnalyticsEvent[]) {
    const headers = [
        "created_at",
        "created_at_jakarta",
        "event_name",
        "intent_category",
        "place_name",
        "place_slug",
        "source",
        "page_path",
        "referrer",
        "session_id",
        "device_type",
        "os",
        "browser",
        "screen_width",
        "screen_height",
        "city",
        "region",
        "country",
        "timezone",
        "metadata",
    ];

    const rows = events.map((event) => [
        event.created_at,
        formatDateTime(event.created_at),
        event.event_name,
        getIntentCategory(event.event_name),
        event.place_name,
        event.place_slug,
        event.source,
        event.page_path,
        event.referrer,
        event.session_id,
        event.device_type,
        event.os,
        event.browser,
        event.screen_width,
        event.screen_height,
        event.city,
        event.region,
        event.country,
        event.timezone,
        event.metadata,
    ]);

    return [
        headers.map(escapeCsvValue).join(","),
        ...rows.map((row) => row.map(escapeCsvValue).join(",")),
    ].join("\n");
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
        screen_height,
        user_agent
      `
            )
            .gte("created_at", range.start)
            .lt("created_at", range.end)
            .order("created_at", { ascending: false })
            .limit(10000);

        if (error) {
            throw error;
        }

        const events = (data ?? []) as AnalyticsEvent[];
        const csv = buildCsv(events);

        const filename = `saranwak-analytics-${range.period}-${range.label}.csv`;

        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("ADMIN ANALYTICS EXPORT ERROR:", error);

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Gagal export data analytics.",
            },
            { status: 500 }
        );
    }
}
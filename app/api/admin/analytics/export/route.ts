import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const ACTION_EVENTS = new Set([
    "google_maps_clicked",
    "instagram_clicked",
    "whatsapp_contact_clicked",
]);

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
            start: start.toISOString(),
            end: end.toISOString(),
            label: `weekly-${start.toISOString().slice(0, 10)}`,
        };
    }

    if (period === "yearly") {
        const year = Number(searchParams.get("year")) || now.getUTCFullYear();

        const start = new Date(Date.UTC(year, 0, 1));
        const end = new Date(Date.UTC(year + 1, 0, 1));

        return {
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
            start: start.toISOString(),
            end: end.toISOString(),
            label: `custom-${start.toISOString().slice(0, 10)}-${addDays(end, -1)
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
        start: start.toISOString(),
        end: end.toISOString(),
        label: `${year}-${String(month).padStart(2, "0")}`,
    };
}

function csvEscape(value: unknown) {
    if (value === null || value === undefined) return "";

    const stringValue =
        typeof value === "object" ? JSON.stringify(value) : String(value);

    return `"${stringValue.replace(/"/g, '""')}"`;
}

function getActionType(eventName: string) {
    if (eventName === "google_maps_clicked") return "maps";
    if (eventName === "instagram_clicked") return "instagram";
    if (eventName === "whatsapp_contact_clicked") return "whatsapp";

    return "";
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const { start, end, label } = getDateRange(searchParams);

        const { data, error } = await supabaseAdmin
            .from("analytics_events")
            .select(
                `
                event_name,
                place_id,
                place_name,
                place_slug,
                source,
                page_path,
                referrer,
                metadata,
                session_id,
                user_agent,
                created_at
            `
            )
            .gte("created_at", start)
            .lt("created_at", end)
            .order("created_at", { ascending: false });

        if (error) {
            throw error;
        }

        const headers = [
            "created_at",
            "event_name",
            "is_action_click",
            "action_type",
            "place_id",
            "place_name",
            "place_slug",
            "source",
            "page_path",
            "referrer",
            "metadata",
            "session_id",
            "user_agent",
        ];

        const rows = (data ?? []).map((item) => {
            const isActionClick = ACTION_EVENTS.has(item.event_name);
            const actionType = getActionType(item.event_name);

            return [
                item.created_at,
                item.event_name,
                isActionClick ? "yes" : "no",
                actionType,
                item.place_id,
                item.place_name,
                item.place_slug,
                item.source,
                item.page_path,
                item.referrer,
                item.metadata,
                item.session_id,
                item.user_agent,
            ]
                .map(csvEscape)
                .join(",");
        });

        const csv = [headers.join(","), ...rows].join("\n");

        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="saranwak-analytics-${label}.csv"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("EXPORT ANALYTICS ERROR:", error);

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Gagal export analytics.",
            },
            { status: 500 }
        );
    }
}
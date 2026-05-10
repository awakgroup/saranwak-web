import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const allowedEvents = new Set([
    "page_view",
    "place_detail_view",
    "place_card_clicked",
    "related_place_clicked",
    "google_maps_clicked",
    "instagram_clicked",
    "whatsapp_contact_clicked",
    "website_service_clicked",
    "search_submitted",
    "filter_applied",
    "empty_result_viewed",
]);

function sanitizeText(value: unknown, maxLength = 300) {
    if (typeof value !== "string") return null;

    const clean = value.trim();

    if (!clean) return null;

    return clean.slice(0, maxLength);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const eventName = sanitizeText(body.event_name, 80);

        if (!eventName || !allowedEvents.has(eventName)) {
            return NextResponse.json(
                { message: "Invalid event name." },
                { status: 400 }
            );
        }

        const placeId = sanitizeText(body.place_id, 80);
        const placeName = sanitizeText(body.place_name, 200);
        const placeSlug = sanitizeText(body.place_slug, 200);
        const source = sanitizeText(body.source, 120);
        const pagePath = sanitizeText(body.page_path, 300);
        const referrer = sanitizeText(body.referrer, 500);
        const sessionId = sanitizeText(body.session_id, 120);

        const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;

        const metadata =
            body.metadata && typeof body.metadata === "object" ? body.metadata : null;

        const { error } = await supabaseAdmin.from("analytics_events").insert({
            event_name: eventName,
            place_id: placeId || null,
            place_name: placeName,
            place_slug: placeSlug,
            source,
            page_path: pagePath,
            referrer,
            metadata,
            session_id: sessionId,
            user_agent: userAgent,
        });

        if (error) {
            console.error("TRACK INSERT ERROR:", error.message);

            return NextResponse.json(
                { message: "Failed to track event." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Tracked.",
        });
    } catch (error) {
        console.error("TRACK API ERROR:", error);

        return NextResponse.json(
            { message: "Invalid tracking request." },
            { status: 400 }
        );
    }
}
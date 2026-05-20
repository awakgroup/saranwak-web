import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

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

function sanitizeNumber(value: unknown) {
    if (typeof value !== "number") return null;

    if (!Number.isFinite(value)) return null;

    return Math.round(value);
}

function sanitizeMetadata(value: unknown) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return null;
    }

    try {
        const jsonString = JSON.stringify(value);

        if (jsonString.length > 5000) {
            return {
                truncated: true,
                raw: jsonString.slice(0, 5000),
            };
        }

        return value as Record<string, unknown>;
    } catch {
        return null;
    }
}

function decodeHeaderValue(value: string | null) {
    if (!value) return null;

    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function getDeviceType(userAgent: string) {
    const ua = userAgent.toLowerCase();

    if (/ipad|tablet/.test(ua)) return "tablet";

    if (
        /mobile|iphone|ipod|android|blackberry|iemobile|opera mini/.test(ua)
    ) {
        return "mobile";
    }

    return "desktop";
}

function getBrowser(userAgent: string) {
    const ua = userAgent.toLowerCase();

    if (ua.includes("edg/")) return "Edge";
    if (ua.includes("opr/") || ua.includes("opera")) return "Opera";
    if (ua.includes("firefox")) return "Firefox";
    if (ua.includes("samsungbrowser")) return "Samsung Internet";
    if (ua.includes("chrome") && !ua.includes("chromium")) return "Chrome";
    if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";

    return "Unknown";
}

function getOS(userAgent: string) {
    const ua = userAgent.toLowerCase();

    if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
        return "iOS";
    }

    if (ua.includes("android")) return "Android";
    if (ua.includes("mac os")) return "macOS";
    if (ua.includes("windows")) return "Windows";
    if (ua.includes("linux")) return "Linux";

    return "Unknown";
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
        const metadata = sanitizeMetadata(body.metadata);

        const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;
        const safeUserAgent = userAgent || "";

        /**
         * Lokasi ini berbasis IP dari Vercel headers.
         * Ini bukan GPS, jadi tidak butuh permission user.
         */
        const country = sanitizeText(request.headers.get("x-vercel-ip-country"), 20);
        const region = sanitizeText(
            request.headers.get("x-vercel-ip-country-region"),
            80
        );
        const city = sanitizeText(
            decodeHeaderValue(request.headers.get("x-vercel-ip-city")),
            120
        );
        const timezone = sanitizeText(
            request.headers.get("x-vercel-ip-timezone"),
            120
        );
        const latitude = sanitizeText(
            request.headers.get("x-vercel-ip-latitude"),
            60
        );
        const longitude = sanitizeText(
            request.headers.get("x-vercel-ip-longitude"),
            60
        );

        const screenWidth = sanitizeNumber(body.screen_width);
        const screenHeight = sanitizeNumber(body.screen_height);

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

            country,
            region,
            city,
            timezone,
            latitude,
            longitude,

            device_type: getDeviceType(safeUserAgent),
            os: getOS(safeUserAgent),
            browser: getBrowser(safeUserAgent),
            screen_width: screenWidth,
            screen_height: screenHeight,
            user_agent: userAgent,
        });

        if (error) {
            console.error("TRACK INSERT ERROR:", {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
            });

            return NextResponse.json(
                { message: "Failed to track event." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Tracked." },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (error) {
        console.error("TRACK API ERROR:", error);

        return NextResponse.json(
            { message: "Invalid tracking request." },
            { status: 400 }
        );
    }
}
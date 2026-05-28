import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
    return NextResponse.json(
        {
            ok: true,
            disabled: true,
            message: "Tracking is temporarily disabled.",
        },
        {
            status: 200,
            headers: {
                "Cache-Control": "no-store",
            },
        }
    );
}

export async function GET() {
    return NextResponse.json(
        {
            ok: true,
            disabled: true,
            message: "Tracking is temporarily disabled.",
        },
        {
            status: 200,
            headers: {
                "Cache-Control": "no-store",
            },
        }
    );
}
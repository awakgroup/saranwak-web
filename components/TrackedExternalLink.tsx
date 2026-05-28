"use client";

import type { ReactNode } from "react";

type TrackedExternalLinkProps = {
    href: string;
    children: ReactNode;
    className?: string;
    eventName:
    | "google_maps_clicked"
    | "instagram_clicked"
    | "whatsapp_contact_clicked"
    | "website_service_clicked";
    placeId?: string | null;
    placeName?: string | null;
    placeSlug?: string | null;
    source?: string;
    metadata?: Record<string, unknown>;
};

/**
 * EMERGENCY MODE SARANWAK
 *
 * External link tracking dimatikan sementara karena:
 * - Supabase restricted / exceeding usage limit
 * - Vercel paused / exceeding usage limit
 *
 * Component tetap dipertahankan supaya semua import lama tetap aman.
 * Link tetap berjalan normal, hanya tracking click yang tidak dijalankan.
 */
export function TrackedExternalLink({
    href,
    children,
    className,
}: TrackedExternalLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={className}
        >
            {children}
        </a>
    );
}
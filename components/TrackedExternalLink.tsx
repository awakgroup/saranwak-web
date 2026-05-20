"use client";

import type { MouseEvent, ReactNode } from "react";
import { trackEvent } from "@/lib/track-event";

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

export function TrackedExternalLink({
    href,
    children,
    className,
    eventName,
    placeId,
    placeName,
    placeSlug,
    source,
    metadata,
}: TrackedExternalLinkProps) {
    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
        const currentPath =
            typeof window !== "undefined"
                ? `${window.location.pathname}${window.location.search}`
                : undefined;

        const referrer =
            typeof document !== "undefined" ? document.referrer || null : null;

        trackEvent({
            event_name: eventName,
            place_id: placeId,
            place_name: placeName,
            place_slug: placeSlug,
            source: source || "external_link",
            page_path: currentPath,
            referrer,
            metadata: {
                ...(metadata ?? {}),
                href,
                opened_with: event.metaKey || event.ctrlKey ? "new_tab_shortcut" : "click",
            },
        });
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={className}
            onClick={handleClick}
        >
            {children}
        </a>
    );
}
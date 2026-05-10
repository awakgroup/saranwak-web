"use client";

import { trackEvent } from "@/lib/track-event";

type TrackedExternalLinkProps = {
    href: string;
    children: React.ReactNode;
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
    function handleClick() {
        trackEvent({
            event_name: eventName,
            place_id: placeId,
            place_name: placeName,
            place_slug: placeSlug,
            source,
            metadata,
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
"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/track-event";

type PlaceDetailTrackerProps = {
    placeId: string;
    placeName: string;
    placeSlug: string;
    metadata?: Record<string, unknown>;
};

export function PlaceDetailTracker({
    placeId,
    placeName,
    placeSlug,
    metadata,
}: PlaceDetailTrackerProps) {
    const hasTracked = useRef(false);

    useEffect(() => {
        if (hasTracked.current) return;

        hasTracked.current = true;

        trackEvent({
            event_name: "place_detail_view",
            place_id: placeId,
            place_name: placeName,
            place_slug: placeSlug,
            source: "place_detail_page",
            metadata,
        });
    }, [placeId, placeName, placeSlug, metadata]);

    return null;
}
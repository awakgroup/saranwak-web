"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/track-event";

type PlaceDetailTrackerProps = {
    placeId: string;
    placeName: string;
    placeSlug: string;
    area?: string | null;
    city?: string | null;
};

export function PlaceDetailTracker({
    placeId,
    placeName,
    placeSlug,
    area,
    city,
}: PlaceDetailTrackerProps) {
    const hasTracked = useRef(false);

    useEffect(() => {
        if (hasTracked.current) return;

        hasTracked.current = true;

        void trackEvent({
            event_name: "place_detail_view",
            place_id: placeId,
            place_name: placeName,
            place_slug: placeSlug,
            source: "place_detail_page",
            metadata: {
                area,
                city,
            },
        }).catch((error) => {
            console.error("Failed to track place detail view:", error);
        });
    }, [placeId, placeName, placeSlug, area, city]);

    return null;
}
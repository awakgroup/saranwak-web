"use client";

import { useEffect } from "react";
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
    useEffect(() => {
        trackEvent({
            event_name: "place_detail_view",
            place_id: placeId,
            place_name: placeName,
            place_slug: placeSlug,
            source: "detail_page",
            metadata: {
                area,
                city,
            },
        });
    }, [placeId, placeName, placeSlug, area, city]);

    return null;
}
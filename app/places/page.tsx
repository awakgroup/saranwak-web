import { Suspense } from "react";

import { PlacesClientPage } from "@/components/PlacesClientPage";
import { getPlaces as getPlacesFromApi, type ApiPlace } from "@/lib/api/places";
import type { Place } from "@/types/database";

export default async function PlacesPage() {
    const places = await getPublishedPlaces();

    return (
        <Suspense fallback={<PlacesLoading />}>
            <PlacesClientPage placesData={places} />
        </Suspense>
    );
}

async function getPublishedPlaces(): Promise<Place[]> {
    try {
        const places = await getPlacesFromApi({
            limit: 100,
        });

        return places.map(mapApiPlaceToLegacyPlace);
    } catch (error) {
        console.error("Places D1 fetch error:", error);
        return [];
    }
}

function mapApiPlaceToLegacyPlace(place: ApiPlace): Place {
    return {
        ...place,

        /**
         * Adapter field lama.
         * Komponen existing Saranwak masih banyak pakai nama lama.
         */
        maps_url: place.google_maps_url,
        is_published: Boolean(place.is_active),
        is_featured: Boolean(place.is_featured),

        /**
         * Fallback supaya komponen lama tidak crash.
         */
        tags: [],
        gallery: [],
    } as unknown as Place;
}

function PlacesLoading() {
    return (
        <main className="min-h-screen bg-[#F4F1EA] px-4 py-10 text-[#201813]">
            <section className="mx-auto max-w-7xl">
                <div className="rounded-[30px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-sm">
                    <p className="text-sm font-black text-[#756A60]">
                        Loading places...
                    </p>
                </div>
            </section>
        </main>
    );
}
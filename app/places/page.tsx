import { Suspense } from "react";

import { PlacesClientPage } from "@/components/PlacesClientPage";
import {
    getPlaces as getPlacesFromApi,
    mapApiPlaceToLegacyPlace,
} from "@/lib/api/places";
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
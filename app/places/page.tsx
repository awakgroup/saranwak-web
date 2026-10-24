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
        <main className="min-h-screen bg-[#F4F1EA] px-4 pb-14 pt-4 text-[#201813] sm:px-6 sm:pt-6 lg:px-8 lg:pb-20 lg:pt-8">
            <section className="mx-auto max-w-7xl">
                {/* Hero skeleton */}
                <div className="relative mb-8 overflow-hidden rounded-[32px] border border-[#E7D8C8] bg-[#191614] p-6 sm:p-8 lg:p-10">
                    <div className="h-6 w-44 animate-pulse rounded-full bg-white/10" />
                    <div className="mt-4 h-10 w-3/4 max-w-lg animate-pulse rounded-2xl bg-white/10 sm:h-14" />
                    <div className="mt-3 h-5 w-1/2 max-w-md animate-pulse rounded-xl bg-white/10" />
                    <div className="mt-6 h-12 w-full max-w-xl animate-pulse rounded-full bg-white/10" />
                </div>

                {/* Content grid skeleton */}
                <div className="grid gap-6 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr]">
                    <div className="hidden rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 lg:block">
                        <div className="h-6 w-32 animate-pulse rounded-xl bg-[#EADCCB]/60" />
                        <div className="mt-5 space-y-4">
                            <div className="h-20 animate-pulse rounded-2xl bg-[#F8F1E8]" />
                            <div className="h-32 animate-pulse rounded-2xl bg-[#F8F1E8]" />
                            <div className="h-32 animate-pulse rounded-2xl bg-[#F8F1E8]" />
                        </div>
                    </div>

                    <div>
                        <div className="mb-5 flex justify-between">
                            <div className="h-8 w-48 animate-pulse rounded-xl bg-[#EADCCB]/60" />
                            <div className="h-5 w-32 animate-pulse rounded-xl bg-[#EADCCB]/40" />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="overflow-hidden rounded-[28px] border border-[#EADCCB] bg-[#FFFDF8] shadow-sm"
                                >
                                    <div className="aspect-[4/3] animate-pulse bg-gradient-to-br from-[#E7D8C8] via-[#F8F1E8] to-[#E3DED4]" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 w-1/3 animate-pulse rounded bg-[#EADCCB]" />
                                        <div className="h-6 w-3/4 animate-pulse rounded bg-[#EADCCB]" />
                                        <div className="h-4 w-full animate-pulse rounded bg-[#EADCCB]/60" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
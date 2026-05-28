import { promises as fs } from "fs";
import path from "path";
import { Suspense } from "react";
import { PlacesClientPage } from "@/components/PlacesClientPage";
import type { Place } from "@/types/database";

export default async function PlacesPage() {
    const places = await getPlaces();

    return (
        <Suspense fallback={<PlacesLoading />}>
            <PlacesClientPage placesData={places} />
        </Suspense>
    );
}

async function getPlaces() {
    try {
        const filePath = path.join(
            process.cwd(),
            "public",
            "data",
            "places.json"
        );

        const fileContent = await fs.readFile(filePath, "utf8");
        const places = JSON.parse(fileContent) as Place[];

        if (!Array.isArray(places)) {
            return [];
        }

        return places.filter((place) => place.is_published);
    } catch (error) {
        console.error("Static places JSON read error:", error);
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
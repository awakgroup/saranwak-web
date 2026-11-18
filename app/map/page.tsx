import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";

import { MapPageClient } from "@/components/MapPageClient";
import {
    getPlaces as getPlacesFromApi,
    mapApiPlaceToLegacyPlace,
} from "@/lib/api/places";
import type { Place } from "@/types/database";

export const metadata: Metadata = {
    title: "Peta Interaktif Coffee Shop & Spot WFC Padang — Saranwak",
    description:
        "Jelajahi peta interaktif direktori coffee shop, cafe nugas, dan spot WFC terbaik di Kota Padang. Temukan posisi terdekat dengan panduan rute OpenStreetMap.",
    alternates: {
        canonical: "https://saranwak.com/map",
    },
    openGraph: {
        title: "Peta Interaktif Coffee Shop & Spot WFC Padang | Saranwak",
        description:
            "Eksplorasi posisi cafe & coffee shop di penjuru Padang dengan visualisasi peta interaktif dan navigasi GPS terdekat.",
        url: "https://saranwak.com/map",
        type: "website",
    },
    other: {
        "geo.region": "ID-SB",
        "geo.placename": "Padang",
        "geo.position": "-0.9471;100.4172",
        ICBM: "-0.9471, 100.4172",
    },
};

export default async function MapPage() {
    const places = await getPublishedPlaces();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Map",
        "name": "Peta Interaktif Coffee Shop Padang",
        "description":
            "Peta direktori persebaran cafe, coffee shop, dan spot WFC terkurasi di Kota Padang, Sumatera Barat.",
        "url": "https://saranwak.com/map",
        "spatialCoverage": {
            "@type": "Place",
            "name": "Kota Padang",
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": -0.9471,
                "longitude": 100.4172,
            },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <MapPageClient places={places} />
        </>
    );
}

async function getPublishedPlaces(): Promise<Place[]> {
    let jsonPlaces: Place[] = [];
    try {
        const filePath = path.join(process.cwd(), "public", "data", "places.json");
        const fileContent = await fs.readFile(filePath, "utf8");
        jsonPlaces = JSON.parse(fileContent) as Place[];
    } catch (fallbackError) {
        console.error("Places JSON fallback error:", fallbackError);
    }

    try {
        const places = await getPlacesFromApi({
            limit: 100,
        });

        if (places && places.length > 0) {
            const apiPlaces = places.map(mapApiPlaceToLegacyPlace);
            const map = new Map<string, Place>();
            jsonPlaces.forEach((p) => map.set(p.slug, p));
            apiPlaces.forEach((p) => map.set(p.slug, p));
            return Array.from(map.values());
        }
    } catch (apiError) {
        console.error("Map API fetch error:", apiError);
    }

    return jsonPlaces;
}

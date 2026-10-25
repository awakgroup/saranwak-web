import type { Place } from "@/types/database";

// Koordinat presisi untuk seluruh spot cafe di Padang
export const PADANG_PLACE_COORDINATES: Record<string, { lat: number; lng: number }> = {
    "kopkit-fabriek-bloc": {
        "lat": -0.8653,
        "lng": 100.3491
    },
    "maison-merjer": {
        "lat": -0.9254,
        "lng": 100.3687
    },
    "kopkit-sutomo": {
        "lat": -0.9542,
        "lng": 100.3887
    },
    "menza-coffee-barber": {
        "lat": -0.9471,
        "lng": 100.4172
    },
    "kopkit-gunung-pangilun": {
        "lat": -0.9082,
        "lng": 100.3648
    },
    "praya-brew": {
        "lat": -0.9385,
        "lng": 100.3752
    },
    "musi-coffee-eatery-expression-space": {
        "lat": -0.9290489,
        "lng": 100.353978
    },
    "toko-kopi-rasa-sutomo": {
        "lat": -0.9546618,
        "lng": 100.3929291
    },
    "canteen-up": {
        "lat": -0.9405838,
        "lng": 100.3544293
    },
    "kopi-titik": {
        "lat": -0.9382,
        "lng": 100.3541
    },
    "folks-coffe-club": {
        "lat": -0.9471,
        "lng": 100.4172
    },
    "show-koffie": {
        "lat": -0.9368433,
        "lng": 100.3555197
    },
    "rimbun-coffee": {
        "lat": -0.9339594,
        "lng": 100.363108
    },
    "kopkit-ulak-karang": {
        "lat": -0.9471,
        "lng": 100.4172
    },
    "menyala-coffee": {
        "lat": -0.9413196,
        "lng": 100.3566847
    },
    "hom-id": {
        "lat": -0.9471,
        "lng": 100.4172
    },
    "jiwani-coffee": {
        "lat": -0.944032,
        "lng": 100.3568738
    },
    "coffenary-mangunsarkoro": {
        "lat": -0.9342887,
        "lng": 100.3644352
    },
    "ortie-coffee": {
        "lat": -0.9336861,
        "lng": 100.3594919
    },
    "toko-kopi-rasa-damar": {
        "lat": -0.9449819,
        "lng": 100.3538644
    },
    "hq-coffee-eatery": {
        "lat": -0.9448922,
        "lng": 100.3587151
    },
    "parewa-coffee-bandar-purus": {
        "lat": -0.9412813,
        "lng": 100.3562702
    },
    "fore-pattimura": {
        "lat": -0.9471,
        "lng": 100.4172
    },
    "toko-kopi-rasa-raden-saleh": {
        "lat": -0.926939,
        "lng": 100.3559071
    },
    "dupin-flamboyan": {
        "lat": -0.9471,
        "lng": 100.4172
    },
    "geos-coffee-eatery": {
        "lat": -0.9258599,
        "lng": 100.3633935
    },
    "menes-coffee-eatery": {
        "lat": -0.9405632,
        "lng": 100.3599237
    },
    "kuri-slow-bar-195": {
        "lat": -0.9103,
        "lng": 100.3512
    },
    "kopkit-x-savey": {
        "lat": -0.9471,
        "lng": 100.4172
    },
    "cafe-merjer": {
        "lat": -0.9347677,
        "lng": 100.3546828
    },
    "salejourn": {
        "lat": -0.9342405,
        "lng": 100.3588516
    },
    "kopkit-veteran": {
        "lat": -0.9471,
        "lng": 100.4172
    },
    "hanghouse-coffee-and-eatery": {
        "lat": -0.9572,
        "lng": 100.3542
    },
    "kopkit-jati": {
        "lat": -0.9471,
        "lng": 100.4172
    }
};

// Fallback koordinat pusat per area/kecamatan di Padang jika cafe baru belum ada titik presisi
export const PADANG_AREA_COORDINATES: Record<string, { lat: number; lng: number }> = {
    "Padang Barat": { lat: -0.9419, lng: 100.3556 },
    "Padang Utara": { lat: -0.9167, lng: 100.3583 },
    "Padang Timur": { lat: -0.9412, lng: 100.3789 },
    "Nanggalo": { lat: -0.9082, lng: 100.3648 },
    "Koto Tangah": { lat: -0.8653, lng: 100.3491 },
    "Padang Selatan": { lat: -0.9634, lng: 100.3621 },
    "Lubuk Begalung": { lat: -0.9789, lng: 100.3956 },
    "Kuranji": { lat: -0.9250, lng: 100.4100 },
    "Pauh": { lat: -0.9144, lng: 100.4578 },
    "default": { lat: -0.9410, lng: 100.3620 }
};

export function getPlaceCoordinates(place: Place): { lat: number; lng: number } {
    if (typeof place.latitude === "number" && typeof place.longitude === "number" && !isNaN(place.latitude) && !isNaN(place.longitude)) {
        return { lat: place.latitude, lng: place.longitude };
    }

    if (place.slug && PADANG_PLACE_COORDINATES[place.slug]) {
        return PADANG_PLACE_COORDINATES[place.slug];
    }

    if (place.area && PADANG_AREA_COORDINATES[place.area]) {
        return PADANG_AREA_COORDINATES[place.area];
    }

    return PADANG_AREA_COORDINATES["default"];
}

/**
 * Menghitung jarak antara dua titik koordinat bumi (dalam kilometer) menggunakan Haversine Formula
 */
export function calculateDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Radius bumi dalam km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Format jarak menjadi string yang ramah pengguna (contoh: "450 m" atau "2.4 km")
 */
export function formatDistance(km: number): string {
    if (isNaN(km) || km < 0) return "";
    if (km < 1) {
        const meters = Math.round(km * 1000);
        return `${meters} m`;
    }
    return `${km.toFixed(1)} km`;
}

/**
 * Menghitung jarak pengguna ke suatu tempat (cafe)
 */
export function getDistanceToPlace(
    userCoords: { lat: number; lng: number } | null | undefined,
    place: Place
): number | null {
    if (!userCoords) return null;
    const placeCoords = getPlaceCoordinates(place);
    return calculateDistanceKm(userCoords.lat, userCoords.lng, placeCoords.lat, placeCoords.lng);
}


/**
 * Helper untuk menghitung status buka/tutup cafe secara real-time
 * berdasarkan waktu lokal Kota Padang (WIB / UTC+7).
 */

export type PlaceOpenStatus = {
    isOpen: boolean;
    is24Hours: boolean;
    statusLabel: string;
    detailLabel: string;
    variant: "open" | "closed" | "24hours";
};

export function getWibMinutes(): number {
    const now = new Date();
    // Offset UTC ke WIB (UTC+7)
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const wibDate = new Date(utc + 7 * 3600000);
    return wibDate.getHours() * 60 + wibDate.getMinutes();
}

export function parseMinutesFromTimeString(timeStr: string): number {
    const normalized = timeStr.replace(".", ":").trim();
    const parts = normalized.split(":").map((v) => parseInt(v, 10));
    const hours = parts[0] ?? 0;
    const minutes = parts[1] ?? 0;
    return hours * 60 + minutes;
}

export function getPlaceOpenStatus(openingHours?: string | null): PlaceOpenStatus {
    if (!openingHours || !openingHours.trim()) {
        return {
            isOpen: false,
            is24Hours: false,
            statusLabel: "Info jam belum ada",
            detailLabel: "Jam operasional belum dicantumkan",
            variant: "closed",
        };
    }

    const normalized = openingHours.toLowerCase().trim();

    // Cek jika buka 24 jam
    if (
        normalized.includes("24") ||
        normalized.includes("buka 24 jam") ||
        normalized.includes("24 jam")
    ) {
        return {
            isOpen: true,
            is24Hours: true,
            statusLabel: "Buka 24 Jam",
            detailLabel: "Buka tanpa henti",
            variant: "24hours",
        };
    }

    // Ekstrak pola jam: misal "08.00 - 22.00" atau "08:00 - 03:00"
    const timeMatches = openingHours.match(/\d{1,2}[.:]\d{2}/g);

    if (!timeMatches || timeMatches.length < 2) {
        return {
            isOpen: true,
            is24Hours: false,
            statusLabel: "Buka",
            detailLabel: openingHours,
            variant: "open",
        };
    }

    const openMinutes = parseMinutesFromTimeString(timeMatches[0]);
    let closeMinutes = parseMinutesFromTimeString(timeMatches[1]);

    // Jika tutup pukul 00:00 (tengah malam), anggap 24:00 (1440 menit)
    if (closeMinutes === 0) {
        closeMinutes = 1440;
    }

    const currentMinutes = getWibMinutes();
    let isOpen = false;

    // Kasus 1: Tutup melewati tengah malam (misal 08.00 - 03.00 pagi hari berikutnya)
    if (closeMinutes < openMinutes) {
        isOpen = currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
    } else {
        // Kasus 2: Jam operasional standar dalam satu hari yang sama (misal 08.00 - 22.00)
        isOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    }

    const closeTimeDisplay = timeMatches[1].replace(":", ".");

    if (isOpen) {
        return {
            isOpen: true,
            is24Hours: false,
            statusLabel: "Buka Sekarang",
            detailLabel: `Tutup pukul ${closeTimeDisplay}`,
            variant: "open",
        };
    }

    const openTimeDisplay = timeMatches[0].replace(":", ".");

    return {
        isOpen: false,
        is24Hours: false,
        statusLabel: "Tutup",
        detailLabel: `Buka pukul ${openTimeDisplay}`,
        variant: "closed",
    };
}

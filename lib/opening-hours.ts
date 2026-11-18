/**
 * Helper untuk menghitung status operasional buka/tutup cafe secara presisi dan real-time
 * berdasarkan waktu lokal Kota Padang (WIB / UTC+7 / Asia/Jakarta).
 */

export type PlaceOpenStatus = {
    isOpen: boolean;
    is24Hours: boolean;
    statusLabel: string;
    detailLabel: string;
    variant: "open" | "closed" | "24hours";
};

export function getWibDate(): Date {
    const now = new Date();
    // Konversi akurat ke WIB (UTC+7) tanpa terpengaruh perbedaan zona waktu browser/OS pengguna
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 7 * 3600000);
}

export function parseTimeToMinutes(timeStr: string): number {
    if (!timeStr) return 0;
    const clean = timeStr.replace(".", ":").trim();
    const parts = clean.split(":").map((v) => parseInt(v, 10));
    const hours = parts[0] ?? 0;
    const minutes = parts[1] ?? 0;
    return hours * 60 + minutes;
}

type ScheduleSegment = {
    is24Hours: boolean;
    days: number[]; // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
    openMin: number;
    closeMin: number;
    openStr: string;
    closeStr: string;
};

export function parseScheduleSegments(openingHours?: string | null): ScheduleSegment[] {
    if (!openingHours || !openingHours.trim()) return [];
    const normalized = openingHours.toLowerCase().trim();

    // Deteksi jika buka 24 jam nonstop
    if (
        normalized.includes("24 jam") ||
        normalized.includes("24jam") ||
        normalized.includes("buka 24") ||
        normalized.includes("24/7")
    ) {
        return [
            {
                is24Hours: true,
                days: [0, 1, 2, 3, 4, 5, 6],
                openMin: 0,
                closeMin: 1440,
                openStr: "00.00",
                closeStr: "24.00",
            },
        ];
    }

    // Pisahkan jika ada klausa multi-hari (misal: "Senin - Jumat 14.00 - 23.30, Sabtu 16.00 - 02.00 WIB")
    const clauses = normalized.split(/[,;]/);
    const segments: ScheduleSegment[] = [];

    for (const clause of clauses) {
        const times = clause.match(/\d{1,2}[.:]\d{2}/g);
        if (!times || times.length < 2) continue;

        const openMin = parseTimeToMinutes(times[0]);
        let closeMin = parseTimeToMinutes(times[1]);
        if (closeMin === 0) closeMin = 1440; // 00.00 malam dihitung sampai batas akhir hari

        let days: number[] = [];
        if (clause.includes("senin - jumat")) {
            days = [1, 2, 3, 4, 5];
        } else if (clause.includes("senin - sabtu")) {
            days = [1, 2, 3, 4, 5, 6];
        } else if (
            clause.includes("senin - minggu") ||
            clause.includes("setiap hari") ||
            clause.includes("seluruh hari") ||
            clause.includes("tiap hari")
        ) {
            days = [0, 1, 2, 3, 4, 5, 6];
        } else if (clause.includes("sabtu - minggu") || clause.includes("weekend")) {
            days = [6, 0];
        } else if (clause.includes("sabtu")) {
            days = [6];
        } else if (clause.includes("minggu") || clause.includes("ahad")) {
            days = [0];
        } else if (clause.includes("jumat") || clause.includes("jum'at")) {
            days = [5];
        } else {
            days = [0, 1, 2, 3, 4, 5, 6];
        }

        segments.push({
            is24Hours: false,
            days,
            openMin,
            closeMin,
            openStr: times[0].replace(":", "."),
            closeStr: times[1].replace(":", "."),
        });
    }

    // Fallback jika tidak terbagi koma tapi ada jam
    if (segments.length === 0) {
        const times = openingHours.match(/\d{1,2}[.:]\d{2}/g);
        if (times && times.length >= 2) {
            let closeMin = parseTimeToMinutes(times[1]);
            if (closeMin === 0) closeMin = 1440;
            segments.push({
                is24Hours: false,
                days: [0, 1, 2, 3, 4, 5, 6],
                openMin: parseTimeToMinutes(times[0]),
                closeMin,
                openStr: times[0].replace(":", "."),
                closeStr: times[1].replace(":", "."),
            });
        }
    }

    return segments;
}

export function getPlaceOpenStatus(
    openingHours?: string | null,
    referenceDate?: Date
): PlaceOpenStatus {
    if (!openingHours || !openingHours.trim()) {
        return {
            isOpen: false,
            is24Hours: false,
            statusLabel: "Info jam belum ada",
            detailLabel: "Jam operasional belum dicantumkan",
            variant: "closed",
        };
    }

    const segments = parseScheduleSegments(openingHours);
    if (segments.length === 0) {
        return {
            isOpen: true,
            is24Hours: false,
            statusLabel: "Buka",
            detailLabel: openingHours,
            variant: "open",
        };
    }

    // Jika buka 24 jam
    if (segments.some((s) => s.is24Hours)) {
        return {
            isOpen: true,
            is24Hours: true,
            statusLabel: "Buka 24 Jam",
            detailLabel: "Buka tanpa henti",
            variant: "24hours",
        };
    }

    const wibDate = referenceDate || getWibDate();
    const currentDay = wibDate.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
    const currentMinutes = wibDate.getHours() * 60 + wibDate.getMinutes();

    // 1. Cek sesi operasional kemarin malam yang tutup melewati tengah malam (misal buka kemarin 16.00 tutup 02.00 dini hari ini)
    const yesterdayDay = (currentDay + 6) % 7;
    for (const seg of segments) {
        if (seg.days.includes(yesterdayDay) && seg.closeMin < seg.openMin) {
            if (currentMinutes <= seg.closeMin) {
                return {
                    isOpen: true,
                    is24Hours: false,
                    statusLabel: "Buka Sekarang",
                    detailLabel: `Tutup pukul ${seg.closeStr}`,
                    variant: "open",
                };
            }
        }
    }

    // 2. Cek jadwal untuk hari ini
    const todaySeg = segments.find((s) => s.days.includes(currentDay));

    if (!todaySeg) {
        return {
            isOpen: false,
            is24Hours: false,
            statusLabel: "Tutup",
            detailLabel: "Tutup hari ini",
            variant: "closed",
        };
    }

    // Jika jadwal hari ini tutup melewati tengah malam (misal 08.00 - 03.00 dini hari berikutnya)
    if (todaySeg.closeMin < todaySeg.openMin) {
        if (currentMinutes >= todaySeg.openMin) {
            return {
                isOpen: true,
                is24Hours: false,
                statusLabel: "Buka Sekarang",
                detailLabel: `Tutup pukul ${todaySeg.closeStr}`,
                variant: "open",
            };
        }
    } else {
        // Jadwal standar pada hari yang sama (misal 08.00 - 22.00)
        if (currentMinutes >= todaySeg.openMin && currentMinutes <= todaySeg.closeMin) {
            return {
                isOpen: true,
                is24Hours: false,
                statusLabel: "Buka Sekarang",
                detailLabel: `Tutup pukul ${todaySeg.closeStr}`,
                variant: "open",
            };
        }
    }

    // Sedang tutup hari ini: informasikan jam bukanya
    if (currentMinutes < todaySeg.openMin) {
        return {
            isOpen: false,
            is24Hours: false,
            statusLabel: "Tutup",
            detailLabel: `Buka pukul ${todaySeg.openStr}`,
            variant: "closed",
        };
    } else {
        return {
            isOpen: false,
            is24Hours: false,
            statusLabel: "Tutup",
            detailLabel: `Buka esok pukul ${todaySeg.openStr}`,
            variant: "closed",
        };
    }
}

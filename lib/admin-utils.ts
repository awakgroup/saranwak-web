import type {
    AdminPlace,
    Characteristic,
    PeriodType,
    Tag,
    TopPlaceAnalytics,
} from "@/types/admin";

export const initialAdminForm = {
    id: "",
    name: "",
    slug: "",
    category_id: "",
    description: "",
    characteristics: [
        {
            title: "",
            description: "",
        },
    ],
    address: "",
    area: "",
    city: "Padang",
    image_url: "",
    google_maps_url: "",
    instagram_url: "",
    price_range: "",
    price_min_input: "",
    price_max_input: "",
    opening_hours: "",
    open_time: "",
    close_time: "",
    is_24_hours: false,
    photo_urls: [""],
    is_featured: true,
    is_published: true,
    tag_ids: [],
};

export const monthOptions = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
];

export function formatShortRupiah(value: string) {
    const numericValue = Number(value.replace(/\D/g, ""));

    if (!numericValue) return "";

    if (numericValue >= 1000) {
        return `Rp${numericValue / 1000}k`;
    }

    return `Rp${numericValue}`;
}

export function formatPriceRange(min: string, max: string) {
    const minFormatted = formatShortRupiah(min);
    const maxFormatted = formatShortRupiah(max);

    if (minFormatted && maxFormatted) {
        return `${minFormatted} - ${maxFormatted}`;
    }

    if (minFormatted) {
        return `Mulai ${minFormatted}`;
    }

    if (maxFormatted) {
        return `Sampai ${maxFormatted}`;
    }

    return "";
}

export function formatOpeningHours(
    openTime: string,
    closeTime: string,
    is24Hours: boolean
) {
    if (is24Hours) return "Buka 24 Jam";

    if (!openTime && !closeTime) return "";

    const formatTime = (value: string) => value.replace(":", ".");

    if (openTime && closeTime) {
        return `${formatTime(openTime)} - ${formatTime(closeTime)}`;
    }

    if (openTime) {
        return `Buka ${formatTime(openTime)}`;
    }

    return `Tutup ${formatTime(closeTime)}`;
}

export function parsePriceRange(priceRange?: string | null) {
    if (!priceRange) {
        return {
            min: "",
            max: "",
        };
    }

    const numbers = priceRange.match(/\d+/g);

    if (!numbers || numbers.length === 0) {
        return {
            min: "",
            max: "",
        };
    }

    const normalize = (value: string) => {
        const number = Number(value);

        if (!number) return "";

        if (number < 1000) {
            return String(number * 1000);
        }

        return String(number);
    };

    return {
        min: normalize(numbers[0]),
        max: normalize(numbers[1] ?? ""),
    };
}

export function parseOpeningHours(openingHours?: string | null) {
    if (!openingHours) {
        return {
            open: "",
            close: "",
            is24Hours: false,
        };
    }

    const normalized = openingHours.toLowerCase();

    if (
        normalized.includes("24") ||
        normalized.includes("buka 24 jam") ||
        normalized.includes("24 jam")
    ) {
        return {
            open: "",
            close: "",
            is24Hours: true,
        };
    }

    const matches = openingHours.match(/\d{1,2}[.:]\d{2}/g);

    if (!matches || matches.length === 0) {
        return {
            open: "",
            close: "",
            is24Hours: false,
        };
    }

    const normalize = (value: string) => value.replace(".", ":");

    return {
        open: normalize(matches[0]),
        close: normalize(matches[1] ?? ""),
        is24Hours: false,
    };
}

export function getCategoryName(category: AdminPlace["categories"]) {
    if (Array.isArray(category)) {
        return category[0]?.name ?? "Tanpa kategori";
    }

    return category?.name ?? "Tanpa kategori";
}

export function getPreviewUrls(photoUrls: string[]) {
    return photoUrls
        .map((url) => url.trim())
        .filter(Boolean)
        .slice(0, 5);
}

export function normalizeCharacteristics(
    value?: (string | Characteristic)[] | null
) {
    if (!Array.isArray(value)) {
        return [
            {
                title: "",
                description: "",
            },
        ];
    }

    const normalized = value
        .map((item) => {
            if (typeof item === "string") {
                const cleanTitle = item.trim();

                if (!cleanTitle) return null;

                return {
                    title: cleanTitle,
                    description: "",
                };
            }

            if (!item || typeof item !== "object") {
                return null;
            }

            const title = String(item.title ?? "").trim();
            const description = String(item.description ?? "").trim();

            if (!title && !description) {
                return null;
            }

            return {
                title,
                description,
            };
        })
        .filter((item): item is Characteristic => Boolean(item));

    return normalized.length > 0
        ? normalized
        : [
            {
                title: "",
                description: "",
            },
        ];
}

export function getCleanCharacteristics(characteristics: Characteristic[]) {
    return characteristics
        .map((item) => ({
            title: item.title.trim(),
            description: item.description.trim(),
        }))
        .filter((item) => item.title || item.description)
        .slice(0, 20);
}

export function getTagTypeLabel(type: string) {
    const labels: Record<string, string> = {
        activity: "Aktivitas",
        mood: "Aktivitas",
        facility: "Fasilitas",
        vibe: "Vibes",
        time: "Operasional",
        general: "Lainnya",
    };

    return labels[type] || type;
}

const tagTypeOrder = ["activity", "mood", "facility", "vibe", "time", "general"];

export function sortTagGroups(entries: [string, Tag[]][]) {
    return entries.sort(([typeA], [typeB]) => {
        const indexA = tagTypeOrder.indexOf(typeA);
        const indexB = tagTypeOrder.indexOf(typeB);

        const normalizedA = indexA === -1 ? tagTypeOrder.length : indexA;
        const normalizedB = indexB === -1 ? tagTypeOrder.length : indexB;

        if (normalizedA !== normalizedB) {
            return normalizedA - normalizedB;
        }

        return typeA.localeCompare(typeB);
    });
}

export function formatNumber(value?: number | null) {
    return Number(value ?? 0).toLocaleString("id-ID");
}

export function formatPercent(value?: number | null) {
    return `${Number(value ?? 0).toFixed(1)}%`;
}

export function getRate(part: number, total: number) {
    if (!total) return 0;

    return (part / total) * 100;
}

export function formatEventTime(value?: string | null) {
    if (!value) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export function formatEventName(value: string) {
    return value
        .split("_")
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
        .join(" ");
}

export function getTodayInputValue() {
    return new Date().toISOString().slice(0, 10);
}

export function buildAnalyticsParams(options: {
    periodType: PeriodType;
    selectedMonth: string;
    selectedYear: string;
    selectedDate: string;
    selectedWeekStart: string;
    customStart: string;
    customEnd: string;
}) {
    const params = new URLSearchParams();

    params.set("period", options.periodType);

    if (options.periodType === "daily") {
        params.set("date", options.selectedDate);
    }

    if (options.periodType === "weekly") {
        params.set("start", options.selectedWeekStart);
    }

    if (options.periodType === "monthly") {
        params.set("month", options.selectedMonth);
        params.set("year", options.selectedYear);
    }

    if (options.periodType === "yearly") {
        params.set("year", options.selectedYear);
    }

    if (options.periodType === "custom") {
        params.set("start", options.customStart);
        params.set("end", options.customEnd);
    }

    return params;
}

export function getBestActionRatePlace(places: TopPlaceAnalytics[]) {
    return places
        .filter((place) => place.detail_views > 0)
        .slice()
        .sort(
            (a, b) =>
                Number(b.action_click_rate ?? 0) - Number(a.action_click_rate ?? 0)
        )[0];
}

export function getTopByMetric(
    places: TopPlaceAnalytics[],
    metric: keyof Pick<
        TopPlaceAnalytics,
        "detail_views" | "maps_clicks" | "instagram_clicks" | "total_events"
    >
) {
    return places.slice().sort((a, b) => Number(b[metric]) - Number(a[metric]))[0];
}

export function getPerformanceBadge(place: TopPlaceAnalytics) {
    const actionRate = Number(place.action_click_rate ?? 0);
    const actionClicks = Number(place.action_clicks ?? 0);

    if (actionClicks >= 20 || actionRate >= 25) {
        return {
            label: "High Intent",
            className: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
        };
    }

    if (actionClicks >= 8 || actionRate >= 12) {
        return {
            label: "Growing",
            className: "bg-amber-400/10 text-amber-300 border-amber-400/20",
        };
    }

    return {
        label: "Need Boost",
        className: "bg-white/[0.06] text-neutral-300 border-white/10",
    };
}

export function generateSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/['"]/g, "")
        .replace(/&/g, " dan ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function isValidHttpUrl(value?: string | null) {
    if (!value?.trim()) return true;

    try {
        const url = new URL(value.trim());
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

export function isValidImageUrl(value?: string | null) {
    if (!value?.trim()) return true;

    if (!isValidHttpUrl(value)) return false;

    const url = value.trim().toLowerCase();

    const allowedHosts = [
        "images.unsplash.com",
        "plus.unsplash.com",
        "drive.google.com",
        "lh3.googleusercontent.com",
        "res.cloudinary.com",
        "ik.imagekit.io",
        "supabase.co",
    ];

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif",
        ".avif",
    ];

    try {
        const parsedUrl = new URL(url);

        const hostAllowed = allowedHosts.some((host) =>
            parsedUrl.hostname.includes(host)
        );

        const extensionAllowed = allowedExtensions.some((extension) =>
            parsedUrl.pathname.endsWith(extension)
        );

        return hostAllowed || extensionAllowed;
    } catch {
        return false;
    }
}

export function isValidGoogleMapsUrl(value?: string | null) {
    if (!value?.trim()) return true;

    if (!isValidHttpUrl(value)) return false;

    const url = value.trim().toLowerCase();

    return (
        url.includes("google.com/maps") ||
        url.includes("maps.google.com") ||
        url.includes("maps.app.goo.gl") ||
        url.includes("goo.gl/maps")
    );
}

export function isValidInstagramUrl(value?: string | null) {
    if (!value?.trim()) return true;

    if (!isValidHttpUrl(value)) return false;

    try {
        const url = new URL(value.trim().toLowerCase());

        return (
            url.hostname === "instagram.com" ||
            url.hostname === "www.instagram.com" ||
            url.hostname.endsWith(".instagram.com")
        );
    } catch {
        return false;
    }
}

export function getInvalidGalleryImageUrls(photoUrls: string[]) {
    return photoUrls
        .map((url) => url.trim())
        .filter(Boolean)
        .filter((url) => !isValidImageUrl(url));
}
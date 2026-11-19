export type PlaceTagFilter = {
    label: string;
    tag: string;
};

export type PlaceFilterGroupType =
    | "activity"
    | "facility"
    | "vibe";

export type PlaceFilterGroup = {
    title: string;
    type: PlaceFilterGroupType;
    options: PlaceTagFilter[];
};

export const placeFilterGroups: PlaceFilterGroup[] = [
    {
        title: "Aktivitas",
        type: "activity",
        options: [
            { label: "WFC", tag: "wfc" },
            { label: "Nugas", tag: "nugas" },
            { label: "Nongkrong", tag: "nongkrong" },
            { label: "Nge-date", tag: "nge-date" },
            { label: "Me-time", tag: "me-time" },
            { label: "Meeting", tag: "meeting" },
            { label: "Live Musik", tag: "live-musik" },
        ],
    },
    {
        title: "Fasilitas",
        type: "facility",
        options: [
            { label: "WiFi", tag: "wifi" },
            { label: "Colokan", tag: "colokan" },
            { label: "AC", tag: "ac" },
            { label: "Outdoor", tag: "outdoor" },
            { label: "Indoor", tag: "indoor" },
            { label: "Musholla", tag: "musholla" },
            { label: "Smoking Area", tag: "smoking-area" },
            { label: "Indoor Smoking", tag: "indoor-smoking" },
            { label: "Toilet", tag: "toilet" },
            { label: "Photobox", tag: "photobox" },
            { label: "Board Game", tag: "board-game" },
        ],
    },
    {
        title: "Vibes & Suasana",
        type: "vibe",
        options: [
            { label: "Tenang", tag: "tenang" },
            { label: "Cozy", tag: "cozy" },
            { label: "Aesthetic", tag: "aesthetic" },
            { label: "Minimalis", tag: "minimalis" },
            { label: "Industrial", tag: "industrial" },
            { label: "Rame", tag: "rame" },
            { label: "Healing", tag: "healing" },
        ],
    },
];

export const placeFilterOptions = placeFilterGroups.flatMap(
    (group) => group.options
);

export type PriceFilterValue = "all" | "under-20k" | "20k-40k" | "above-40k";

export type PriceFilterOption = {
    label: string;
    value: PriceFilterValue;
};

export const priceFilterOptions: PriceFilterOption[] = [
    {
        label: "Semua Harga",
        value: "all",
    },
    {
        label: "Dibawah 20k",
        value: "under-20k",
    },
    {
        label: "20k - 40k",
        value: "20k-40k",
    },
    {
        label: "Diatas 40k",
        value: "above-40k",
    },
];
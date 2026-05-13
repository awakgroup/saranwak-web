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
            { label: "Nugas", tag: "nugas" },
            { label: "Nge-date", tag: "nge-date" },
            { label: "Nongkrong", tag: "nongkrong" },
            { label: "Me-time", tag: "me-time" },
            { label: "Meeting", tag: "meeting" },
            { label: "WFC", tag: "wfc" },
            { label: "Live Musik", tag: "live-musik" },
        ],
    },
    {
        title: "Fasilitas",
        type: "facility",
        options: [
            { label: "AC", tag: "ac" },
            { label: "Musholla", tag: "musholla" },
            { label: "Toilet", tag: "toilet" },
            { label: "WiFi", tag: "wifi" },
            { label: "Colokan", tag: "colokan" },
            { label: "Outdoor", tag: "outdoor" },
            { label: "Indoor", tag: "indoor" },
            { label: "Indoor Smoking", tag: "indoor-smoking" },
            { label: "Photobox", tag: "photobox" },
            { label: "Board Game", tag: "board-game" },
        ],
    },
    {
        title: "Vibes",
        type: "vibe",
        options: [
            { label: "Rame", tag: "rame" },
            { label: "Tenang", tag: "tenang" },
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
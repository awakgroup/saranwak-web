export type PlaceTagFilter = {
    label: string;
    tag: string;
};

export type PlaceFilterGroup = {
    title: string;
    options: PlaceTagFilter[];
};

export const placeFilterGroups: PlaceFilterGroup[] = [
    {
        title: "Aktivitas",
        options: [
            { label: "Nugas", tag: "nugas" },
            { label: "Nongkrong", tag: "nongkrong" },
            { label: "Me Time", tag: "me-time" },
            { label: "First Date", tag: "first-date" },
        ],
    },
    {
        title: "Fasilitas",
        options: [
            { label: "WiFi", tag: "wifi" },
            { label: "Colokan", tag: "colokan" },
            { label: "AC", tag: "ac" },
            { label: "Musholla", tag: "musholla" },
            { label: "Toilet", tag: "toilet" },
            { label: "Outdoor", tag: "outdoor" },
            { label: "Indoor", tag: "indoor" },
        ],
    },
    {
        title: "Operasional",
        options: [{ label: "24 Jam", tag: "24-jam" }],
    },
    {
        title: "Vibe",
        options: [
            { label: "Aesthetic", tag: "aesthetic" },
            { label: "Cozy", tag: "cozy" },
            { label: "Tenang", tag: "tenang" },
            { label: "Rame", tag: "rame" },
            { label: "Minimalis", tag: "minimalis" },
            { label: "Industrial", tag: "industrial" },
            { label: "View Bagus", tag: "view-bagus" },
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
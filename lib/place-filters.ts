export const placeFilterGroups = [
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
            { label: "Outdoor", tag: "outdoor" },
            { label: "Indoor", tag: "indoor" },
        ],
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
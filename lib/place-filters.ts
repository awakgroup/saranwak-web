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
            { label: "Outdoor", tag: "outdoor" },
            { label: "Indoor", tag: "indoor" },
        ],
    },
    {
        title: "Budget & Waktu",
        options: [
            { label: "Budget Mahasiswa", tag: "budget-mahasiswa" },
            { label: "Buka Pagi", tag: "buka-pagi" },
            { label: "Buka Malam", tag: "buka-malam" },
            { label: "24 Jam", tag: "24-jam" },
        ],
    },
];

export const placeFilterOptions = placeFilterGroups.flatMap(
    (group) => group.options
);
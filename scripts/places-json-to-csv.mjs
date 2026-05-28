import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const inputPath = path.join(rootDir, "public", "data", "places.json");
const outputDir = path.join(rootDir, "exports");

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function safeString(value) {
    if (value === null || value === undefined) return "";

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
}

function csvEscape(value) {
    const text = safeString(value);

    if (
        text.includes(",") ||
        text.includes('"') ||
        text.includes("\n") ||
        text.includes("\r")
    ) {
        return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
}

function writeCsv(fileName, headers, rows) {
    const content = [
        headers.map(csvEscape).join(","),
        ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
    ].join("\n");

    fs.writeFileSync(path.join(outputDir, fileName), content, "utf8");
}

function getSingleCategory(category) {
    if (Array.isArray(category)) return category[0] ?? null;
    return category ?? null;
}

function getSingleTag(tag) {
    if (Array.isArray(tag)) return tag[0] ?? null;
    return tag ?? null;
}

const raw = fs.readFileSync(inputPath, "utf8");
const places = JSON.parse(raw);

if (!Array.isArray(places)) {
    throw new Error("public/data/places.json harus berupa array.");
}

const categoriesMap = new Map();
const tagsMap = new Map();

const placesRows = [];
const placeTagsRows = [];
const placePhotosRows = [];

for (const place of places) {
    const category = getSingleCategory(place.categories);

    if (category?.id) {
        categoriesMap.set(category.id, {
            id: category.id,
            name: category.name ?? "",
            slug: category.slug ?? "",
            icon: category.icon ?? "",
        });
    }

    placesRows.push({
        id: place.id ?? "",
        name: place.name ?? "",
        slug: place.slug ?? "",
        description: place.description ?? "",
        short_description: place.short_description ?? "",
        characteristics: JSON.stringify(place.characteristics ?? []),
        address: place.address ?? "",
        area: place.area ?? "",
        city: place.city ?? "",
        image_url: place.image_url ?? "",
        google_maps_url: place.google_maps_url ?? "",
        instagram_url: place.instagram_url ?? "",
        price_range: place.price_range ?? "",
        price_min: place.price_min ?? "",
        price_max: place.price_max ?? "",
        opening_hours: place.opening_hours ?? "",
        is_featured: Boolean(place.is_featured),
        is_verified: Boolean(place.is_verified),
        is_published: Boolean(place.is_published),
        category_id: category?.id ?? "",
        created_at: place.created_at ?? "",
        updated_at: place.updated_at ?? "",
    });

    const placeTags = Array.isArray(place.place_tags) ? place.place_tags : [];

    for (const relation of placeTags) {
        const tag = getSingleTag(relation.tags);

        if (!tag?.id) continue;

        tagsMap.set(tag.id, {
            id: tag.id,
            name: tag.name ?? "",
            slug: tag.slug ?? "",
            type: tag.type ?? "",
        });

        placeTagsRows.push({
            place_id: place.id ?? "",
            tag_id: tag.id,
        });
    }

    const photos = Array.isArray(place.place_photos) ? place.place_photos : [];

    for (const photo of photos) {
        if (!photo?.image_url) continue;

        placePhotosRows.push({
            id: photo.id ?? `${place.id}-photo-${placePhotosRows.length + 1}`,
            place_id: place.id ?? "",
            image_url: photo.image_url ?? "",
            caption: photo.caption ?? "",
            sort_order: photo.sort_order ?? "",
        });
    }
}

writeCsv(
    "places.csv",
    [
        "id",
        "name",
        "slug",
        "description",
        "short_description",
        "characteristics",
        "address",
        "area",
        "city",
        "image_url",
        "google_maps_url",
        "instagram_url",
        "price_range",
        "price_min",
        "price_max",
        "opening_hours",
        "is_featured",
        "is_verified",
        "is_published",
        "category_id",
        "created_at",
        "updated_at",
    ],
    placesRows
);

writeCsv(
    "categories.csv",
    ["id", "name", "slug", "icon"],
    Array.from(categoriesMap.values())
);

writeCsv(
    "tags.csv",
    ["id", "name", "slug", "type"],
    Array.from(tagsMap.values())
);

writeCsv(
    "place_tags.csv",
    ["place_id", "tag_id"],
    placeTagsRows
);

writeCsv(
    "place_photos.csv",
    ["id", "place_id", "image_url", "caption", "sort_order"],
    placePhotosRows
);

console.log("✅ CSV berhasil dibuat di folder exports:");
console.log("- exports/places.csv");
console.log("- exports/categories.csv");
console.log("- exports/tags.csv");
console.log("- exports/place_tags.csv");
console.log("- exports/place_photos.csv");
import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const inputDir = path.join(rootDir, "imports");
const outputPath = path.join(rootDir, "public", "data", "places.json");

const requiredFiles = [
    "places.csv",
    "categories.csv",
    "tags.csv",
    "place_tags.csv",
    "place_photos.csv",
];

function assertRequiredFiles() {
    for (const fileName of requiredFiles) {
        const filePath = path.join(inputDir, fileName);

        if (!fs.existsSync(filePath)) {
            throw new Error(`File wajib tidak ditemukan: imports/${fileName}`);
        }
    }
}

function parseCsv(content) {
    const rows = [];
    let currentRow = [];
    let currentValue = "";
    let insideQuotes = false;

    for (let index = 0; index < content.length; index += 1) {
        const char = content[index];
        const nextChar = content[index + 1];

        if (char === '"' && insideQuotes && nextChar === '"') {
            currentValue += '"';
            index += 1;
            continue;
        }

        if (char === '"') {
            insideQuotes = !insideQuotes;
            continue;
        }

        if (char === "," && !insideQuotes) {
            currentRow.push(currentValue);
            currentValue = "";
            continue;
        }

        if ((char === "\n" || char === "\r") && !insideQuotes) {
            if (char === "\r" && nextChar === "\n") {
                index += 1;
            }

            currentRow.push(currentValue);

            const hasContent = currentRow.some((item) => item.trim() !== "");

            if (hasContent) {
                rows.push(currentRow);
            }

            currentRow = [];
            currentValue = "";
            continue;
        }

        currentValue += char;
    }

    if (currentValue.length > 0 || currentRow.length > 0) {
        currentRow.push(currentValue);

        const hasContent = currentRow.some((item) => item.trim() !== "");

        if (hasContent) {
            rows.push(currentRow);
        }
    }

    if (rows.length === 0) return [];

    const headers = rows[0].map((header) => header.trim());

    return rows.slice(1).map((row) => {
        const item = {};

        headers.forEach((header, index) => {
            item[header] = row[index]?.trim() ?? "";
        });

        return item;
    });
}

function readCsv(fileName) {
    const filePath = path.join(inputDir, fileName);
    const content = fs.readFileSync(filePath, "utf8");

    return parseCsv(content);
}

function toBoolean(value) {
    const normalized = String(value ?? "").trim().toLowerCase();

    return ["true", "1", "yes", "y", "ya"].includes(normalized);
}

function toNumberOrNull(value) {
    const normalized = String(value ?? "").trim();

    if (!normalized) return null;

    const number = Number(normalized);

    return Number.isFinite(number) ? number : null;
}

function toStringOrNull(value) {
    const normalized = String(value ?? "").trim();

    return normalized || null;
}

function parseCharacteristics(value) {
    const normalized = String(value ?? "").trim();

    if (!normalized) return [];

    try {
        const parsed = JSON.parse(normalized);

        if (Array.isArray(parsed)) {
            return parsed;
        }

        return [];
    } catch {
        return normalized
            .split("|")
            .map((item) => item.trim())
            .filter(Boolean)
            .map((item) => ({
                title: item,
                description: "",
            }));
    }
}

function normalizeSlug(value) {
    return String(value ?? "")
        .toLowerCase()
        .trim()
        .replace(/_/g, "-")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
}

function makeIdFromSlugOrName({ id, slug, name }) {
    const cleanId = String(id ?? "").trim();

    if (cleanId) return cleanId;

    const cleanSlug = normalizeSlug(slug);

    if (cleanSlug) return cleanSlug;

    return normalizeSlug(name);
}

function validateUniqueIds(rows, label) {
    const seen = new Set();
    const duplicates = [];

    for (const row of rows) {
        if (!row.id) continue;

        if (seen.has(row.id)) {
            duplicates.push(row.id);
        }

        seen.add(row.id);
    }

    if (duplicates.length > 0) {
        throw new Error(
            `Duplicate id ditemukan di ${label}: ${Array.from(new Set(duplicates)).join(", ")}`
        );
    }
}

function main() {
    assertRequiredFiles();

    const placesRows = readCsv("places.csv");
    const categoriesRows = readCsv("categories.csv");
    const tagsRows = readCsv("tags.csv");
    const placeTagsRows = readCsv("place_tags.csv");
    const placePhotosRows = readCsv("place_photos.csv");

    const categories = categoriesRows.map((row) => ({
        id: makeIdFromSlugOrName(row),
        name: row.name || "",
        slug: normalizeSlug(row.slug || row.name || row.id),
        icon: row.icon || null,
    }));

    const tags = tagsRows.map((row) => ({
        id: makeIdFromSlugOrName(row),
        name: row.name || "",
        slug: normalizeSlug(row.slug || row.name || row.id),
        type: row.type || null,
    }));

    validateUniqueIds(categories, "categories.csv");
    validateUniqueIds(tags, "tags.csv");

    const categoryMap = new Map(categories.map((category) => [category.id, category]));
    const tagMap = new Map(tags.map((tag) => [tag.id, tag]));

    const places = placesRows.map((row) => {
        const placeId = makeIdFromSlugOrName(row);
        const categoryId = row.category_id || "";

        return {
            id: placeId,
            name: row.name || "",
            slug: normalizeSlug(row.slug || row.name || placeId),
            description: toStringOrNull(row.description),
            short_description: toStringOrNull(row.short_description),
            characteristics: parseCharacteristics(row.characteristics),
            address: toStringOrNull(row.address),
            area: toStringOrNull(row.area),
            city: toStringOrNull(row.city) || "Padang",
            image_url: toStringOrNull(row.image_url),
            main_image_url: toStringOrNull(row.image_url),
            google_maps_url: toStringOrNull(row.google_maps_url),
            instagram_url: toStringOrNull(row.instagram_url),
            price_range: toStringOrNull(row.price_range),
            price_min: toNumberOrNull(row.price_min),
            price_max: toNumberOrNull(row.price_max),
            opening_hours: toStringOrNull(row.opening_hours),
            is_featured: toBoolean(row.is_featured),
            is_verified: toBoolean(row.is_verified),
            is_published: toBoolean(row.is_published),
            created_at: toStringOrNull(row.created_at) || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            categories: categoryMap.get(categoryId) ?? null,
            place_tags: [],
            place_photos: [],
        };
    });

    validateUniqueIds(places, "places.csv");

    const placeMap = new Map(places.map((place) => [place.id, place]));

    let skippedPlaceTags = 0;
    let skippedPhotos = 0;

    for (const row of placeTagsRows) {
        const placeId = row.place_id || "";
        const tagId = row.tag_id || "";

        const place = placeMap.get(placeId);
        const tag = tagMap.get(tagId);

        if (!place || !tag) {
            skippedPlaceTags += 1;
            continue;
        }

        place.place_tags.push({
            id: `${placeId}-${tagId}`,
            tag_id: tagId,
            tags: tag,
        });
    }

    for (const row of placePhotosRows) {
        const placeId = row.place_id || "";
        const place = placeMap.get(placeId);

        if (!place || !row.image_url) {
            skippedPhotos += 1;
            continue;
        }

        place.place_photos.push({
            id:
                row.id ||
                `${placeId}-photo-${String(place.place_photos.length + 1).padStart(2, "0")}`,
            image_url: row.image_url,
            caption: toStringOrNull(row.caption),
            sort_order: toNumberOrNull(row.sort_order),
        });
    }

    for (const place of places) {
        place.place_photos.sort((a, b) => {
            const sortA = a.sort_order ?? 999;
            const sortB = b.sort_order ?? 999;

            return sortA - sortB;
        });
    }

    const publishedCount = places.filter((place) => place.is_published).length;

    fs.writeFileSync(outputPath, JSON.stringify(places, null, 2), "utf8");

    console.log("✅ public/data/places.json berhasil dibuat ulang.");
    console.log(`Total places: ${places.length}`);
    console.log(`Published places: ${publishedCount}`);
    console.log(`Categories: ${categories.length}`);
    console.log(`Tags: ${tags.length}`);
    console.log(`Place tag relations: ${placeTagsRows.length}`);
    console.log(`Photos: ${placePhotosRows.length}`);

    if (skippedPlaceTags > 0) {
        console.warn(`⚠️ Skipped place_tags karena place_id/tag_id tidak cocok: ${skippedPlaceTags}`);
    }

    if (skippedPhotos > 0) {
        console.warn(`⚠️ Skipped photos karena place_id/image_url kosong atau tidak cocok: ${skippedPhotos}`);
    }
}

main();
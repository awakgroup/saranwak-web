type Env = {
    DB: D1Database;
};

type PlaceRow = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    category_id: string | null;
    address: string | null;
    area: string | null;
    city: string | null;
    price_min: number | null;
    price_max: number | null;
    price_range: string | null;
    image_url: string | null;
    instagram_url: string | null;
    google_maps_url: string | null;
    whatsapp_url: string | null;
    website_url: string | null;
    opening_hours: string | null;
    is_featured: number;
    is_active: number;
    created_at: string;
    updated_at: string;
    category_name: string | null;
    category_slug: string | null;
};

type CategoryRow = {
    id: string;
    name: string;
    slug: string;
    created_at?: string | null;
    updated_at?: string | null;
};

type TagRow = {
    id: string;
    name: string;
    slug: string;
    type: string;
    created_at?: string | null;
    updated_at?: string | null;
};

type PlaceTagRow = {
    place_id: string;
    tag_id: string;
    id: string;
    name: string;
    slug: string;
    type: string;
};

type GalleryRow = {
    id: string;
    place_id: string;
    image_url: string;
    alt_text: string | null;
    sort_order: number | null;
    created_at: string | null;
};

type PlacePayload = {
    id?: string;
    name?: string;
    slug?: string;
    category_id?: string;
    description?: string | null;
    short_description?: string | null;
    characteristics?: unknown;
    address?: string | null;
    area?: string | null;
    city?: string | null;
    image_url?: string | null;
    google_maps_url?: string | null;
    instagram_url?: string | null;
    whatsapp_url?: string | null;
    website_url?: string | null;
    price_range?: string | null;
    price_min?: number | null;
    price_max?: number | null;
    opening_hours?: string | null;
    is_featured?: boolean | number;
    is_published?: boolean | number;
    is_active?: boolean | number;
    tag_ids?: string[];
    photo_urls?: string[];
};

type JsonResponseBody = {
    success: boolean;
    message?: string;
    categories?: CategoryRow[];
    tags?: TagRow[];
    places?: unknown[];
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const [categoriesResult, tagsResult, placesResult, galleriesResult] =
            await Promise.all([
                context.env.DB.prepare(
                    `
          SELECT id, name, slug, created_at, updated_at
          FROM categories
          ORDER BY name ASC
        `
                ).all<CategoryRow>(),

                context.env.DB.prepare(
                    `
          SELECT id, name, slug, type, created_at, updated_at
          FROM tags
          ORDER BY type ASC, name ASC
        `
                ).all<TagRow>(),

                context.env.DB.prepare(
                    `
          SELECT
            p.id,
            p.name,
            p.slug,
            p.description,
            p.short_description,
            p.category_id,
            p.address,
            p.area,
            p.city,
            p.price_min,
            p.price_max,
            p.price_range,
            p.image_url,
            p.instagram_url,
            p.google_maps_url,
            p.whatsapp_url,
            p.website_url,
            p.opening_hours,
            p.is_featured,
            p.is_active,
            p.created_at,
            p.updated_at,
            c.name AS category_name,
            c.slug AS category_slug
          FROM places p
          LEFT JOIN categories c ON c.id = p.category_id
          ORDER BY p.created_at DESC
        `
                ).all<PlaceRow>(),

                context.env.DB.prepare(
                    `
          SELECT id, place_id, image_url, alt_text, sort_order, created_at
          FROM galleries
          ORDER BY sort_order ASC, created_at ASC
        `
                ).all<GalleryRow>(),
            ]);

        const places = placesResult.results ?? [];
        const galleries = galleriesResult.results ?? [];

        const placeIds = places.map((place) => place.id);
        const placeTagsByPlaceId = await getPlaceTagsByPlaceId(
            context.env.DB,
            placeIds
        );

        const galleriesByPlaceId = new Map<string, GalleryRow[]>();

        for (const gallery of galleries) {
            const current = galleriesByPlaceId.get(gallery.place_id) ?? [];
            current.push(gallery);
            galleriesByPlaceId.set(gallery.place_id, current);
        }

        const mappedPlaces = places.map((place) => {
            const placeTags = placeTagsByPlaceId.get(place.id) ?? [];
            const placePhotos = galleriesByPlaceId.get(place.id) ?? [];

            return {
                ...place,

                is_featured: Boolean(place.is_featured),
                is_published: Boolean(place.is_active),
                is_active: Boolean(place.is_active),

                categories: place.category_id
                    ? {
                        id: place.category_id,
                        name: place.category_name,
                        slug: place.category_slug,
                    }
                    : null,

                tags: placeTags.map((item) => ({
                    id: item.id,
                    name: item.name,
                    slug: item.slug,
                    type: item.type,
                })),

                place_tags: placeTags.map((item) => ({
                    place_id: item.place_id,
                    tag_id: item.tag_id,
                    tags: {
                        id: item.id,
                        name: item.name,
                        slug: item.slug,
                        type: item.type,
                    },
                    tag: {
                        id: item.id,
                        name: item.name,
                        slug: item.slug,
                        type: item.type,
                    },
                })),

                place_photos: placePhotos.map((photo) => ({
                    id: photo.id,
                    place_id: photo.place_id,
                    image_url: photo.image_url,
                    alt_text: photo.alt_text,
                    sort_order: photo.sort_order ?? 0,
                    created_at: photo.created_at,
                })),

                galleries: placePhotos,
            };
        });

        return json({
            success: true,
            categories: categoriesResult.results ?? [],
            tags: tagsResult.results ?? [],
            places: mappedPlaces,
        });
    } catch (error) {
        console.error("GET /api/admin/places error:", error);

        return json(
            {
                success: false,
                message: "Gagal mengambil data CMS.",
            },
            500
        );
    }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const payload = await readJsonPayload(context.request);

        const validationError = validatePayload(payload);

        if (validationError) {
            return json(
                {
                    success: false,
                    message: validationError,
                },
                400
            );
        }

        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        const name = cleanString(payload.name);
        const slug = cleanString(payload.slug) || generateSlug(name);
        const categoryId = cleanString(payload.category_id);
        const isFeatured = toSqlBool(payload.is_featured);
        const isActive = toSqlBool(payload.is_published ?? payload.is_active ?? true);

        await context.env.DB
            .prepare(
                `
        INSERT INTO places (
          id,
          name,
          slug,
          description,
          short_description,
          category_id,
          address,
          area,
          city,
          price_min,
          price_max,
          price_range,
          image_url,
          instagram_url,
          google_maps_url,
          whatsapp_url,
          website_url,
          opening_hours,
          is_featured,
          is_active,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
            )
            .bind(
                id,
                name,
                slug,
                nullableString(payload.description),
                nullableString(payload.short_description),
                categoryId,
                nullableString(payload.address),
                nullableString(payload.area),
                cleanString(payload.city) || "Padang",
                nullableNumber(payload.price_min),
                nullableNumber(payload.price_max),
                nullableString(payload.price_range),
                nullableString(payload.image_url),
                nullableString(payload.instagram_url),
                nullableString(payload.google_maps_url),
                nullableString(payload.whatsapp_url),
                nullableString(payload.website_url),
                nullableString(payload.opening_hours),
                isFeatured,
                isActive,
                now,
                now
            )
            .run();

        await replacePlaceTags(context.env.DB, id, payload.tag_ids ?? []);
        await replaceGalleries(
            context.env.DB,
            id,
            payload.photo_urls ?? [],
            name
        );

        return json({
            success: true,
            message: "Tempat berhasil ditambahkan.",
        });
    } catch (error) {
        console.error("POST /api/admin/places error:", error);

        return json(
            {
                success: false,
                message:
                    error instanceof Error ? error.message : "Gagal menambahkan tempat.",
            },
            500
        );
    }
};

export const onRequestPatch: PagesFunction<Env> = async (context) => {
    try {
        const payload = await readJsonPayload(context.request);

        const id = cleanString(payload.id);

        if (!id) {
            return json(
                {
                    success: false,
                    message: "ID tempat wajib dikirim.",
                },
                400
            );
        }

        const validationError = validatePayload(payload);

        if (validationError) {
            return json(
                {
                    success: false,
                    message: validationError,
                },
                400
            );
        }

        const now = new Date().toISOString();

        const name = cleanString(payload.name);
        const slug = cleanString(payload.slug) || generateSlug(name);
        const categoryId = cleanString(payload.category_id);
        const isFeatured = toSqlBool(payload.is_featured);
        const isActive = toSqlBool(payload.is_published ?? payload.is_active ?? true);

        const existing = await context.env.DB
            .prepare("SELECT id FROM places WHERE id = ?")
            .bind(id)
            .first<{ id: string }>();

        if (!existing) {
            return json(
                {
                    success: false,
                    message: "Tempat tidak ditemukan.",
                },
                404
            );
        }

        await context.env.DB
            .prepare(
                `
        UPDATE places
        SET
          name = ?,
          slug = ?,
          description = ?,
          short_description = ?,
          category_id = ?,
          address = ?,
          area = ?,
          city = ?,
          price_min = ?,
          price_max = ?,
          price_range = ?,
          image_url = ?,
          instagram_url = ?,
          google_maps_url = ?,
          whatsapp_url = ?,
          website_url = ?,
          opening_hours = ?,
          is_featured = ?,
          is_active = ?,
          updated_at = ?
        WHERE id = ?
      `
            )
            .bind(
                name,
                slug,
                nullableString(payload.description),
                nullableString(payload.short_description),
                categoryId,
                nullableString(payload.address),
                nullableString(payload.area),
                cleanString(payload.city) || "Padang",
                nullableNumber(payload.price_min),
                nullableNumber(payload.price_max),
                nullableString(payload.price_range),
                nullableString(payload.image_url),
                nullableString(payload.instagram_url),
                nullableString(payload.google_maps_url),
                nullableString(payload.whatsapp_url),
                nullableString(payload.website_url),
                nullableString(payload.opening_hours),
                isFeatured,
                isActive,
                now,
                id
            )
            .run();

        await replacePlaceTags(context.env.DB, id, payload.tag_ids ?? []);
        await replaceGalleries(
            context.env.DB,
            id,
            payload.photo_urls ?? [],
            name
        );

        return json({
            success: true,
            message: "Tempat berhasil diperbarui.",
        });
    } catch (error) {
        console.error("PATCH /api/admin/places error:", error);

        return json(
            {
                success: false,
                message:
                    error instanceof Error ? error.message : "Gagal memperbarui tempat.",
            },
            500
        );
    }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
    try {
        const url = new URL(context.request.url);
        const id = cleanString(url.searchParams.get("id"));

        if (!id) {
            return json(
                {
                    success: false,
                    message: "ID tempat wajib dikirim.",
                },
                400
            );
        }

        const existing = await context.env.DB
            .prepare("SELECT id FROM places WHERE id = ?")
            .bind(id)
            .first<{ id: string }>();

        if (!existing) {
            return json(
                {
                    success: false,
                    message: "Tempat tidak ditemukan.",
                },
                404
            );
        }

        /**
         * Soft delete biar data tidak benar-benar hilang.
         * Public API hanya baca is_active = 1.
         */
        await context.env.DB
            .prepare(
                `
        UPDATE places
        SET is_active = 0, updated_at = ?
        WHERE id = ?
      `
            )
            .bind(new Date().toISOString(), id)
            .run();

        return json({
            success: true,
            message: "Tempat berhasil dinonaktifkan.",
        });
    } catch (error) {
        console.error("DELETE /api/admin/places error:", error);

        return json(
            {
                success: false,
                message:
                    error instanceof Error ? error.message : "Gagal menghapus tempat.",
            },
            500
        );
    }
};

async function getPlaceTagsByPlaceId(db: D1Database, placeIds: string[]) {
    const resultMap = new Map<string, PlaceTagRow[]>();

    if (placeIds.length === 0) {
        return resultMap;
    }

    const placeholders = placeIds.map(() => "?").join(",");

    const result = await db
        .prepare(
            `
      SELECT
        pt.place_id,
        pt.tag_id,
        t.id,
        t.name,
        t.slug,
        t.type
      FROM place_tags pt
      INNER JOIN tags t ON t.id = pt.tag_id
      WHERE pt.place_id IN (${placeholders})
      ORDER BY t.type ASC, t.name ASC
    `
        )
        .bind(...placeIds)
        .all<PlaceTagRow>();

    for (const item of result.results ?? []) {
        const current = resultMap.get(item.place_id) ?? [];
        current.push(item);
        resultMap.set(item.place_id, current);
    }

    return resultMap;
}

async function replacePlaceTags(
    db: D1Database,
    placeId: string,
    tagIds: string[]
) {
    await db.prepare("DELETE FROM place_tags WHERE place_id = ?").bind(placeId).run();

    const uniqueTagIds = Array.from(
        new Set(tagIds.map((tagId) => cleanString(tagId)).filter(Boolean))
    );

    for (const tagId of uniqueTagIds) {
        await db
            .prepare(
                `
        INSERT OR IGNORE INTO place_tags (place_id, tag_id)
        VALUES (?, ?)
      `
            )
            .bind(placeId, tagId)
            .run();
    }
}

async function replaceGalleries(
    db: D1Database,
    placeId: string,
    photoUrls: string[],
    placeName: string
) {
    await db.prepare("DELETE FROM galleries WHERE place_id = ?").bind(placeId).run();

    const urls = Array.from(
        new Set(photoUrls.map((url) => cleanString(url)).filter(Boolean))
    ).slice(0, 5);

    for (const [index, url] of urls.entries()) {
        await db
            .prepare(
                `
        INSERT INTO galleries (
          id,
          place_id,
          image_url,
          alt_text,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?)
      `
            )
            .bind(
                crypto.randomUUID(),
                placeId,
                url,
                `${placeName} photo ${index + 1}`,
                index
            )
            .run();
    }
}

async function readJsonPayload(request: Request): Promise<PlacePayload> {
    try {
        const body = (await request.json()) as PlacePayload;

        if (!body || typeof body !== "object") {
            throw new Error("Payload tidak valid.");
        }

        return body;
    } catch {
        throw new Error("Payload JSON tidak valid.");
    }
}

function validatePayload(payload: PlacePayload) {
    const name = cleanString(payload.name);
    const slug = cleanString(payload.slug) || generateSlug(name);
    const categoryId = cleanString(payload.category_id);

    if (!name) {
        return "Nama tempat wajib diisi.";
    }

    if (!slug) {
        return "Slug wajib diisi.";
    }

    if (!categoryId) {
        return "Kategori wajib dipilih.";
    }

    return "";
}

function cleanString(value: unknown) {
    return String(value ?? "").trim();
}

function nullableString(value: unknown) {
    const cleaned = cleanString(value);
    return cleaned ? cleaned : null;
}

function nullableNumber(value: unknown) {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return null;
    }

    return number;
}

function toSqlBool(value: unknown) {
    if (typeof value === "number") {
        return value ? 1 : 0;
    }

    if (typeof value === "boolean") {
        return value ? 1 : 0;
    }

    if (typeof value === "string") {
        return ["true", "1", "yes", "on"].includes(value.toLowerCase()) ? 1 : 0;
    }

    return 0;
}

function generateSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function json(body: JsonResponseBody, status = 200) {
    return Response.json(body, {
        status,
        headers: {
            "Cache-Control": "no-store",
        },
    });
}
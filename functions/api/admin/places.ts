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

type TagRow = {
    place_id: string;
    id: string;
    name: string;
    slug: string;
    type: string;
};

type ApiResponse = {
    success: boolean;
    data?: unknown;
    message?: string;
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const url = new URL(context.request.url);

        const search = url.searchParams.get("search")?.trim() ?? "";
        const featured = url.searchParams.get("featured");
        const rawLimit = Number(url.searchParams.get("limit") ?? "100");

        /**
         * Safety limit.
         * Jangan biarkan orang request limit besar dan bikin D1 kerja rodi.
         */
        const safeLimit = Math.min(
            Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 100,
            100
        );

        const conditions: string[] = ["p.is_active = 1"];
        const params: unknown[] = [];

        if (search) {
            conditions.push(
                `(
          p.name LIKE ?
          OR p.description LIKE ?
          OR p.short_description LIKE ?
          OR p.area LIKE ?
          OR p.address LIKE ?
          OR c.name LIKE ?
        )`
            );

            const keyword = `%${search}%`;
            params.push(keyword, keyword, keyword, keyword, keyword, keyword);
        }

        if (featured === "true") {
            conditions.push("p.is_featured = 1");
        }

        const placesQuery = `
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
      WHERE ${conditions.join(" AND ")}
      ORDER BY p.is_featured DESC, p.created_at DESC
      LIMIT ?
    `;

        params.push(safeLimit);

        const placesResult = await context.env.DB
            .prepare(placesQuery)
            .bind(...params)
            .all<PlaceRow>();

        const places = placesResult.results ?? [];

        if (places.length === 0) {
            return publicJson({
                success: true,
                data: [],
            });
        }

        const placeIds = places.map((place) => place.id);
        const tagsByPlaceId = await getTagsByPlaceId(context.env.DB, placeIds);

        const data = places.map((place) => {
            const tags = tagsByPlaceId.get(place.id) ?? [];

            return {
                ...place,

                /**
                 * Boolean adapter.
                 */
                is_featured: Boolean(place.is_featured),
                is_active: Boolean(place.is_active),
                is_published: Boolean(place.is_active),

                /**
                 * Legacy adapter.
                 */
                maps_url: place.google_maps_url,

                /**
                 * Category adapter.
                 */
                categories: place.category_id
                    ? {
                        id: place.category_id,
                        name: place.category_name,
                        slug: place.category_slug,
                    }
                    : null,

                /**
                 * Filter support.
                 */
                tags,

                /**
                 * Support format lama dan baru.
                 */
                place_tags: tags.map((tag) => ({
                    place_id: place.id,
                    tag_id: tag.id,
                    tags: tag,
                    tag,
                })),

                /**
                 * Fallback supaya komponen lama tidak crash.
                 */
                gallery: [],
                galleries: [],
            };
        });

        return publicJson({
            success: true,
            data,
        });
    } catch (error) {
        console.error("GET /api/places error:", error);

        return errorJson(
            {
                success: false,
                message: "Failed to fetch places",
            },
            500
        );
    }
};

async function getTagsByPlaceId(db: D1Database, placeIds: string[]) {
    const tagsByPlaceId = new Map<
        string,
        Array<{
            id: string;
            name: string;
            slug: string;
            type: string;
        }>
    >();

    if (placeIds.length === 0) {
        return tagsByPlaceId;
    }

    const placeholders = placeIds.map(() => "?").join(",");

    const tagsResult = await db
        .prepare(
            `
      SELECT
        pt.place_id,
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
        .all<TagRow>();

    for (const tag of tagsResult.results ?? []) {
        const currentTags = tagsByPlaceId.get(tag.place_id) ?? [];

        currentTags.push({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            type: tag.type,
        });

        tagsByPlaceId.set(tag.place_id, currentTags);
    }

    return tagsByPlaceId;
}

function publicJson(body: ApiResponse, status = 200) {
    return Response.json(body, {
        status,
        headers: {
            /**
             * Browser cache: 60 detik
             * Edge/CDN cache: 5 menit
             * Kalau cache stale, masih boleh dipakai sambil refresh background.
             */
            "Cache-Control":
                "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
        },
    });
}

function errorJson(body: ApiResponse, status = 500) {
    return Response.json(body, {
        status,
        headers: {
            /**
             * Error jangan di-cache. Kalau error di-cache, nanti debugging jadi horor.
             */
            "Cache-Control": "no-store",
        },
    });
}
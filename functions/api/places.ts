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

export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const url = new URL(context.request.url);

        const search = url.searchParams.get("search")?.trim() ?? "";
        const featured = url.searchParams.get("featured");
        const limit = Number(url.searchParams.get("limit") ?? "100");

        const conditions: string[] = ["p.is_active = 1"];
        const params: unknown[] = [];

        if (search) {
            conditions.push(
                `(p.name LIKE ? 
          OR p.description LIKE ? 
          OR p.short_description LIKE ? 
          OR p.area LIKE ? 
          OR p.address LIKE ?)`
            );

            const keyword = `%${search}%`;
            params.push(keyword, keyword, keyword, keyword, keyword);
        }

        if (featured === "true") {
            conditions.push("p.is_featured = 1");
        }

        const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 100;

        const query = `
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
      ORDER BY p.is_featured DESC, p.name ASC
      LIMIT ?
    `;

        params.push(safeLimit);

        const result = await context.env.DB
            .prepare(query)
            .bind(...params)
            .all<PlaceRow>();

        return Response.json({
            success: true,
            data: result.results ?? [],
        });
    } catch (error) {
        console.error("GET /api/places error:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to fetch places",
            },
            { status: 500 }
        );
    }
};
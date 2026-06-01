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
    id: string;
    name: string;
    slug: string;
    type: string;
};

type GalleryRow = {
    id: string;
    image_url: string;
    alt_text: string | null;
    sort_order: number;
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const slug = context.params.slug;

        if (!slug || typeof slug !== "string") {
            return Response.json(
                {
                    success: false,
                    message: "Slug is required",
                },
                { status: 400 }
            );
        }

        const place = await context.env.DB
            .prepare(
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
        WHERE p.slug = ? AND p.is_active = 1
        LIMIT 1
      `
            )
            .bind(slug)
            .first<PlaceRow>();

        if (!place) {
            return Response.json(
                {
                    success: false,
                    message: "Place not found",
                },
                { status: 404 }
            );
        }

        const tags = await context.env.DB
            .prepare(
                `
        SELECT 
          t.id,
          t.name,
          t.slug,
          t.type
        FROM tags t
        INNER JOIN place_tags pt ON pt.tag_id = t.id
        WHERE pt.place_id = ?
        ORDER BY t.type ASC, t.name ASC
      `
            )
            .bind(place.id)
            .all<TagRow>();

        const galleries = await context.env.DB
            .prepare(
                `
        SELECT 
          id,
          image_url,
          alt_text,
          sort_order
        FROM galleries
        WHERE place_id = ?
        ORDER BY sort_order ASC, created_at ASC
      `
            )
            .bind(place.id)
            .all<GalleryRow>();

        return Response.json({
            success: true,
            data: {
                ...place,
                tags: tags.results ?? [],
                galleries: galleries.results ?? [],
            },
        });
    } catch (error) {
        console.error("GET /api/places/[slug] error:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to fetch place detail",
            },
            { status: 500 }
        );
    }
};
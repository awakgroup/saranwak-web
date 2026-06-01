import type { Place } from "@/types/database";

export type ApiTag = {
    id: string;
    name: string;
    slug: string;
    type: string;
};

export type ApiCategory = {
    id: string;
    name: string | null;
    slug: string | null;
};

export type ApiGallery = {
    id: string;
    image_url: string;
    alt_text: string | null;
    sort_order: number;
};

export type ApiPlace = {
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

    tags?: ApiTag[];
    categories?: ApiCategory | null;
    place_tags?: Array<{
        place_id: string;
        tag_id: string;
        tags: ApiTag;
    }>;
};

export type ApiPlaceDetail = ApiPlace & {
    galleries?: ApiGallery[];
};

type ApiResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
};

function getBaseUrl() {
    if (typeof window !== "undefined") return "";

    return process.env.NEXT_PUBLIC_SITE_URL || "https://saranwak.com";
}

export async function getPlaces(params?: {
    search?: string;
    featured?: boolean;
    limit?: number;
}) {
    const searchParams = new URLSearchParams();

    if (params?.search) searchParams.set("search", params.search);
    if (params?.featured) searchParams.set("featured", "true");
    if (params?.limit) searchParams.set("limit", String(params.limit));

    const queryString = searchParams.toString();

    const response = await fetch(
        `${getBaseUrl()}/api/places${queryString ? `?${queryString}` : ""}`,
        {
            next: {
                revalidate: 300,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch places");
    }

    const json = (await response.json()) as ApiResponse<ApiPlace[]>;

    return json.data;
}

export async function getFeaturedPlaces(limit = 6) {
    return getPlaces({
        featured: true,
        limit,
    });
}

export async function getPlaceBySlug(slug: string) {
    const response = await fetch(`${getBaseUrl()}/api/places/${slug}`, {
        next: {
            revalidate: 300,
        },
    });

    if (!response.ok) {
        return null;
    }

    const json = (await response.json()) as ApiResponse<ApiPlaceDetail>;

    return json.data;
}

export function mapApiPlaceToLegacyPlace(place: ApiPlace): Place {
    const tags = place.tags ?? [];

    return {
        ...place,

        maps_url: place.google_maps_url,
        is_published: Boolean(place.is_active),
        is_featured: Boolean(place.is_featured),

        categories:
            place.categories ??
            (place.category_id
                ? {
                    id: place.category_id,
                    name: place.category_name,
                    slug: place.category_slug,
                }
                : null),

        tags,

        place_tags:
            place.place_tags ??
            tags.map((tag) => ({
                place_id: place.id,
                tag_id: tag.id,
                tags: tag,
            })),

        gallery: [],
        galleries: [],
    } as unknown as Place;
}
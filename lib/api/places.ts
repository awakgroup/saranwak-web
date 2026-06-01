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
};

export type ApiTag = {
    id: string;
    name: string;
    slug: string;
    type: string;
};

export type ApiGallery = {
    id: string;
    image_url: string;
    alt_text: string | null;
    sort_order: number;
};

export type ApiPlaceDetail = ApiPlace & {
    tags: ApiTag[];
    galleries: ApiGallery[];
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
export type Category = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string | null;
};

export type Tag = {
    id: string;
    name: string;
    slug: string;
    type: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string | null;
};

export type PlaceTag = {
    id: string;
    place_id: string;
    tag_id: string;
    created_at: string;
    tags?: Tag | null;
};

export type Place = {
    id: string;
    name: string;
    slug: string;

    description?: string | null;
    short_description?: string | null;

    address?: string | null;
    area?: string | null;
    city?: string | null;

    image_url?: string | null;
    main_image_url?: string | null;

    google_maps_url?: string | null;
    instagram_url?: string | null;

    price_range?: string | null;
    price_min?: number | null;
    price_max?: number | null;

    opening_hours?: string | null;

    is_featured?: boolean | null;
    is_verified?: boolean | null;
    is_published?: boolean | null;

    categories?: {
        id: string;
        name: string;
        slug: string;
    } | null;

    place_tags?: {
        tag_id?: string | null;
        tags?: {
            id: string;
            name: string;
            slug: string;
            type?: string | null;
        } | null;
    }[];
};
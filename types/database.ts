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
    description?: string | null;
    is_active?: boolean;
    sort_order?: number;
    created_at?: string;
    updated_at?: string | null;
};

export type PlaceTag = {
    id: string;
    place_id?: string;
    tag_id?: string;
    created_at?: string;
    tags?: Tag | null;
};

export type Place = {
    id: string;
    category_id: string | null;
    name: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    address: string | null;
    area: string | null;
    city: string | null;
    province: string | null;
    latitude: number | null;
    longitude: number | null;
    google_maps_url: string | null;
    instagram_url: string | null;
    tiktok_url: string | null;
    website_url: string | null;
    phone: string | null;
    whatsapp_number: string | null;
    opening_hours: string | null;
    price_min: number | null;
    price_max: number | null;
    main_image_url: string | null;
    vibe: string | null;
    is_featured: boolean;
    is_published: boolean;
    is_verified: boolean;
    view_count: number;
    maps_click_count: number;
    instagram_click_count: number;
    whatsapp_click_count: number;
    created_at: string;
    updated_at: string | null;

    categories?: Category | null;
    place_tags?: PlaceTag[];
};
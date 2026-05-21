export type Category = {
    id: string;
    name: string;
    slug: string;
};

export type Tag = {
    id: string;
    name: string;
    slug: string;
    type: string;
};

export type Characteristic = {
    title: string;
    description: string;
};

export type AdminPlace = {
    id: string;
    category_id: string | null;
    name: string;
    slug: string;
    description: string | null;
    characteristics: (string | Characteristic)[] | null;
    address: string | null;
    area: string | null;
    city: string | null;
    image_url: string | null;
    google_maps_url: string | null;
    instagram_url: string | null;
    price_range: string | null;
    price_min: number | null;
    price_max: number | null;
    opening_hours: string | null;
    is_featured: boolean;
    is_published: boolean;
    created_at: string;
    categories?:
    | {
        id: string;
        name: string;
        slug: string;
    }
    | {
        id: string;
        name: string;
        slug: string;
    }[]
    | null;
    place_tags?: {
        tag_id: string;
        tags?: Tag | Tag[] | null;
    }[];
    place_photos?: {
        id: string;
        image_url: string;
        caption?: string | null;
        sort_order?: number | null;
    }[];
};

export type FormState = {
    id: string;
    name: string;
    slug: string;
    category_id: string;
    description: string;
    characteristics: Characteristic[];
    address: string;
    area: string;
    city: string;
    image_url: string;
    google_maps_url: string;
    instagram_url: string;
    price_range: string;
    price_min_input: string;
    price_max_input: string;
    opening_hours: string;
    open_time: string;
    close_time: string;
    is_24_hours: boolean;
    photo_urls: string[];
    is_featured: boolean;
    is_published: boolean;
    tag_ids: string[];
};

export type AdminTab = "places" | "analytics";

export type AnalyticsPeriod = {
    period: string;
    start: string;
    end: string;
    label: string;
};

export type AnalyticsSummary = {
    total_events: number;
    detail_views: number;
    maps_clicks: number;
    instagram_clicks: number;
    whatsapp_clicks: number;
    card_clicks: number;
    action_clicks?: number;
    action_click_rate?: number;
    maps_click_rate?: number;
    instagram_click_rate?: number;
    whatsapp_click_rate?: number;
    card_to_detail_rate?: number;
};

export type TopPlaceAnalytics = {
    place_id: string | null;
    place_name: string;
    place_slug: string;
    detail_views: number;
    maps_clicks: number;
    instagram_clicks: number;
    whatsapp_clicks: number;
    card_clicks: number;
    action_clicks?: number;
    action_click_rate?: number;
    maps_click_rate?: number;
    instagram_click_rate?: number;
    total_events: number;
    last_event_at: string | null;
};

export type RecentAnalyticsEvent = {
    id: string;
    event_name: string;
    place_id: string | null;
    place_name: string | null;
    place_slug: string | null;
    source: string | null;
    page_path: string | null;
    referrer: string | null;
    metadata: Record<string, unknown> | null;
    session_id: string | null;
    created_at: string;

    country?: string | null;
    region?: string | null;
    city?: string | null;
    timezone?: string | null;
    device_type?: string | null;
    os?: string | null;
    browser?: string | null;
    screen_width?: number | null;
    screen_height?: number | null;
};

export type SimpleStat = {
    label: string;
    total: number;
    percentage: number;
};

export type CityStat = {
    city: string;
    region: string;
    country: string;
    total: number;
    percentage: number;
};

export type AnalyticsResponse = {
    period: AnalyticsPeriod;
    summary: AnalyticsSummary;
    top_places: TopPlaceAnalytics[];
    recent_events: RecentAnalyticsEvent[];
    device_stats?: SimpleStat[];
    city_stats?: CityStat[];
    browser_stats?: SimpleStat[];
    os_stats?: SimpleStat[];
};

export type PeriodType = "daily" | "weekly" | "monthly" | "yearly" | "custom";
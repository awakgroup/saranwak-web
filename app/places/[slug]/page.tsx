import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import { GallerySlider } from "@/components/GallerySlider";
import { PlaceCard } from "@/components/PlaceCard";
import { PlaceDetailTracker } from "@/components/PlaceDetailTracker";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import type { Place } from "@/types/database";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const siteUrl = "https://saranwak.com";

type Category = {
    id: string;
    name: string;
    slug: string;
};

type Tag = {
    id: string;
    name: string;
    slug: string;
    type: string | null;
};

type Characteristic = {
    title: string;
    description: string;
};

type PlaceTagRelation = {
    tag_id: string;
    tags: Tag | Tag[] | null;
};

type PlacePhoto = {
    id: string;
    image_url: string;
    caption?: string | null;
    sort_order?: number | null;
};

type PlaceDetail = {
    id: string;
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
    opening_hours: string | null;
    is_published: boolean;
    categories: Category | Category[] | null;
    place_tags: PlaceTagRelation[] | null;
    place_photos: PlacePhoto[] | null;
};

type PlaceDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

function getSingleCategory(category: Category | Category[] | null) {
    if (Array.isArray(category)) {
        return category[0] ?? null;
    }

    return category;
}

function getSingleTag(tag: Tag | Tag[] | null) {
    if (Array.isArray(tag)) {
        return tag[0] ?? null;
    }

    return tag;
}

function groupTagsByType(tags: Tag[]) {
    return tags.reduce<Record<string, Tag[]>>((result, tag) => {
        const type = tag.type || "other";

        if (!result[type]) {
            result[type] = [];
        }

        result[type].push(tag);

        return result;
    }, {});
}

function getTagGroupLabel(type: string) {
    const labels: Record<string, string> = {
        activity: "Aktivitas",
        mood: "Aktivitas",
        facility: "Fasilitas",
        vibe: "Vibes",
        ambience: "Vibes",
        time: "Operasional",
        budget: "Budget",
        other: "Info Lainnya",
    };

    return labels[type] || "Info Lainnya";
}

function getTagGroupDescription(type: string) {
    const descriptions: Record<string, string> = {
        activity: "Aktivitas yang paling cocok dilakukan di tempat ini.",
        mood: "Aktivitas yang paling cocok dilakukan di tempat ini.",
        facility: "Fasilitas yang bisa kamu manfaatkan saat datang ke tempat ini.",
        vibe: "Suasana utama yang ditawarkan tempat ini.",
        ambience: "Suasana utama yang ditawarkan tempat ini.",
        time: "Informasi operasional yang penting untuk kamu cek.",
        budget: "Gambaran budget atau segmentasi harga.",
        other: "Informasi tambahan dari tempat ini.",
    };

    return descriptions[type] || "Informasi tambahan dari tempat ini.";
}

function cleanDescription(value?: string | null) {
    if (!value) return "";

    return value.replace(/\s+/g, " ").trim();
}

function getPlaceCharacteristics(value?: (string | Characteristic)[] | null) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => {
            if (typeof item === "string") {
                const cleanTitle = item.trim();

                if (!cleanTitle) return null;

                return {
                    title: cleanTitle,
                    description: "",
                };
            }

            if (!item || typeof item !== "object") {
                return null;
            }

            const title = String(item.title ?? "").trim();
            const description = String(item.description ?? "").trim();

            if (!title && !description) {
                return null;
            }

            return {
                title,
                description,
            };
        })
        .filter((item): item is Characteristic => Boolean(item));
}

function makeSeoDescription(place: PlaceDetail, tags: Tag[] = []) {
    const description = cleanDescription(place.description);

    const tagNames = tags
        .map((tag) => tag.name)
        .filter(Boolean)
        .slice(0, 4)
        .join(", ");

    const locationText = [place.area, place.city || "Padang"]
        .filter(Boolean)
        .join(", ");

    const generatedDescription = `${place.name} adalah coffee shop di ${locationText || "Padang"
        }${place.price_range ? ` dengan range harga ${place.price_range}` : ""
        }. Cek alamat, jam buka, foto, Google Maps, Instagram${tagNames ? `, dan cocok untuk ${tagNames}` : ""
        } di Saranwak.`;

    const finalDescription = description || generatedDescription;

    return finalDescription.length > 155
        ? `${finalDescription.slice(0, 152)}...`
        : finalDescription;
}

function getTagsByType(tags: Tag[], type: string) {
    return tags.filter((tag) => tag.type === type);
}

function getTagNamesByType(tags: Tag[], type: string) {
    return getTagsByType(tags, type).map((tag) => tag.name);
}

function getActivityTagNames(tags: Tag[]) {
    return [
        ...getTagNamesByType(tags, "activity"),
        ...getTagNamesByType(tags, "mood"),
    ];
}

function getVibeTagNames(tags: Tag[]) {
    return [
        ...getTagNamesByType(tags, "vibe"),
        ...getTagNamesByType(tags, "ambience"),
    ];
}

const tagGroupOrder = [
    "activity",
    "mood",
    "facility",
    "vibe",
    "ambience",
    "time",
    "budget",
    "other",
];

function sortTagGroups(entries: [string, Tag[]][]) {
    return entries.sort(([typeA], [typeB]) => {
        const indexA = tagGroupOrder.indexOf(typeA);
        const indexB = tagGroupOrder.indexOf(typeB);

        const normalizedA = indexA === -1 ? tagGroupOrder.length : indexA;
        const normalizedB = indexB === -1 ? tagGroupOrder.length : indexB;

        if (normalizedA !== normalizedB) {
            return normalizedA - normalizedB;
        }

        return typeA.localeCompare(typeB);
    });
}

function makeQuickSummary(place: PlaceDetail, tags: Tag[]) {
    const activityTags = getActivityTagNames(tags);
    const facilityTags = getTagNamesByType(tags, "facility");
    const vibeTags = getVibeTagNames(tags);

    const locationText = [place.area, place.city || "Padang"]
        .filter(Boolean)
        .join(", ");

    const priceText = place.price_range
        ? `dengan range harga ${place.price_range}`
        : "dengan info harga yang bisa kamu cek sebelum datang";

    const openingText = place.opening_hours
        ? `Jam bukanya ${place.opening_hours}`
        : "Jam buka belum tersedia, jadi sebaiknya cek Google Maps atau Instagram sebelum datang";

    const activityText =
        activityTags.length > 0
            ? `Cocok buat ${activityTags.slice(0, 3).join(", ").toLowerCase()}`
            : "Cocok buat kamu yang lagi cari coffee shop di Padang";

    const facilityText =
        facilityTags.length > 0
            ? `Fasilitas yang bisa jadi nilai plus: ${facilityTags
                .slice(0, 4)
                .join(", ")}.`
            : "";

    const vibeText =
        vibeTags.length > 0
            ? `Vibe tempat ini cenderung ${vibeTags
                .slice(0, 3)
                .join(", ")
                .toLowerCase()}.`
            : "";

    return `${place.name} adalah coffee shop di ${locationText || "Padang"
        } ${priceText}. ${openingText}. ${activityText}. ${facilityText} ${vibeText}`
        .replace(/\s+/g, " ")
        .trim();
}

function getPrimaryReasons(place: PlaceDetail, tags: Tag[]) {
    const reasons: string[] = [];

    if (place.price_range) {
        reasons.push(`Harga ${place.price_range}`);
    }

    if (place.opening_hours) {
        reasons.push(place.opening_hours);
    }

    const activityTags = getActivityTagNames(tags);
    const facilityTags = getTagNamesByType(tags, "facility");
    const vibeTags = getVibeTagNames(tags);

    reasons.push(...activityTags.slice(0, 2));
    reasons.push(...facilityTags.slice(0, 2));
    reasons.push(...vibeTags.slice(0, 2));

    return Array.from(new Set(reasons)).slice(0, 6);
}

async function getPlaceBySlug(slug: string): Promise<PlaceDetail | null> {
    const { data, error } = await supabase
        .from("places")
        .select(
            `
      id,
      name,
      slug,
      description,
      characteristics,
      address,
      area,
      city,
      image_url,
      google_maps_url,
      instagram_url,
      price_range,
      opening_hours,
      is_published,
      categories (
        id,
        name,
        slug
      ),
      place_tags (
        tag_id,
        tags (
          id,
          name,
          slug,
          type
        )
      ),
      place_photos (
        id,
        image_url,
        caption,
        sort_order
      )
    `
        )
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (error || !data) {
        return null;
    }

    return data as unknown as PlaceDetail;
}

async function getRelatedPlaces(currentPlaceId: string): Promise<Place[]> {
    const { data, error } = await supabase
        .from("places")
        .select(
            `
      id,
      category_id,
      name,
      slug,
      description,
      short_description,
      address,
      area,
      city,
      image_url,
      main_image_url,
      price_min,
      price_max,
      price_range,
      opening_hours,
      is_featured,
      is_verified,
      is_published,
      categories!inner (
        id,
        name,
        slug
      ),
      place_tags (
        tag_id,
        tags (
          id,
          name,
          slug,
          type
        )
      )
    `
        )
        .eq("is_published", true)
        .eq("categories.slug", "coffee-shop")
        .neq("id", currentPlaceId)
        .order("created_at", { ascending: false })
        .limit(3);

    if (error || !data) {
        console.error("GET related places error:", error);
        return [];
    }

    return data as unknown as Place[];
}

export async function generateMetadata({
    params,
}: PlaceDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const place = await getPlaceBySlug(slug);

    if (!place) {
        return {
            title: "Tempat tidak ditemukan",
            description: "Tempat yang kamu cari tidak ditemukan di Saranwak.",
            alternates: {
                canonical: `${siteUrl}/places?category=coffee-shop`,
            },
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const tags =
        place.place_tags
            ?.map((item) => getSingleTag(item.tags))
            .filter((tag): tag is Tag => Boolean(tag)) ?? [];

    const locationTitle = place.area
        ? `${place.area}, ${place.city || "Padang"}`
        : place.city || "Padang";

    const title = `${place.name} - Coffee Shop di ${locationTitle}`;
    const description = makeSeoDescription(place, tags);
    const imageUrl = getSafePlaceImageUrl(place.image_url);
    const pageUrl = `${siteUrl}/places/${place.slug}`;

    const tagKeywords = tags
        .map((tag) => tag.name)
        .filter(Boolean)
        .slice(0, 8);

    return {
        title,
        description,
        keywords: [
            place.name,
            `${place.name} Padang`,
            `${place.name} ${locationTitle}`,
            `coffee shop ${locationTitle}`,
            `cafe ${locationTitle}`,
            "coffee shop Padang",
            "cafe Padang",
            "tempat nongkrong Padang",
            "tempat nugas Padang",
            ...tagKeywords,
        ],
        alternates: {
            canonical: pageUrl,
        },
        openGraph: {
            title,
            description,
            url: pageUrl,
            siteName: "Saranwak",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: `${place.name} coffee shop di ${locationTitle}`,
                },
            ],
            locale: "id_ID",
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
                "max-video-preview": -1,
            },
        },
    };
}

export default async function PlaceDetailPage({
    params,
}: PlaceDetailPageProps) {
    const { slug } = await params;

    const place = await getPlaceBySlug(slug);

    if (!place) {
        notFound();
    }

    const relatedPlaces = await getRelatedPlaces(place.id);
    const category = getSingleCategory(place.categories);

    const tags =
        place.place_tags
            ?.map((item) => getSingleTag(item.tags))
            .filter((tag): tag is Tag => Boolean(tag)) ?? [];

    const groupedTags = groupTagsByType(tags);
    const characteristics = getPlaceCharacteristics(place.characteristics);

    const galleryPhotos =
        place.place_photos
            ?.slice()
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) ?? [];

    const heroImageUrl = getSafePlaceImageUrl(place.image_url);
    const pageUrl = `${siteUrl}/places/${place.slug}`;
    const quickSummary = makeQuickSummary(place, tags);
    const primaryReasons = getPrimaryReasons(place, tags);
    const shareText = `Cek ${place.name} di Saranwak: ${pageUrl}`;
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
        shareText
    )}`;

    const locationTitle = place.area
        ? `${place.area}, ${place.city || "Padang"}`
        : place.city || "Padang";

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CafeOrCoffeeShop",
                "@id": `${pageUrl}#place`,
                name: place.name,
                description: makeSeoDescription(place, tags),
                image: heroImageUrl,
                url: pageUrl,
                address: {
                    "@type": "PostalAddress",
                    streetAddress: place.address || undefined,
                    addressLocality: place.city || "Padang",
                    addressRegion: "Sumatera Barat",
                    addressCountry: "ID",
                },
                areaServed: locationTitle,
                priceRange: place.price_range || undefined,
                openingHours: place.opening_hours || undefined,
                sameAs: place.instagram_url ? [place.instagram_url] : undefined,
                servesCuisine: "Coffee",
                publicAccess: true,
                isAccessibleForFree: true,
                mainEntityOfPage: {
                    "@type": "WebPage",
                    "@id": pageUrl,
                },
            },
            {
                "@type": "WebPage",
                "@id": pageUrl,
                url: pageUrl,
                name: `${place.name} - Coffee Shop di ${locationTitle}`,
                description: makeSeoDescription(place, tags),
                isPartOf: {
                    "@type": "WebSite",
                    "@id": `${siteUrl}#website`,
                    name: "Saranwak",
                    url: siteUrl,
                },
                primaryImageOfPage: {
                    "@type": "ImageObject",
                    url: heroImageUrl,
                },
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${pageUrl}#breadcrumb`,
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: siteUrl,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Coffee Shop Padang",
                        item: `${siteUrl}/places?category=coffee-shop`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: place.name,
                        item: pageUrl,
                    },
                ],
            },
        ],
    };

    return (
        <main className="min-h-screen bg-[#F4F1EA] px-4 pb-12 pt-5 text-[#201813] sm:px-5 sm:pb-16 sm:pt-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd),
                }}
            />

            <PlaceDetailTracker
                placeId={place.id}
                placeName={place.name}
                placeSlug={place.slug}
                area={place.area}
                city={place.city}
            />

            <section className="mx-auto max-w-6xl">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href="/places?category=coffee-shop"
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-4 py-2 text-sm font-black text-[#201813] shadow-sm transition hover:-translate-y-0.5 hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
                    >
                        ← Kembali ke Explore
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#181818] px-4 py-2 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1F5A4A]"
                    >
                        Home
                    </Link>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] shadow-[0_24px_80px_rgba(47,35,25,0.10)] sm:rounded-[38px]">
                    <div className="relative">
                        <div className="relative h-[260px] bg-[#181818] sm:h-[320px] lg:h-[520px]">
                            <img
                                src={heroImageUrl}
                                alt={`${place.name} coffee shop di ${place.area || "Padang"}`}
                                className="h-full w-full object-cover object-center"
                                referrerPolicy="no-referrer"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/28 to-black/5" />

                            <div className="absolute bottom-0 left-0 right-0 hidden p-7 lg:block lg:p-9">
                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-full border border-white/15 bg-white/15 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white backdrop-blur">
                                        {category?.name ?? "Tempat"}
                                    </span>

                                    {place.area ? (
                                        <span className="rounded-full border border-white/15 bg-white/15 px-3 py-2 text-[11px] font-black text-white backdrop-blur">
                                            {place.area}
                                        </span>
                                    ) : null}

                                    {place.price_range ? (
                                        <span className="rounded-full border border-white/15 bg-white/15 px-3 py-2 text-[11px] font-black text-white backdrop-blur">
                                            {place.price_range}
                                        </span>
                                    ) : null}
                                </div>

                                <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.055em] text-white lg:text-7xl">
                                    {place.name}
                                </h1>

                                <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-white/76">
                                    {quickSummary}
                                </p>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    {place.google_maps_url ? (
                                        <TrackedExternalLink
                                            href={place.google_maps_url}
                                            eventName="google_maps_clicked"
                                            placeId={place.id}
                                            placeName={place.name}
                                            placeSlug={place.slug}
                                            source="detail_page_hero"
                                            metadata={{
                                                area: place.area,
                                                city: place.city,
                                                category: category?.slug ?? null,
                                            }}
                                            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#F2C38B] px-5 py-3 text-sm font-black text-[#181818] transition hover:-translate-y-0.5 hover:bg-white"
                                        >
                                            Buka Maps
                                        </TrackedExternalLink>
                                    ) : null}

                                    {place.instagram_url ? (
                                        <TrackedExternalLink
                                            href={place.instagram_url}
                                            eventName="instagram_clicked"
                                            placeId={place.id}
                                            placeName={place.name}
                                            placeSlug={place.slug}
                                            source="detail_page_hero"
                                            metadata={{
                                                area: place.area,
                                                city: place.city,
                                                category: category?.slug ?? null,
                                            }}
                                            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-[#181818]"
                                        >
                                            Instagram
                                        </TrackedExternalLink>
                                    ) : null}

                                    <a
                                        href={whatsappShareUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-[#181818]"
                                    >
                                        Share
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="block bg-[#FFFDF8] p-5 lg:hidden">
                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full border border-[#E7D8C8] bg-[#F8F1E8] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#C8784A]">
                                    {category?.name ?? "Tempat"}
                                </span>

                                {place.area ? (
                                    <span className="rounded-full border border-[#E7D8C8] bg-[#F8F1E8] px-3 py-2 text-[10px] font-black text-[#4B4038]">
                                        {place.area}
                                    </span>
                                ) : null}

                                {place.price_range ? (
                                    <span className="rounded-full border border-[#E7D8C8] bg-[#F8F1E8] px-3 py-2 text-[10px] font-black text-[#4B4038]">
                                        {place.price_range}
                                    </span>
                                ) : null}
                            </div>

                            <h1 className="mt-4 break-words text-[30px] font-black leading-[1] tracking-[-0.05em] text-[#201813] sm:text-4xl">
                                {place.name}
                            </h1>

                            <p className="mt-4 text-sm font-semibold leading-7 text-[#756A60]">
                                {quickSummary}
                            </p>

                            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {place.google_maps_url ? (
                                    <TrackedExternalLink
                                        href={place.google_maps_url}
                                        eventName="google_maps_clicked"
                                        placeId={place.id}
                                        placeName={place.name}
                                        placeSlug={place.slug}
                                        source="detail_page_mobile_hero"
                                        metadata={{
                                            area: place.area,
                                            city: place.city,
                                            category: category?.slug ?? null,
                                        }}
                                        className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#181818] px-4 py-3 text-center text-sm font-black text-white transition hover:bg-[#1F5A4A]"
                                    >
                                        Maps
                                    </TrackedExternalLink>
                                ) : null}

                                {place.instagram_url ? (
                                    <TrackedExternalLink
                                        href={place.instagram_url}
                                        eventName="instagram_clicked"
                                        placeId={place.id}
                                        placeName={place.name}
                                        placeSlug={place.slug}
                                        source="detail_page_mobile_hero"
                                        metadata={{
                                            area: place.area,
                                            city: place.city,
                                            category: category?.slug ?? null,
                                        }}
                                        className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#E7D8C8] bg-white px-4 py-3 text-center text-sm font-black text-[#201813] transition hover:bg-[#181818] hover:text-white"
                                    >
                                        Instagram
                                    </TrackedExternalLink>
                                ) : null}

                                <a
                                    href={whatsappShareUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8] px-4 py-3 text-center text-sm font-black text-[#201813] transition hover:bg-[#1F5A4A] hover:text-white sm:col-span-2"
                                >
                                    Share ke WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                    {galleryPhotos.length > 0 ? (
                        <GallerySlider photos={galleryPhotos} placeName={place.name} />
                    ) : null}

                    <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[1fr_360px] md:p-8 lg:p-10">
                        <div className="min-w-0">
                            <section className="rounded-[26px] border border-[#E7D8C8] bg-[#F8F1E8]/80 p-5 sm:p-6">
                                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#C8784A]">
                                    Quick Summary
                                </p>

                                <h2 className="mt-3 text-2xl font-black tracking-[-0.035em] text-[#201813]">
                                    Kenapa tempat ini layak dicek?
                                </h2>

                                <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[#756A60] sm:text-base sm:leading-8">
                                    {quickSummary}
                                </p>

                                {primaryReasons.length > 0 ? (
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {primaryReasons.map((reason) => (
                                            <span
                                                key={reason}
                                                className="rounded-full border border-[#E7D8C8] bg-white px-3.5 py-2 text-xs font-black text-[#201813] sm:text-sm"
                                            >
                                                {reason}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}
                            </section>

                            <section className="mt-7">
                                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#C8784A]">
                                    Tentang Tempat
                                </p>

                                <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-[#201813]">
                                    Cerita singkat
                                </h2>

                                <div className="mt-4 rounded-[26px] border border-[#E7D8C8] bg-white p-5 sm:p-6">
                                    <p className="max-w-3xl text-sm font-semibold leading-7 text-[#756A60] sm:text-base sm:leading-8">
                                        {place.description ||
                                            "Belum ada deskripsi khusus untuk tempat ini. Untuk sekarang, kamu bisa cek ringkasan, tag, Google Maps, dan Instagram supaya tetap dapat gambaran sebelum datang."}
                                    </p>
                                </div>
                            </section>

                            {characteristics.length > 0 ? (
                                <section className="mt-7">
                                    <div className="mb-4">
                                        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#C8784A]">
                                            Keunggulan
                                        </p>

                                        <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-[#201813]">
                                            Karakteristik & Keunggulan
                                        </h2>

                                        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#756A60]">
                                            Poin utama yang bikin tempat ini layak kamu
                                            pertimbangkan.
                                        </p>
                                    </div>

                                    <div className="grid gap-3">
                                        {characteristics.map((item, index) => (
                                            <div
                                                key={`${item.title}-${index}`}
                                                className="rounded-[24px] border border-[#E7D8C8] bg-white p-5 shadow-sm"
                                            >
                                                <div className="flex gap-4">
                                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#181818] text-sm font-black text-white">
                                                        {String(index + 1).padStart(2, "0")}
                                                    </div>

                                                    <div className="pt-0.5">
                                                        {item.title ? (
                                                            <h3 className="text-base font-black leading-7 text-[#201813]">
                                                                {item.title}
                                                            </h3>
                                                        ) : null}

                                                        {item.description ? (
                                                            <p className="mt-1 text-sm font-semibold leading-7 text-[#756A60] sm:text-base">
                                                                {item.description}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ) : null}

                            {tags.length > 0 ? (
                                <section className="mt-7">
                                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#C8784A]">
                                        Highlight
                                    </p>

                                    <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-[#201813]">
                                        Highlight Tempat
                                    </h2>

                                    <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#756A60]">
                                        Tag dipisahkan menjadi aktivitas, fasilitas, dan vibes biar
                                        lebih gampang dibaca.
                                    </p>

                                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                                        {sortTagGroups(Object.entries(groupedTags)).map(
                                            ([type, tagList]) => (
                                                <div
                                                    key={type}
                                                    className="rounded-[24px] border border-[#E7D8C8] bg-white p-5 shadow-sm"
                                                >
                                                    <div className="mb-4">
                                                        <h3 className="text-lg font-black tracking-[-0.02em] text-[#201813]">
                                                            {getTagGroupLabel(type)}
                                                        </h3>

                                                        <p className="mt-1 text-sm font-semibold leading-6 text-[#756A60]">
                                                            {getTagGroupDescription(type)}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        {tagList.map((tag) => (
                                                            <span
                                                                key={tag.id}
                                                                className="rounded-full border border-[#E7D8C8] bg-[#F8F1E8] px-3.5 py-2 text-xs font-black text-[#4B4038] sm:text-sm"
                                                            >
                                                                {tag.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </section>
                            ) : null}
                        </div>

                        <aside className="h-fit rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 shadow-[0_18px_55px_rgba(47,35,25,0.08)] md:sticky md:top-6">
                            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#C8784A]">
                                Info Detail
                            </p>

                            <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-[#201813]">
                                Sebelum berangkat
                            </h2>

                            <div className="mt-5 grid gap-3">
                                <InfoItem icon="📍" label="Alamat" value={place.address} />
                                <InfoItem
                                    icon="🧭"
                                    label="Area"
                                    value={[place.area, place.city].filter(Boolean).join(", ")}
                                />
                                <InfoItem
                                    icon="💸"
                                    label="Range Harga"
                                    value={place.price_range}
                                />
                                <InfoItem
                                    icon="🕒"
                                    label="Jam Buka"
                                    value={place.opening_hours}
                                    fallback="Belum tersedia, cek Maps/Instagram dulu."
                                />
                            </div>

                            <div className="mt-6 space-y-3">
                                {place.google_maps_url ? (
                                    <TrackedExternalLink
                                        href={place.google_maps_url}
                                        eventName="google_maps_clicked"
                                        placeId={place.id}
                                        placeName={place.name}
                                        placeSlug={place.slug}
                                        source="detail_page_sidebar"
                                        metadata={{
                                            area: place.area,
                                            city: place.city,
                                            category: category?.slug ?? null,
                                        }}
                                        className="block rounded-2xl bg-[#181818] px-5 py-4 text-center text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#1F5A4A]"
                                    >
                                        Buka Google Maps
                                    </TrackedExternalLink>
                                ) : null}

                                {place.instagram_url ? (
                                    <TrackedExternalLink
                                        href={place.instagram_url}
                                        eventName="instagram_clicked"
                                        placeId={place.id}
                                        placeName={place.name}
                                        placeSlug={place.slug}
                                        source="detail_page_sidebar"
                                        metadata={{
                                            area: place.area,
                                            city: place.city,
                                            category: category?.slug ?? null,
                                        }}
                                        className="block rounded-2xl border border-[#E7D8C8] bg-white px-5 py-4 text-center text-sm font-black text-[#201813] transition hover:-translate-y-0.5 hover:border-[#181818] hover:bg-[#181818] hover:text-white"
                                    >
                                        Lihat Instagram
                                    </TrackedExternalLink>
                                ) : null}

                                <a
                                    href={whatsappShareUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block rounded-2xl border border-[#E7D8C8] bg-white px-5 py-4 text-center text-sm font-black text-[#201813] transition hover:-translate-y-0.5 hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
                                >
                                    Share ke WhatsApp
                                </a>
                            </div>

                            <div className="mt-5 rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8] p-4">
                                <p className="text-xs font-bold leading-5 text-[#756A60]">
                                    Data tempat bisa berubah. Cek Google Maps atau Instagram
                                    sebelum datang biar nggak kena prank jam operasional.
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>

                {relatedPlaces.length > 0 ? (
                    <section className="mt-10">
                        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#C8784A]">
                                    Tempat Serupa
                                </p>

                                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#201813] md:text-4xl">
                                    Coffee shop lain yang bisa kamu cek
                                </h2>

                                <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#756A60]">
                                    Alternatif lain di Padang kalau tempat ini belum pas dengan
                                    mood, budget, atau lokasi kamu.
                                </p>
                            </div>

                            <Link
                                href="/places?category=coffee-shop"
                                className="inline-flex min-h-11 w-fit items-center justify-center rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-5 py-3 text-sm font-black text-[#1F5A4A] shadow-sm transition hover:-translate-y-0.5 hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
                            >
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedPlaces.map((relatedPlace, index) => (
                                <PlaceCard
                                    key={relatedPlace.id}
                                    place={relatedPlace}
                                    source="related_places"
                                    position={index + 1}
                                />
                            ))}
                        </div>
                    </section>
                ) : null}
            </section>
        </main>
    );
}

function InfoItem({
    icon,
    label,
    value,
    fallback = "Belum tersedia",
}: {
    icon: string;
    label: string;
    value?: string | null;
    fallback?: string;
}) {
    const displayValue = value && value.trim().length > 0 ? value : fallback;

    return (
        <div className="rounded-2xl border border-[#E7D8C8] bg-white p-4">
            <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F8F1E8] text-lg ring-1 ring-[#E7D8C8]">
                    {icon}
                </div>

                <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9B8B7E]">
                        {label}
                    </p>

                    <p className="mt-2 break-words text-sm font-black leading-6 text-[#201813]">
                        {displayValue}
                    </p>
                </div>
            </div>
        </div>
    );
}
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

const siteUrl = "https://saranwak.vercel.app";

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
            // Support data lama: characteristics masih berupa string[]
            if (typeof item === "string") {
                const cleanTitle = item.trim();

                if (!cleanTitle) return null;

                return {
                    title: cleanTitle,
                    description: "",
                };
            }

            // Support data baru: characteristics berupa object[]
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

const tagGroupOrder = ["activity", "mood", "facility", "vibe", "ambience", "time", "budget", "other"];

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
        : "Jam bukanya belum tersedia";

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
            title: "Tempat tidak ditemukan | Saranwak",
            description: "Tempat yang kamu cari tidak ditemukan di Saranwak.",
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

    const title = `${place.name} - Coffee Shop di ${locationTitle} | Saranwak`;
    const description = makeSeoDescription(place, tags);
    const imageUrl = getSafePlaceImageUrl(place.image_url);
    const pageUrl = `${siteUrl}/places/${place.slug}`;

    return {
        title,
        description,
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
            type: "website",
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
        "@type": "CafeOrCoffeeShop",
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
    };

    return (
        <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white sm:px-5 sm:py-12">
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
                <Link
                    href="/places?category=coffee-shop"
                    className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-neutral-300 transition hover:bg-white hover:text-black"
                >
                    ← Kembali ke Explore
                </Link>

                <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_30px_120px_rgba(0,0,0,0.28)] sm:rounded-[36px]">
                    <div className="relative h-[360px] bg-neutral-900 md:h-[520px]">
                        <img
                            src={heroImageUrl}
                            alt={`${place.name} coffee shop di ${place.area || "Padang"
                                }`}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />

                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-10">
                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-white backdrop-blur">
                                    {category?.name ?? "Tempat"}
                                </span>

                                {place.area ? (
                                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-black text-white backdrop-blur">
                                        {place.area}
                                    </span>
                                ) : null}

                                {place.price_range ? (
                                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-black text-white backdrop-blur">
                                        {place.price_range}
                                    </span>
                                ) : null}
                            </div>

                            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
                                {place.name}
                            </h1>

                            <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-300 sm:text-base">
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
                                        className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
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
                                        className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
                                    >
                                        Instagram
                                    </TrackedExternalLink>
                                ) : null}

                                <a
                                    href={whatsappShareUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
                                >
                                    Share
                                </a>
                            </div>
                        </div>
                    </div>

                    {galleryPhotos.length > 0 ? (
                        <GallerySlider photos={galleryPhotos} placeName={place.name} />
                    ) : null}

                    <div className="grid gap-8 p-5 sm:p-6 md:grid-cols-[1fr_380px] md:p-10">
                        <div>
                            <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">
                                    Quick Summary
                                </p>

                                <h2 className="mt-3 text-2xl font-black">
                                    Kenapa tempat ini layak dicek?
                                </h2>

                                <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
                                    {quickSummary}
                                </p>

                                {primaryReasons.length > 0 ? (
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {primaryReasons.map((reason) => (
                                            <span
                                                key={reason}
                                                className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-neutral-200"
                                            >
                                                {reason}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}
                            </section>

                            <section className="mt-8">
                                <h2 className="text-2xl font-black">Tentang Tempat</h2>

                                <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300 sm:text-lg">
                                    {place.description ||
                                        "Belum ada deskripsi untuk tempat ini."}
                                </p>
                            </section>

                            {characteristics.length > 0 ? (
                                <section className="mt-8">
                                    <div className="mb-5">

                                        <h2 className="mt-3 text-2xl font-black">
                                            Karakteristik & Keunggulan
                                        </h2>

                                        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
                                            Poin utama yang bikin tempat ini layak kamu pertimbangkan.
                                        </p>
                                    </div>

                                    <div className="grid gap-3">
                                        {characteristics.map((item, index) => (
                                            <div
                                                key={`${item.title}-${index}`}
                                                className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5"
                                            >
                                                <div className="flex gap-4">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-black text-black">
                                                        {String(index + 1).padStart(2, "0")}
                                                    </div>

                                                    <div className="pt-1">
                                                        {item.title ? (
                                                            <h3 className="text-base font-black leading-7 text-neutral-100">
                                                                {item.title}
                                                            </h3>
                                                        ) : null}

                                                        {item.description ? (
                                                            <p className="mt-1 text-sm font-medium leading-7 text-neutral-400 sm:text-base">
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
                                <section className="mt-8">
                                    <h2 className="text-2xl font-black">
                                        Highlight Tempat
                                    </h2>

                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
                                        Tag dipisahkan menjadi aktivitas, fasilitas,
                                        dan vibes agar lebih gampang dibaca.
                                    </p>

                                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                                        {sortTagGroups(Object.entries(groupedTags)).map(
                                            ([type, tagList]) => (
                                                <div
                                                    key={type}
                                                    className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5"
                                                >
                                                    <div className="mb-4">
                                                        <h3 className="text-lg font-black">
                                                            {getTagGroupLabel(type)}
                                                        </h3>

                                                        <p className="mt-1 text-sm leading-6 text-neutral-500">
                                                            {getTagGroupDescription(type)}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        {tagList.map((tag) => (
                                                            <span
                                                                key={tag.id}
                                                                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-neutral-200"
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

                        <aside className="h-fit rounded-[28px] border border-white/10 bg-black/30 p-5 md:sticky md:top-6">
                            <h2 className="text-2xl font-black">Info Detail</h2>

                            <div className="mt-5 grid gap-3">
                                <InfoItem
                                    icon="📍"
                                    label="Alamat"
                                    value={place.address}
                                />
                                <InfoItem
                                    icon="🧭"
                                    label="Area"
                                    value={
                                        [place.area, place.city]
                                            .filter(Boolean)
                                            .join(", ") || null
                                    }
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
                                        className="block rounded-2xl bg-white px-5 py-4 text-center text-sm font-black text-black transition hover:bg-neutral-200"
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
                                        className="block rounded-2xl border border-white/10 px-5 py-4 text-center text-sm font-black text-white transition hover:bg-white/10"
                                    >
                                        Lihat Instagram
                                    </TrackedExternalLink>
                                ) : null}

                                <a
                                    href={whatsappShareUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block rounded-2xl border border-white/10 px-5 py-4 text-center text-sm font-black text-white transition hover:bg-white/10"
                                >
                                    Share ke WhatsApp
                                </a>
                            </div>

                            <p className="mt-5 text-xs leading-5 text-neutral-500">
                                Data tempat bisa berubah. Cek Google Maps atau
                                Instagram sebelum datang biar nggak kena prank jam
                                operasional.
                            </p>
                        </aside>
                    </div>
                </div>

                {relatedPlaces.length > 0 ? (
                    <section className="mt-10">
                        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.35em] text-neutral-500">
                                    Tempat Serupa
                                </p>

                                <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                                    Coffee shop lain yang bisa kamu cek
                                </h2>

                                <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-400">
                                    Alternatif lain di Padang kalau tempat ini belum
                                    pas dengan mood, budget, atau lokasi kamu.
                                </p>
                            </div>

                            <Link
                                href="/places?category=coffee-shop"
                                className="w-fit rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-black"
                            >
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedPlaces.map((relatedPlace) => (
                                <PlaceCard
                                    key={relatedPlace.id}
                                    place={relatedPlace}
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
}: {
    icon: string;
    label: string;
    value?: string | null;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] text-lg">
                    {icon}
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                        {label}
                    </p>

                    <p className="mt-2 break-words font-bold leading-6 text-neutral-100">
                        {value || "-"}
                    </p>
                </div>
            </div>
        </div>
    );
}
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getSafePlaceImageUrl } from "@/lib/image-url";
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
    icon?: string | null;
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
    id?: string;
    tag_id?: string | null;
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
    short_description?: string | null;
    characteristics: (string | Characteristic)[] | null;
    address: string | null;
    area: string | null;
    city: string | null;
    image_url: string | null;
    google_maps_url: string | null;
    instagram_url: string | null;
    price_range: string | null;
    price_min?: number | string | null;
    price_max?: number | string | null;
    opening_hours: string | null;
    is_published: boolean;
    created_at?: string | null;
    updated_at?: string | null;
    categories: Category | Category[] | null;
    place_tags: PlaceTagRelation[] | null;
    place_photos: PlacePhoto[] | null;
};

type PlaceDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({
    params,
}: PlaceDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const place = await getPlaceBySlug(slug);

    if (!place) {
        return {
            title: "Tempat tidak ditemukan | Saranwak",
            description: "Tempat yang kamu cari tidak ditemukan di Saranwak.",
        };
    }

    const tags = getPlaceTags(place);
    const category = getSingleCategory(place.categories);
    const seoDescription = makeSeoDescription(place, tags);
    const imageUrl = getAbsoluteImageUrl(place.image_url);
    const canonicalUrl = `${siteUrl}/places/${place.slug}`;

    return {
        title: `${place.name} - ${category?.name || "Coffee Shop"} di ${place.area || place.city || "Padang"
            } | Saranwak`,
        description: seoDescription,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: `${place.name} | Saranwak`,
            description: seoDescription,
            url: canonicalUrl,
            siteName: "Saranwak",
            type: "article",
            images: imageUrl
                ? [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: place.name,
                    },
                ]
                : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: `${place.name} | Saranwak`,
            description: seoDescription,
            images: imageUrl ? [imageUrl] : undefined,
        },
    };
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
    const { slug } = await params;

    const place = await getPlaceBySlug(slug);

    if (!place) {
        notFound();
    }

    const category = getSingleCategory(place.categories);
    const tags = getPlaceTags(place);
    const groupedTags = sortTagGroups(Object.entries(groupTagsByType(tags)));
    const characteristics = getPlaceCharacteristics(place.characteristics);
    const galleryImages = getGalleryImages(place);
    const relatedPlaces = await getRelatedPlaces({
        currentPlaceId: place.id,
        categorySlug: category?.slug,
        area: place.area,
    });

    const mainImageUrl = getSafePlaceImageUrl(place.image_url);
    const whatsappShareUrl = makeWhatsappShareUrl(place);
    const quickSummary = makeQuickSummary(place, tags);
    const jsonLd = makePlaceJsonLd(place, tags, category, galleryImages);

    return (
        <main className="min-h-screen bg-[#F4F1EA] px-4 pb-28 pt-5 text-[#201813] sm:px-5 sm:pb-16 sm:pt-8 md:pb-16 lg:px-8">
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
                metadata={{
                    area: place.area,
                    city: place.city,
                    category: category?.slug ?? null,
                }}
            />

            <section className="mx-auto max-w-7xl">
                <Link
                    href="/places?category=coffee-shop"
                    className="mb-4 inline-flex items-center rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-4 py-2 text-xs font-black text-[#4B4038] shadow-sm transition hover:bg-[#201813] hover:text-white"
                >
                    ← Kembali ke explore
                </Link>

                <HeroSection
                    place={place}
                    category={category}
                    tags={tags}
                    mainImageUrl={mainImageUrl}
                    whatsappShareUrl={whatsappShareUrl}
                />

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                    <article className="min-w-0">
                        <QuickSummarySection summary={quickSummary} />

                        {characteristics.length > 0 ? (
                            <CharacteristicsSection characteristics={characteristics} />
                        ) : null}

                        {place.description ? (
                            <DescriptionSection description={place.description} />
                        ) : null}

                        {galleryImages.length > 0 ? (
                            <GallerySection images={galleryImages} placeName={place.name} />
                        ) : null}

                        {groupedTags.length > 0 ? (
                            <TagGroupsSection groupedTags={groupedTags} />
                        ) : null}
                    </article>

                    <PlaceSidebar
                        place={place}
                        category={category}
                        whatsappShareUrl={whatsappShareUrl}
                    />
                </div>

                {relatedPlaces.length > 0 ? (
                    <RelatedPlacesSection places={relatedPlaces} />
                ) : null}
            </section>

            <MobileStickyActions
                mapsUrl={place.google_maps_url}
                instagramUrl={place.instagram_url}
                whatsappShareUrl={whatsappShareUrl}
                placeId={place.id}
                placeName={place.name}
                placeSlug={place.slug}
                area={place.area}
                city={place.city}
                categorySlug={category?.slug ?? null}
            />
        </main>
    );
}

function HeroSection({
    place,
    category,
    tags,
    mainImageUrl,
    whatsappShareUrl,
}: {
    place: PlaceDetail;
    category: Category | null;
    tags: Tag[];
    mainImageUrl: string;
    whatsappShareUrl: string;
}) {
    const activityTags = getActivityTagNames(tags).slice(0, 3);
    const vibeTags = getVibeTagNames(tags).slice(0, 2);
    const heroTags = [...activityTags, ...vibeTags].slice(0, 5);

    return (
        <section className="overflow-hidden rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] shadow-[0_18px_55px_rgba(47,35,25,0.08)] sm:rounded-[36px] sm:shadow-[0_22px_70px_rgba(47,35,25,0.08)]">
            <div className="relative min-h-[360px] overflow-hidden bg-[#181818] sm:min-h-[430px] lg:min-h-[520px]">
                <img
                    src={mainImageUrl}
                    alt={place.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/30 to-black/88" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

                <div className="relative z-10 flex min-h-[360px] flex-col justify-between p-5 sm:min-h-[430px] sm:p-7 lg:min-h-[520px] lg:p-9">
                    <div className="flex flex-wrap items-center gap-2">
                        {category ? (
                            <Link
                                href={`/places?category=${category.slug}`}
                                className="rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-[11px] font-black text-[#201813] shadow-sm backdrop-blur transition hover:bg-white"
                            >
                                {category.name}
                            </Link>
                        ) : null}

                        {place.price_range ? (
                            <span className="rounded-full border border-white/20 bg-[#F2C38B] px-3 py-1.5 text-[11px] font-black text-[#201813] shadow-sm">
                                {place.price_range}
                            </span>
                        ) : null}

                        {place.area ? (
                            <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[11px] font-black text-white shadow-sm backdrop-blur">
                                {place.area}
                            </span>
                        ) : null}
                    </div>

                    <div className="max-w-4xl">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#F2C38B] sm:text-xs">
                            Detail tempat
                        </p>

                        <h1 className="mt-2 max-w-[340px] break-words text-[30px] font-black leading-[0.98] tracking-[-0.06em] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:max-w-2xl sm:text-5xl sm:leading-[0.95] md:text-6xl lg:max-w-4xl lg:text-[72px]">
                            {place.name}
                        </h1>

                        <p className="mt-3 max-w-[330px] text-sm font-semibold leading-6 text-white/82 sm:max-w-2xl sm:text-base sm:leading-7">
                            {[place.area, place.city || "Padang"].filter(Boolean).join(", ")}
                            {place.address ? ` · ${place.address}` : ""}
                        </p>

                        {heroTags.length > 0 ? (
                            <div className="mt-4 flex max-w-[340px] flex-wrap gap-2 sm:max-w-2xl">
                                {heroTags.map((tag) => (
                                    <Link
                                        key={`${tag}-hero`}
                                        href={`/places?category=coffee-shop&tags=${encodeURIComponent(
                                            tagToSlug(tag)
                                        )}`}
                                        className="rounded-full border border-white/20 bg-white/16 px-3 py-2 text-xs font-black text-white shadow-sm backdrop-blur transition hover:bg-white hover:text-[#201813] sm:px-4"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="grid gap-3 border-t border-[#E7D8C8] bg-[#FFFDF8] p-4 sm:grid-cols-3 sm:p-5">
                <HeroAction
                    label="Buka Google Maps"
                    href={place.google_maps_url}
                    disabledLabel="Maps belum tersedia"
                    eventName="google_maps_clicked"
                    place={place}
                    primary
                />

                <HeroAction
                    label="Lihat Instagram"
                    href={place.instagram_url}
                    disabledLabel="Instagram belum tersedia"
                    eventName="instagram_clicked"
                    place={place}
                />

                <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#E7D8C8] bg-white px-5 py-3 text-sm font-black text-[#201813] transition hover:bg-[#201813] hover:text-white"
                >
                    Share ke WhatsApp
                </a>
            </div>
        </section>
    );
}

function HeroAction({
    label,
    href,
    disabledLabel,
    eventName,
    place,
    primary = false,
}: {
    label: string;
    href?: string | null;
    disabledLabel: string;
    eventName: "google_maps_clicked" | "instagram_clicked";
    place: PlaceDetail;
    primary?: boolean;
}) {
    if (!href) {
        return (
            <span className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#E7D8C8] bg-[#F8F1E8] px-5 py-3 text-sm font-black text-[#9B8C7C]">
                {disabledLabel}
            </span>
        );
    }

    return (
        <TrackedExternalLink
            href={href}
            eventName={eventName}
            placeId={place.id}
            placeName={place.name}
            placeSlug={place.slug}
            source="place_detail_hero"
            metadata={{
                area: place.area,
                city: place.city,
            }}
            className={
                primary
                    ? "inline-flex min-h-12 items-center justify-center rounded-full bg-[#201813] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1F5A4A]"
                    : "inline-flex min-h-12 items-center justify-center rounded-full border border-[#E7D8C8] bg-white px-5 py-3 text-sm font-black text-[#201813] transition hover:bg-[#201813] hover:text-white"
            }
        >
            {label}
        </TrackedExternalLink>
    );
}

function QuickSummarySection({ summary }: { summary: string }) {
    if (!summary) return null;

    return (
        <section className="rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 shadow-[0_18px_55px_rgba(47,35,25,0.05)] sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                Ringkasan cepat
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#201813] sm:text-3xl">
                Cocok buat apa?
            </h2>

            <p className="mt-3 text-sm font-semibold leading-7 text-[#756A60] sm:text-base">
                {summary}
            </p>
        </section>
    );
}

function CharacteristicsSection({
    characteristics,
}: {
    characteristics: Characteristic[];
}) {
    return (
        <section className="mt-5 rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 shadow-[0_18px_55px_rgba(47,35,25,0.05)] sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                Keunggulan
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#201813] sm:text-3xl">
                Karakteristik tempat
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {characteristics.map((item, index) => (
                    <div
                        key={`${item.title}-${index}`}
                        className="rounded-[22px] border border-[#E7D8C8] bg-[#F8F1E8] p-4"
                    >
                        <p className="text-xs font-black text-[#C8784A]">
                            {String(index + 1).padStart(2, "0")}
                        </p>

                        {item.title ? (
                            <h3 className="mt-2 text-base font-black leading-6 text-[#201813]">
                                {item.title}
                            </h3>
                        ) : null}

                        {item.description ? (
                            <p className="mt-2 text-sm font-semibold leading-6 text-[#756A60]">
                                {item.description}
                            </p>
                        ) : null}
                    </div>
                ))}
            </div>
        </section>
    );
}

function DescriptionSection({ description }: { description: string }) {
    return (
        <section className="mt-5 rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 shadow-[0_18px_55px_rgba(47,35,25,0.05)] sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                Deskripsi
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#201813] sm:text-3xl">
                Tentang tempat ini
            </h2>

            <div className="mt-3 whitespace-pre-line text-sm font-semibold leading-7 text-[#756A60] sm:text-base">
                {description}
            </div>
        </section>
    );
}

function GallerySection({
    images,
    placeName,
}: {
    images: PlacePhoto[];
    placeName: string;
}) {
    return (
        <section className="mt-5 rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 shadow-[0_18px_55px_rgba(47,35,25,0.05)] sm:p-6">
            <div className="mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                    Galeri
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#201813] sm:text-3xl">
                    Foto tempat
                </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {images.slice(0, 6).map((photo, index) => (
                    <figure
                        key={photo.id || `${photo.image_url}-${index}`}
                        className="overflow-hidden rounded-[22px] border border-[#E7D8C8] bg-[#F8F1E8]"
                    >
                        <img
                            src={getSafePlaceImageUrl(photo.image_url)}
                            alt={photo.caption || `${placeName} ${index + 1}`}
                            className="h-56 w-full object-cover transition duration-500 hover:scale-105"
                            referrerPolicy="no-referrer"
                        />

                        {photo.caption ? (
                            <figcaption className="px-4 py-3 text-xs font-bold leading-5 text-[#756A60]">
                                {photo.caption}
                            </figcaption>
                        ) : null}
                    </figure>
                ))}
            </div>
        </section>
    );
}

function TagGroupsSection({
    groupedTags,
}: {
    groupedTags: [string, Tag[]][];
}) {
    return (
        <section className="mt-5 rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 shadow-[0_18px_55px_rgba(47,35,25,0.05)] sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                Info tambahan
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#201813] sm:text-3xl">
                Fasilitas, vibes, dan aktivitas
            </h2>

            <div className="mt-5 grid gap-4">
                {groupedTags.map(([type, tags]) => (
                    <div
                        key={type}
                        className="rounded-[22px] border border-[#E7D8C8] bg-[#F8F1E8] p-4"
                    >
                        <div className="mb-3">
                            <h3 className="text-base font-black text-[#201813]">
                                {getTagGroupLabel(type)}
                            </h3>

                            <p className="mt-1 text-xs font-semibold leading-5 text-[#756A60]">
                                {getTagGroupDescription(type)}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <Link
                                    key={tag.id}
                                    href={`/places?category=coffee-shop&tags=${tag.slug}`}
                                    className="rounded-full border border-[#E7D8C8] bg-white px-3 py-2 text-xs font-black text-[#4B4038] transition hover:bg-[#201813] hover:text-white"
                                >
                                    {tag.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function PlaceSidebar({
    place,
    category,
    whatsappShareUrl,
}: {
    place: PlaceDetail;
    category: Category | null;
    whatsappShareUrl: string;
}) {
    return (
        <aside className="h-fit rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 shadow-[0_18px_55px_rgba(47,35,25,0.08)] lg:sticky lg:top-24">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                Informasi tempat
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#201813]">
                Quick info
            </h2>

            <div className="mt-5 grid gap-3">
                <InfoItem label="Nama" value={place.name} />
                <InfoItem label="Kategori" value={category?.name || "Coffee Shop"} />
                <InfoItem label="Area" value={place.area || "-"} />
                <InfoItem label="Kota" value={place.city || "Padang"} />
                <InfoItem label="Range harga" value={place.price_range || "-"} />
                <InfoItem label="Jam buka" value={place.opening_hours || "-"} />
                <InfoItem label="Alamat" value={place.address || "-"} />
            </div>

            <div className="mt-5 grid gap-2">
                {place.google_maps_url ? (
                    <TrackedExternalLink
                        href={place.google_maps_url}
                        eventName="google_maps_clicked"
                        placeId={place.id}
                        placeName={place.name}
                        placeSlug={place.slug}
                        source="place_detail_sidebar"
                        metadata={{
                            area: place.area,
                            city: place.city,
                            category: category?.slug ?? null,
                        }}
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#201813] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1F5A4A]"
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
                        source="place_detail_sidebar"
                        metadata={{
                            area: place.area,
                            city: place.city,
                            category: category?.slug ?? null,
                        }}
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#E7D8C8] bg-white px-5 py-3 text-sm font-black text-[#201813] transition hover:bg-[#201813] hover:text-white"
                    >
                        Lihat Instagram
                    </TrackedExternalLink>
                ) : null}

                <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#E7D8C8] bg-[#F8F1E8] px-5 py-3 text-sm font-black text-[#201813] transition hover:bg-[#201813] hover:text-white"
                >
                    Share ke WhatsApp
                </a>
            </div>
        </aside>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-[18px] border border-[#E7D8C8] bg-[#F8F1E8] p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9B8C7C]">
                {label}
            </p>

            <p className="mt-1 text-sm font-black leading-6 text-[#201813]">
                {value}
            </p>
        </div>
    );
}

function RelatedPlacesSection({ places }: { places: Place[] }) {
    return (
        <section className="mt-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                        Related places
                    </p>

                    <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#201813] sm:text-3xl">
                        Tempat lain yang mungkin cocok
                    </h2>

                    <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[#756A60]">
                        Rekomendasi lain dari Saranwak biar pilihan kamu nggak cuma satu.
                    </p>
                </div>

                <Link
                    href="/places?category=coffee-shop"
                    className="hidden rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-5 py-3 text-sm font-black text-[#1F5A4A] transition hover:bg-[#1F5A4A] hover:text-white sm:inline-flex"
                >
                    Lihat semua
                </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {places.map((place, index) => (
                    <PlaceCard
                        key={place.id}
                        place={place}
                        source="related_places"
                        position={index + 1}
                    />
                ))}
            </div>
        </section>
    );
}

function MobileStickyActions({
    mapsUrl,
    instagramUrl,
    whatsappShareUrl,
    placeId,
    placeName,
    placeSlug,
    area,
    city,
    categorySlug,
}: {
    mapsUrl?: string | null;
    instagramUrl?: string | null;
    whatsappShareUrl: string;
    placeId: string;
    placeName: string;
    placeSlug: string;
    area?: string | null;
    city?: string | null;
    categorySlug?: string | null;
}) {
    return (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E7D8C8] bg-[#FFFDF8]/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-16px_40px_rgba(32,24,19,0.12)] backdrop-blur md:hidden">
            <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
                {mapsUrl ? (
                    <TrackedExternalLink
                        href={mapsUrl}
                        eventName="google_maps_clicked"
                        placeId={placeId}
                        placeName={placeName}
                        placeSlug={placeSlug}
                        source="detail_page_mobile_sticky"
                        metadata={{
                            area,
                            city,
                            category: categorySlug ?? null,
                        }}
                        className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#201813] px-3 py-2 text-xs font-black text-white"
                    >
                        Maps
                    </TrackedExternalLink>
                ) : (
                    <span className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#E7D8C8] px-3 py-2 text-xs font-black text-[#756A60]">
                        Maps
                    </span>
                )}

                {instagramUrl ? (
                    <TrackedExternalLink
                        href={instagramUrl}
                        eventName="instagram_clicked"
                        placeId={placeId}
                        placeName={placeName}
                        placeSlug={placeSlug}
                        source="detail_page_mobile_sticky"
                        metadata={{
                            area,
                            city,
                            category: categorySlug ?? null,
                        }}
                        className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#E7D8C8] bg-white px-3 py-2 text-xs font-black text-[#201813]"
                    >
                        Instagram
                    </TrackedExternalLink>
                ) : (
                    <span className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#E7D8C8] px-3 py-2 text-xs font-black text-[#756A60]">
                        Instagram
                    </span>
                )}

                <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#1F5A4A] px-3 py-2 text-xs font-black text-white"
                >
                    Share
                </a>
            </div>
        </div>
    );
}

async function getPlaceBySlug(slug: string) {
    const { data, error } = await supabase
        .from("places")
        .select(
            `
      *,
      categories (
        id,
        name,
        slug,
        icon
      ),
      place_tags (
        id,
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

    if (error) {
        console.error("Place detail query error:", error.message);
        return null;
    }

    return data as unknown as PlaceDetail;
}

async function getRelatedPlaces({
    currentPlaceId,
    categorySlug,
    area,
}: {
    currentPlaceId: string;
    categorySlug?: string | null;
    area?: string | null;
}) {
    let query = supabase
        .from("places")
        .select(
            `
      *,
      categories (
        id,
        name,
        slug,
        icon
      ),
      place_tags (
        id,
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
        .neq("id", currentPlaceId)
        .limit(6);

    if (categorySlug) {
        query = query.eq("categories.slug", categorySlug);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Related places query error:", error.message);
        return [];
    }

    const places = (data ?? []) as unknown as Place[];

    if (!area) {
        return places;
    }

    return places.sort((a, b) => {
        const aSameArea = normalizeText(a.area) === normalizeText(area);
        const bSameArea = normalizeText(b.area) === normalizeText(area);

        if (aSameArea === bSameArea) return 0;

        return aSameArea ? -1 : 1;
    });
}

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

function getPlaceTags(place: PlaceDetail) {
    return (
        place.place_tags
            ?.map((relation) => getSingleTag(relation.tags))
            .filter((tag): tag is Tag => Boolean(tag)) ?? []
    );
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

function getGalleryImages(place: PlaceDetail) {
    return (
        place.place_photos
            ?.filter((photo) => Boolean(photo.image_url))
            .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)) ?? []
    );
}

function cleanDescription(value?: string | null) {
    if (!value) return "";

    return value.replace(/\s+/g, " ").trim();
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

function makeQuickSummary(place: PlaceDetail, tags: Tag[]) {
    const activityTags = getActivityTagNames(tags);
    const facilityTags = getTagNamesByType(tags, "facility");
    const vibeTags = getVibeTagNames(tags);

    const locationText = [place.area, place.city || "Padang"]
        .filter(Boolean)
        .join(", ");

    const priceText = place.price_range
        ? `dengan range harga ${place.price_range}`
        : "dengan informasi harga yang bisa kamu cek langsung dari tempatnya";

    const activityText =
        activityTags.length > 0
            ? `cocok untuk ${activityTags.slice(0, 3).join(", ")}`
            : "cocok untuk kamu yang ingin mencari suasana baru";

    const facilityText =
        facilityTags.length > 0
            ? `Fasilitas yang menonjol: ${facilityTags.slice(0, 4).join(", ")}.`
            : "";

    const vibeText =
        vibeTags.length > 0
            ? `Vibes-nya cenderung ${vibeTags.slice(0, 3).join(", ")}.`
            : "";

    return `${place.name} berada di ${locationText || "Padang"
        }, ${priceText}, dan ${activityText}. ${facilityText} ${vibeText}`.trim();
}

function makeWhatsappShareUrl(place: PlaceDetail) {
    const detailUrl = `${siteUrl}/places/${place.slug}`;

    const message = [
        `Cek ${place.name} di Saranwak:`,
        detailUrl,
        "",
        place.area ? `Area: ${place.area}` : null,
        place.price_range ? `Harga: ${place.price_range}` : null,
    ]
        .filter(Boolean)
        .join("\n");

    return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

function getAbsoluteImageUrl(imageUrl?: string | null) {
    if (!imageUrl) return null;

    const safeImageUrl = getSafePlaceImageUrl(imageUrl);

    if (safeImageUrl.startsWith("http")) {
        return safeImageUrl;
    }

    return `${siteUrl}${safeImageUrl.startsWith("/") ? "" : "/"}${safeImageUrl}`;
}

function makePlaceJsonLd(
    place: PlaceDetail,
    tags: Tag[],
    category: Category | null,
    galleryImages: PlacePhoto[]
) {
    const imageUrls = [
        getAbsoluteImageUrl(place.image_url),
        ...galleryImages.map((photo) => getAbsoluteImageUrl(photo.image_url)),
    ].filter(Boolean);

    return {
        "@context": "https://schema.org",
        "@type":
            category?.slug === "coffee-shop" ? "CafeOrCoffeeShop" : "LocalBusiness",
        name: place.name,
        description: makeSeoDescription(place, tags),
        image: imageUrls,
        url: `${siteUrl}/places/${place.slug}`,
        address: {
            "@type": "PostalAddress",
            streetAddress: place.address || undefined,
            addressLocality: place.city || "Padang",
            addressRegion: "Sumatera Barat",
            addressCountry: "ID",
        },
        areaServed: place.area || place.city || "Padang",
        priceRange: place.price_range || undefined,
        openingHours: place.opening_hours || undefined,
        sameAs: place.instagram_url ? [place.instagram_url] : undefined,
        hasMap: place.google_maps_url || undefined,
        keywords: tags.map((tag) => tag.name).join(", "),
    };
}

function normalizeText(value?: string | null) {
    return value?.toLowerCase().trim() || "";
}

function tagToSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
}
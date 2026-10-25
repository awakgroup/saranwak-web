import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    MapPin,
    Clock,
    Coins,
    Share2,
    Coffee,
    Sparkles,
    CheckCircle2,
} from "lucide-react";

import { PlaceCard } from "@/components/PlaceCard";
import { PlaceDetailTracker } from "@/components/PlaceDetailTracker";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { OpenStatusBadge } from "@/components/OpenStatusBadge";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import {
    getPlaceBySlug as getPlaceBySlugFromApi,
    getPlaces as getPlacesFromApi,
    type ApiGallery,
    type ApiPlace,
    type ApiPlaceDetail,
    type ApiTag,
} from "@/lib/api/places";
import type { Place } from "@/types/database";

export const revalidate = 3600;

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
    is_featured?: boolean | null;
    is_verified?: boolean | null;
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

export async function generateStaticParams() {
    const slugs = await getStaticPlaceSlugs();

    return slugs.map((slug) => ({
        slug,
    }));
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
        };
    }

    const tags = getPlaceTags(place);
    const category = getSingleCategory(place.categories);
    const seoDescription = makeSeoDescription(place, tags);
    const imageUrl = getAbsoluteImageUrl(place.image_url);
    const canonicalUrl = `${siteUrl}/places/${place.slug}`;

    return {
        title: `${place.name} - ${category?.name || "Coffee Shop"
            } di ${place.area || place.city || "Padang"} | Saranwak`,
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
                {/* Editorial Breadcrumbs */}
                <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs font-bold text-[#756A60]">
                    <Link
                        href="/"
                        className="transition hover:text-[#201813]"
                    >
                        Home
                    </Link>
                    <span>/</span>
                    <Link
                        href="/places?category=coffee-shop"
                        className="transition hover:text-[#201813]"
                    >
                        Explore
                    </Link>
                    {place.area ? (
                        <>
                            <span>/</span>
                            <Link
                                href={`/places?category=coffee-shop&area=${encodeURIComponent(place.area)}`}
                                className="transition hover:text-[#201813]"
                            >
                                {place.area}
                            </Link>
                        </>
                    ) : null}
                    <span>/</span>
                    <span className="truncate font-semibold text-[#201813]">{place.name}</span>
                </nav>

                <HeroSection
                    place={place}
                    category={category}
                    tags={tags}
                    mainImageUrl={mainImageUrl}
                    whatsappShareUrl={whatsappShareUrl}
                />

                <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
                    <article className="min-w-0 space-y-6">
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
        <section className="overflow-hidden rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8] shadow-[0_20px_60px_rgba(47,35,25,0.08)] sm:rounded-[40px] sm:shadow-[0_24px_80px_rgba(47,35,25,0.10)]">
            <div className="relative min-h-[380px] overflow-hidden bg-[#181818] sm:min-h-[460px] lg:min-h-[540px]">
                <Image
                    src={mainImageUrl}
                    alt={place.name}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/40 to-black/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

                <div className="relative z-10 flex min-h-[380px] flex-col justify-between p-6 sm:min-h-[460px] sm:p-8 lg:min-h-[540px] lg:p-10">
                    <div className="flex flex-wrap items-center gap-2">
                        {category ? (
                            <Link
                                href={`/places?category=${category.slug}`}
                                className="rounded-full border border-white/20 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#201813] shadow-sm backdrop-blur transition hover:bg-white"
                            >
                                {category.name}
                            </Link>
                        ) : null}

                        {place.price_range ? (
                            <span className="rounded-full border border-white/20 bg-[#F2C38B] px-3.5 py-1.5 text-xs font-bold text-[#201813] shadow-sm">
                                {place.price_range}
                            </span>
                        ) : null}

                        {place.area ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur">
                                <MapPin className="h-3 w-3 text-[#F2C38B]" />
                                {place.area}
                            </span>
                        ) : null}

                        <OpenStatusBadge openingHours={place.opening_hours} mode="compact" />

                        {place.is_featured ? (
                            <span className="rounded-full bg-[#1F5A4A] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm">
                                Featured
                            </span>
                        ) : null}

                        {place.is_verified ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur">
                                <CheckCircle2 className="h-3 w-3 text-[#8BE4D2]" />
                                Verified
                            </span>
                        ) : null}
                    </div>

                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F2C38B] backdrop-blur">
                            <Coffee className="h-3 w-3 text-[#F2C38B]" />
                            Spot Pilihan Padang
                        </div>

                        <h1 className="mt-3 font-serif text-3xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)] sm:text-5xl md:text-6xl lg:text-7xl">
                            {place.name}
                        </h1>

                        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium leading-6 text-white/85 sm:text-base">
                            <MapPin className="h-4 w-4 shrink-0 text-[#F2C38B]" />
                            <span>
                                {[place.area, place.city || "Padang"].filter(Boolean).join(", ")}
                                {place.address ? ` · ${place.address}` : ""}
                            </span>
                        </p>

                        {heroTags.length > 0 ? (
                            <div className="mt-5 flex flex-wrap gap-2">
                                {heroTags.map((tag) => (
                                    <Link
                                        key={`${tag}-hero`}
                                        href={`/places?category=coffee-shop&tags=${encodeURIComponent(
                                            tagToSlug(tag)
                                        )}`}
                                        className="rounded-full border border-white/20 bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur transition hover:bg-white hover:text-[#201813]"
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
                    label="Buka di Google Maps"
                    icon="maps"
                    href={place.google_maps_url}
                    disabledLabel="Maps belum tersedia"
                    eventName="google_maps_clicked"
                    place={place}
                    primary
                />

                <HeroAction
                    label="Lihat Instagram"
                    icon="instagram"
                    href={place.instagram_url}
                    disabledLabel="Instagram belum tersedia"
                    eventName="instagram_clicked"
                    place={place}
                />

                <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#E7D8C8] bg-white px-5 py-3 text-sm font-bold text-[#201813] transition hover:bg-[#201813] hover:text-white"
                >
                    <Share2 className="h-4 w-4" />
                    Share ke WhatsApp
                </a>
            </div>
        </section>
    );
}

function HeroAction({
    label,
    icon,
    href,
    disabledLabel,
    eventName,
    place,
    primary = false,
}: {
    label: string;
    icon?: "maps" | "instagram";
    href?: string | null;
    disabledLabel: string;
    eventName: "google_maps_clicked" | "instagram_clicked";
    place: PlaceDetail;
    primary?: boolean;
}) {
    if (!href) {
        return (
            <span className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#E7D8C8] bg-[#F8F1E8] px-5 py-3 text-sm font-bold text-[#9B8C7C]">
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
                    ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1F5A4A] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#164337]"
                    : "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#E7D8C8] bg-white px-5 py-3 text-sm font-bold text-[#201813] transition hover:bg-[#201813] hover:text-white"
            }
        >
            {icon === "maps" ? <MapPin className="h-4 w-4" /> : null}
            {icon === "instagram" ? <InstagramIcon className="h-4 w-4" /> : null}
            <span>{label}</span>
        </TrackedExternalLink>
    );
}

function QuickSummarySection({ summary }: { summary: string }) {
    if (!summary) return null;

    return (
        <section className="relative overflow-hidden rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-[0_16px_50px_rgba(47,35,25,0.05)] sm:p-7">
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#F2C38B]/20 blur-2xl" />

            <div className="relative z-10">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#C8784A]" />
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                        Ringkasan Cepat
                    </p>
                </div>

                <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-3xl">
                    Cocok Buat Apa?
                </h2>

                <div className="mt-3 rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8]/70 p-4 sm:p-5">
                    <p className="text-sm font-medium leading-7 text-[#4B4038] sm:text-base">
                        {summary}
                    </p>
                </div>
            </div>
        </section>
    );
}

function CharacteristicsSection({
    characteristics,
}: {
    characteristics: Characteristic[];
}) {
    return (
        <section className="rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-[0_16px_50px_rgba(47,35,25,0.05)] sm:p-7">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                Keunggulan Utama
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-3xl">
                Karakteristik Tempat
            </h2>

            <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
                {characteristics.map((item, index) => (
                    <div
                        key={`${item.title}-${index}`}
                        className="group rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8]/60 p-4.5 transition hover:border-[#1F5A4A]/30 hover:bg-[#F8F1E8]"
                    >
                        <span className="font-serif text-xs font-bold text-[#C8784A]">
                            {String(index + 1).padStart(2, "0")}
                        </span>

                        {item.title ? (
                            <h3 className="mt-1 font-serif text-base font-bold text-[#201813]">
                                {item.title}
                            </h3>
                        ) : null}

                        {item.description ? (
                            <p className="mt-2 text-xs font-medium leading-6 text-[#756A60] sm:text-sm">
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
        <section className="rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-[0_16px_50px_rgba(47,35,25,0.05)] sm:p-7">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                Deskripsi
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-3xl">
                Tentang Tempat Ini
            </h2>

            <div className="mt-4 whitespace-pre-line text-sm font-medium leading-7 text-[#5C534B] sm:text-base sm:leading-8">
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
        <section className="rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-[0_16px_50px_rgba(47,35,25,0.05)] sm:p-7">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                        Dokumentasi
                    </p>

                    <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-3xl">
                        Foto & Suasana Tempat
                    </h2>
                </div>

                <span className="rounded-full border border-[#E7D8C8] bg-[#F8F1E8] px-3 py-1 text-xs font-bold text-[#756A60]">
                    {images.length} Foto
                </span>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
                {images.slice(0, 6).map((photo, index) => (
                    <figure
                        key={photo.id || `${photo.image_url}-${index}`}
                        className="group overflow-hidden rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8]"
                    >
                        <div className="relative h-60 w-full overflow-hidden bg-[#E3DED4]">
                            <Image
                                src={getSafePlaceImageUrl(photo.image_url)}
                                alt={photo.caption || `${placeName} ${index + 1}`}
                                fill
                                sizes="(max-width: 640px) 100vw, 50vw"
                                className="object-cover transition duration-700 group-hover:scale-105"
                            />
                        </div>

                        {photo.caption ? (
                            <figcaption className="px-4 py-2.5 text-xs font-medium text-[#756A60]">
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
        <section className="rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-[0_16px_50px_rgba(47,35,25,0.05)] sm:p-7">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                Kelengkapan & Vibes
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-3xl">
                Fasilitas, Suasana, & Aktivitas
            </h2>

            <div className="mt-5 grid gap-4">
                {groupedTags.map(([type, tags]) => (
                    <div
                        key={type}
                        className="rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8]/60 p-4.5"
                    >
                        <div className="mb-3">
                            <h3 className="font-serif text-base font-bold text-[#201813]">
                                {getTagGroupLabel(type)}
                            </h3>

                            <p className="mt-1 text-xs font-medium leading-5 text-[#756A60]">
                                {getTagGroupDescription(type)}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <Link
                                    key={tag.id}
                                    href={`/places?category=coffee-shop&tags=${tag.slug}`}
                                    className="rounded-full border border-[#E7D8C8] bg-white px-3.5 py-1.5 text-xs font-bold text-[#4B4038] shadow-sm transition hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
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
        <aside className="h-fit rounded-[30px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-[0_20px_60px_rgba(47,35,25,0.07)] lg:sticky lg:top-24">
            <div className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-[#C8784A]" />
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                    Informasi Tempat
                </p>
            </div>

            <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#201813]">
                Quick Info
            </h2>

            <div className="mt-5 space-y-2.5">
                <InfoItem icon="tag" label="Kategori" value={category?.name || "Coffee Shop"} />
                <InfoItem icon="map" label="Area & Kota" value={`${place.area || "-"}, ${place.city || "Padang"}`} />
                <InfoItem icon="wallet" label="Perkiraan Harga" value={place.price_range || "-"} />
                <InfoItem icon="clock" label="Jam Operasional" value={place.opening_hours || "-"}>
                    {place.opening_hours ? (
                        <OpenStatusBadge openingHours={place.opening_hours} mode="detail" className="mt-2" />
                    ) : null}
                </InfoItem>
                <InfoItem icon="pin" label="Alamat Lengkap" value={place.address || "-"} />
            </div>

            <div className="mt-6 grid gap-2.5">
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
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1F5A4A] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#164337]"
                    >
                        <MapPin className="h-4 w-4" />
                        Buka di Google Maps
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
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#E7D8C8] bg-white px-5 py-3 text-sm font-bold text-[#201813] transition hover:bg-[#201813] hover:text-white"
                    >
                        <InstagramIcon className="h-4 w-4" />
                        Lihat Instagram
                    </TrackedExternalLink>
                ) : null}

                <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#E7D8C8] bg-[#F8F1E8] px-5 py-3 text-sm font-bold text-[#201813] transition hover:bg-[#201813] hover:text-white"
                >
                    <Share2 className="h-4 w-4" />
                    Share ke WhatsApp
                </a>
            </div>
        </aside>
    );
}

function InfoItem({
    label,
    value,
    icon,
    children,
}: {
    label: string;
    value: string;
    icon?: "tag" | "map" | "wallet" | "clock" | "pin";
    children?: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8]/60 p-3.5">
            <div className="mt-0.5 text-[#C8784A]">
                {icon === "tag" ? <Coffee className="h-4 w-4" /> : null}
                {icon === "map" ? <MapPin className="h-4 w-4" /> : null}
                {icon === "wallet" ? <Coins className="h-4 w-4" /> : null}
                {icon === "clock" ? <Clock className="h-4 w-4" /> : null}
                {icon === "pin" ? <MapPin className="h-4 w-4" /> : null}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9B8C7C]">
                    {label}
                </p>
                <p className="mt-0.5 text-xs font-bold leading-5 text-[#201813] sm:text-sm">
                    {value}
                </p>
                {children}
            </div>
        </div>
    );
}

function RelatedPlacesSection({ places }: { places: Place[] }) {
    return (
        <section className="mt-12 border-t border-[#E7D8C8] pt-10">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                        Rekomendasi Lain
                    </p>

                    <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-3xl">
                        Tempat Serupa di Padang
                    </h2>

                    <p className="mt-1.5 text-xs font-medium text-[#756A60] sm:text-sm">
                        Pilihan coffee shop lain di sekitar area atau dengan suasana serupa.
                    </p>
                </div>

                <Link
                    href="/places?category=coffee-shop"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-4 py-2 text-xs font-bold text-[#1F5A4A] shadow-sm transition hover:bg-[#1F5A4A] hover:text-white"
                >
                    Lihat Semua Tempat
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

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
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
                        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-[#1F5A4A] px-3 py-2 text-xs font-bold text-white shadow-sm"
                    >
                        <MapPin className="h-3.5 w-3.5" />
                        Maps
                    </TrackedExternalLink>
                ) : (
                    <span className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#E7D8C8] px-3 py-2 text-xs font-bold text-[#756A60]">
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
                        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl border border-[#E7D8C8] bg-white px-3 py-2 text-xs font-bold text-[#201813]"
                    >
                        <InstagramIcon className="h-3.5 w-3.5" />
                        Instagram
                    </TrackedExternalLink>
                ) : (
                    <span className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#E7D8C8] px-3 py-2 text-xs font-bold text-[#756A60]">
                        Instagram
                    </span>
                )}

                <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-[#201813] px-3 py-2 text-xs font-bold text-white"
                >
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                </a>
            </div>
        </div>
    );
}

async function getStaticPlaceSlugs() {
    try {
        const places = await getPlacesFromApi({
            limit: 500,
        });

        const slugs = places
            .map((place) => place.slug)
            .filter((slug): slug is string => Boolean(slug));

        if (slugs.length > 0) {
            return slugs;
        }
    } catch (error) {
        console.error("Static params D1 fetch error:", error);
    }

    const fallbackPlaces = await getPlacesFromJson();

    return fallbackPlaces
        .map((place) => place.slug)
        .filter((slug): slug is string => Boolean(slug));
}

async function getPlacesFromJson() {
    try {
        const filePath = path.join(
            process.cwd(),
            "public",
            "data",
            "places.json"
        );

        const fileContent = await fs.readFile(filePath, "utf8");
        const places = JSON.parse(fileContent) as PlaceDetail[];

        if (!Array.isArray(places)) {
            return [];
        }

        return places.filter((place) => place.is_published !== false);
    } catch (error) {
        console.error("Static detail places JSON read error:", error);
        return [];
    }
}

async function getPlaceBySlug(slug: string): Promise<PlaceDetail | null> {
    try {
        const place = await getPlaceBySlugFromApi(slug);

        if (place) {
            return mapApiPlaceDetailToPlaceDetail(place);
        }
    } catch (error) {
        console.error("Place detail D1 fetch error:", error);
    }

    const places = await getPlacesFromJson();

    return (
        places.find(
            (place) => place.slug === slug && place.is_published !== false
        ) ?? null
    );
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
    try {
        const apiPlaces = await getPlacesFromApi({
            limit: 100,
        });

        const relatedPlaces = apiPlaces
            .filter((place) => place.id !== currentPlaceId)
            .filter((place) => {
                if (!categorySlug) return true;

                return (place.category_slug || "coffee-shop") === categorySlug;
            })
            .sort((a, b) => {
                const aSameArea = normalizeText(a.area) === normalizeText(area);
                const bSameArea = normalizeText(b.area) === normalizeText(area);

                if (aSameArea !== bSameArea) {
                    return aSameArea ? -1 : 1;
                }

                const aFeatured = Boolean(a.is_featured);
                const bFeatured = Boolean(b.is_featured);

                if (aFeatured !== bFeatured) {
                    return aFeatured ? -1 : 1;
                }

                const dateA = new Date(a.created_at ?? 0).getTime();
                const dateB = new Date(b.created_at ?? 0).getTime();

                return dateB - dateA;
            })
            .slice(0, 6)
            .map(mapApiPlaceToLegacyPlace);

        if (relatedPlaces.length > 0) {
            return relatedPlaces;
        }
    } catch (error) {
        console.error("Related places D1 fetch error:", error);
    }

    const places = await getPlacesFromJson();

    const relatedPlaces = places
        .filter((place) => place.id !== currentPlaceId)
        .filter((place) => {
            if (!categorySlug) return true;

            const category = getSingleCategory(place.categories);

            return category?.slug === categorySlug;
        })
        .sort((a, b) => {
            const aSameArea = normalizeText(a.area) === normalizeText(area);
            const bSameArea = normalizeText(b.area) === normalizeText(area);

            if (aSameArea !== bSameArea) {
                return aSameArea ? -1 : 1;
            }

            const aFeatured = Boolean(a.is_featured);
            const bFeatured = Boolean(b.is_featured);

            if (aFeatured !== bFeatured) {
                return aFeatured ? -1 : 1;
            }

            const dateA = new Date(a.created_at ?? 0).getTime();
            const dateB = new Date(b.created_at ?? 0).getTime();

            return dateB - dateA;
        })
        .slice(0, 6);

    return relatedPlaces as unknown as Place[];
}

function mapApiPlaceDetailToPlaceDetail(place: ApiPlaceDetail): PlaceDetail {
    const category = makeCategoryFromApiPlace(place);

    return {
        id: place.id,
        name: place.name,
        slug: place.slug,
        description: place.description,
        short_description: place.short_description,
        characteristics: null,
        address: place.address,
        area: place.area,
        city: place.city,
        image_url: place.image_url,
        google_maps_url: place.google_maps_url,
        instagram_url: place.instagram_url,
        price_range: place.price_range,
        price_min: place.price_min,
        price_max: place.price_max,
        opening_hours: place.opening_hours,
        is_featured: Boolean(place.is_featured),
        is_verified: null,
        is_published: Boolean(place.is_active),
        created_at: place.created_at,
        updated_at: place.updated_at,
        categories: category,
        place_tags: mapApiTagsToPlaceTags(place.tags ?? []),
        place_photos: mapApiGalleriesToPlacePhotos(place.galleries ?? []),
    };
}

function mapApiPlaceToLegacyPlace(place: ApiPlace): Place {
    const category = makeCategoryFromApiPlace(place);

    return {
        ...place,
        maps_url: place.google_maps_url,
        is_published: Boolean(place.is_active),
        is_featured: Boolean(place.is_featured),
        categories: category,
        place_tags: [],
        place_photos: [],
        tags: [],
        gallery: [],
    } as unknown as Place;
}

function makeCategoryFromApiPlace(place: ApiPlace | ApiPlaceDetail): Category | null {
    if (!place.category_id && !place.category_name && !place.category_slug) {
        return {
            id: "cat_coffee_shop",
            name: "Coffee Shop",
            slug: "coffee-shop",
        };
    }

    return {
        id: place.category_id || place.category_slug || "cat_coffee_shop",
        name: place.category_name || "Coffee Shop",
        slug: place.category_slug || "coffee-shop",
    };
}

function mapApiTagsToPlaceTags(tags: ApiTag[]): PlaceTagRelation[] {
    return tags.map((tag) => ({
        tag_id: tag.id,
        tags: {
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            type: tag.type,
        },
    }));
}

function mapApiGalleriesToPlacePhotos(galleries: ApiGallery[]): PlacePhoto[] {
    return galleries.map((gallery, index) => ({
        id: gallery.id,
        image_url: gallery.image_url,
        caption: gallery.alt_text,
        sort_order: gallery.sort_order ?? index + 1,
    }));
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
        geo: {
            "@type": "GeoCoordinates",
            "latitude": -0.9471,
            "longitude": 100.4172,
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
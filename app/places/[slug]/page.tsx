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
    ArrowRight,
    Star,
    Laptop,
    Users,
    Sun,
    Utensils,
    Building2,
    Music,
} from "lucide-react";

import { PlaceCard } from "@/components/PlaceCard";
import { PlaceDetailTracker } from "@/components/PlaceDetailTracker";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { OpenStatusBadge } from "@/components/OpenStatusBadge";
import { BookmarkButton } from "@/components/BookmarkButton";
import { MobilePlaceDetailView } from "@/components/MobilePlaceDetailView";
import { DesktopGallerySection } from "@/components/DesktopGallerySection";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import {
    getPlaceBySlug as getPlaceBySlugFromApi,
    getPlaces as getPlacesFromApi,
    FEATURED_PLACE_SLUGS,
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
    source?: string | null;
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
            images: [
                {
                    url: imageUrl || `${siteUrl}/og-saranwak-banner.png`,
                    width: 1200,
                    height: 630,
                    alt: place.name,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${place.name} | Saranwak`,
            description: seoDescription,
            images: [imageUrl || `${siteUrl}/og-saranwak-banner.png`],
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
        <main className="min-h-screen bg-[#FAF7F2] text-[#19120D]">
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

            {/* Mobile View - Aligned 100% with Stitch design 9618eb0c068645cdb436c263d4ef2a0b */}
            <div className="block md:hidden">
                <MobilePlaceDetailView
                    place={place}
                    category={category}
                    tags={tags}
                    characteristics={characteristics}
                    galleryImages={galleryImages}
                    relatedPlaces={relatedPlaces}
                    mainImageUrl={mainImageUrl}
                    whatsappShareUrl={whatsappShareUrl}
                />
            </div>

            {/* Desktop View */}
            <div className="hidden md:block px-5 pb-16 pt-8 lg:px-8">
                <section className="mx-auto max-w-7xl">
                    {/* Editorial Breadcrumbs */}
                    <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#756A63]">
                        <Link
                            href="/"
                            className="transition hover:text-[#19120D]"
                        >
                            Home
                        </Link>
                        <span>/</span>
                        <Link
                            href="/places?category=coffee-shop"
                            className="transition hover:text-[#19120D]"
                        >
                            Explore
                        </Link>
                        {place.area ? (
                            <>
                                <span>/</span>
                                <Link
                                    href={`/places?category=coffee-shop&area=${encodeURIComponent(place.area)}`}
                                    className="transition hover:text-[#19120D]"
                                >
                                    {place.area}
                                </Link>
                            </>
                        ) : null}
                        <span>/</span>
                        <span className="truncate font-bold text-[#19120D]">{place.name}</span>
                    </nav>

                    <HeroSection
                        place={place}
                        category={category}
                        tags={tags}
                        mainImageUrl={mainImageUrl}
                        whatsappShareUrl={whatsappShareUrl}
                    />

                    <div className="mt-5 grid gap-5 sm:mt-8 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
                        <article className="min-w-0 space-y-4 sm:space-y-6">
                            <QuickSummarySection summary={quickSummary} />

                            {characteristics.length > 0 ? (
                                <CharacteristicsSection characteristics={characteristics} />
                            ) : null}

                            {place.description ? (
                                <DescriptionSection description={place.description} />
                            ) : null}

                            {galleryImages.length > 0 ? (
                                <DesktopGallerySection images={galleryImages} placeName={place.name} />
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
            </div>
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
        <section className="overflow-hidden rounded-xl sm:rounded-[32px] border border-[#EBE5DC] bg-white shadow-sm sm:shadow-md">
            <div className="relative min-h-[250px] overflow-hidden bg-gradient-to-b from-[#2B1D15] to-[#120B07] text-white sm:min-h-[460px] lg:min-h-[520px]">
                <Image
                    src={mainImageUrl}
                    alt={place.name}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover opacity-35"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

                <div className="relative z-10 flex min-h-[250px] flex-col justify-between p-3.5 sm:min-h-[460px] sm:p-8 lg:min-h-[520px] lg:p-10">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {category ? (
                            <Link
                                href={`/places?category=${category.slug}`}
                                className="rounded-full border border-white/20 bg-white/95 px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-bold text-[#19120D] shadow-xs backdrop-blur transition hover:bg-white"
                            >
                                {category.name}
                            </Link>
                        ) : null}

                        {place.price_range ? (
                            <span className="rounded-full border border-white/20 bg-[#FDBA74] px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-bold text-[#19120D] shadow-xs">
                                {place.price_range}
                            </span>
                        ) : null}

                        {place.area ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/15 px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-bold text-white shadow-xs backdrop-blur">
                                <MapPin className="h-3 w-3 text-[#FDBA74]" />
                                {place.area}
                            </span>
                        ) : null}

                        <OpenStatusBadge openingHours={place.opening_hours} mode="compact" />

                        {place.is_featured ? (
                            <span
                                title="Tempat Pilihan (Featured)"
                                className="grid h-6 w-6 sm:h-7 sm:w-7 place-items-center rounded-full bg-white shadow-xs transition hover:scale-110"
                                aria-label="Featured place"
                            >
                                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-500" />
                            </span>
                        ) : null}
                    </div>

                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5C35]/40 bg-[#FF5C35]/20 px-2.5 py-0.5 sm:px-3.5 sm:py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#FDBA74] backdrop-blur">
                            <Star className="h-3 w-3 text-[#FF5C35]" />
                            Spot Pilihan Padang
                        </div>

                        <h1 className="mt-1.5 font-sans text-xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            {place.name}
                        </h1>

                        <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium leading-relaxed text-stone-300 sm:mt-2.5 sm:gap-1.5 sm:text-sm">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#FF5C35]" />
                            <span>
                                {[place.area, place.city || "Padang"].filter(Boolean).join(", ")}
                                {place.address ? ` · ${place.address}` : ""}
                            </span>
                        </p>

                        {heroTags.length > 0 ? (
                            <div className="mt-2.5 flex flex-wrap gap-1 sm:mt-5 sm:gap-2">
                                {heroTags.map((tag) => (
                                    <Link
                                        key={`${tag}-hero`}
                                        href={`/places?category=coffee-shop&tags=${encodeURIComponent(
                                            tagToSlug(tag)
                                        )}`}
                                        className="rounded-lg border border-white/10 bg-white/10 px-2 py-0.5 text-[10.5px] font-medium text-stone-200 transition hover:bg-white/20 sm:px-3 sm:py-1 sm:text-xs"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="grid gap-2 border-t border-[#EBE5DC] bg-white p-3 sm:gap-3 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
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
                    className="inline-flex min-h-9.5 sm:min-h-12 items-center justify-center gap-2 rounded-full border border-[#EBE5DC] bg-white px-3.5 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-[#19120D] transition hover:bg-[#19120D] hover:text-white"
                >
                    <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Share ke WhatsApp
                </a>

                <BookmarkButton place={place as unknown as Place} variant="button" />
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
            <span className="inline-flex min-h-9.5 sm:min-h-12 items-center justify-center rounded-full border border-[#EBE5DC] bg-[#FAF6F0] px-3.5 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-[#756A63]">
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
                    ? "inline-flex min-h-9.5 sm:min-h-12 items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#FF5C35] hover:bg-[#D8431F] px-3.5 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition-all active:scale-95"
                    : "inline-flex min-h-9.5 sm:min-h-12 items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-[#EBE5DC] bg-white px-3.5 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-[#19120D] transition hover:bg-[#19120D] hover:text-white"
            }
        >
            {icon === "maps" ? <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : null}
            {icon === "instagram" ? <InstagramIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : null}
            <span>{label}</span>
        </TrackedExternalLink>
    );
}

function QuickSummarySection({ summary }: { summary: string }) {
    if (!summary) return null;

    return (
        <section className="relative overflow-hidden rounded-2xl border border-[#EBE5DC] bg-white p-4 shadow-xs sm:p-7">
            <div className="relative z-10">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF5C35]">
                    <Sparkles className="h-4 w-4 text-[#FF5C35]" />
                    <span>Ringkasan Cepat</span>
                </div>

                <h2 className="mt-2 font-sans text-lg font-extrabold text-[#19120D] sm:text-2xl">
                    Cocok Buat Apa?
                </h2>

                <div className="mt-3 rounded-xl border border-[#EBE5DC] bg-[#FAF6F0] p-3.5 text-xs leading-relaxed text-[#19120D] sm:p-5 sm:text-base">
                    {summary}
                </div>
            </div>
        </section>
    );
}

function getCharacteristicIcon(title?: string, description?: string) {
    const text = `${title || ""} ${description || ""}`.toLowerCase();
    if (
        text.includes("roastery") ||
        text.includes("beans") ||
        text.includes("v60") ||
        text.includes("manual brew") ||
        text.includes("kopi") ||
        text.includes("espresso")
    ) {
        return <Coffee className="h-4 w-4 text-[#C8784A]" />;
    }
    if (
        text.includes("wfc") ||
        text.includes("laptop") ||
        text.includes("colokan") ||
        text.includes("wifi") ||
        text.includes("nugas") ||
        text.includes("kerja")
    ) {
        return <Laptop className="h-4 w-4 text-[#1F5A4A]" />;
    }
    if (
        text.includes("meeting") ||
        text.includes("komunal") ||
        text.includes("diskusi") ||
        text.includes("komunitas")
    ) {
        return <Users className="h-4 w-4 text-[#C8784A]" />;
    }
    if (
        text.includes("outdoor") ||
        text.includes("teras") ||
        text.includes("taman") ||
        text.includes("sunset") ||
        text.includes("sungai") ||
        text.includes("asri")
    ) {
        return <Sun className="h-4 w-4 text-amber-600" />;
    }
    if (
        text.includes("makanan") ||
        text.includes("pizza") ||
        text.includes("pasta") ||
        text.includes("cemilan") ||
        text.includes("menu") ||
        text.includes("kuliner")
    ) {
        return <Utensils className="h-4 w-4 text-[#C8784A]" />;
    }
    if (
        text.includes("heritage") ||
        text.includes("kolonial") ||
        text.includes("arsitektur") ||
        text.includes("bangunan") ||
        text.includes("gudang")
    ) {
        return <Building2 className="h-4 w-4 text-[#1F5A4A]" />;
    }
    if (
        text.includes("music") ||
        text.includes("live music") ||
        text.includes("nightlife") ||
        text.includes("akustik")
    ) {
        return <Music className="h-4 w-4 text-purple-600" />;
    }
    return <Sparkles className="h-4 w-4 text-[#C8784A]" />;
}

function CharacteristicsSection({
    characteristics,
}: {
    characteristics: Characteristic[];
}) {
    return (
        <section className="rounded-2xl border border-[#EBE5DC] bg-white p-4 shadow-xs sm:p-7">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF5C35]">
                <span className="h-2 w-2 rounded-full bg-[#FF5C35]" />
                <span>Keunggulan Utama</span>
            </div>

            <h2 className="mt-2 font-sans text-lg font-extrabold text-[#19120D] sm:text-2xl">
                Karakteristik Tempat
            </h2>

            <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-3.5 sm:grid-cols-2">
                {characteristics.map((item, index) => (
                    <div
                        key={`${item.title}-${index}`}
                        className="group relative flex flex-col rounded-xl border border-[#EBE5DC] bg-[#FAF6F0] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF5C35]/50 hover:bg-white hover:shadow-sm sm:p-4.5"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <div className="grid h-8 w-8 place-items-center rounded-xl border border-[#EBE5DC] bg-white shadow-xs">
                                {getCharacteristicIcon(item.title, item.description)}
                            </div>
                            <span className="rounded-full bg-[#FFECE5] px-2.5 py-0.5 font-sans text-xs font-bold text-[#FF5C35]">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                        </div>

                        {item.title ? (
                            <h3 className="font-sans text-base font-bold leading-snug text-[#19120D] transition-colors group-hover:text-[#FF5C35]">
                                {item.title}
                            </h3>
                        ) : null}

                        {item.description ? (
                            <p className="mt-2 text-xs font-medium leading-relaxed text-[#756A63] sm:text-sm">
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
        <section className="rounded-2xl border border-[#EBE5DC] bg-white p-4 shadow-xs sm:p-7">
            <p className="text-xs font-bold uppercase tracking-wider text-[#756A63]">
                Deskripsi
            </p>

            <h2 className="mt-1 font-sans text-lg font-extrabold text-[#19120D] sm:text-2xl">
                Tentang Tempat Ini
            </h2>

            <div className="mt-3 whitespace-pre-line text-xs font-normal leading-relaxed text-[#756A63] sm:mt-4 sm:text-base">
                {description}
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
        <section className="rounded-2xl border border-[#EBE5DC] bg-white p-4 shadow-xs sm:p-7">
            <p className="text-xs font-bold uppercase tracking-wider text-[#756A63]">
                Kelengkapan &amp; Vibes
            </p>

            <h2 className="mt-1 font-sans text-lg font-extrabold text-[#19120D] sm:text-2xl">
                Fasilitas, Suasana, &amp; Aktivitas
            </h2>

            <div className="mt-3.5 grid gap-3 sm:mt-5 sm:gap-4">
                {groupedTags.map(([type, tags]) => (
                    <div
                        key={type}
                        className="rounded-xl border border-[#EBE5DC] bg-[#FAF6F0] p-3.5 sm:p-4.5"
                    >
                        <div className="mb-3">
                            <h3 className="font-sans text-base font-bold text-[#19120D]">
                                {getTagGroupLabel(type)}
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-[#756A63]">
                                {getTagGroupDescription(type)}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <Link
                                    key={tag.id}
                                    href={`/places?category=coffee-shop&tags=${tag.slug}`}
                                    className="rounded-lg border border-[#EBE5DC] bg-white px-3 py-1.5 text-xs font-semibold text-[#19120D] shadow-xs transition hover:border-[#FF5C35] hover:bg-[#FF5C35] hover:text-white"
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
        <aside className="h-fit rounded-2xl border border-[#EBE5DC] bg-white p-4 shadow-xs sm:p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-[#FF5C35]" />
                <p className="text-xs font-bold uppercase tracking-wider text-[#FF5C35]">
                    Informasi Tempat
                </p>
            </div>

            <h2 className="mt-1 font-sans text-lg font-extrabold text-[#19120D] sm:text-xl">
                Quick Info
            </h2>

            <div className="mt-4 space-y-2 sm:mt-5 sm:space-y-2.5">
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

            <div className="mt-5 grid gap-2 sm:mt-6 sm:gap-2.5">
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
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FF5C35] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#D8431F]"
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
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#EBE5DC] bg-white px-5 py-2.5 text-xs font-bold text-[#19120D] transition hover:bg-[#19120D] hover:text-white"
                    >
                        <InstagramIcon className="h-4 w-4" />
                        Lihat Instagram
                    </TrackedExternalLink>
                ) : null}

                <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#EBE5DC] bg-[#FAF6F0] px-5 py-2.5 text-xs font-bold text-[#19120D] transition hover:bg-[#19120D] hover:text-white"
                >
                    <Share2 className="h-4 w-4" />
                    Share ke WhatsApp
                </a>
            </div>

            {/* Owner Claim Listing Card */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#EBE5DC] bg-[#FAF6F0] p-4 shadow-xs sm:mt-8 sm:p-5">
                <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFECE5] text-xl text-[#FF5C35]">
                        💼
                    </span>
                    <div>
                        <h4 className="font-sans text-sm font-bold text-[#19120D]">
                            Pemilik atau Pengelola {place.name}?
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-[#756A63]">
                            Klaim tempat ini untuk verifikasi profil resmi, perbarui info jam buka &amp; fasilitas, atau diskusikan kerja sama promo di Saranwak.
                        </p>
                    </div>
                </div>

                <a
                    href={makeOwnerClaimWhatsappUrl(place.name)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5C35] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#D8431F] active:scale-[0.98]"
                >
                    <span>Klaim / Perbarui Tempat Ini</span>
                    <ArrowRight className="h-3.5 w-3.5" />
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
        <div className="flex items-start gap-3 rounded-xl border border-[#EBE5DC] bg-[#FAF6F0] p-3.5">
            <div className="mt-0.5 text-[#FF5C35]">
                {icon === "tag" ? <Coffee className="h-4 w-4" /> : null}
                {icon === "map" ? <MapPin className="h-4 w-4" /> : null}
                {icon === "wallet" ? <Coins className="h-4 w-4" /> : null}
                {icon === "clock" ? <Clock className="h-4 w-4" /> : null}
                {icon === "pin" ? <MapPin className="h-4 w-4" /> : null}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#756A63]">
                    {label}
                </p>
                <p className="mt-0.5 font-sans text-xs font-bold leading-5 text-[#19120D] sm:text-sm">
                    {value}
                </p>
                {children}
            </div>
        </div>
    );
}

function RelatedPlacesSection({ places }: { places: Place[] }) {
    return (
        <section className="mt-8 border-t border-[#EBE5DC] pt-6 sm:mt-14 sm:pt-10">
            <div className="mb-4 flex flex-col gap-2.5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black uppercase tracking-wider text-[#FF5C35]">
                            Rekomendasi Lain
                        </span>
                        <span>☕</span>
                    </div>

                    <h2 className="font-sans text-xl font-extrabold tracking-tight text-[#19120D] sm:text-3xl">
                        Tempat Serupa di Padang
                    </h2>

                    <p className="mt-0.5 text-xs text-[#756A63] sm:mt-1 sm:text-sm">
                        Pilihan coffee shop lain di sekitar area atau dengan suasana serupa.
                    </p>
                </div>

                <Link
                    href="/places?category=coffee-shop"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5C35] transition-colors hover:text-[#D8431F] sm:text-sm"
                >
                    <span>Lihat Semua Tempat</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid gap-3.5 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    place,
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
    place: PlaceDetail;
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
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#EBE5DC] bg-white/95 px-3.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_25px_rgba(25,18,13,0.1)] backdrop-blur-md md:hidden">
            <div className="mx-auto flex max-w-md items-center gap-2">
                <BookmarkButton place={place as unknown as Place} />

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
                        className="flex-1 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-[#FF5C35] hover:bg-[#D8431F] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all duration-150 active:scale-95"
                    >
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>Petunjuk Arah</span>
                    </TrackedExternalLink>
                ) : (
                    <span className="flex-1 inline-flex min-h-10 items-center justify-center rounded-full bg-[#FAF6F0] px-3 py-2 text-xs font-bold text-[#756A63]">
                        Maps Belum Tersedia
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
                        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-[#E7D8C8] bg-white px-3 py-2 text-xs font-bold text-[#201813] transition-all duration-150 active:scale-95"
                    >
                        <InstagramIcon className="h-3.5 w-3.5 shrink-0" />
                        <span className="hidden sm:inline">Instagram</span>
                    </TrackedExternalLink>
                ) : null}

                <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-[#201813] px-3 py-2 text-xs font-bold text-white transition-all duration-150 active:scale-95"
                    aria-label="Bagikan ke WhatsApp"
                >
                    <Share2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="hidden sm:inline">Share</span>
                </a>
            </div>
        </div>
    );
}

async function getStaticPlaceSlugs() {
    const slugSet = new Set<string>();

    const fallbackPlaces = await getPlacesFromJson();
    fallbackPlaces.forEach((place) => {
        if (place.slug) {
            slugSet.add(place.slug);
        }
    });

    try {
        const places = await getPlacesFromApi({
            limit: 500,
        });

        places.forEach((place) => {
            if (place.slug) {
                slugSet.add(place.slug);
            }
        });
    } catch (error) {
        console.error("Static params D1 fetch error:", error);
    }

    return Array.from(slugSet);
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
    const places = await getPlacesFromJson();
    const jsonPlace =
        places.find(
            (place) => place.slug === slug && place.is_published !== false
        ) ?? null;

    try {
        const place = await getPlaceBySlugFromApi(slug);

        if (place) {
            const mapped = mapApiPlaceDetailToPlaceDetail(place);
            return {
                ...mapped,
                image_url: mapped.image_url || jsonPlace?.image_url || null,
                place_photos: (mapped.place_photos && mapped.place_photos.length > 0)
                    ? mapped.place_photos
                    : (jsonPlace?.place_photos ?? []),
                characteristics: mapped.characteristics || jsonPlace?.characteristics || null,
                description: mapped.description || jsonPlace?.description || null,
                short_description: mapped.short_description || jsonPlace?.short_description || null,
            };
        }
    } catch (error) {
        console.error("Place detail D1 fetch error:", error);
    }

    return jsonPlace;
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

    let characteristics = null;
    if (Array.isArray(place.characteristics)) {
        characteristics = place.characteristics;
    } else if (typeof place.characteristics === "string") {
        try {
            characteristics = JSON.parse(place.characteristics);
        } catch {
            characteristics = null;
        }
    }

    return {
        id: place.id,
        name: place.name,
        slug: place.slug,
        description: place.description,
        short_description: place.short_description,
        characteristics,
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
        is_featured: FEATURED_PLACE_SLUGS.has(place.slug),
        is_verified: null,
        is_published: Boolean(place.is_active),
        source: place.source ?? null,
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
        is_featured: FEATURED_PLACE_SLUGS.has(place.slug),
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

const WHATSAPP_CLAIM_NUMBER = "6281932097214";

function makeOwnerClaimWhatsappUrl(placeName: string) {
    const text = `Halo Admin Saranwak! Saya pemilik/pengelola dari "${placeName}". Saya ingin mengonfirmasi data tempat kami, memperbarui informasi jam buka & fasilitas, atau berdiskusi kerja sama promo di saranwak.com.`;
    return `https://wa.me/${WHATSAPP_CLAIM_NUMBER}?text=${encodeURIComponent(text)}`;
}
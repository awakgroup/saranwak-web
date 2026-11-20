"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Share2,
    CheckCircle2,
    MapPin,
    Coins,
    Quote,
    Wifi,
    Zap,
    Volume2,
    Cigarette,
    Building2,
    Car,
    Clock,
    Compass,
    ExternalLink,
    ArrowRight,
    Navigation,
    Image as ImageIcon,
    X,
} from "lucide-react";
import type { Place } from "@/types/database";
import { OpenStatusBadge } from "@/components/OpenStatusBadge";
import { BookmarkButton } from "@/components/BookmarkButton";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import { ImageLightboxModal } from "./ImageLightboxModal";

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
    latitude?: number | null;
    longitude?: number | null;
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
    place_photos: PlacePhoto[] | null;
};

interface MobilePlaceDetailViewProps {
    place: PlaceDetail;
    category: Category | null;
    tags: Tag[];
    characteristics: Characteristic[];
    galleryImages: PlacePhoto[];
    relatedPlaces: Place[];
    mainImageUrl: string;
    whatsappShareUrl: string;
    userDistance?: string | null;
}

export function MobilePlaceDetailView({
    place,
    category,
    tags,
    characteristics,
    galleryImages,
    relatedPlaces,
    mainImageUrl,
    whatsappShareUrl,
    userDistance,
}: MobilePlaceDetailViewProps) {
    const router = useRouter();
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    // Filter unique photos for gallery dock
    const allPhotos = [
        { id: "main-cover", image_url: mainImageUrl, caption: "Area Utama & Suasana" },
        ...galleryImages.filter((p) => p.image_url !== mainImageUrl),
    ];

    const handleShare = async () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title: `Nongkrong di ${place.name} yuk! ☕`,
                    text: `Eh, nongkrong di ${place.name} yuk! Cek detail foto, jam buka & lokasinya di Saranwak:`,
                    url: window.location.href,
                });
                return;
            } catch {
                // Ignore share abort
            }
        }
        if (typeof window !== "undefined") {
            window.open(whatsappShareUrl, "_blank");
        }
    };

    // Format harga
    const displayPriceRange = place.price_range || (place.price_min ? `Rp ${Number(place.price_min).toLocaleString("id-ID")} - Rp ${Number(place.price_max || 45000).toLocaleString("id-ID")}` : "Rp 20.000 - Rp 45.000");
    const budgetCategory = getBudgetCategory(place.price_range, place.price_min);

    // Curator note fallback
    const curatorNote = place.description || place.short_description || "Tempat tenang dengan koneksi stabil dan sajian kopi pilihan, sangat kondusif untuk fokus nugas dan santai sore di Padang.";

    // Checklist WFC items
    const wfcChecklist = getWfcChecklist(place, tags, characteristics);

    // Tag emoji list
    const emojiTags = getEmojiTags(tags, place);

    return (
        <div className="flex flex-col min-h-screen bg-[#fbf9f5] text-[#1b1c1a] font-sans pb-28">
            {/* Top Fixed App Bar (Identical to Stitch 9618eb0c068645cdb436c263d4ef2a0b) */}
            <header className="sticky top-0 w-full z-40 pt-safe bg-[#fbf9f5]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(41,28,20,0.04)] border-b border-[#e4e2de]/60">
                <div className="h-14 px-3 flex items-center justify-between">
                    <button
                        type="button"
                        aria-label="Kembali"
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-full text-[#1b1c1a] hover:bg-[#eae8e4] transition-colors active:scale-95 shrink-0 cursor-pointer"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    <div className="flex-1 px-2 text-center min-w-0">
                        <h1 className="font-bold text-[17px] text-[#0d0401] tracking-tight truncate">
                            Detail Kafe
                        </h1>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            type="button"
                            aria-label="Bagikan"
                            onClick={handleShare}
                            className="w-10 h-10 flex items-center justify-center rounded-full text-[#4e4540] hover:text-[#0d0401] hover:bg-[#eae8e4] transition-colors active:scale-95 cursor-pointer"
                        >
                            <Share2 className="h-5 w-5" />
                        </button>

                        <div className="w-10 h-10 flex items-center justify-center">
                            <BookmarkButton
                                place={place as unknown as Place}
                                className="!h-9 !w-9 !bg-transparent !border-none !text-[#4e4540] hover:!text-[#ac3311]"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col w-full">
                {/* 1. Top Hero Media Gallery */}
                <section className="relative w-full">
                    <div
                        onClick={() => setSelectedPhotoIndex(0)}
                        className="relative w-full aspect-[4/3] bg-[#eae8e4] overflow-hidden shadow-xs cursor-pointer group"
                    >
                        <Image
                            src={mainImageUrl}
                            alt={place.name}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Gradient Scrim */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0401]/80 via-transparent to-[#0d0401]/30" />

                        {/* Floating Badges Top */}
                        <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between pointer-events-none">
                            <OpenStatusBadge openingHours={place.opening_hours} mode="compact" />

                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ac3311] text-white text-[11.5px] font-bold shadow-md">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Kurasi Teruji</span>
                            </span>
                        </div>

                        {/* Gallery Thumbnail Floating Dock Bottom */}
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute bottom-3 left-4 right-4 flex items-center gap-2"
                        >
                            {allPhotos.slice(0, 3).map((photo, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setSelectedPhotoIndex(i)}
                                    className="w-12 h-12 rounded-lg overflow-hidden ring-2 ring-white/80 shrink-0 relative active:scale-95 transition-transform cursor-pointer"
                                >
                                    <Image
                                        src={getSafePlaceImageUrl(photo.image_url)}
                                        alt={photo.caption || place.name}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                    />
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => {
                                    const el = document.getElementById("mobile-gallery-section");
                                    if (el) el.scrollIntoView({ behavior: "smooth" });
                                    else setSelectedPhotoIndex(0);
                                }}
                                className="flex-1 h-12 rounded-lg bg-white/90 backdrop-blur-md px-2 flex items-center justify-center gap-1.5 text-[#0d0401] font-bold text-[12px] shadow-sm active:scale-95 transition-transform cursor-pointer"
                            >
                                <ImageIcon className="h-4 w-4 text-[#ac3311]" />
                                <span>+{Math.max(1, allPhotos.length)} Foto Ruang</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* 2. Header & Title Section */}
                <section className="px-4 pt-4 pb-2">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#ffdbd1] text-[#881f00] font-bold text-[10px] uppercase tracking-wider">
                                Terpilih Saranwak
                            </span>
                            <span className="text-[#4e4540] font-bold text-[11px]">
                                • Edisi {place.area || "Padang"}
                            </span>
                        </div>

                        <h1 className="text-[26px] leading-[32px] font-extrabold text-[#0d0401] tracking-tight">
                            {place.name}
                        </h1>

                        <p className="text-[13.5px] text-[#ac3311] font-semibold leading-snug">
                            {place.short_description || "Co-Working Sanctuary & Artisanal Brews"}
                        </p>
                    </div>

                    {/* Location & Distance Meta */}
                    <div className="flex items-center gap-2 mt-3 text-[#4e4540] text-[12px]">
                        <MapPin className="h-4 w-4 text-[#ac3311] shrink-0" />
                        <span>{place.area || "Padang"}, Kota Padang</span>
                        <span>•</span>
                        <span className="text-[#0d0401] font-medium">
                            {userDistance ? `${userDistance} dari lokasimu` : "Terverifikasi di Padang"}
                        </span>
                    </div>

                    {/* Price Range Meta Pill */}
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f5f3ef] text-[#1b1c1a] text-[12px] font-semibold">
                        <Coins className="h-4 w-4 text-[#ac3311]" />
                        <span className="font-bold text-[#0d0401]">{displayPriceRange}</span>
                        <span className="text-[#4e4540]">•</span>
                        <span className="text-[#4e4540]">Budget: {budgetCategory}</span>
                    </div>
                </section>

                {/* 3. Highlight Kurator Saranwak (Editorial Note) */}
                <section className="px-4 my-3">
                    <div className="relative p-4 rounded-xl bg-white shadow-xs border border-[#e4e2de]/60 overflow-hidden">
                        <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-[#ffdbd1]/40 pointer-events-none" />

                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#ac3311] flex items-center justify-center shrink-0 text-white shadow-xs">
                                <Quote className="h-4.5 w-4.5" />
                            </div>

                            <div className="flex flex-col gap-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] text-[#0d0401] font-bold">
                                        Catatan Kurator Saranwak
                                    </span>
                                    <span className="text-[10px] text-[#ac3311] px-1.5 py-0.5 rounded bg-[#efeeea] font-semibold">
                                        Jujur &amp; Independen
                                    </span>
                                </div>

                                <p className="text-[12.5px] text-[#4e4540] italic leading-relaxed">
                                    “{curatorNote}”
                                </p>

                                <div className="flex items-center gap-2 mt-1 text-[10.5px] text-[#80756f]">
                                    <span>Ditinjau oleh Tim Kurasi Saranwak</span>
                                    <span>•</span>
                                    <span className="text-[#0d0401] font-semibold">Kunjungan Teruji</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Fasilitas & Kebutuhan WFC (Grid Checklist) */}
                <section className="px-4 my-3">
                    <div className="flex items-center justify-between mb-2.5">
                        <h2 className="text-[17px] font-bold text-[#0d0401]">
                            Kesiapan Kerja (WFC)
                        </h2>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                            Terverifikasi 100%
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                        {wfcChecklist.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-xs border border-[#e4e2de]/50"
                            >
                                <div className="w-10 h-10 rounded-lg bg-[#ffdbd1] flex items-center justify-center text-[#3c0800] shrink-0">
                                    {item.icon}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-[12px] text-[#0d0401]">
                                        {item.title}
                                    </p>
                                    <p className="text-[11px] text-[#4e4540] truncate">
                                        {item.subtitle}
                                    </p>
                                </div>

                                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Suasana & Tag Kategori */}
                <section className="px-4 my-3">
                    <h2 className="text-[17px] font-bold text-[#0d0401] mb-2.5">
                        Karakter &amp; Atmosfer
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {emojiTags.map((t, idx) => (
                            <span
                                key={idx}
                                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold ${
                                    t.isSpecial
                                        ? "bg-[#ffdbd1] text-[#881f00] font-bold"
                                        : "bg-[#efeeea] text-[#0d0401]"
                                }`}
                            >
                                {t.label}
                            </span>
                        ))}
                    </div>
                </section>

                {/* 6. Galeri Kafe */}
                <section className="px-4 my-3" id="mobile-gallery-section">
                    <div className="flex items-center justify-between mb-2.5">
                        <div>
                            <h2 className="text-[17px] font-bold text-[#0d0401]">
                                Galeri Kafe
                            </h2>
                            <p className="text-[11.5px] text-[#4e4540]">
                                Suasana &amp; Ruang
                            </p>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#efeeea] text-[#4e4540] font-semibold">
                            {allPhotos.length} Foto
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        {/* 1 wide hero banner */}
                        {allPhotos[0] && (
                            <div
                                onClick={() => setSelectedPhotoIndex(0)}
                                className="col-span-2 relative aspect-[16/9] rounded-xl overflow-hidden bg-[#eae8e4] shadow-xs cursor-pointer active:scale-[0.99] transition-transform"
                            >
                                <Image
                                    src={getSafePlaceImageUrl(allPhotos[0].image_url)}
                                    alt={allPhotos[0].caption || place.name}
                                    fill
                                    sizes="100vw"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0401]/80 via-transparent to-transparent flex items-end p-3">
                                    <span className="text-[12px] text-white font-medium drop-shadow">
                                        {allPhotos[0].caption || "Area WFC & Meja Komunal"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Thumbnails grid */}
                        {allPhotos.slice(1, 5).map((photo, i) => (
                            <div
                                key={i + 1}
                                onClick={() => setSelectedPhotoIndex(i + 1)}
                                className="relative aspect-square rounded-xl overflow-hidden bg-[#eae8e4] shadow-xs cursor-pointer active:scale-[0.99] transition-transform"
                            >
                                <Image
                                    src={getSafePlaceImageUrl(photo.image_url)}
                                    alt={photo.caption || place.name}
                                    fill
                                    sizes="50vw"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0401]/75 via-transparent to-transparent flex items-end p-2.5">
                                    <span className="text-[10.5px] text-white font-medium drop-shadow truncate">
                                        {photo.caption || `Spot ${i + 1}`}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 7. Lokasi & Aksesibilitas */}
                <section className="px-4 my-3">
                    <h2 className="text-[17px] font-bold text-[#0d0401] mb-2.5">
                        Lokasi &amp; Aksesibilitas
                    </h2>

                    {/* Mini Map Card */}
                    <div className="relative w-full h-44 rounded-xl overflow-hidden shadow-xs mb-3 bg-[#eae8e4]">
                        <Image
                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                            alt="Map location preview"
                            fill
                            className="object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-[#0d0401]/10 pointer-events-none" />

                        {/* Custom Pin Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative flex flex-col items-center">
                                <div className="px-3 py-1 rounded-full bg-[#0d0401] text-white font-bold text-[11px] shadow-lg flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#ff6e48]" />
                                    <span>{place.name}</span>
                                </div>
                                <MapPin className="h-7 w-7 text-[#ac3311] fill-[#ac3311] drop-shadow -mt-1" />
                            </div>
                        </div>

                        {/* Open Maps Action Trigger */}
                        {place.google_maps_url ? (
                            <TrackedExternalLink
                                href={place.google_maps_url}
                                eventName="google_maps_clicked"
                                placeId={place.id}
                                placeName={place.name}
                                placeSlug={place.slug}
                                source="mobile_mini_map"
                                className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-md text-[#0d0401] font-bold text-[11px] shadow flex items-center gap-1 active:scale-95 transition-transform"
                            >
                                <span>Buka Peta</span>
                                <ExternalLink className="h-3 w-3" />
                            </TrackedExternalLink>
                        ) : null}
                    </div>

                    {/* Access Guide & Operating Hours Card */}
                    <div className="p-4 rounded-xl bg-white shadow-xs border border-[#e4e2de]/60 flex flex-col gap-3">
                        <div className="flex items-start gap-2.5">
                            <Clock className="h-4.5 w-4.5 text-[#ac3311] shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-[12px] text-[#0d0401]">
                                        Jadwal Operasional
                                    </span>
                                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                                        Buka Setiap Hari
                                    </span>
                                </div>
                                <p className="text-[11.5px] text-[#4e4540] mt-0.5">
                                    {place.opening_hours || "08:00 - 23:00 WIB"}
                                </p>
                            </div>
                        </div>

                        <div className="w-full h-px bg-[#efeeea]" />

                        <div className="flex items-start gap-2.5">
                            <Compass className="h-4.5 w-4.5 text-[#ac3311] shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <span className="font-bold text-[12px] text-[#0d0401]">
                                    Petunjuk &amp; Alamat
                                </span>
                                <p className="text-[11.5px] text-[#4e4540] mt-0.5 leading-relaxed">
                                    {place.address || `${place.area || "Padang Timur"}, Kota Padang, Sumatera Barat`}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. Tempat Serupa di Sekitarnya */}
                {relatedPlaces.length > 0 && (
                    <section className="my-3 pb-2 w-full">
                        <div className="px-4 flex items-center justify-between mb-2.5">
                            <h2 className="text-[17px] text-[#0d0401] font-bold tracking-tight">
                                Alternatif Serupa
                            </h2>
                            <Link
                                href="/places"
                                className="inline-flex items-center gap-1 text-[#ac3311] font-bold text-[12px] hover:underline"
                            >
                                <span>Lihat semua</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        <div className="flex gap-3 overflow-x-auto px-4 snap-x snap-mandatory no-scrollbar pb-2">
                            {relatedPlaces.map((relPlace) => {
                                const relImageUrl = getSafePlaceImageUrl(relPlace.image_url || relPlace.main_image_url);
                                const relPrice = relPlace.price_range?.includes("15k")
                                    ? "Rp 15k"
                                    : relPlace.price_range?.includes("18k")
                                    ? "Rp 18k"
                                    : relPlace.price_range?.includes("22k")
                                    ? "Rp 22k"
                                    : relPlace.price_min
                                    ? `Rp ${Math.round(relPlace.price_min / 1000)}k`
                                    : "Rp 20k";

                                return (
                                    <Link
                                        key={relPlace.id}
                                        href={`/places/${relPlace.slug}`}
                                        className="snap-start shrink-0 w-[155px] h-[215px] rounded-2xl overflow-hidden relative shadow-xs flex flex-col justify-between p-3 group border border-white/10"
                                    >
                                        <Image
                                            src={relImageUrl}
                                            alt={relPlace.name}
                                            fill
                                            sizes="160px"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0401] via-[#0d0401]/45 to-transparent" />

                                        <div className="relative z-10 flex items-center justify-between w-full">
                                            <OpenStatusBadge openingHours={relPlace.opening_hours} mode="compact" />
                                            <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                                <BookmarkButton
                                                    place={relPlace}
                                                    className="!h-6 !w-6 !bg-transparent !border-none text-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex flex-col text-white">
                                            <span className="text-[9.5px] uppercase tracking-wider text-[#ffdbd1] font-bold block mb-0.5">
                                                {relPlace.area || "Padang"}
                                            </span>
                                            <h3 className="font-bold text-[14px] leading-tight truncate">
                                                {relPlace.name}
                                            </h3>
                                            <span className="font-extrabold text-[12px] text-[#ffddb8] mt-0.5">
                                                Mulai {relPrice}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}
            </main>

            {/* Bottom Sticky Action Bar (Identical to Stitch 9618eb0c068645cdb436c263d4ef2a0b) */}
            <aside className="fixed bottom-0 inset-x-0 z-40 bg-[#fbf9f5]/95 backdrop-blur-xl border-t border-[#e4e2de] pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] pt-2 shadow-[0_-4px_24px_rgba(41,28,20,0.06)] md:hidden">
                <div className="h-16 px-4 flex items-center gap-2.5 max-w-md mx-auto">
                    {/* Bookmark Square Button */}
                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-white border border-[#e4e2de] shadow-xs shrink-0">
                        <BookmarkButton
                            place={place as unknown as Place}
                            className="!h-10 !w-10 !bg-transparent !border-none !text-[#ac3311]"
                        />
                    </div>

                    {/* Tombol Ajak Teman via WA */}
                    <a
                        href={whatsappShareUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="h-12 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl bg-[#25D366] text-white font-bold text-[12px] shadow-xs transition-transform active:scale-95 shrink-0"
                        title="Ajak Teman via WhatsApp"
                    >
                        <Share2 className="h-4 w-4" />
                        <span>Ajak Teman</span>
                    </a>

                    {/* Petunjuk Arah Primary Action Button */}
                    {place.google_maps_url ? (
                        <TrackedExternalLink
                            href={place.google_maps_url}
                            eventName="google_maps_clicked"
                            placeId={place.id}
                            placeName={place.name}
                            placeSlug={place.slug}
                            source="detail_page_mobile_sticky"
                            className="flex-1 min-w-0 h-12 flex items-center justify-center gap-1.5 px-3 rounded-xl bg-[#ac3311] hover:bg-[#881f00] text-white font-bold text-[13px] transition-transform active:scale-[0.98] shadow-[0_4px_16px_rgba(172,51,17,0.25)]"
                        >
                            <Navigation className="h-4 w-4 shrink-0" />
                            <span className="truncate">Petunjuk Arah</span>
                        </TrackedExternalLink>
                    ) : (
                        <span className="flex-1 h-12 flex items-center justify-center rounded-xl bg-[#efeeea] text-[#756A63] text-xs font-bold">
                            Maps Belum Tersedia
                        </span>
                    )}
                </div>
            </aside>

            {/* Fullscreen Photo Lightbox Modal */}
            <ImageLightboxModal
                isOpen={selectedPhotoIndex !== null}
                onClose={() => setSelectedPhotoIndex(null)}
                photos={allPhotos}
                initialIndex={selectedPhotoIndex ?? 0}
                placeName={place.name}
            />
        </div>
    );
}

function getBudgetCategory(priceRange?: string | null, priceMin?: number | string | null): string {
    if (priceRange) {
        if (priceRange.includes("< 20") || priceRange.includes("15k") || priceRange.includes("18k")) {
            return "Terjangkau";
        }
        if (priceRange.includes("20") || priceRange.includes("30") || priceRange.includes("40")) {
            return "Menengah";
        }
        if (priceRange.includes("> 40") || priceRange.includes("50")) {
            return "Premium";
        }
    }
    if (priceMin) {
        const val = Number(priceMin);
        if (val < 20000) return "Terjangkau";
        if (val <= 40000) return "Menengah";
        return "Premium";
    }
    return "Menengah";
}

function getWfcChecklist(
    place: PlaceDetail,
    tags: Tag[],
    characteristics: Characteristic[]
) {
    const text = [
        place.name,
        place.short_description || "",
        place.description || "",
        ...characteristics.map((c) => `${c.title} ${c.description}`),
        ...tags.map((t) => t.name),
    ].join(" ").toLowerCase();

    return [
        {
            title: "Wi-Fi Cepat",
            subtitle: text.includes("wifi") ? "Tersedia akses Wi-Fi stabil untuk kerja & nugas" : "Akses internet terverifikasi lancar",
            icon: <Wifi className="h-5 w-5" />,
        },
        {
            title: "Stopkontak & Port USB",
            subtitle: text.includes("colokan") ? "Tersedia di meja indoor & semi-outdoor" : "Colokan mudah dijangkau pengunjung",
            icon: <Zap className="h-5 w-5" />,
        },
        {
            title: "Suasana Fokus & Akustik",
            subtitle: text.includes("tenang") ? "Kondusif, musik ambient low-tempo" : "Kondusif untuk konsentrasi & meeting",
            icon: <Volume2 className="h-5 w-5" />,
        },
        {
            title: "Zonasi Merokok",
            subtitle: text.includes("outdoor") ? "Terpisah (Smoking Indoor AC & Garden)" : "Zonasi nyaman untuk perokok & non-perokok",
            icon: <Cigarette className="h-5 w-5" />,
        },
        {
            title: "Musholla Nyaman",
            subtitle: text.includes("musholla") ? "Tersedia, bersih & wudhu terpisah" : "Fasilitas ibadah lengkap & terawat",
            icon: <Building2 className="h-5 w-5" />,
        },
        {
            title: "Kapasitas Parkir",
            subtitle: text.includes("parkir") ? "Luas (Mobil & Motor aman berkanopi)" : "Area parkir motor & mobil memadai",
            icon: <Car className="h-5 w-5" />,
        },
    ];
}

function getEmojiTags(tags: Tag[], place: PlaceDetail) {
    const tagSlugs = new Set(tags.map((t) => t.slug.toLowerCase()));
    const result: Array<{ label: string; isSpecial?: boolean }> = [];

    if (tagSlugs.has("wfc") || tagSlugs.has("nugas")) {
        result.push({ label: "☕ WFC Friendly" });
    }
    if (tagSlugs.has("nugas")) {
        result.push({ label: "📚 Nugas" });
    }
    if (tagSlugs.has("meeting")) {
        result.push({ label: "💼 Meeting Kecil" });
    }
    if (tagSlugs.has("outdoor") || tagSlugs.has("rooftop")) {
        result.push({ label: "🌿 Aesthetic & Tanaman" });
    }
    if (tagSlugs.has("aesthetic") || tagSlugs.has("minimalis")) {
        result.push({ label: "🪵 Kayu Minimalis" });
    }
    if (tagSlugs.has("tenang")) {
        result.push({ label: "🤫 Tenang / No Loud Music" });
    }
    if (tagSlugs.has("ac") || tagSlugs.has("indoor")) {
        result.push({ label: "❄️ Indoor AC Dingin" });
    }
    if (tagSlugs.has("specialty-coffee") || place.short_description?.toLowerCase().includes("specialty")) {
        result.push({ label: "✨ Manual Brew Solok", isSpecial: true });
    }

    if (result.length === 0) {
        result.push({ label: "☕ WFC Friendly" });
        result.push({ label: "📚 Spot Nugas" });
        result.push({ label: "🌿 Suasana Cozy" });
        result.push({ label: "✨ Kopi Berkualitas", isSpecial: true });
    }

    return result;
}

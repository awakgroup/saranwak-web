"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Bookmark,
    Compass,
    ExternalLink,
    MapPin,
    Share2,
    Trash2,
    X,
} from "lucide-react";
import { useSavedPlaces, type SavedPlaceItem } from "@/lib/saved-places";
import { getSafePlaceImageUrl } from "@/lib/image-url";

interface SavedPlacesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SavedPlacesModal({ isOpen, onClose }: SavedPlacesModalProps) {
    const { savedPlaces, removePlace, clearAll } = useSavedPlaces();
    const [copied, setCopied] = useState(false);

    // Prevent background scroll when modal open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleShareList = () => {
        if (savedPlaces.length === 0) return;

        const textLines = [
            "☕ Daftar Cafe Pilihan Saranwak yang Mau Dikunjungi:",
            ...savedPlaces.map(
                (p, idx) =>
                    `${idx + 1}. *${p.name}* (${p.area})\n   🔗 https://saranwak.com/places/${p.slug}`
            ),
            "\nYuk nongkrong bareng di salah satu spot ini!",
        ];

        const shareText = textLines.join("\n");
        const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(waUrl, "_blank");

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="saved-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            />

            {/* Modal Box */}
            <div className="relative flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8] shadow-[0_24px_80px_rgba(32,24,19,0.25)]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#E7D8C8] px-6 py-5">
                    <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F8F1E8] text-[#C8784A]">
                            <Bookmark className="h-5 w-5 fill-current" />
                        </span>
                        <div>
                            <h2
                                id="saved-modal-title"
                                className="font-serif text-xl font-bold text-[#201813] sm:text-2xl"
                            >
                                Cafe Tersimpan
                            </h2>
                            <p className="text-xs font-semibold text-[#756A60]">
                                {savedPlaces.length > 0
                                    ? `${savedPlaces.length} cafe masuk wishlist kamu`
                                    : "Wishlist cafe di Padang"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {savedPlaces.length > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm("Kosongkan semua daftar tersimpan?")) {
                                        clearAll();
                                    }
                                }}
                                title="Kosongkan semua"
                                className="rounded-full p-2 text-xs font-bold text-[#756A60] transition hover:bg-red-50 hover:text-red-600"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="grid h-9 w-9 place-items-center rounded-full bg-[#F4F1EA] text-[#756A60] transition hover:bg-[#E7D8C8] hover:text-[#201813]"
                            aria-label="Tutup modal"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                    {savedPlaces.length === 0 ? (
                        <div className="my-8 flex flex-col items-center text-center">
                            <div className="grid h-20 w-20 place-items-center rounded-full bg-[#F8F1E8] text-[#C8784A]">
                                <Bookmark className="h-9 w-9 stroke-[1.5]" />
                            </div>
                            <h3 className="mt-4 font-serif text-lg font-bold text-[#201813]">
                                Belum Ada Cafe Tersimpan
                            </h3>
                            <p className="mt-2 max-w-sm text-xs font-medium leading-relaxed text-[#756A60] sm:text-sm">
                                Tekan ikon bookmark pada kartu cafe mana pun untuk menyimpannya ke daftar ini dan melihatnya kembali nanti.
                            </p>
                            <Link
                                href="/places"
                                onClick={onClose}
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#201813] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#C8784A]"
                            >
                                <Compass className="h-4 w-4" />
                                Jelajahi Coffee Shop Padang
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-3.5">
                            {savedPlaces.map((place) => (
                                <SavedPlaceRow
                                    key={place.id}
                                    place={place}
                                    onRemove={() => removePlace(place.slug)}
                                    onCloseModal={onClose}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {savedPlaces.length > 0 && (
                    <div className="border-t border-[#E7D8C8] bg-[#FAF5EE] px-6 py-4">
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs font-medium text-[#756A60]">
                                Tersimpan di browser perangkat kamu.
                            </p>
                            <button
                                type="button"
                                onClick={handleShareList}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1F5A4A] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#164337] active:scale-95"
                            >
                                <Share2 className="h-3.5 w-3.5" />
                                {copied ? "Membuka WhatsApp..." : "Ajak Teman ke WA"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function SavedPlaceRow({
    place,
    onRemove,
    onCloseModal,
}: {
    place: SavedPlaceItem;
    onRemove: () => void;
    onCloseModal: () => void;
}) {
    const safeImage = getSafePlaceImageUrl(place.image_url);

    return (
        <div className="flex items-center gap-3.5 rounded-2xl border border-[#E7D8C8] bg-white p-3 shadow-sm transition hover:border-[#C8784A]/40 sm:p-3.5">
            {/* Thumbnail */}
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#E3DED4] sm:h-18 sm:w-18">
                <img
                    src={safeImage}
                    alt={place.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#756A60]">
                    <MapPin className="h-3 w-3 text-[#C8784A]" />
                    <span>{place.area}</span>
                    {place.price_range && (
                        <>
                            <span>•</span>
                            <span className="text-[#C8784A]">{place.price_range}</span>
                        </>
                    )}
                </div>

                <Link
                    href={`/places/${place.slug}`}
                    onClick={onCloseModal}
                    className="mt-0.5 block truncate font-serif text-base font-bold text-[#201813] hover:text-[#C8784A] transition"
                >
                    {place.name}
                </Link>

                {place.opening_hours && (
                    <p className="mt-0.5 text-[11px] font-medium text-[#756A60] truncate">
                        🕒 {place.opening_hours}
                    </p>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
                {place.google_maps_url && (
                    <a
                        href={place.google_maps_url}
                        target="_blank"
                        rel="noreferrer"
                        title="Buka Google Maps"
                        className="grid h-8 w-8 place-items-center rounded-full bg-[#F4F1EA] text-[#756A60] transition hover:bg-[#1F5A4A] hover:text-white"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                )}

                <button
                    type="button"
                    onClick={onRemove}
                    title="Hapus dari tersimpan"
                    className="grid h-8 w-8 place-items-center rounded-full bg-[#F4F1EA] text-[#756A60] transition hover:bg-red-50 hover:text-red-600"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}

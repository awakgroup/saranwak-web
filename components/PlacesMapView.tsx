"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Coffee,
    Compass,
    MapPin,
    Maximize2,
    Navigation,
    X,
    Laptop,
    Sun,
    ExternalLink,
    ArrowRight,
    Megaphone,
    Sparkles,
    Bookmark,
    Wifi,
    Zap,
    Layers,
    Plus,
    Minus,
} from "lucide-react";
import type { Place } from "@/types/database";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import {
    calculateDistanceKm,
    formatDistance,
    getPlaceCoordinates,
} from "@/lib/place-coordinates";
import { getPlaceOpenStatus } from "@/lib/opening-hours";
import { useSavedPlaces } from "@/lib/saved-places";
import "leaflet/dist/leaflet.css";

interface PlacesMapViewProps {
    places: Place[];
    userCoords?: { lat: number; lng: number } | null;
    onSelectPlace?: (place: Place) => void;
}

const AREA_CHARACTERS = [
    {
        name: "Padang Barat",
        tag: "Sunset & Pusat Kota",
        desc: "Deretan kafe tepi pantai, kawasan Samudera, dan nongkrong senja santai dengan pemandangan laut lepas.",
        icon: Sun,
        count: "15+ Spot",
        filterArea: "Padang Barat",
    },
    {
        name: "Padang Timur",
        tag: "Epicentrum WFC & Nugas",
        desc: "Kawasan Jati dan Sawahan, pusat kedai kopi fokus dengan colokan melimpah, Wi-Fi stabil, dan meja ergonomis.",
        icon: Laptop,
        count: "18+ Spot",
        filterArea: "Padang Timur",
    },
    {
        name: "Padang Selatan",
        tag: "Heritage & Roastery",
        desc: "Pesona klasik tepi sungai Batang Arau dan pecinan Pondok dengan sentuhan roastery artisanal dan kopi seduh manual.",
        icon: Coffee,
        count: "10+ Spot",
        filterArea: "Padang Selatan",
    },
    {
        name: "Padang Utara",
        tag: "Lingkar Kampus & Kreatif",
        desc: "Khatib Sulaiman dan lingkar UNP/Air Tawar, ruang temu mahasiswa, diskusi kreatif, dan harga ramah kantong.",
        icon: Compass,
        count: "12+ Spot",
        filterArea: "Padang Utara",
    },
];

const WHATSAPP_NUMBER = "6281932097214";
const registerCafeUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi SaranWak, saya pemilik coffee shop di Padang dan tertarik mendaftarkan tempat saya di direktori Saranwak."
)}`;

function createPinIcon(L: typeof import("leaflet"), place: Place, isSelected: boolean) {
    const safeName = (place.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let priceText = "";
    if (place.price_range) {
        priceText = " • " + place.price_range.replace(/Rp\s*/i, "").replace(/000\b/g, "k");
    }

    const coffeeSvg = `<svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>`;

    if (isSelected) {
        return L.divIcon({
            className: "saranwak-marker-container",
            html: `
                <div class="saranwak-pin-wrapper selected">
                    <div class="flex items-center gap-1.5 bg-[#0d0401] text-white pl-1.5 pr-3 py-1 rounded-full shadow-[0_8px_20px_-2px_rgba(13,4,1,0.35)] scale-105 ring-2 ring-[#ff6e48]">
                        <div class="w-4.5 h-4.5 rounded-full bg-[#ff6e48] text-[#291c14] flex items-center justify-center shrink-0">
                            ${coffeeSvg}
                        </div>
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                        <span class="text-[11.5px] font-bold tracking-tight whitespace-nowrap max-w-[130px] truncate">${safeName}${priceText}</span>
                    </div>
                    <div class="w-2.5 h-2.5 bg-[#0d0401] rotate-45 -mt-1 rounded-xs shadow-sm"></div>
                </div>
            `,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
        });
    }

    return L.divIcon({
        className: "saranwak-marker-container",
        html: `
            <div class="saranwak-pin-wrapper">
                <div class="flex items-center gap-1.5 bg-white text-[#0d0401] pl-1.5 pr-2.5 py-1 rounded-full shadow-[0_4px_14px_rgba(41,28,20,0.12)] border border-[#e4e2de]/80 hover:scale-105 transition-transform">
                    <div class="w-4 h-4 rounded-full bg-[#ffdbd1] text-[#ac3311] flex items-center justify-center shrink-0">
                        ${coffeeSvg}
                    </div>
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span class="text-[11px] font-semibold whitespace-nowrap max-w-[110px] truncate">${safeName}${priceText}</span>
                </div>
                <div class="w-2 h-2 bg-white rotate-45 -mt-1 shadow-xs border-r border-b border-[#e4e2de]/80"></div>
            </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
    });
}

export function PlacesMapView({
    places,
    userCoords,
    onSelectPlace,
}: PlacesMapViewProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);
    const markersRef = useRef<Map<string, L.Marker>>(new Map());
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(places[0] || null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [activeTab, setActiveTab] = useState<"semua" | "nugas" | "santai">("semua");
    const { isPlaceSaved, togglePlace } = useSavedPlaces();

    // Sync selectedPlace if places change and current selectedPlace is not in list
    useEffect(() => {
        if (places.length > 0) {
            if (!selectedPlace || !places.some((p) => p.id === selectedPlace.id)) {
                setSelectedPlace(places[0]);
            }
        }
    }, [places]);

    // Filter list kafe di sebelah kiri peta berdasarkan quick filter tab
    const filteredPlaces = useMemo(() => {
        if (activeTab === "nugas") {
            return places.filter((p) => {
                const s = `${p.name} ${p.short_description || ""} ${p.description || ""}`.toLowerCase();
                const hasTag = (p.place_tags as any)?.some((pt: any) => {
                    const tag = (pt?.tags?.slug || pt?.tags?.name || "").toLowerCase();
                    return /wfc|nugas|kerja|colokan|wifi/i.test(tag);
                });
                return hasTag || s.includes("wfc") || s.includes("nugas") || s.includes("kerja") || s.includes("colokan") || s.includes("wifi");
            });
        }
        if (activeTab === "santai") {
            return places.filter((p) => {
                const s = `${p.name} ${p.short_description || ""} ${p.description || ""}`.toLowerCase();
                const hasTag = (p.place_tags as any)?.some((pt: any) => {
                    const tag = (pt?.tags?.slug || pt?.tags?.name || "").toLowerCase();
                    return /santai|sunset|outdoor|nongkrong/i.test(tag);
                });
                return hasTag || s.includes("santai") || s.includes("sunset") || s.includes("outdoor") || s.includes("nongkrong");
            });
        }
        return places;
    }, [places, activeTab]);

    // Initial Leaflet Map Setup
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        let isCancelled = false;

        import("leaflet").then((mod) => {
            if (isCancelled || !mapContainerRef.current || mapInstanceRef.current) return;

            const L = ((mod as any).default ?? mod) as typeof import("leaflet");

            // Pastikan container bersih dari instance sebelumnya (pencegahan Error: Map container is already initialized)
            if ((mapContainerRef.current as any)?._leaflet_id) {
                delete (mapContainerRef.current as any)._leaflet_id;
            }

            // Default Padang Center coordinates
            const map = L.map(mapContainerRef.current, {
                center: [-0.9410, 100.3620],
                zoom: 13,
                zoomControl: false,
                attributionControl: false,
            });

            // OpenStreetMap Standard Tiles
            L.tileLayer(
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    maxZoom: 19,
                    attribution: '&copy; OpenStreetMap contributors',
                }
            ).addTo(map);

            // Clean zoom control at top right
            L.control.zoom({ position: "topright" }).addTo(map);

            const markersLayer = L.layerGroup().addTo(map);
            markersLayerRef.current = markersLayer;
            mapInstanceRef.current = map;
            setIsMapReady(true);

            setTimeout(() => {
                map.invalidateSize();
            }, 300);
        }).catch((err) => {
            console.error("Gagal memuat Leaflet map:", err);
        });

        return () => {
            isCancelled = true;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            if (mapContainerRef.current && (mapContainerRef.current as any)?._leaflet_id) {
                delete (mapContainerRef.current as any)._leaflet_id;
            }
        };
    }, []);

    // Update markers on places change or selection
    useEffect(() => {
        if (!isMapReady || !mapInstanceRef.current || !markersLayerRef.current) return;

        import("leaflet").then((mod) => {
            const L = ((mod as any).default ?? mod) as typeof import("leaflet");
            const markersLayer = markersLayerRef.current;
            const map = mapInstanceRef.current;
            if (!markersLayer || !map) return;

            map.invalidateSize();
            markersLayer.clearLayers();
            markersRef.current.clear();

            if (places.length === 0 && !userCoords) return;

            const bounds: L.LatLngExpression[] = [];

            // Add user location marker if available
            if (userCoords) {
                bounds.push([userCoords.lat, userCoords.lng]);

                const userIcon = L.divIcon({
                    className: "saranwak-marker-container",
                    html: `
                        <div class="saranwak-user-marker" title="Lokasi Kamu">
                            <div class="saranwak-user-marker-pulse"></div>
                            <div class="saranwak-user-marker-core"></div>
                        </div>
                    `,
                    iconSize: [0, 0],
                    iconAnchor: [0, 0],
                });

                const userMarker = L.marker([userCoords.lat, userCoords.lng], {
                    icon: userIcon,
                    zIndexOffset: 1000,
                });

                userMarker.bindTooltip("📍 Lokasi Kamu", {
                    permanent: false,
                    direction: "top",
                    offset: [0, -14],
                });

                markersLayer.addLayer(userMarker);
            }

            places.forEach((place) => {
                const coords = getPlaceCoordinates(place);
                const lat = coords.lat;
                const lng = coords.lng;
                bounds.push([lat, lng]);

                const isSelected = selectedPlace?.id === place.id;
                const safeName = (place.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                const customIcon = createPinIcon(L, place, isSelected);

                const marker = L.marker([lat, lng], {
                    icon: customIcon,
                    zIndexOffset: isSelected ? 1000 : 0,
                });

                const popupHtml = `
                    <div style="font-family: inherit; min-width: 170px; padding: 2px;">
                        <div style="font-weight: 800; font-size: 13px; color: #19120D; line-height: 1.25; margin-bottom: 3px;">
                            ${safeName}
                        </div>
                        <div style="font-size: 11px; font-weight: 600; color: #756A63; margin-bottom: 8px;">
                            📍 ${place.area || "Padang"} • <span style="color: #FF5C35; font-weight: 700;">${place.price_range || "Mulai Rp 18k"}</span>
                        </div>
                        <a href="/places/${place.slug}" style="display: block; text-align: center; background: #FF5C35; color: #ffffff; padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; text-decoration: none;">
                            Lihat Detail Spot →
                        </a>
                    </div>
                `;

                marker.bindPopup(popupHtml, {
                    offset: [0, -28],
                    closeButton: true,
                    autoPan: true,
                });

                marker.on("click", () => {
                    handleFocusPlace(place);
                });

                markersLayer.addLayer(marker);
                markersRef.current.set(place.id, marker);
            });

            // Fit map to markers bounds
            if (bounds.length > 0) {
                map.fitBounds(L.latLngBounds(bounds), {
                    padding: [50, 50],
                    maxZoom: 15,
                });
            }
        }).catch((err) => {
            console.error("Gagal memperbarui markers peta:", err);
        });
    }, [places, isMapReady, userCoords]);

    const handleFocusPlace = (place: Place) => {
        setSelectedPlace(place);
        if (onSelectPlace) onSelectPlace(place);

        const targetCoords = getPlaceCoordinates(place);

        if (mapInstanceRef.current) {
            const map = mapInstanceRef.current;
            // Immediate animated pan and zoom to target cafe coords
            map.setView([targetCoords.lat, targetCoords.lng], 16, { animate: true });

            import("leaflet").then((mod) => {
                const L = ((mod as any).default ?? mod) as typeof import("leaflet");

                // Update all marker icons using Leaflet's official setIcon and open active popup
                markersRef.current.forEach((marker, id) => {
                    const isCurrent = id === place.id;
                    marker.setZIndexOffset(isCurrent ? 1000 : 0);

                    const targetPlace = places.find((p) => p.id === id);
                    if (targetPlace) {
                        marker.setIcon(createPinIcon(L, targetPlace, isCurrent));
                    }

                    if (isCurrent) {
                        setTimeout(() => {
                            marker.openPopup();
                        }, 200);
                    } else {
                        marker.closePopup();
                    }
                });
            });
        }

        // Auto-scroll the active card into view in horizontal carousel or desktop list
        if (typeof document !== "undefined") {
            const activeCardEl = document.getElementById(`mobile-map-card-${place.id}`) || document.getElementById(`map-card-${place.id}`);
            if (activeCardEl) {
                activeCardEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
            const activeDesktopCardEl = document.getElementById(`map-desktop-card-${place.id}`);
            if (activeDesktopCardEl) {
                activeDesktopCardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        }

        // On mobile, smoothly scroll map into view if it's completely out of viewport
        if (typeof window !== "undefined" && window.innerWidth < 1024 && mapContainerRef.current) {
            const rect = mapContainerRef.current.getBoundingClientRect();
            if (rect.top < -60 || rect.bottom > window.innerHeight + 120) {
                mapContainerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        }
    };

    const handleResetView = () => {
        if (!mapInstanceRef.current || places.length === 0) return;
        import("leaflet").then((mod) => {
            const L = ((mod as any).default ?? mod) as typeof import("leaflet");
            const validCoords = places.map((p) => {
                const c = getPlaceCoordinates(p);
                return [c.lat, c.lng] as L.LatLngExpression;
            });

            if (validCoords.length > 0 && mapInstanceRef.current) {
                mapInstanceRef.current.fitBounds(L.latLngBounds(validCoords), {
                    padding: [50, 50],
                    maxZoom: 15,
                });
            }
        });
    };

    return (
        <div className="w-full space-y-12">
            {/* Split Layout: Kolom Kiri List & Kolom Kanan Peta Interaktif - Aligned with Stitch 6b54b60a2a4846d38bc2c9cfe2c993f3 */}
            <div className="grid h-auto w-full grid-cols-1 gap-6 lg:h-[660px] lg:grid-cols-12">
                {/* KOLOM KIRI (col-span-5): Daftar Kafe Terdekat & Terkurasi (Hanya tampil di Desktop/lg) */}
                <aside className="hidden lg:flex flex-col overflow-hidden rounded-3xl border border-[#EBE5DC] bg-[#FAF6F0] p-4 shadow-sm sm:p-5 lg:col-span-5 lg:h-full">
                    {/* List Header */}
                    <div className="flex items-center justify-between border-b border-[#EBE5DC] pb-3.5">
                        <div>
                            <h2 className="font-sans text-base font-extrabold tracking-tight text-[#19120D] sm:text-lg">
                                Rekomendasi Terdekat
                            </h2>
                            <p className="mt-0.5 text-xs text-[#756A63]">
                                Kopi artisanal &amp; ruang berkarya ({filteredPlaces.length} spot)
                            </p>
                        </div>

                        {/* Quick Filter Tabs */}
                        <div className="flex items-center gap-1 rounded-xl bg-[#EBE5DC] p-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab("semua")}
                                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                                    activeTab === "semua"
                                        ? "bg-[#19120D] text-white shadow-xs"
                                        : "text-[#756A63] hover:text-[#19120D]"
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("nugas")}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                                    activeTab === "nugas"
                                        ? "bg-[#19120D] text-white shadow-xs"
                                        : "text-[#756A63] hover:text-[#19120D]"
                                }`}
                            >
                                WFC
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("santai")}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                                    activeTab === "santai"
                                        ? "bg-[#19120D] text-white shadow-xs"
                                        : "text-[#756A63] hover:text-[#19120D]"
                                }`}
                            >
                                Santai
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Cards Stream */}
                    <div className="custom-scroll flex-1 space-y-3 overflow-y-auto pr-1 pt-3.5 overscroll-y-contain">
                        {filteredPlaces.map((place, index) => {
                            const isSelected = selectedPlace?.id === place.id;
                            const imageUrl = getSafePlaceImageUrl(place.image_url || place.main_image_url);
                            const priceText = place.price_range || "Mulai Rp 18k";
                            const openStatus = getPlaceOpenStatus(place.opening_hours);

                            return (
                                <article
                                    key={place.id}
                                    id={`map-desktop-card-${place.id}`}
                                    onClick={() => handleFocusPlace(place)}
                                    className={`group cursor-pointer rounded-2xl p-3.5 transition-all ${
                                        isSelected
                                            ? "border-2 border-[#FF5C35] bg-white shadow-md"
                                            : "border border-[#EBE5DC] bg-white hover:border-[#FF5C35]/50 hover:shadow-sm"
                                    }`}
                                >
                                    <div className="flex gap-3.5">
                                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#19120D] sm:h-24 sm:w-24">
                                            <img
                                                src={imageUrl}
                                                alt={place.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            <span className="absolute left-1.5 top-1.5 rounded-md bg-[#FF5C35] px-1.5 py-0.5 text-[10px] font-black text-white">
                                                #{index + 1}
                                            </span>
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                                            <div>
                                                <div className="mb-0.5 flex items-center gap-1.5">
                                                    <span
                                                        className={`h-2 w-2 rounded-full ${
                                                            openStatus.variant === "24hours"
                                                                ? "bg-amber-500 animate-pulse"
                                                                : openStatus.isOpen
                                                                ? "bg-[#10B981] animate-pulse"
                                                                : "bg-[#A39B95]"
                                                        }`}
                                                    />
                                                    <span
                                                        className={`text-[10px] font-semibold ${
                                                            openStatus.isOpen ? "text-[#10B981]" : "text-[#756A63]"
                                                        }`}
                                                    >
                                                        {openStatus.isOpen
                                                            ? openStatus.is24Hours
                                                                ? "Buka 24 Jam"
                                                                : `Buka • ${openStatus.detailLabel}`
                                                            : `Tutup • ${openStatus.detailLabel}`}
                                                    </span>
                                                </div>
                                                <h3 className="truncate font-sans text-sm font-bold text-[#19120D] transition-colors group-hover:text-[#FF5C35] sm:text-base">
                                                    {place.name}
                                                </h3>
                                                <p className="mt-0.5 truncate text-xs text-[#756A63]">
                                                    {place.area || "Padang"} • {place.short_description || "Coffee & Space"}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-[#EBE5DC]/60 pt-1.5">
                                                <span className="text-xs font-bold text-[#FF5C35]">
                                                    {priceText}
                                                </span>
                                                <span className="text-[11px] font-bold text-[#756A63] group-hover:text-[#FF5C35]">
                                                    Lihat di Peta →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </aside>

                {/* KOLOM KANAN (col-span-7): Interactive Map Canvas */}
                <div className="relative h-[580px] sm:h-[620px] w-full overflow-hidden rounded-3xl border border-[#EBE5DC] bg-[#EDE8E1] shadow-sm select-none lg:col-span-7 lg:h-full">
                    <div
                        ref={mapContainerRef}
                        className="absolute inset-0 h-full w-full z-0"
                    />

                    {/* Floating Map Control Buttons (Top Right of Map) - Aligned with Stitch 252863f1beb84271b57c384f171e43ac */}
                    <div className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20 flex flex-col gap-2">
                        {/* Compass / Layer / Reset View Button */}
                        <button
                            type="button"
                            aria-label="Pusatkan Peta"
                            onClick={handleResetView}
                            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(41,28,20,0.12)] border border-[#e4e2de]/70 flex items-center justify-center text-[#0d0401] hover:bg-white active:scale-90 transition-transform cursor-pointer"
                            title="Pusatkan Peta"
                        >
                            <Layers className="h-4.5 w-4.5 text-[#0d0401]" />
                        </button>

                        {/* GPS / My Location Button */}
                        <button
                            type="button"
                            aria-label="Lokasi Saya"
                            onClick={() => {
                                if (userCoords && mapInstanceRef.current) {
                                    mapInstanceRef.current.setView([userCoords.lat, userCoords.lng], 15, { animate: true });
                                } else if (places.length > 0 && mapInstanceRef.current) {
                                    const c = getPlaceCoordinates(places[0]);
                                    mapInstanceRef.current.setView([c.lat, c.lng], 14, { animate: true });
                                }
                            }}
                            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(41,28,20,0.12)] border border-[#e4e2de]/70 flex items-center justify-center text-[#ac3311] hover:bg-white active:scale-90 transition-transform cursor-pointer"
                            title="Lokasi Terdekat"
                        >
                            <Navigation className="h-4.5 w-4.5 text-[#ac3311]" />
                        </button>

                        {/* Zoom In & Out Block */}
                        <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-full shadow-[0_4px_16px_rgba(41,28,20,0.12)] border border-[#e4e2de]/70 overflow-hidden">
                            <button
                                type="button"
                                aria-label="Perbesar"
                                onClick={() => mapInstanceRef.current?.zoomIn()}
                                className="w-10 h-9 flex items-center justify-center text-[#0d0401] hover:bg-[#efeeea] active:scale-95 transition-colors cursor-pointer"
                                title="Perbesar"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                            <div className="w-5 h-[1px] bg-[#e4e2de] self-center" />
                            <button
                                type="button"
                                aria-label="Perkecil"
                                onClick={() => mapInstanceRef.current?.zoomOut()}
                                className="w-10 h-9 flex items-center justify-center text-[#0d0401] hover:bg-[#efeeea] active:scale-95 transition-colors cursor-pointer"
                                title="Perkecil"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Top Overlay Badge & Reset Button (Desktop only) */}
                    <div className="hidden lg:flex pointer-events-none absolute left-4 top-4 z-10 flex-wrap items-center gap-2 sm:left-6 sm:top-6">
                        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[#EBE5DC] bg-white/95 px-4 py-2 text-xs font-bold text-[#19120D] shadow-md backdrop-blur">
                            <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                            <span>{places.length} Cafe di Peta Padang</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleResetView}
                            title="Reset Tampilan Peta"
                            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-[#EBE5DC] bg-white/95 px-3.5 py-2 text-xs font-bold text-[#756A63] shadow-md backdrop-blur transition hover:bg-[#FAF4ED] hover:text-[#19120D]"
                        >
                            <Maximize2 className="h-3.5 w-3.5" />
                            <span>Reset Peta</span>
                        </button>
                    </div>

                    {/* Floating Preview Card when a Place is Selected (Desktop only) */}
                    {selectedPlace && (
                        <div className="hidden lg:block pointer-events-auto absolute inset-x-4 bottom-4 z-20 mx-auto max-w-md sm:bottom-6">
                            <div className="group relative flex cursor-pointer items-center gap-4 rounded-3xl border border-[#EBE5DC] bg-white/95 p-3.5 shadow-xl backdrop-blur-xl sm:p-4 transition hover:border-[#FF5C35]/50">
                                {/* Stretched Link for the entire preview card */}
                                <Link
                                    href={`/places/${selectedPlace.slug}`}
                                    className="absolute inset-0 z-10"
                                    aria-label={`Buka detail ${selectedPlace.name}`}
                                />

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedPlace(null);
                                    }}
                                    className="relative z-20 -right-2 -top-2 ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#19120D] text-white shadow-md transition hover:scale-105"
                                    style={{ position: "absolute", top: "-8px", right: "-8px" }}
                                    aria-label="Tutup preview"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>

                                <div className="pointer-events-none relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#EBE5DC]">
                                    <img
                                        src={getSafePlaceImageUrl(selectedPlace.image_url || selectedPlace.main_image_url)}
                                        alt={selectedPlace.name}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="pointer-events-none min-w-0 flex-1 pr-3">
                                    <div className="flex flex-wrap items-center gap-1 text-[11px] font-bold text-[#756A63]">
                                        <MapPin className="h-3 w-3 text-[#FF5C35]" />
                                        <span>{selectedPlace.area || "Padang"}</span>
                                        {selectedPlace.price_range && (
                                            <>
                                                <span>•</span>
                                                <span className="text-[#FF5C35]">{selectedPlace.price_range}</span>
                                            </>
                                        )}
                                    </div>

                                    <h3 className="mt-0.5 block truncate font-sans text-base font-bold text-[#19120D] transition group-hover:text-[#FF5C35]">
                                        {selectedPlace.name}
                                    </h3>

                                    <div className="mt-2.5 flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-xl bg-[#19120D] px-3.5 py-1.5 text-xs font-bold text-white transition group-hover:bg-[#FF5C35]">
                                            <span>Detail Lengkap</span>
                                            <ArrowRight className="h-3 w-3" />
                                        </span>

                                        {selectedPlace.google_maps_url && (
                                            <a
                                                href={selectedPlace.google_maps_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="pointer-events-auto relative z-20 inline-flex items-center gap-1 rounded-xl border border-[#EBE5DC] bg-white px-3 py-1.5 text-xs font-bold text-[#756A63] transition hover:text-[#FF5C35]"
                                            >
                                                <Navigation className="h-3 w-3" />
                                                <span>Rute</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Bottom Floating Preview Card Carousel (Overlaid Above Map) - Aligned with Stitch 252863f1beb84271b57c384f171e43ac */}
            <div className="block lg:hidden -mt-48 z-20 w-full pb-2 relative px-3 sm:px-0">
                {/* Carousel Header Badge Pill */}
                <div className="mb-2 flex items-center justify-between px-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-[#e4e2de]/60">
                        <span className="w-2 h-2 rounded-full bg-[#ac3311] animate-pulse" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d0401]">
                            {places.length} Spot di Sekitarmu
                        </span>
                    </div>
                    <span className="text-[10.5px] font-medium text-[#4e4540] bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-[#e4e2de]/60 shadow-xs">
                        Geser kartu ➔
                    </span>
                </div>

                {/* Horizontal Cards Track */}
                <div className="no-scrollbar flex gap-3 overflow-x-auto px-1 pb-3 pt-1 snap-x snap-mandatory overscroll-x-contain">
                    {places.map((place) => {
                        const isSelected = selectedPlace?.id === place.id;
                        const imageUrl = getSafePlaceImageUrl(place.image_url || place.main_image_url);
                        const openStatus = getPlaceOpenStatus(place.opening_hours);
                        const coords = getPlaceCoordinates(place);
                        const distKm = userCoords ? calculateDistanceKm(userCoords.lat, userCoords.lng, coords.lat, coords.lng) : null;
                        const distText = distKm !== null ? `${formatDistance(distKm)} • ` : "";
                        const priceText = place.price_range ? place.price_range.replace(/Rp\s*/i, "").replace(/000\b/g, "k") : "18k";

                        return (
                            <article
                                key={place.id}
                                id={`mobile-map-card-${place.id}`}
                                onClick={() => handleFocusPlace(place)}
                                className={`cafe-card snap-center shrink-0 w-[86vw] max-w-[340px] bg-white rounded-2xl p-3 shadow-[0_12px_32px_-4px_rgba(41,28,20,0.14),0_4px_12px_-2px_rgba(41,28,20,0.06)] flex flex-col gap-2.5 transition-all cursor-pointer ${
                                    isSelected
                                        ? "ring-2 ring-[#ac3311]"
                                        : "border border-[#e4e2de]/70"
                                }`}
                            >
                                {/* Card Image Segment */}
                                <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#efeeea]">
                                    <Image
                                        src={imageUrl}
                                        alt={place.name}
                                        fill
                                        sizes="340px"
                                        className="object-cover"
                                    />
                                    {/* Frosted Status Badge */}
                                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-xs">
                                        <span
                                            className={`w-2 h-2 rounded-full ${
                                                openStatus.variant === "24hours"
                                                    ? "bg-amber-500 animate-pulse"
                                                    : openStatus.isOpen
                                                    ? "bg-emerald-500 animate-pulse"
                                                    : "bg-[#80756f]"
                                            }`}
                                        />
                                        <span className="text-[11px] font-bold text-[#0d0401]">
                                            {openStatus.is24Hours
                                                ? "Buka 24 Jam"
                                                : openStatus.isOpen
                                                ? "Buka"
                                                : "Tutup"}
                                        </span>
                                    </div>
                                    {/* Bookmark Action */}
                                    <button
                                        type="button"
                                        aria-label={`Simpan ${place.name}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            togglePlace(place);
                                        }}
                                        className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors shadow-xs ${
                                            isPlaceSaved(place.slug)
                                                ? "bg-[#ac3311] text-white"
                                                : "bg-white/90 text-[#0d0401] hover:text-[#ac3311]"
                                        }`}
                                    >
                                        <Bookmark className={`h-4 w-4 ${isPlaceSaved(place.slug) ? "fill-current" : ""}`} />
                                    </button>
                                </div>

                                {/* Details Info */}
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-[15.5px] text-[#0d0401] truncate leading-snug">
                                                {place.name}
                                            </h3>
                                            <p className="text-[11.5px] text-[#4e4540] truncate">
                                                {place.vibe || "Coffee Shop"} • {distText}{place.area || "Padang"}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <span className="text-[9.5px] text-[#80756f] block uppercase tracking-wider font-semibold">Mulai</span>
                                            <span className="text-[14px] text-[#ac3311] font-bold">Rp {priceText}</span>
                                        </div>
                                    </div>

                                    {/* Feature Chips */}
                                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10.5px] font-semibold">
                                            <Wifi className="h-3 w-3" /> Wi-Fi
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#efeeea] text-[#4e4540] text-[10.5px] font-semibold">
                                            <Zap className="h-3 w-3 text-[#ac3311]" /> Stopkontak
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ffdbd1]/60 text-[#ac3311] text-[10.5px] font-semibold">
                                            {place.vibe || "Kondusif"}
                                        </span>
                                    </div>
                                </div>

                                {/* Dual Action Buttons */}
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <a
                                        href={place.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} Padang`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="h-10 rounded-lg bg-[#efeeea] text-[#0d0401] text-[12px] font-bold flex items-center justify-center gap-1.5 active:bg-[#eae8e4] transition-colors"
                                    >
                                        <Navigation className="h-3.5 w-3.5 text-[#ac3311]" />
                                        <span>Rute (Maps)</span>
                                    </a>
                                    <Link
                                        href={`/places/${place.slug}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="h-10 rounded-lg bg-[#ac3311] text-white text-[12px] font-bold flex items-center justify-center gap-1 active:bg-[#962c0e] transition-colors shadow-xs"
                                    >
                                        <span>Detail Kafe</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>

            {/* Eksplorasi Berdasarkan Karakter Area - Aligned with Stitch 6b54b60a2a4846d38bc2c9cfe2c993f3 */}
            <section className="hidden lg:block border-t border-[#EBE5DC] pt-10">
                <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-1.5 flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wider text-[#FF5C35]">
                                KARAKTER &amp; ZONA KOPI PADANG
                            </span>
                            <span>✨</span>
                        </div>
                        <h2 className="font-sans text-2xl font-extrabold tracking-tight text-[#19120D] sm:text-3xl">
                            Eksplorasi Berdasarkan Karakter Area
                        </h2>
                    </div>
                    <p className="max-w-md text-xs text-[#756A63] sm:text-sm">
                        Setiap sudut kota memiliki DNA dan nuansa khas: dari deretan roastery artisanal di kawasan heritage hingga ruang kerja ber-AC yang tenang.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {AREA_CHARACTERS.map((area) => {
                        const Icon = area.icon;
                        return (
                            <Link
                                key={area.name}
                                href={`/places?area=${encodeURIComponent(area.filterArea)}`}
                                className="group flex flex-col justify-between rounded-2xl border border-[#EBE5DC] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#FF5C35]/50 hover:shadow-md"
                            >
                                <div>
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFEAE5] text-[#FF5C35] transition-transform group-hover:scale-105">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="rounded-full bg-[#FAF6F0] px-2.5 py-0.5 text-xs font-bold text-[#756A63]">
                                            {area.count}
                                        </span>
                                    </div>
                                    <h3 className="font-sans text-lg font-bold text-[#19120D] transition-colors group-hover:text-[#FF5C35]">
                                        {area.name}
                                    </h3>
                                    <span className="mt-0.5 block text-xs font-semibold text-[#FF5C35]">
                                        {area.tag}
                                    </span>
                                    <p className="mt-2 text-xs leading-relaxed text-[#756A63]">
                                        {area.desc}
                                    </p>
                                </div>

                                <div className="mt-5 flex items-center gap-1.5 border-t border-[#EBE5DC] pt-3 text-xs font-bold text-[#FF5C35]">
                                    <span>Jelajahi Area</span>
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Owner CTA Banner */}
            <section className="hidden lg:block pt-4">
                <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-[2.5rem] border border-[#FF5C35]/30 bg-gradient-to-r from-[#1E130B] via-[#2A180E] to-[#140D08] p-8 text-white shadow-2xl md:flex-row sm:p-12">
                    <div className="relative z-10 max-w-xl">
                        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#FF5C35]/40 bg-[#FF5C35]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FDBA74]">
                            <Megaphone className="h-3.5 w-3.5 text-[#FF5C35]" />
                            <span>KHUSUS PEMILIK KAFE</span>
                        </div>
                        <h2 className="mb-2 font-sans text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                            Punya Coffee Shop di Padang? Daftarkan Spot Kamu.
                        </h2>
                        <p className="text-xs leading-relaxed text-[#D4C9C3] sm:text-sm">
                            Jangkau ribuan mahasiswa, pegiat remote work, dan pecinta kopi di Sumatera Barat. Publikasikan menu unggulan Anda bersama kami.
                        </p>
                    </div>

                    <div className="relative z-10 shrink-0">
                        <a
                            href={registerCafeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-2xl bg-[#FF5C35] px-7 py-3.5 text-xs font-bold text-white shadow-[0_12px_32px_-4px_rgba(255,92,53,0.35)] transition-all duration-300 hover:scale-105 hover:bg-[#D8431F] hover:shadow-2xl active:scale-95 sm:text-sm"
                        >
                            <span>Daftarkan Sekarang</span>
                            <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

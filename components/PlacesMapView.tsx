"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    Coffee,
    Compass,
    ExternalLink,
    MapPin,
    Maximize2,
    Navigation,
    X,
} from "lucide-react";
import type { Place } from "@/types/database";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import "leaflet/dist/leaflet.css";

interface PlacesMapViewProps {
    places: Place[];
    onSelectPlace?: (place: Place) => void;
}

export function PlacesMapView({ places, onSelectPlace }: PlacesMapViewProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);

    // Initial map setup
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        let isCancelled = false;

        import("leaflet").then((L) => {
            if (isCancelled || !mapContainerRef.current || mapInstanceRef.current) return;

            // Default Padang Center: -0.9471, 100.3650
            const map = L.map(mapContainerRef.current, {
                center: [-0.9410, 100.3620],
                zoom: 13,
                zoomControl: false,
                attributionControl: false,
            });

            // OpenStreetMap Standard Tiles - 100% Free, NO API KEY required
            L.tileLayer(
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    maxZoom: 19,
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }
            ).addTo(map);

            // Add clean zoom control at top right
            L.control.zoom({ position: "topright" }).addTo(map);

            const markersLayer = L.layerGroup().addTo(map);
            markersLayerRef.current = markersLayer;
            mapInstanceRef.current = map;
            setIsMapReady(true);
        });

        return () => {
            isCancelled = true;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update markers when places change or map becomes ready
    useEffect(() => {
        if (!isMapReady || !mapInstanceRef.current || !markersLayerRef.current) return;

        import("leaflet").then((L) => {
            const markersLayer = markersLayerRef.current;
            const map = mapInstanceRef.current;
            if (!markersLayer || !map) return;

            markersLayer.clearLayers();

            const validPlaces = places.filter(
                (p) => typeof p.latitude === "number" && typeof p.longitude === "number"
            );

            if (validPlaces.length === 0) return;

            const bounds: L.LatLngExpression[] = [];

            validPlaces.forEach((place) => {
                const lat = place.latitude as number;
                const lng = place.longitude as number;
                bounds.push([lat, lng]);

                // Create custom HTML marker pin with Saranwak aesthetic
                const isSelected = selectedPlace?.id === place.id;

                const customIcon = L.divIcon({
                    className: "saranwak-marker-container",
                    html: `
                        <div class="group relative cursor-pointer -translate-x-1/2 -translate-y-full transition-transform duration-200 hover:scale-110">
                            <div class="flex items-center gap-1.5 rounded-full border-2 ${
                                isSelected
                                    ? "border-[#201813] bg-[#201813] text-[#F2C38B] scale-110 ring-4 ring-[#C8784A]/30"
                                    : "border-[#C8784A] bg-[#FFFDF8] text-[#201813] shadow-md hover:border-[#201813]"
                            } px-2.5 py-1 text-xs font-black shadow-lg">
                                <span class="h-2 w-2 rounded-full ${isSelected ? "bg-[#F2C38B]" : "bg-[#C8784A]"}"></span>
                                <span class="max-w-[110px] truncate text-[11px] leading-tight font-extrabold">${place.name}</span>
                            </div>
                            <div class="mx-auto -mt-1 h-2 w-2 rotate-45 border-b-2 border-r-2 ${
                                isSelected ? "border-[#201813] bg-[#201813]" : "border-[#C8784A] bg-[#FFFDF8]"
                            }"></div>
                        </div>
                    `,
                    iconSize: [120, 42],
                    iconAnchor: [60, 42],
                });

                const marker = L.marker([lat, lng], { icon: customIcon });

                marker.on("click", () => {
                    setSelectedPlace(place);
                    if (onSelectPlace) onSelectPlace(place);
                    map.panTo([lat, lng], { animate: true, duration: 0.5 });
                });

                markersLayer.addLayer(marker);
            });

            // Fit map to markers bounds
            if (bounds.length > 0) {
                map.fitBounds(L.latLngBounds(bounds), {
                    padding: [40, 40],
                    maxZoom: 15,
                });
            }
        });
    }, [places, isMapReady, selectedPlace?.id, onSelectPlace]);

    const handleResetView = () => {
        if (!mapInstanceRef.current || places.length === 0) return;
        import("leaflet").then((L) => {
            const validCoords = places
                .filter((p) => typeof p.latitude === "number" && typeof p.longitude === "number")
                .map((p) => [p.latitude as number, p.longitude as number] as L.LatLngExpression);

            if (validCoords.length > 0 && mapInstanceRef.current) {
                mapInstanceRef.current.fitBounds(L.latLngBounds(validCoords), {
                    padding: [40, 40],
                    maxZoom: 15,
                });
            }
        });
    };

    return (
        <div className="relative overflow-hidden rounded-[32px] border border-[#E7D8C8] bg-[#F8F1E8] shadow-[0_18px_60px_rgba(47,35,25,0.08)]">
            {/* Map Canvas Container */}
            <div
                ref={mapContainerRef}
                className="h-[520px] w-full z-0 sm:h-[600px] lg:h-[640px]"
            />

            {/* Top Overlay Badge / Controls */}
            <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2 sm:left-6 sm:top-6">
                <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[#E7D8C8] bg-white/95 px-4 py-2 text-xs font-bold text-[#201813] shadow-md backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-[#1F5A4A]" />
                    <span>
                        {places.length} Cafe di Peta Padang
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleResetView}
                    title="Lihat semua spot di Padang"
                    className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-[#E7D8C8] bg-white/95 px-3.5 py-2 text-xs font-bold text-[#756A60] shadow-md backdrop-blur transition hover:text-[#201813] hover:bg-[#FAF4ED]"
                >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>Reset Peta</span>
                </button>
            </div>

            {/* Floating Preview Card when a Place is Selected */}
            {selectedPlace && (
                <div className="pointer-events-auto absolute bottom-4 inset-x-4 z-20 mx-auto max-w-md sm:bottom-6">
                    <div className="relative flex items-center gap-4 rounded-[26px] border border-[#E7D8C8] bg-[#FFFDF8] p-3.5 shadow-[0_20px_60px_rgba(32,24,19,0.22)] backdrop-blur-xl sm:p-4">
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setSelectedPlace(null)}
                            className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-[#201813] text-white shadow-md transition hover:scale-105"
                            aria-label="Tutup preview"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>

                        {/* Image */}
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#E3DED4] sm:h-22 sm:w-22">
                            <img
                                src={getSafePlaceImageUrl(selectedPlace.image_url || selectedPlace.main_image_url)}
                                alt={selectedPlace.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1 pr-4">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#756A60]">
                                <MapPin className="h-3 w-3 text-[#C8784A]" />
                                <span>{selectedPlace.area || selectedPlace.city || "Padang"}</span>
                                {selectedPlace.price_range && (
                                    <>
                                        <span>•</span>
                                        <span className="text-[#C8784A]">{selectedPlace.price_range}</span>
                                    </>
                                )}
                            </div>

                            <Link
                                href={`/places/${selectedPlace.slug}`}
                                className="mt-0.5 block truncate font-serif text-base font-bold text-[#201813] transition hover:text-[#C8784A] sm:text-lg"
                            >
                                {selectedPlace.name}
                            </Link>

                            <p className="mt-0.5 text-xs font-medium text-[#756A60] truncate">
                                🕒 {selectedPlace.opening_hours || "Buka setiap hari"}
                            </p>

                            <div className="mt-2.5 flex items-center gap-2">
                                <Link
                                    href={`/places/${selectedPlace.slug}`}
                                    className="inline-flex items-center gap-1 rounded-full bg-[#201813] px-3.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#C8784A]"
                                >
                                    Detail Lengkap →
                                </Link>

                                {selectedPlace.google_maps_url && (
                                    <a
                                        href={selectedPlace.google_maps_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 rounded-full border border-[#E7D8C8] bg-white px-3 py-1.5 text-[11px] font-bold text-[#756A60] transition hover:border-[#1F5A4A] hover:text-[#1F5A4A]"
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
    );
}

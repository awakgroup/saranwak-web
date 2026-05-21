import Link from "next/link";
import { ArrowRight, Coffee, MapPin } from "lucide-react";
import { PlaceCard } from "@/components/PlaceCard";
import type { Place } from "@/types/database";

type FeaturedPlacesSectionProps = {
    places: Place[];
};

export function FeaturedPlacesSection({ places }: FeaturedPlacesSectionProps) {
    const mobilePlaces = places.slice(0, 3);

    return (
        <section className="relative">
            <SectionHeader placesCount={places.length} />

            {places.length === 0 ? (
                <EmptyPlacesState />
            ) : (
                <>
                    {/* Mobile compact preview */}
                    <div className="grid gap-4 md:hidden">
                        {mobilePlaces.map((place, index) => (
                            <PlaceCard
                                key={place.id}
                                place={place}
                                source="homepage_featured"
                                position={index + 1}
                            />
                        ))}

                        <Link
                            href="/places?category=coffee-shop"
                            className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#201813] px-5 py-3 text-sm font-black text-white shadow-[0_14px_32px_rgba(32,24,19,0.18)] transition duration-300 active:scale-[0.98]"
                        >
                            Lihat semua coffee shop
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {/* Desktop full grid */}
                    <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
                        {places.map((place, index) => (
                            <div key={place.id} className="min-w-0">
                                <PlaceCard
                                    place={place}
                                    source="homepage_featured"
                                    position={index + 1}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

function SectionHeader({ placesCount }: { placesCount: number }) {
    return (
        <div className="mb-6 flex flex-col gap-5 md:mb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E7D8C8] bg-[#FFFDF8]/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#C8784A] shadow-sm backdrop-blur sm:text-xs">
                    <Coffee className="h-4 w-4" />
                    Featured Coffee Shops
                </div>

                <h2 className="mt-4 text-[34px] font-black leading-[0.96] tracking-[-0.055em] text-[#201813] sm:text-5xl lg:text-[56px]">
                    Coffee shop pilihan di Padang
                </h2>

                <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#756A60] sm:text-base">
                    Pilihan cafe dan coffee shop Padang yang bisa kamu cek sebelum
                    berangkat. Cocok untuk nugas, nongkrong, meeting santai, first date,
                    atau cari suasana baru.
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
                <div className="hidden items-center gap-2 rounded-full border border-[#E7D8C8] bg-[#FFFDF8]/80 px-4 py-3 text-sm font-black text-[#201813] shadow-sm backdrop-blur sm:flex">
                    <MapPin className="h-4 w-4 text-[#C8784A]" />
                    {placesCount > 0 ? `${placesCount} tempat pilihan` : "Kurasi lokal"}
                </div>

                <Link
                    href="/places?category=coffee-shop"
                    className="hidden min-h-12 items-center justify-center gap-2 rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-5 py-3 text-sm font-black text-[#1F5A4A] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white md:inline-flex"
                >
                    Lihat semua tempat
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}

function EmptyPlacesState() {
    return (
        <div className="relative overflow-hidden rounded-[28px] border border-dashed border-[#D8C9B7] bg-[#FFFDF8]/80 p-6 text-center shadow-sm backdrop-blur sm:p-10">
            <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-[#F2C38B]/25 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-[#1F5A4A]/10 blur-3xl" />

            <div className="relative mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#F4F1EA] text-[#C8784A]">
                <Coffee className="h-6 w-6" />
            </div>

            <p className="relative mt-4 text-lg font-black text-[#201813]">
                Belum ada data coffee shop.
            </p>

            <p className="relative mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-[#756A60] sm:text-base">
                Cek tabel <span className="font-black">places</span> di Supabase.
                Pastikan data sudah published, featured, dan kategorinya Coffee Shop.
            </p>

            <Link
                href="/places?category=coffee-shop"
                className="relative mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#201813] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#3A2A1F]"
            >
                Lihat daftar tempat
                <ArrowRight className="h-4 w-4" />
            </Link>
        </div>
    );
}
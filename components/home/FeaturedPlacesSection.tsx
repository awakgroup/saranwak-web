import Link from "next/link";
import { PlaceCard } from "@/components/PlaceCard";
import type { Place } from "@/types/database";

type FeaturedPlacesSectionProps = {
    places: Place[];
};

export function FeaturedPlacesSection({ places }: FeaturedPlacesSectionProps) {
    const mobilePlaces = places.slice(0, 3);

    return (
        <section className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-5 md:pt-10">
            <SectionHeader />

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
                            className="mt-1 flex min-h-12 items-center justify-center rounded-full bg-[#1F5A4A] px-5 py-3 text-sm font-black text-white shadow-[0_14px_32px_rgba(31,90,74,0.2)] transition duration-300 active:scale-[0.98]"
                        >
                            Lihat semua coffee shop →
                        </Link>
                    </div>

                    {/* Desktop full grid */}
                    <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
                        {places.map((place, index) => (
                            <PlaceCard
                                key={place.id}
                                place={place}
                                source="homepage_featured"
                                position={index + 1}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

function SectionHeader() {
    return (
        <div className="mb-5 flex flex-col gap-4 md:mb-7 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A] sm:text-xs md:text-sm">
                    Featured Coffee Shops
                </p>

                {/* Mobile title */}
                <h2 className="mt-2 text-3xl font-black leading-[1.02] tracking-[-0.05em] text-[#201813] md:hidden">
                    Coffee shop pilihan.
                </h2>

                {/* Desktop title */}
                <h2 className="mt-2 hidden text-3xl font-black tracking-[-0.04em] text-[#201813] sm:text-4xl md:block md:text-5xl">
                    Coffee shop pilihan di Padang
                </h2>

                {/* Mobile description */}
                <p className="mt-2 text-sm font-semibold leading-6 text-[#756A60] md:hidden">
                    Preview tempat pilihan buat nugas, nongkrong, atau ngopi santai.
                </p>

                {/* Desktop description */}
                <p className="mt-3 hidden max-w-2xl text-sm font-semibold leading-7 text-[#756A60] sm:text-base md:block">
                    Pilihan cafe dan coffee shop Padang yang bisa kamu cek sebelum
                    berangkat. Cocok untuk nugas, nongkrong, meeting santai, first date,
                    atau cari suasana baru.
                </p>
            </div>

            <Link
                href="/places?category=coffee-shop"
                className="hidden min-h-12 w-fit items-center justify-center rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-5 py-3 text-sm font-black text-[#1F5A4A] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white md:inline-flex"
            >
                Lihat semua tempat →
            </Link>
        </div>
    );
}

function EmptyPlacesState() {
    return (
        <div className="rounded-[24px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 text-center shadow-[0_18px_60px_rgba(47,35,25,0.06)] sm:rounded-[32px] sm:p-10">
            <p className="text-lg font-black text-[#201813]">
                Belum ada data coffee shop.
            </p>

            <p className="mt-2 text-sm font-semibold leading-6 text-[#756A60] sm:text-base">
                Cek tabel <span className="font-black">places</span> di Supabase.
                Pastikan data sudah published, featured, dan kategorinya Coffee Shop.
            </p>
        </div>
    );
}
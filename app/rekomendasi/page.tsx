import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlaceCard } from "@/components/PlaceCard";
import type { Place } from "@/types/database";

async function getRecommendedPlaces() {
    const { data, error } = await supabase
        .from("places")
        .select(`
      *,
      categories (
        id,
        name,
        slug,
        icon
      ),
      place_tags (
        id,
        tags (
          id,
          name,
          slug,
          type
        )
      )
    `)
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Recommended places error:", error.message);
        return [];
    }

    return data as Place[];
}

const quickFilters = [
    {
        label: "Buat Nugas",
        href: "/places?mood=nugas",
    },
    {
        label: "Budget Mahasiswa",
        href: "/places?mood=budget-mahasiswa",
    },
    {
        label: "Healing",
        href: "/places?mood=healing",
    },
    {
        label: "Coffee Shop",
        href: "/places?category=coffee-shop",
    },
];

export default async function RekomendasiPage() {
    const places = await getRecommendedPlaces();

    return (
        <main className="min-h-screen bg-[#F6F0E7] px-5 py-12 text-[#201813]">
            <section className="mx-auto max-w-6xl">
                <div className="rounded-[36px] border border-[#E7D8C8] bg-[#FFFDF8] p-8 md:p-12">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C8784A]">
                        Rekomendasi Saranwak
                    </p>

                    <h1 className="mt-3 max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
                        Tempat pilihan yang layak kamu cek dulu.
                    </h1>

                    <p className="mt-5 max-w-2xl text-lg leading-8 text-[#756A60]">
                        Kurasi tempat berdasarkan kategori, mood, kebutuhan, dan area.
                        Untuk sekarang masih mulai dari data featured. Nanti bisa dibuat
                        lebih pintar berdasarkan lokasi, rating, promo, dan kebiasaan user.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                        {quickFilters.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-full border border-[#E7D8C8] bg-[#F6F0E7] px-4 py-2 text-sm font-bold text-[#4B4038] transition hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-10">
                    <div className="mb-6 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C8784A]">
                                Featured
                            </p>
                            <h2 className="mt-2 text-3xl font-black">
                                Pilihan dari Saranwak
                            </h2>
                        </div>

                        <Link
                            href="/places"
                            className="rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-5 py-3 text-sm font-black text-[#1F5A4A] transition hover:bg-[#1F5A4A] hover:text-white"
                        >
                            Lihat semua
                        </Link>
                    </div>

                    {places.length === 0 ? (
                        <div className="rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8] p-10 text-center">
                            <p className="text-lg font-black">Belum ada rekomendasi.</p>
                            <p className="mt-2 text-[#756A60]">
                                Pastikan ada data tempat dengan status published dan featured.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-3">
                            {places.map((place) => (
                                <PlaceCard key={place.id} place={place} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
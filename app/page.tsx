import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlaceCard } from "@/components/PlaceCard";
import { HeroSearch } from "@/components/HeroSearch";
import type { Place } from "@/types/database";
import { WhySaranwak } from "@/components/WhySaranwak";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const WHATSAPP_NUMBER = "6281932097214";

async function getFeaturedPlaces() {
  const { data, error } = await supabase
    .from("places")
    .select(`
      *,
      categories!inner (
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
    .eq("categories.slug", "coffee-shop")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Supabase error:", error.message);
    return [];
  }

  return data as unknown as Place[];
}

const categories = [
  {
    label: "Coffee Shop Padang",
    emoji: "☕",
    desc: "Cari cafe Padang untuk nugas, nongkrong, meeting, atau ngopi santai.",
    href: "/places?category=coffee-shop",
  },
];

const websiteServiceUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Awak, saya ingin membuat website untuk bisnis saya"
)}`;

export default async function Home() {
  const places = await getFeaturedPlaces();

  return (
    <main className="min-h-screen overflow-hidden bg-[#F4F1EA] text-[#141414]">
      <section className="relative overflow-hidden px-4 pb-12 pt-10 sm:px-5 sm:pt-14 md:pb-20 md:pt-20 lg:pb-24 lg:pt-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,#C8784A20,transparent_34%),radial-gradient(circle_at_88%_18%,#1F5A4A1C,transparent_30%)]" />

        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <div className="min-w-0">
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-3 py-2 text-xs font-bold text-[#1F5A4A] shadow-sm sm:px-4 sm:text-sm">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#C8784A]" />
              <span className="truncate">Local coffee shop guide dari Padang</span>
            </div>

            <h1 className="max-w-3xl text-[44px] font-black leading-[0.96] tracking-tight sm:text-6xl md:text-7xl">
              Cari Coffee Shop di Padang
              <span className="block text-[#1F5A4A]">
                sesuai mood kamu.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#756A60] sm:text-lg sm:leading-8">
              Saranwak bantu kamu menemukan coffee shop di Padang berdasarkan
              mood, kebutuhan, area, dan fasilitas. Cocok buat cari cafe Padang
              untuk nugas, tempat nongkrong di Padang, first date, coffee shop
              WiFi, sampai tempat ngopi santai.
            </p>

            <HeroSearch />
          </div>

          <div className="relative pb-6 sm:pb-7 lg:pb-6">
            <div className="absolute -right-10 top-10 h-44 w-44 rounded-full bg-[#1F5A4A]/20 blur-3xl sm:h-56 sm:w-56" />
            <div className="absolute -bottom-8 left-8 h-40 w-40 rounded-full bg-[#C8784A]/20 blur-3xl sm:h-48 sm:w-48" />

            <div className="relative z-10 rounded-[30px] border border-[#E7D8C8] bg-[#FFFDF8] p-3 shadow-[0_30px_90px_rgba(32,24,19,0.14)] sm:rounded-[38px] sm:p-5">
              <div className="overflow-hidden rounded-[24px] bg-[#F6F0E7] sm:rounded-[30px]">
                <div className="relative h-48 overflow-hidden bg-[#181818] sm:h-56 md:h-64">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#C8784A55,transparent_28%),radial-gradient(circle_at_80%_20%,#1F5A4A55,transparent_30%),linear-gradient(135deg,#181818,#2a241f)]" />

                  <div className="absolute inset-x-4 top-4 flex items-center justify-between sm:inset-x-5 sm:top-5">
                    <div className="rounded-full bg-[#FFFDF8] px-3 py-1 text-xs font-black text-[#181818]">
                      Padang
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl backdrop-blur sm:h-12 sm:w-12 sm:text-2xl">
                      ☕
                    </div>
                  </div>

                  <div className="absolute left-5 top-24 h-3 w-3 rounded-full bg-[#F2C38B]" />
                  <div className="absolute right-24 top-20 h-2 w-2 rounded-full bg-white/40" />
                  <div className="absolute bottom-20 right-10 h-4 w-4 rounded-full bg-[#1F5A4A]" />

                  <div className="absolute bottom-5 left-4 right-4 sm:left-5 sm:right-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/50 sm:text-xs">
                      Mood Finder
                    </p>

                    <h2 className="mt-2 text-4xl font-black leading-none text-white sm:text-5xl">
                      Ngopi,
                      <span className="block text-[#F2C38B]">nugas,</span>
                      nongkrong.
                    </h2>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C8784A] sm:text-xs">
                        Pick your vibe
                      </p>

                      <h3 className="mt-1 text-xl font-black text-[#201813] sm:text-2xl">
                        Mau cari cafe yang gimana?
                      </h3>
                    </div>

                    <div className="rounded-full bg-[#1F5A4A] px-3 py-1 text-xs font-black text-white">
                      Beta
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {categories.map((category) => (
                      <Link
                        key={category.label}
                        href={category.href}
                        className="group rounded-[22px] border border-[#E7D8C8] bg-[#FFFDF8] p-4 transition hover:-translate-y-1 hover:border-[#1F5A4A] hover:shadow-lg sm:rounded-[24px]"
                      >
                        <div className="flex gap-3 sm:gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F6F0E7] text-xl transition group-hover:rotate-[-8deg] group-hover:scale-110 sm:h-12 sm:w-12 sm:text-2xl">
                            {category.emoji}
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-black text-[#201813]">
                              {category.label}
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-[#756A60]">
                              {category.desc}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4 rounded-[20px] border border-[#E7D8C8] bg-[#FFFDF8] p-4 sm:rounded-[22px]">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A] sm:text-xs">
                          curated list
                        </p>

                        <p className="mt-1 text-sm font-black leading-5 text-[#201813]">
                          Rekomendasi coffee shop Padang biar nggak asal scroll.
                        </p>
                      </div>

                      <div className="flex shrink-0 -space-x-2">
                        <div className="h-8 w-8 rounded-full border-2 border-[#FFFDF8] bg-[#1F5A4A] sm:h-9 sm:w-9" />
                        <div className="h-8 w-8 rounded-full border-2 border-[#FFFDF8] bg-[#C8784A] sm:h-9 sm:w-9" />
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#FFFDF8] bg-[#181818] text-xs font-black text-white sm:h-9 sm:w-9">
                          S
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-3 py-2 text-xs font-black text-[#1F5A4A]">
                      Coffee shop WiFi ✦
                    </span>

                    <span className="rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-3 py-2 text-xs font-black text-[#C8784A]">
                      Tempat nugas di Padang
                    </span>

                    <span className="rounded-full border border-[#E7D8C8] bg-[#181818] px-3 py-2 text-xs font-black text-[#FFFDF8]">
                      Cafe aesthetic Padang
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-1 left-1/2 z-20 w-fit -translate-x-1/2 rotate-[-2deg] whitespace-nowrap rounded-2xl bg-[#C8784A] px-4 py-2.5 text-xs font-black text-white shadow-xl sm:px-5 sm:py-3 sm:text-sm md:-bottom-2">
              Mulai dari Padang dulu
            </div>
          </div>
        </div>
      </section>

      <WhySaranwak />

      <section className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-5">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C8784A] sm:text-sm">
              Featured Coffee Shops
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Coffee Shop Pilihan di Padang
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#756A60] sm:text-base">
              Pilihan cafe dan coffee shop Padang yang bisa kamu cek sebelum
              berangkat. Cocok untuk nugas, nongkrong, meeting santai, first
              date, atau cari suasana baru di kota.
            </p>
          </div>

          <Link
            href="/places?category=coffee-shop"
            className="w-fit rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-5 py-3 text-sm font-black text-[#1F5A4A] transition hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
          >
            Lihat semua
          </Link>
        </div>

        {places.length === 0 ? (
          <div className="rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-8 text-center sm:rounded-[32px] sm:p-10">
            <p className="text-lg font-black text-[#201813]">
              Belum ada data coffee shop.
            </p>

            <p className="mt-2 text-sm text-[#756A60] sm:text-base">
              Cek tabel <span className="font-bold">places</span> di Supabase.
              Pastikan data sudah published, featured, dan kategorinya Coffee
              Shop.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </section>

      <section className="px-4 pb-16 pt-5 sm:px-5">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-[#E7D8C8] bg-[#181818] p-6 text-white shadow-[0_28px_90px_rgba(24,24,24,0.18)] sm:rounded-[36px] sm:p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_360px] md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#F2C38B] sm:text-sm">
                Website Service
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
                Jasa Website untuk Coffee Shop dan Bisnis Lokal
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                Kami bisa bantu buat website untuk coffee shop, resto, local
                brand, company profile, katalog produk, sampai landing page
                promosi. Biar bisnis kamu nggak cuma rame di offline, tapi juga
                gampang ditemukan online.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white/80">
                  Landing Page
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white/80">
                  Company Profile
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white/80">
                  Website Katalog
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white/80">
                  CMS Admin
                </span>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-5 sm:rounded-[28px]">
              <p className="text-sm font-bold text-white/60">Cocok untuk</p>

              <ul className="mt-4 space-y-3 text-sm font-bold text-white">
                <li>✓ Coffee shop & resto</li>
                <li>✓ UMKM & local brand</li>
                <li>✓ Portfolio bisnis</li>
                <li>✓ Event & promo campaign</li>
              </ul>

              <a
                href={websiteServiceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex w-full items-center justify-center rounded-2xl bg-[#F2C38B] px-5 py-4 text-sm font-black text-[#181818] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Buat Website Sekarang →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
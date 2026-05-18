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
      <section className="relative overflow-hidden px-4 pb-10 pt-8 sm:px-5 sm:pt-10 md:pb-14 md:pt-14 lg:pb-16 lg:pt-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,#C8784A22,transparent_34%),radial-gradient(circle_at_88%_18%,#1F5A4A1F,transparent_30%)]" />
        <div className="absolute left-0 top-0 -z-10 h-full w-full bg-[linear-gradient(180deg,#FFF8EF00,#F4F1EA_88%)]" />

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
          <div className="min-w-0">
            <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[#E7D8C8] bg-[#FFFDF8]/90 px-3 py-2 text-xs font-black text-[#1F5A4A] shadow-sm backdrop-blur sm:px-4 sm:text-sm">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#C8784A]" />
              <span className="truncate">
                Local coffee shop guide dari Padang
              </span>
            </div>

            <h1 className="max-w-3xl text-[40px] font-black leading-[0.96] tracking-[-0.06em] text-[#201813] sm:text-6xl md:text-7xl">
              Cari Coffee Shop di Padang
              <span className="block text-[#1F5A4A]">
                sesuai mood kamu.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-[#756A60] sm:text-lg sm:leading-8">
              Saranwak bantu kamu menemukan coffee shop di Padang berdasarkan
              budget, aktivitas, fasilitas, dan vibes. Cocok buat nugas,
              nongkrong, first date, meeting santai, sampai ngopi sendirian.
            </p>

            <HeroSearch />
          </div>

          <div className="relative hidden lg:block lg:pl-2">
            <div className="absolute -right-10 top-10 h-44 w-44 rounded-full bg-[#1F5A4A]/20 blur-3xl sm:h-56 sm:w-56" />
            <div className="absolute -bottom-8 left-8 h-40 w-40 rounded-full bg-[#C8784A]/20 blur-3xl sm:h-48 sm:w-48" />

            <div className="relative z-10 overflow-hidden rounded-[40px] border border-[#E7D8C8] bg-[#FFFDF8] p-4 shadow-[0_26px_80px_rgba(32,24,19,0.14)]">
              <div className="overflow-hidden rounded-[30px] bg-[#181818]">
                <div className="relative min-h-[360px] p-6 text-white">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,#C8784A66,transparent_28%),radial-gradient(circle_at_80%_24%,#1F5A4A70,transparent_30%),linear-gradient(135deg,#181818,#2A241F)]" />
                  <div className="absolute -right-16 top-20 h-44 w-44 rounded-full border border-white/10" />
                  <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full border border-white/10" />

                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <span className="rounded-full bg-[#FFFDF8] px-4 py-2 text-xs font-black text-[#201813]">
                      Padang Guide
                    </span>

                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-2xl backdrop-blur">
                      ☕
                    </span>
                  </div>

                  <div className="relative z-10 mt-10">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-white/50">
                      Mood Finder
                    </p>

                    <h2 className="mt-3 max-w-sm text-5xl font-black leading-[0.92] tracking-[-0.06em] text-white">
                      Ngopi,
                      <span className="block text-[#F2C38B]">nugas,</span>
                      nongkrong.
                    </h2>

                    <p className="mt-5 max-w-sm text-sm font-semibold leading-7 text-white/66">
                      Pilih kebutuhan kamu, lalu Saranwak bantu munculin tempat
                      yang paling cocok. Tanpa drama “di mana ya enaknya?”.
                    </p>
                  </div>

                  <div className="relative z-10 mt-7 grid gap-3">
                    {categories.map((category) => (
                      <Link
                        key={category.label}
                        href={category.href}
                        className="group rounded-[22px] border border-white/10 bg-white/[0.08] p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.13]"
                      >
                        <div className="flex gap-4">
                          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#FFFDF8] text-2xl transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
                            {category.emoji}
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-black text-white">
                              {category.label}
                            </h3>

                            <p className="mt-1 text-sm font-medium leading-6 text-white/64">
                              {category.desc}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="relative z-10 mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-3">
                      <p className="text-2xl font-black text-[#F2C38B]">32+</p>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
                        Places
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-3">
                      <p className="text-2xl font-black text-[#F2C38B]">4</p>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
                        Filter
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-3">
                      <p className="text-2xl font-black text-[#F2C38B]">1</p>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
                        Kota
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 left-1/2 z-20 w-fit -translate-x-1/2 rotate-[-2deg] whitespace-nowrap rounded-2xl bg-[#C8784A] px-5 py-3 text-xs font-black text-white shadow-xl">
              Mulai dari Padang dulu
            </div>
          </div>
        </div>
      </section>

      <WhySaranwak />

      <section className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-5 md:pt-10">
        <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C8784A] sm:text-sm">
              Featured Coffee Shops
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#201813] sm:text-4xl md:text-5xl">
              Coffee shop pilihan di Padang
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#756A60] sm:text-base">
              Pilihan cafe dan coffee shop Padang yang bisa kamu cek sebelum
              berangkat. Cocok untuk nugas, nongkrong, meeting santai, first
              date, atau cari suasana baru.
            </p>
          </div>

          <Link
            href="/places?category=coffee-shop"
            className="inline-flex min-h-12 w-fit items-center justify-center rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-5 py-3 text-sm font-black text-[#1F5A4A] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
          >
            Lihat semua tempat →
          </Link>
        </div>

        {places.length === 0 ? (
          <div className="rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-8 text-center shadow-[0_18px_60px_rgba(47,35,25,0.06)] sm:rounded-[32px] sm:p-10">
            <p className="text-lg font-black text-[#201813]">
              Belum ada data coffee shop.
            </p>

            <p className="mt-2 text-sm font-semibold leading-6 text-[#756A60] sm:text-base">
              Cek tabel <span className="font-black">places</span> di Supabase.
              Pastikan data sudah published, featured, dan kategorinya Coffee
              Shop.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place, index) => (
              <PlaceCard
                key={place.id}
                place={place}
                source="homepage_featured"
                position={index + 1}
              />
            ))}
          </div>
        )}
      </section>

      <section className="px-4 pb-12 pt-0 sm:px-5 md:pb-14">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-[#E7D8C8] bg-[#181818] p-6 text-white shadow-[0_24px_80px_rgba(24,24,24,0.16)] sm:rounded-[38px] sm:p-8 md:p-10">
          <div className="grid gap-7 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#F2C38B]">
                Untuk owner bisnis lokal
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl md:text-5xl">
                Punya coffee shop atau bisnis lokal?
              </h2>

              <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/68 sm:text-base">
                Saranwak bisa bantu tempat kamu lebih mudah ditemukan. Mulai
                dari listing, promo, featured placement, sampai website bisnis
                yang lebih proper.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={websiteServiceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F2C38B] px-6 py-3 text-sm font-black text-[#181818] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
                >
                  Konsultasi via WhatsApp
                </a>

                <Link
                  href="/places?category=coffee-shop"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#181818]"
                >
                  Lihat direktori
                </Link>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur sm:p-5">
              <div className="grid gap-3">
                {[
                  "Listing tempat lebih rapi",
                  "Bisa diarahkan ke Maps, Instagram, dan WhatsApp",
                  "Siap untuk promo banner dan featured placement",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                  >
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#1F5A4A] text-xs font-black text-white">
                      ✓
                    </span>

                    <p className="text-sm font-bold leading-6 text-white/78">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl bg-[#F2C38B] p-4 text-[#201813]">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7A4E2F]">
                  Next monetization
                </p>

                <p className="mt-2 text-lg font-black leading-snug">
                  Featured listing, promo banner, dan halaman profil bisnis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
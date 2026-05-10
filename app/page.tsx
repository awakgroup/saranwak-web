import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlaceCard } from "@/components/PlaceCard";
import { HeroSearch } from "@/components/HeroSearch";
import type { Place } from "@/types/database";

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
    .limit(6);

  if (error) {
    console.error("Supabase error:", error.message);
    return [];
  }

  return data as Place[];
}

const categories = [
  {
    label: "Coffee Shop",
    emoji: "☕",
    desc: "Nugas, nongkrong, meeting, atau sekadar ngopi santai.",
    href: "/places?category=coffee-shop",
  },
];

const areas = [
  "Padang Barat",
  "Purus",
  "Khatib Sulaiman",
  "Gajah Mada",
  "Pondok",
  "Air Tawar",
];

export default async function Home() {
  const places = await getFeaturedPlaces();

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#141414]">
      <section className="relative px-5 pb-14 pt-14 md:pb-20 md:pt-18">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,#C8784A20,transparent_34%),radial-gradient(circle_at_88%_18%,#1F5A4A1C,transparent_30%)]" />

        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.08fr_0.92fr] md:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-4 py-2 text-sm font-bold text-[#1F5A4A] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#C8784A]" />
              Local spot guide dari Padang
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.96] tracking-tight md:text-7xl">
              Cari tempat yang
              <span className="block text-[#1F5A4A]">
                pas sama mood kamu.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#756A60]">
              Saranwak bantu kamu menemukan coffee shop di Padang berdasarkan
              mood, kebutuhan, area, dan fasilitas. Fokus awal kita coffee shop
              dulu, biar datanya rapi dan rekomendasinya nggak asal comot.
            </p>

            <HeroSearch />
          </div>

          <div className="relative">
            <div className="rounded-[36px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 shadow-[0_25px_80px_rgba(32,24,19,0.12)]">
              <div className="rounded-[28px] bg-[#F6F0E7] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C8784A]">
                      Pilih kebutuhan
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-[#201813]">
                      Mau cari apa?
                    </h2>
                  </div>

                  <div className="rounded-full bg-[#1F5A4A] px-3 py-1 text-xs font-black text-white">
                    Padang
                  </div>
                </div>

                <div className="grid gap-3">
                  {categories.map((category) => (
                    <Link
                      key={category.label}
                      href={category.href}
                      className="group rounded-[24px] border border-[#E7D8C8] bg-[#FFFDF8] p-4 transition hover:-translate-y-1 hover:border-[#1F5A4A] hover:shadow-lg"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F6F0E7] text-2xl">
                          {category.emoji}
                        </div>

                        <div>
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
              </div>
            </div>

            <div className="absolute -bottom-5 -left-4 hidden rotate-[-3deg] rounded-2xl bg-[#C8784A] px-5 py-3 text-sm font-black text-white shadow-xl md:block">
              Mulai dari Padang dulu
            </div>
          </div>
        </div>
      </section>

      {/* <section className="px-5 py-8">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C8784A]">
                Explore Area
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                Cari berdasarkan daerah
              </h2>
              <p className="mt-3 max-w-xl leading-7 text-[#756A60]">
                Pilih area biar rekomendasinya lebih masuk akal. Karena tempat
                bagus tapi jauh kadang cuma cocok buat niat yang kuat.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 md:justify-end">
              {areas.map((area) => (
                <Link
                  href={`/places?category=coffee-shop&area=${encodeURIComponent(
                    area
                  )}`}
                  key={area}
                  className="rounded-full border border-[#E7D8C8] bg-[#F6F0E7] px-4 py-2 text-sm font-bold text-[#4B4038] transition hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
                >
                  {area}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      <section className="mx-auto max-w-6xl px-5 pb-5">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C8784A]">
              Featured Coffee Shops
            </p>
            <h2 className="mt-2 text-4xl font-black tracking-tight">
              Rekomendasi pilihan
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#756A60]">
              Coffee shop yang bisa kamu cek dulu sebelum berangkat. Biar pilih
              tempatnya bukan modal nebak dan doa.
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
          <div className="rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8] p-10 text-center">
            <p className="text-lg font-black text-[#201813]">
              Belum ada data coffee shop.
            </p>
            <p className="mt-2 text-[#756A60]">
              Cek tabel <span className="font-bold">places</span> di Supabase.
              Pastikan data sudah published, featured, dan kategorinya Coffee
              Shop.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </section>
      <section className="px-5 pb-16 pt-5">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-[#E7D8C8] bg-[#181818] p-8 text-white shadow-[0_28px_90px_rgba(24,24,24,0.18)] md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_360px] md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#F2C38B]">
                Website Service
              </p>

              <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-5xl">
                Punya coffee shop atau bisnis? Bikin website-nya biar makin kelihatan serius.
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
                Kami bisa bantu buat website untuk coffee shop, resto, local brand,
                company profile, katalog produk, sampai landing page promosi. Biar
                bisnis kamu nggak cuma rame di offline, tapi juga gampang ditemukan online.
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

            <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5">
              <p className="text-sm font-bold text-white/60">
                Cocok untuk
              </p>

              <ul className="mt-4 space-y-3 text-sm font-bold text-white">
                <li>✓ Coffee shop & resto</li>
                <li>✓ UMKM & local brand</li>
                <li>✓ Portfolio bisnis</li>
                <li>✓ Event & promo campaign</li>
              </ul>

              <a
                href={`https://wa.me/6281932097214?text=${encodeURIComponent(
                  "Hi SaranWak, saya ingin membuat website untuk bisnis saya"
                )}`}
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
      {/* <section className="px-5 pb-20">
        <div className="mx-auto max-w-6xl rounded-[36px] bg-[#1F5A4A] p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F2C38B]">
                Roadmap Saranwak
              </p>
              <h2 className="mt-3 text-4xl font-black leading-tight">
                Mulai dari coffee shop. Besarnya jadi guide lokal.
              </h2>
            </div>

            <p className="text-lg leading-8 text-white/80">
              Fondasinya tetap dynamic dari awal: satu database untuk banyak
              kategori tempat, filter mood, area, fasilitas, foto, menu, dan
              detail lokasi. Tapi untuk sekarang, publik kita fokuskan dulu ke
              coffee shop Padang biar MVP cepat matang.
            </p>
          </div>
        </div>
      </section> */}
    </main>
  );
}
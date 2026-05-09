import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Category = {
    id: string;
    name: string;
    slug: string;
};

type Place = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    address: string | null;
    area: string | null;
    city: string | null;
    image_url: string | null;
    price_range: string | null;
    opening_hours: string | null;
    is_featured: boolean;
    is_published: boolean;
    categories: Category | Category[] | null;
};

function getSingleCategory(category: Category | Category[] | null) {
    if (Array.isArray(category)) {
        return category[0] ?? null;
    }

    return category;
}


async function getPlaces() {
    const { data, error } = await supabase
        .from("places")
        .select(
            `
      id,
      name,
      slug,
      description,
      address,
      area,
      city,
      image_url,
      price_range,
      opening_hours,
      is_featured,
      is_published,
      categories (
        id,
        name,
        slug
      )
    `
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    if (error || !data) {
        console.error("GET places error:", error);
        return [];
    }

    return data as Place[];
}

export default async function PlacesPage() {
    const places = await getPlaces();

    return (
        <main className="min-h-screen bg-neutral-950 px-5 py-16 text-white">
            <section className="mx-auto max-w-7xl">
                <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.35em] text-neutral-500">
                            Saranwak Places
                        </p>

                        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
                            Semua Tempat
                        </h1>

                        <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-400">
                            Cari coffee shop, resto, wisata, dan tempat menarik lain di
                            Padang.
                        </p>
                    </div>

                    <Link
                        href="/rekomendasi"
                        className="w-fit rounded-full bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-neutral-200"
                    >
                        Cari Rekomendasi
                    </Link>
                </div>

                {places.length === 0 ? (
                    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-10">
                        <h2 className="text-2xl font-black">Belum ada tempat.</h2>
                        <p className="mt-3 text-neutral-400">
                            Data belum tersedia atau belum dipublish dari CMS.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {places.map((place) => {
                            const category = getSingleCategory(place.categories);

                            const imageUrl =
                                place.image_url ||
                                "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop";

                            return (
                                <Link
                                    key={place.id}
                                    href={`/places/${place.slug}`}
                                    className="group overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-black"
                                >
                                    <div className="h-56 overflow-hidden bg-neutral-900">
                                        <img
                                            src={imageUrl}
                                            alt={place.name}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="p-5">
                                        <div className="mb-4 flex items-center justify-between gap-3">
                                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-neutral-300 transition group-hover:border-black/10 group-hover:bg-black group-hover:text-white">
                                                {category?.name ?? "Tempat"}
                                            </span>

                                            {place.is_featured ? (
                                                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-black transition group-hover:bg-black group-hover:text-white">
                                                    Featured
                                                </span>
                                            ) : null}
                                        </div>

                                        <h2 className="text-2xl font-black leading-tight">
                                            {place.name}
                                        </h2>

                                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-400 transition group-hover:text-black/60">
                                            {place.description || "Belum ada deskripsi."}
                                        </p>

                                        <div className="mt-5 flex items-center justify-between gap-4 text-sm">
                                            <span className="font-bold text-neutral-300 transition group-hover:text-black/70">
                                                {place.area || "Padang"}
                                            </span>

                                            <span className="font-black">Detail →</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}
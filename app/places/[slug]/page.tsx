import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Category = {
    id: string;
    name: string;
    slug: string;
};

type Tag = {
    id: string;
    name: string;
    slug: string;
    type: string;
};

type PlaceTagRelation = {
    tag_id: string;
    tags: Tag | Tag[] | null;
};

type PlaceDetail = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    address: string | null;
    area: string | null;
    city: string | null;
    image_url: string | null;
    google_maps_url: string | null;
    instagram_url: string | null;
    price_range: string | null;
    opening_hours: string | null;
    is_published: boolean;
    categories: Category | Category[] | null;
    place_tags: PlaceTagRelation[] | null;
};

type PlaceDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

function getSingleCategory(category: Category | Category[] | null) {
    if (Array.isArray(category)) {
        return category[0] ?? null;
    }

    return category;
}

function getSingleTag(tag: Tag | Tag[] | null) {
    if (Array.isArray(tag)) {
        return tag[0] ?? null;
    }

    return tag;
}

async function getPlaceBySlug(slug: string): Promise<PlaceDetail | null> {
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
      google_maps_url,
      instagram_url,
      price_range,
      opening_hours,
      is_published,
      categories (
        id,
        name,
        slug
      ),
      place_tags (
        tag_id,
        tags (
          id,
          name,
          slug,
          type
        )
      )
    `
        )
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (error || !data) {
        return null;
    }

    return data as PlaceDetail;
}

export default async function PlaceDetailPage({
    params,
}: PlaceDetailPageProps) {
    const { slug } = await params;

    const place = await getPlaceBySlug(slug);

    if (!place) {
        notFound();
    }

    const category = getSingleCategory(place.categories);

    const tags =
        place.place_tags
            ?.map((item) => getSingleTag(item.tags))
            .filter((tag): tag is Tag => Boolean(tag)) ?? [];

    const imageUrl =
        place.image_url ||
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop";

    return (
        <main className="min-h-screen bg-neutral-950 px-5 py-12 text-white">
            <section className="mx-auto max-w-6xl">
                <Link
                    href="/places"
                    className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-neutral-300 transition hover:bg-white hover:text-black"
                >
                    ← Kembali ke Tempat
                </Link>

                <div className="mt-8 overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03]">
                    <div className="relative h-[320px] bg-neutral-900 md:h-[460px]">
                        <img
                            src={imageUrl}
                            alt={place.name}
                            className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                            <p className="text-sm font-black uppercase tracking-[0.3em] text-neutral-300">
                                {category?.name ?? "Tempat"}
                            </p>

                            <h1 className="mt-3 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
                                {place.name}
                            </h1>

                            <p className="mt-4 text-neutral-300">
                                {place.area || "Padang"} {place.city ? `· ${place.city}` : ""}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-8 p-6 md:grid-cols-[1fr_360px] md:p-10">
                        <div>
                            <h2 className="text-2xl font-black">Tentang Tempat</h2>

                            <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-300">
                                {place.description || "Belum ada deskripsi untuk tempat ini."}
                            </p>

                            {tags.length > 0 ? (
                                <div className="mt-8">
                                    <h3 className="mb-4 text-lg font-black">Cocok untuk</h3>

                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-neutral-200"
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        <aside className="h-fit rounded-[28px] border border-white/10 bg-black/30 p-5">
                            <h2 className="text-2xl font-black">Info Detail</h2>

                            <div className="mt-5 space-y-4 text-sm">
                                <InfoItem label="Alamat" value={place.address} />
                                <InfoItem label="Area" value={place.area} />
                                <InfoItem label="Kota" value={place.city} />
                                <InfoItem label="Range Harga" value={place.price_range} />
                                <InfoItem label="Jam Buka" value={place.opening_hours} />
                            </div>

                            <div className="mt-6 space-y-3">
                                {place.google_maps_url ? (
                                    <a
                                        href={place.google_maps_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block rounded-2xl bg-white px-5 py-4 text-center text-sm font-black text-black transition hover:bg-neutral-200"
                                    >
                                        Buka Google Maps
                                    </a>
                                ) : null}

                                {place.instagram_url ? (
                                    <a
                                        href={place.instagram_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block rounded-2xl border border-white/10 px-5 py-4 text-center text-sm font-black text-white transition hover:bg-white/10"
                                    >
                                        Lihat Instagram
                                    </a>
                                ) : null}
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}

function InfoItem({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                {label}
            </p>

            <p className="mt-2 font-bold text-neutral-100">{value || "-"}</p>
        </div>
    );
}
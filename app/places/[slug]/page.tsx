import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getSafePlaceImageUrl } from "@/lib/image-url";

type Category = {
    id: string;
    name: string;
    slug: string;
};

type Tag = {
    id: string;
    name: string;
    slug: string;
    type: string | null;
};

type PlaceTagRelation = {
    tag_id: string;
    tags: Tag | Tag[] | null;
};

type PlacePhoto = {
    id: string;
    image_url: string;
    caption?: string | null;
    sort_order?: number | null;
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
    place_photos: PlacePhoto[] | null;
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

function groupTagsByType(tags: Tag[]) {
    return tags.reduce<Record<string, Tag[]>>((result, tag) => {
        const type = tag.type || "other";

        if (!result[type]) {
            result[type] = [];
        }

        result[type].push(tag);

        return result;
    }, {});
}

function getTagGroupLabel(type: string) {
    const labels: Record<string, string> = {
        mood: "Cocok Untuk",
        facility: "Fasilitas",
        time: "Waktu Terbaik",
        budget: "Budget",
        vibe: "Vibes",
        ambience: "Suasana",
        other: "Info Lainnya",
    };

    return labels[type] || "Info Lainnya";
}

function getTagGroupDescription(type: string) {
    const descriptions: Record<string, string> = {
        mood: "Kebutuhan atau aktivitas yang paling pas di tempat ini.",
        facility: "Fasilitas yang bisa kamu manfaatkan.",
        time: "Waktu yang cocok untuk datang.",
        budget: "Gambaran budget atau segmentasi harga.",
        vibe: "Nuansa dan karakter tempat.",
        ambience: "Suasana utama yang ditawarkan.",
        other: "Informasi tambahan dari tempat ini.",
    };

    return descriptions[type] || "Informasi tambahan dari tempat ini.";
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
      ),
      place_photos (
        id,
        image_url,
        caption,
        sort_order
      )
    `
        )
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (error || !data) {
        return null;
    }

    return data as unknown as PlaceDetail;
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

    const groupedTags = groupTagsByType(tags);

    const galleryPhotos =
        place.place_photos
            ?.slice()
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) ?? [];

    const heroImageUrl = getSafePlaceImageUrl(place.image_url);

    return (
        <main className="min-h-screen bg-neutral-950 px-5 py-12 text-white">
            <section className="mx-auto max-w-6xl">
                <Link
                    href="/places?category=coffee-shop"
                    className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-neutral-300 transition hover:bg-white hover:text-black"
                >
                    ← Kembali ke Tempat
                </Link>

                <div className="mt-8 overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03]">
                    <div className="relative h-[320px] bg-neutral-900 md:h-[460px]">
                        <img
                            src={heroImageUrl}
                            alt={place.name}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
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

                    {galleryPhotos.length > 0 ? (
                        <div className="border-b border-white/10 bg-black/30 p-4 md:p-6">
                            <div className="mb-4 flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">
                                        Gallery
                                    </p>

                                    <h2 className="mt-2 text-2xl font-black">Suasana Tempat</h2>
                                </div>

                                <p className="hidden text-sm font-bold text-neutral-500 md:block">
                                    {galleryPhotos.length} foto
                                </p>
                            </div>

                            <div className="grid gap-3 md:grid-cols-4">
                                {galleryPhotos.slice(0, 5).map((photo, index) => (
                                    <div
                                        key={photo.id}
                                        className={`group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] ${index === 0 ? "md:col-span-2 md:row-span-2" : ""
                                            }`}
                                    >
                                        <img
                                            src={getSafePlaceImageUrl(photo.image_url)}
                                            alt={photo.caption || `${place.name} photo ${index + 1}`}
                                            className={`w-full object-cover transition duration-700 group-hover:scale-110 ${index === 0 ? "h-[360px]" : "h-[175px]"
                                                }`}
                                            referrerPolicy="no-referrer"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

                                        {photo.caption ? (
                                            <div className="absolute bottom-3 left-3 right-3">
                                                <p className="rounded-full bg-black/60 px-3 py-2 text-xs font-bold text-white backdrop-blur">
                                                    {photo.caption}
                                                </p>
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="grid gap-8 p-6 md:grid-cols-[1fr_360px] md:p-10">
                        <div>
                            <h2 className="text-2xl font-black">Tentang Tempat</h2>

                            <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-300">
                                {place.description || "Belum ada deskripsi untuk tempat ini."}
                            </p>

                            {tags.length > 0 ? (
                                <div className="mt-8">
                                    <h2 className="text-2xl font-black">Highlight Tempat</h2>

                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
                                        Tag dipisahkan berdasarkan fungsi biar informasinya lebih
                                        nyambung dan gampang dibaca.
                                    </p>

                                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                                        {Object.entries(groupedTags).map(([type, tagList]) => (
                                            <div
                                                key={type}
                                                className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5"
                                            >
                                                <div className="mb-4">
                                                    <h3 className="text-lg font-black">
                                                        {getTagGroupLabel(type)}
                                                    </h3>

                                                    <p className="mt-1 text-sm leading-6 text-neutral-500">
                                                        {getTagGroupDescription(type)}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {tagList.map((tag) => (
                                                        <span
                                                            key={tag.id}
                                                            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-neutral-200"
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
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
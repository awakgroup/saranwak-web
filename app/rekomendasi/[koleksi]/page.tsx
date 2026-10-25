import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import { ArrowLeft, ChevronRight, HelpCircle, Lightbulb, MapPin, Sparkles } from "lucide-react";

import { PlaceCard } from "@/components/PlaceCard";
import {
    CURATED_COLLECTIONS,
    getCuratedCollection,
    type CuratedCollection,
} from "@/lib/curated-collections";
import type { Place } from "@/types/database";

export const dynamic = "force-static";

export function generateStaticParams() {
    return CURATED_COLLECTIONS.map((c) => ({
        koleksi: c.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ koleksi: string }>;
}): Promise<Metadata> {
    const { koleksi } = await params;
    const collection = getCuratedCollection(koleksi);

    if (!collection) {
        return {
            title: "Koleksi Rekomendasi Tidak Ditemukan | Saranwak",
        };
    }

    const canonicalUrl = `https://saranwak.com/rekomendasi/${collection.slug}/`;

    return {
        title: collection.metaTitle,
        description: collection.metaDescription,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: collection.metaTitle,
            description: collection.metaDescription,
            url: canonicalUrl,
            type: "article",
            images: [
                {
                    url: "https://saranwak.com/og-saranwak-banner.png",
                    width: 1200,
                    height: 630,
                    alt: collection.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: collection.metaTitle,
            description: collection.metaDescription,
        },
    };
}

async function getAllPlaces(): Promise<Place[]> {
    try {
        const filePath = path.join(process.cwd(), "public", "data", "places.json");
        const fileContent = await fs.readFile(filePath, "utf8");
        return JSON.parse(fileContent) as Place[];
    } catch (err) {
        console.error("Gagal membaca places.json:", err);
        return [];
    }
}

function filterPlacesByCollection(places: Place[], collection: CuratedCollection): Place[] {
    return places.filter((place) => {
        if (!place.is_published) return false;
        if (collection.customFilter) {
            return collection.customFilter(place);
        }

        const tagSlugs: string[] = [];
        (place.place_tags || []).forEach((pt) => {
            const t = pt.tags;
            if (Array.isArray(t)) {
                t.forEach((item) => {
                    if (item?.slug) tagSlugs.push(item.slug.toLowerCase());
                });
            } else if (t && typeof t === "object" && "slug" in t && typeof t.slug === "string") {
                tagSlugs.push(t.slug.toLowerCase());
            }
        });

        // Juga cek format tags API jika ada
        if (Array.isArray((place as unknown as { tags?: Array<{ slug?: string }> }).tags)) {
            (place as unknown as { tags?: Array<{ slug?: string }> }).tags?.forEach((t) => {
                if (t.slug) tagSlugs.push(t.slug.toLowerCase());
            });
        }

        return collection.filterTags.some((tag) => tagSlugs.includes(tag.toLowerCase()));
    });
}

export default async function CuratedCollectionPage({
    params,
}: {
    params: Promise<{ koleksi: string }>;
}) {
    const { koleksi } = await params;
    const collection = getCuratedCollection(koleksi);

    if (!collection) {
        notFound();
    }

    const allPlaces = await getAllPlaces();
    const matchedPlaces = filterPlacesByCollection(allPlaces, collection);

    const otherCollections = CURATED_COLLECTIONS.filter((c) => c.slug !== collection.slug);

    // JSON-LD Structured Data
    const collectionJsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "@id": `https://saranwak.com/rekomendasi/${collection.slug}/#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Beranda",
                        "item": "https://saranwak.com",
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Rekomendasi",
                        "item": "https://saranwak.com/rekomendasi",
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": collection.shortTitle,
                        "item": `https://saranwak.com/rekomendasi/${collection.slug}/`,
                    },
                ],
            },
            {
                "@type": "ItemList",
                "@id": `https://saranwak.com/rekomendasi/${collection.slug}/#itemlist`,
                "name": collection.title,
                "description": collection.metaDescription,
                "numberOfItems": matchedPlaces.length,
                "itemListElement": matchedPlaces.map((place, idx) => ({
                    "@type": "ListItem",
                    "position": idx + 1,
                    "name": place.name,
                    "url": `https://saranwak.com/places/${place.slug}/`,
                })),
            },
            {
                "@type": "FAQPage",
                "@id": `https://saranwak.com/rekomendasi/${collection.slug}/#faq`,
                "mainEntity": collection.faqs.map((faq) => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer,
                    },
                })),
            },
        ],
    };

    return (
        <main className="min-h-screen bg-[#F4F1EA] px-4 py-8 text-[#141414] sm:px-6 lg:px-8 lg:py-10">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(collectionJsonLd),
                }}
            />

            <div className="mx-auto max-w-7xl">
                {/* Breadcrumb Navigation */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-5 flex items-center gap-2 text-xs font-bold text-[#756A60]"
                >
                    <Link href="/" className="hover:text-[#C8784A] transition">
                        Beranda
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-[#A59A8F]" />
                    <Link href="/rekomendasi" className="hover:text-[#C8784A] transition">
                        Rekomendasi
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-[#A59A8F]" />
                    <span className="text-[#201813] font-black">{collection.shortTitle}</span>
                </nav>

                {/* Hero Header */}
                <header className="relative overflow-hidden rounded-[34px] border border-[#E7D8C8] bg-[#191614] p-6 text-white shadow-[0_24px_80px_rgba(32,24,19,0.18)] sm:p-8 lg:p-10">
                    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F2C38B]/18 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#1F5A4A]/25 blur-3xl" />

                    <div className="relative z-10 max-w-4xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2C38B] backdrop-blur sm:text-xs">
                            <span className="text-sm">{collection.emoji}</span>
                            {collection.badge}
                        </div>

                        <h1 className="mt-4 font-serif text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-5xl">
                            {collection.title}
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-white/75 sm:text-base">
                            {collection.lead}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur">
                                📍 {matchedPlaces.length} Tempat Terkurasi di Padang
                            </span>
                            <span className="rounded-full bg-[#C8784A]/30 px-3.5 py-1.5 text-xs font-bold text-[#F2C38B]">
                                ✨ Diperbarui Berkala
                            </span>
                        </div>
                    </div>
                </header>

                {/* Editorial Context & Tips */}
                <section className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
                    <div className="rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 sm:p-7 shadow-[0_12px_40px_rgba(47,35,25,0.04)]">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                            <Sparkles className="h-3.5 w-3.5" />
                            Kurasi Lokal Padang
                        </div>
                        <h2 className="mt-2 font-serif text-2xl font-bold text-[#201813]">
                            Tentang Spot {collection.shortTitle}
                        </h2>
                        <div className="mt-3.5 space-y-3 text-sm font-medium leading-relaxed text-[#5A4F46] sm:text-base">
                            {collection.editorialParagraphs.map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-[#E7D8C8] bg-[#FBF7F0] p-6 sm:p-7 shadow-[0_12px_40px_rgba(47,35,25,0.04)] flex flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#1F5A4A]">
                                <Lightbulb className="h-3.5 w-3.5" />
                                Tips Kunjungan
                            </div>
                            <h3 className="mt-2 font-serif text-xl font-bold text-[#201813]">
                                Saran dari Warga Lokal
                            </h3>
                            <ul className="mt-3.5 space-y-2.5">
                                {collection.tips.map((tip, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-2.5 text-xs font-medium leading-relaxed text-[#5A4F46] sm:text-sm"
                                    >
                                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8784A]" />
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-5 border-t border-[#E7D8C8] pt-4">
                            <p className="text-xs font-semibold text-[#756A60]">
                                Ada tempat yang mau kamu usulkan?{" "}
                                <a
                                    href="https://wa.me/6281932097214?text=Halo%20Saranwak,%20saya%20mau%20mengusulkan%20tempat%20baru"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-bold text-[#C8784A] underline hover:text-[#1F5A4A]"
                                >
                                    Hubungi kami di WhatsApp
                                </a>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Places Grid */}
                <section className="mt-8">
                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                                Daftar Pilihan
                            </p>
                            <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-3xl">
                                Rekomendasi Tempat ({matchedPlaces.length})
                            </h2>
                        </div>
                        <Link
                            href="/places"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#756A60] hover:text-[#C8784A] transition"
                        >
                            Filter Tempat Lainnya →
                        </Link>
                    </div>

                    {matchedPlaces.length === 0 ? (
                        <div className="rounded-[28px] border border-dashed border-[#E7D8C8] bg-white p-10 text-center">
                            <p className="text-base font-bold text-[#201813]">
                                Belum ada tempat yang cocok untuk kategori ini saat ini.
                            </p>
                            <Link
                                href="/places"
                                className="mt-4 inline-flex items-center justify-center rounded-full bg-[#201813] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#C8784A]"
                            >
                                Jelajahi Semua Tempat
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {matchedPlaces.map((place, idx) => (
                                <PlaceCard
                                    key={place.id}
                                    place={place}
                                    source="places_list"
                                    position={idx + 1}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* FAQ Section */}
                {collection.faqs.length > 0 && (
                    <section className="mt-10 rounded-[30px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 sm:p-8">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                            <HelpCircle className="h-3.5 w-3.5" />
                            FAQ {collection.shortTitle}
                        </div>
                        <h2 className="mt-2 font-serif text-2xl font-bold text-[#201813] sm:text-3xl">
                            Pertanyaan Umum Seputar {collection.shortTitle} di Padang
                        </h2>

                        <div className="mt-6 grid gap-3.5">
                            {collection.faqs.map((faq, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl border border-[#E7D8C8] bg-[#FAF6F0] p-4.5 sm:p-5"
                                >
                                    <h3 className="text-sm font-bold text-[#201813] sm:text-base">
                                        {faq.question}
                                    </h3>
                                    <p className="mt-2 text-xs font-medium leading-relaxed text-[#5A4F46] sm:text-sm">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Cross-linking to other collections */}
                <section className="mt-10 rounded-[30px] border border-[#E7D8C8] bg-[#F8F1E8]/70 p-6 sm:p-8">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                        Jelajahi Kategori Lain
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-bold text-[#201813] sm:text-2xl">
                        Cari Cafe di Padang Berdasarkan Mood Lainnya
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2.5">
                        {otherCollections.map((other) => (
                            <Link
                                key={other.slug}
                                href={`/rekomendasi/${other.slug}/`}
                                className="inline-flex items-center gap-2 rounded-full border border-[#E7D8C8] bg-white px-4 py-2 text-xs font-bold text-[#201813] shadow-sm transition hover:border-[#C8784A] hover:bg-[#FAF4ED] hover:text-[#C8784A]"
                            >
                                <span>{other.emoji}</span>
                                <span>{other.shortTitle}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-[#E7D8C8] pt-4">
                        <Link
                            href="/rekomendasi"
                            className="inline-flex items-center gap-2 text-xs font-bold text-[#756A60] hover:text-[#201813]"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Kembali ke Halaman Rekomendasi
                        </Link>
                        <Link
                            href="/places"
                            className="text-xs font-bold text-[#C8784A] hover:underline"
                        >
                            Buka Semua Tempat & Filter Lengkap →
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}

import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Coffee, MapPin, Heart, Sparkles, Compass, ArrowRight, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Tentang Saranwak — Local Coffee Shop Guide dari Padang",
    description:
        "Cerita di balik Saranwak, platform panduan lokal yang membantu anak muda dan penikmat kopi di Padang menemukan tempat yang pas sesuai mood dan kebutuhan.",
    alternates: {
        canonical: "https://saranwak.com/about",
    },
    openGraph: {
        title: "Tentang Saranwak — Local Coffee Shop Guide dari Padang",
        description:
            "Cerita di balik Saranwak, platform panduan lokal coffee shop di Padang.",
        url: "https://saranwak.com/about",
        type: "website",
    },
};

const values = [
    {
        number: "01",
        title: "Lahir dari Padang",
        icon: MapPin,
        description:
            "Saranwak dimulai dari Kota Padang karena rekomendasi lokal terbaik lahir dari mereka yang benar-benar menjelajahi setiap sudut kotanya.",
    },
    {
        number: "02",
        title: "Kurasi Terverifikasi",
        icon: Coffee,
        description:
            "Kami memverifikasi langsung fasilitas, colokan, Wi-Fi, jam buka, hingga suasana agar ekspektasimu sesuai saat tiba di lokasi.",
    },
    {
        number: "03",
        title: "Pencarian Berbasis Mood",
        icon: Sparkles,
        description:
            "Nggak cuma cari nama kafe. Temukan tempat berdasarkan kebutuhan nyata: nugas/WFC, meeting santai, sunset view, atau sekadar me-time.",
    },
];

const pillars = [
    {
        title: "Direktori Terkurasi",
        desc: "Setiap tempat diulas berdasarkan kriteria riil: fasilitas colokan, kecepatan Wi-Fi, dan kenyamanan tempat duduk.",
    },
    {
        title: "Dukungan Bisnis Lokal",
        desc: "Membantu roastery independen dan kedai kopi lokal Padang dikenal lebih luas oleh generasi muda dan digital nomad.",
    },
    {
        title: "Tanpa Drama Salah Pilih",
        desc: "Hemat waktu tanpa bingung bertanya 'di mana enaknya?'. Cukup pilih mood atau budget kamu hari ini.",
    },
    {
        title: "Pembaruan Berkala",
        desc: "Informasi jam buka, kontak WhatsApp, tautan Google Maps, dan menu terus kami perbarui secara berkala.",
    },
];

const WHATSAPP_NUMBER = "6281932097214";

const contactUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi Saranwak, saya ingin bekerjasama / mendaftarkan tempat di saranwak.com"
)}`;

const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": "https://saranwak.com/about#webpage",
    "url": "https://saranwak.com/about",
    "name": "Tentang Saranwak — Local Coffee Shop Guide dari Padang",
    "description":
        "Cerita di balik Saranwak, platform direktori dan panduan lokal terkurasi untuk menemukan coffee shop dan tempat nugas di Padang.",
    "mainEntity": {
        "@type": "Organization",
        "@id": "https://saranwak.com/#organization",
        "name": "Saranwak",
        "alternateName": ["Saran Wak", "Saranwak Padang"],
        "url": "https://saranwak.com",
        "logo": "https://saranwak.com/favicon.png",
        "disambiguatingDescription":
            "Saranwak adalah platform teknologi dan panduan kurasi spot ngopi serta ruang kerja kreatif lokal di Padang, Sumatera Barat.",
        "areaServed": "Padang, Sumatera Barat",
    },
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#F4F1EA] px-3 pb-28 pt-3 text-[#141414] sm:px-6 sm:pb-20 sm:pt-6 lg:px-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(aboutJsonLd),
                }}
            />
            <div className="mx-auto flex max-w-7xl flex-col gap-10 sm:gap-14">
                {/* 1. Hero Section with Atmospheric Image Canvas */}
                <HeroAbout />

                {/* 2. Core Values Grid */}
                <section>
                    <div className="mb-6">
                        <div className="mb-2.5 h-1 w-12 rounded-full bg-[#C8784A]" />
                        <h2 className="font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-3xl">
                            Mengapa Saranwak Ada?
                        </h2>
                        <p className="mt-1 text-sm font-medium text-[#756A60]">
                            Prinsip kami dalam membangun panduan kopi paling nyaman untuk Kota Padang.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        {values.map((item) => (
                            <ValueCard key={item.title} item={item} />
                        ))}
                    </div>
                </section>

                {/* 3. The Story & Pillars Section */}
                <section className="relative overflow-hidden rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-[0_16px_50px_rgba(47,35,25,0.05)] sm:p-10 lg:p-12">
                    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#E7D8C8] bg-[#FAF3EC] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C8784A]">
                                <Heart className="h-3.5 w-3.5 text-[#C8784A]" />
                                Komitmen Kami
                            </div>

                            <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-[#201813] sm:text-4xl">
                                Dari Padang, untuk para penikmat kopi & ruang bertumbuh.
                            </h2>

                            <p className="mt-4 text-sm font-medium leading-relaxed text-[#756A60] sm:text-base sm:leading-relaxed">
                                Kota Padang punya denyut budaya ngopi yang luar biasa hidup — mulai dari
                                warung kopi legendaris di kawasan pecinan Pondok hingga specialty roastery modern
                                di sepanjang tepian Batang Arau dan pusat kota.
                            </p>

                            <p className="mt-3 text-sm font-medium leading-relaxed text-[#756A60] sm:text-base sm:leading-relaxed">
                                Saranwak hadir agar setiap cangkir kopi yang kamu kunjungi punya cerita yang tepat:
                                laptopan berjam-jam tanpa khawatir baterai habis, ngobrol hangat saat senja,
                                atau sekadar menikmati manual brew terbaik karya barista lokal.
                            </p>

                            <div className="mt-6 flex items-center gap-3">
                                <Link
                                    href="/places?category=coffee-shop"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#1F5A4A] px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#164337] active:scale-95 sm:text-sm"
                                >
                                    <span>Jelajahi Direktori</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* 4 Pillars Grid */}
                        <div className="grid gap-3.5 sm:grid-cols-2">
                            {pillars.map((item, index) => (
                                <div
                                    key={item.title}
                                    className="rounded-[22px] border border-[#E7D8C8]/80 bg-[#FAF4ED]/60 p-5 transition duration-300 hover:-translate-y-1 hover:border-[#1F5A4A]/40 hover:bg-white hover:shadow-md"
                                >
                                    <p className="font-mono text-xs font-bold text-[#C8784A]">
                                        0{index + 1}
                                    </p>
                                    <h3 className="mt-2 font-serif text-base font-bold text-[#201813]">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1.5 text-xs font-medium leading-relaxed text-[#756A60]">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Business CTA Section */}
                <BusinessCTA />
            </div>
        </main>
    );
}

function HeroAbout() {
    return (
        <section className="relative min-h-[420px] overflow-hidden rounded-[32px] border border-[#E4DDD3] bg-[#1E1916] shadow-[0_20px_60px_rgba(32,24,19,0.12)] sm:min-h-[480px] sm:rounded-[44px]">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=2000&q=85"
                    alt="Coffee brewing atmosphere in Padang"
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-cover object-center brightness-[0.70] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/35" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
            </div>

            <div className="relative z-10 flex min-h-[400px] flex-col justify-between p-6 sm:min-h-[460px] sm:p-10 md:p-14 lg:p-16">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur-md">
                        <Compass className="h-3.5 w-3.5 text-[#E5A86D]" />
                        <span>Mengenal Lebih Dekat</span>
                    </div>

                    <div className="mt-6 max-w-3xl">
                        <h1 className="font-serif text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
                            Local guide
                            <span className="block font-serif italic text-[#F2C38B]">
                                untuk setiap cangkir ceritamu.
                            </span>
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white/85 sm:text-base sm:leading-relaxed">
                            Saranwak membantu kamu menemukan coffee shop dan spot ruang kerja terbaik di Padang
                            berdasarkan mood, fasilitas Wi-Fi & colokan, budget, hingga suasana.
                        </p>
                    </div>
                </div>

                {/* Bottom Stats Rail */}
                <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                    <MiniStat value="35+" label="Spot Terkurasi" />
                    <MiniStat value="100%" label="Independen" />
                    <MiniStat value="Padang" label="Fokus Kota" />
                    <div className="ml-auto hidden sm:block">
                        <Link
                            href="/places?category=coffee-shop"
                            className="inline-flex items-center gap-2 rounded-full bg-[#C8784A] px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#B5673B] active:scale-95 sm:text-sm"
                        >
                            <span>Cari Coffee Shop Sekarang</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ValueCard({
    item,
}: {
    item: {
        number: string;
        title: string;
        icon: React.ComponentType<{ className?: string }>;
        description: string;
    };
}) {
    const Icon = item.icon;
    return (
        <div className="group relative overflow-hidden rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-[0_12px_36px_rgba(47,35,25,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(47,35,25,0.08)]">
            <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FAF3EC] text-[#C8784A] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs font-bold text-[#756A60]/60">
                    {item.number}
                </span>
            </div>

            <h3 className="mt-4 font-serif text-xl font-bold tracking-tight text-[#201813]">
                {item.title}
            </h3>

            <p className="mt-2 text-xs font-medium leading-relaxed text-[#756A60] sm:text-sm sm:leading-relaxed">
                {item.description}
            </p>
        </div>
    );
}

function MiniStat({ value, label }: { value: string; label: string }) {
    return (
        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-center backdrop-blur-md sm:px-5 sm:py-3 sm:text-left">
            <p className="font-serif text-lg font-bold text-[#F2C38B] sm:text-2xl">{value}</p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/60 sm:text-[10px]">
                {label}
            </p>
        </div>
    );
}

function BusinessCTA() {
    return (
        <section className="relative overflow-hidden rounded-[32px] border border-[#E7D8C8] bg-[#1F5A4A] p-6 text-white shadow-[0_20px_50px_rgba(31,90,74,0.22)] sm:p-10 md:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E5A86D]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-black/25 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F2C38B] backdrop-blur">
                        <MessageCircle className="h-3.5 w-3.5" />
                        Untuk Pemilik Kafe & Mitra
                    </div>

                    <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                        Ingin Coffee Shop Kamu Terdaftar di Saranwak?
                    </h2>

                    <p className="mt-2 text-xs font-medium leading-relaxed text-white/80 sm:text-sm sm:leading-relaxed">
                        Kami membuka pintu kurasi dan kerja sama untuk coffee shop lokal di Kota Padang.
                        Mulai dari update data tempat, penambahan fasilitas, hingga promosi kreatif.
                    </p>
                </div>

                <div className="shrink-0">
                    <a
                        href={contactUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#C8784A] px-7 py-3.5 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-[#B5673B] active:scale-95 sm:text-sm"
                    >
                        <span>Hubungi via WhatsApp</span>
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}

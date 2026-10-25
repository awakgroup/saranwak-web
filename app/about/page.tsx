import Link from "next/link";
import type { Metadata } from "next";

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
        title: "Mulai dari Padang",
        description:
            "Saranwak dimulai dari Padang karena rekomendasi lokal paling bagus lahir dari orang yang paham daerahnya.",
    },
    {
        number: "02",
        title: "Fokus ke coffee shop",
        description:
            "Kami mulai dari coffee shop dulu supaya data lebih rapi, relevan, dan enak dipakai sebelum masuk kategori lain.",
    },
    {
        number: "03",
        title: "Cari sesuai kebutuhan",
        description:
            "User bisa cari tempat berdasarkan mood, aktivitas, budget, fasilitas, dan vibes.",
    },
];

const focusPoints = [
    "Coffee shop Padang sebagai fokus awal",
    "Filter berdasarkan mood dan kebutuhan",
    "Informasi tempat yang lebih rapi",
    "Kolaborasi dengan bisnis lokal",
];

const WHATSAPP_NUMBER = "6281932097214";

const contactUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi SaranWak, saya ingin bekerjasama dengan saranwak.com"
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
        <main className="min-h-screen bg-[#F4F1EA] px-4 py-8 text-[#141414] sm:px-6 lg:px-8 lg:py-10">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(aboutJsonLd),
                }}
            />
            <div className="mx-auto max-w-7xl">
                <HeroAbout />

                <section className="mt-8 grid gap-4 md:grid-cols-3">
                    {values.map((item) => (
                        <ValueCard key={item.title} item={item} />
                    ))}
                </section>

                <section className="mt-8 grid gap-6 rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-[0_16px_50px_rgba(47,35,25,0.05)] sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                            Fokus Kami
                        </p>

                        <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-4xl">
                            Mulai kecil, dibuat dengan serius.
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-[#756A60] sm:text-base">
                            Untuk sekarang, Saranwak fokus membangun pengalaman mencari coffee
                            shop di Padang yang lebih rapi, relevan, dan gampang dipakai.
                            Bukan kejar banyak kategori dulu, tapi bikin fondasinya kuat.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {focusPoints.map((item, index) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8]/70 p-4.5"
                            >
                                <p className="font-serif text-xs font-bold text-[#C8784A]">
                                    0{index + 1}
                                </p>

                                <p className="mt-1.5 text-xs font-bold leading-5 text-[#201813] sm:text-sm sm:leading-6">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <BusinessCTA />
            </div>
        </main>
    );
}

function HeroAbout() {
    return (
        <section className="relative overflow-hidden rounded-[34px] border border-[#E7D8C8] bg-[#191614] p-6 text-white shadow-[0_24px_80px_rgba(32,24,19,0.18)] sm:p-8 lg:p-10">
            <HeroDecor />

            <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_0.75fr] lg:items-end">
                <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2C38B] backdrop-blur sm:text-xs">
                        <span className="h-2 w-2 rounded-full bg-[#F2C38B]" />
                        Tentang Saranwak
                    </div>

                    <h1 className="mt-4 font-serif text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Local guide
                        <span className="block italic text-[#F2C38B]">buat cari tempat yang pas.</span>
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-white/70 sm:text-base">
                        Saranwak membantu orang menemukan coffee shop dan spot lokal di
                        Padang berdasarkan mood, kebutuhan, area, budget, fasilitas, dan
                        vibes.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/places?category=coffee-shop"
                            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F2C38B] px-6 py-3 text-sm font-bold text-[#201813] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
                        >
                            Lihat Coffee Shop →
                        </Link>

                        <a
                            href={contactUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-[#201813]"
                        >
                            Hubungi Kami
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 lg:grid-cols-1">
                    <MiniStat value="Padang" label="Fokus Awal" />
                    <MiniStat value="Coffee" label="Kategori Utama" />
                    <MiniStat value="Mood" label="Metode Temu" />
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
        description: string;
    };
}) {
    return (
        <div className="relative overflow-hidden rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-[0_14px_45px_rgba(47,35,25,0.045)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(47,35,25,0.08)]">
            <p className="font-serif text-xs font-bold text-[#C8784A]">{item.number}</p>

            <h2 className="mt-2 font-serif text-lg font-bold text-[#201813]">
                {item.title}
            </h2>

            <p className="mt-2 text-xs font-medium leading-6 text-[#756A60] sm:text-sm">
                {item.description}
            </p>
        </div>
    );
}

function MiniStat({ value, label }: { value: string; label: string }) {
    return (
        <div className="rounded-2xl border border-white/12 bg-white/[0.08] p-4 text-center backdrop-blur lg:text-left">
            <p className="font-serif text-xl font-bold text-[#F2C38B] sm:text-2xl">{value}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                {label}
            </p>
        </div>
    );
}

function BusinessCTA() {
    return (
        <section className="mt-8 rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-[0_16px_50px_rgba(47,35,25,0.05)] sm:p-8">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                        Untuk Bisnis Lokal
                    </p>

                    <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-3xl">
                        Mau Tempat Kamu Masuk Saranwak?
                    </h2>

                    <p className="mt-2 max-w-2xl text-xs font-medium leading-6 text-[#756A60] sm:text-sm">
                        Hubungi kami untuk kerja sama, update informasi tempat, promo
                        placement, atau pembuatan profil bisnis digital.
                    </p>
                </div>

                <a
                    href={contactUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1F5A4A] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#164337]"
                >
                    Hubungi via WhatsApp →
                </a>
            </div>
        </section>
    );
}

function HeroDecor() {
    return (
        <>
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#C8784A]/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-[#1F5A4A]/30 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:44px_44px]" />
        </>
    );
}
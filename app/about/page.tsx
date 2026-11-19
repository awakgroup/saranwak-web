import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
    Coffee,
    MapPin,
    Heart,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    Laptop,
    Users,
    Code,
    Handshake,
    Megaphone,
    ShieldCheck,
    HelpCircle,
    Compass,
    Building2,
    Zap,
    ExternalLink,
    BookOpen,
    MessageCircle,
    Mail,
} from "lucide-react";

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

const WHATSAPP_NUMBER = "6281932097214";
const registerCafeUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi SaranWak, saya pemilik coffee shop di Padang dan tertarik mendaftarkan tempat saya di Saranwak."
)}`;
const suggestSpotUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Halo Saranwak, saya punya saran spot ngopi di Padang"
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

const TEAM_MEMBERS = [
    {
        name: "Viky Fandreano",
        role: "Fullstack Tech",
        badge: "Tech & UX",
        skill: "Fullstack & Architecture",
        handle: "@vikyfand",
        desc: "Merancang arsitektur sistem, platform website, dan antarmuka responsif yang seamless di semua perangkat agar pengguna menemukan spot kafe dalam hitungan detik.",
        image: "/images/founder-placeholder.png",
    },
    {
        name: "Gozi Yuzakki Adli",
        role: "Bisnis Development",
        badge: "Partnership",
        skill: "Partnership & Community",
        handle: "@goziyzk",
        desc: "Menjalin kemitraan dengan pemilik kedai kopi lokal Padang dan merumuskan ekosistem pertumbuhan Saranwak agar UMKM kopi Minang bertumbuh sehat bersama.",
        image: "/images/founder-placeholder.png",
    },
    {
        name: "Randika Junivan Putra",
        role: "Marketing & Partnership",
        badge: "Brand & Social",
        skill: "Content & Community Lead",
        handle: "@randikajunivan",
        desc: "Mengelola narasi visual, identitas brand, liputan on-ground kedai kopi, dan engagement media sosial agar rekomendasi Saranwak selalu dekat dengan generasi muda Padang.",
        image: "/images/founder-placeholder.png",
    },
];

const MOBILE_FOUNDERS = [
    {
        name: "Viky Fandreano",
        role: "Fullstack Tech",
        desc: "Merancang arsitektur sistem, platform website, dan antarmuka responsif yang seamless di semua perangkat.",
        image: "/images/founder-placeholder.png",
    },
    {
        name: "Gozi Yuzakki Adli",
        role: "Bisnis Development",
        desc: "Menjalin kemitraan dengan pemilik kedai kopi lokal Padang dan merumuskan ekosistem pertumbuhan Saranwak.",
        image: "/images/founder-placeholder.png",
    },
    {
        name: "Randika Junivan Putra",
        role: "Marketing & Partnership",
        desc: "Mengelola narasi visual, identitas brand, liputan on-ground kedai kopi, dan engagement skena kopi muda Padang.",
        image: "/images/founder-placeholder.png",
    },
];

const FAQS = [
    {
        q: "Bagaimana cara Saranwak memverifikasi kafe?",
        a: "Tim kami mengumpulkan data langsung di lokasi atau dari kurasi komunitas terpercaya, memeriksa colokan listrik, menguji kecepatan Wi-Fi, kenyamanan meja, ketersediaan mushola, dan pemisahan area merokok.",
    },
    {
        q: "Apakah pemilik kedai kopi bisa mendaftarkan tempatnya secara gratis?",
        a: "Ya! Saranwak menyediakan direktori terbuka tanpa biaya listing dasar. Kami ingin membantu UMKM kedai kopi lokal Padang agar mudah ditemukan oleh pecinta kopi dan pegiat remote work.",
    },
    {
        q: "Apakah Saranwak menerima ulasan berbayar (paid review)?",
        a: "Kredibilitas kurasi adalah nyawa Saranwak. Kami tidak menjual penilaian baik. Jika ada penempatan promosi sponsor (banner), akan ditandai secara transparan sebagai Slot Promo.",
    },
    {
        q: "Bagaimana jika informasi jam buka atau fasilitas sudah berubah?",
        a: "Kamu bisa menghubungi tim kami via WhatsApp atau fitur koreksi di tiap halaman detail kafe. Kami memperbarui data secara rutin bersama komunitas kopi Padang.",
    },
];

export default function AboutPage() {
    return (
        <main className="w-full bg-[#FAF7F2] text-[#19120D] antialiased">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(aboutJsonLd),
                }}
            />

            {/* Mobile About View - Aligned with Stitch fac1082d1e264cb6a4139ff81bd297a0 */}
            <div className="block sm:hidden w-full pb-28">
                {/* Hero Section Tentang Kami */}
                <section className="px-5 pt-3 pb-5 flex flex-col">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdbd1]/50 text-[#ac3311] text-[10px] uppercase tracking-wider font-bold mb-3 w-fit">
                        <BookOpen className="h-3.5 w-3.5 text-[#ac3311]" />
                        <span>CERITA &amp; MISI</span>
                    </div>
                    <h1 className="text-[#0d0401] text-[28px] leading-[34px] font-extrabold tracking-tight mb-3">
                        Berawal dari Keresahan Mencari Ruang Kerja yang Jujur.
                    </h1>

                    {/* Editorial Warm Image Banner */}
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-xs mb-4 bg-[#291c14]">
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_W8IxEEGUJwF8xLHEs0n93Df_G4_4o5fYtA7k1MQeon3M42l3C2k1jbLuGM9gjWeC5vmFR9jG_UUFeE8tkOWYp5vMFj5GvRY5nNEdNIhGluSlZWhapgCb4qo9UDDy4xh11BcW1MTtGP69fnI6WBXAD9e0NXhwFYONdFMeworUUVR2O-SsqZgNP2x94yvd-CWhz5-8vYH0_nGzg1wTZ1ZXTZsGLJ1g2bVthA1z_w"
                            alt="Suasana kedai kopi artisanal specialty di Padang"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0401]/85 via-[#0d0401]/30 to-transparent flex items-end p-4">
                            <div className="flex items-center gap-2 text-white">
                                <ShieldCheck className="h-4.5 w-4.5 text-[#ff6e48]" />
                                <span className="text-[13px] font-semibold">Kurasi Independen Ranah Minang</span>
                            </div>
                        </div>
                    </div>

                    {/* Story Description Card */}
                    <div className="bg-white p-4 rounded-2xl border border-[#e4e2de]/40 shadow-xs space-y-2.5">
                        <p className="text-[13px] text-[#1b1c1a] leading-relaxed">
                            <strong className="text-[#ac3311] font-bold">Saranwak</strong> lahir dari rutinitas harian kami yang kerap kali diuji oleh realitas: janji <span className="italic text-[#0d0401] font-semibold">&ldquo;cocok untuk kerja&rdquo;</span> yang berujung colokan minim, Wi-Fi lambat, atau musik yang terlalu hingar-bingar di sudut Kota Padang.
                        </p>
                        <p className="text-[13px] text-[#4e4540] leading-relaxed">
                            Kami percaya setiap perantau, pegiat lepas, dan mahasiswa berhak mendapatkan ruang jujur tanpa rasa takut &lsquo;zonk&rsquo;—tempat di mana aroma seduhan kopi lokal berpadu serasi dengan ketenangan menuntaskan karya.
                        </p>
                    </div>

                    {/* Stats Ringkas */}
                    <div className="grid grid-cols-3 gap-2.5 mt-4">
                        <div className="bg-white border border-[#e4e2de]/40 p-3 rounded-xl text-center shadow-xs">
                            <span className="block text-[20px] font-extrabold text-[#ac3311]">45+</span>
                            <span className="text-[11px] text-[#4e4540] font-medium">Spot Teruji</span>
                        </div>
                        <div className="bg-white border border-[#e4e2de]/40 p-3 rounded-xl text-center shadow-xs">
                            <span className="block text-[20px] font-extrabold text-[#0d0401]">100%</span>
                            <span className="text-[11px] text-[#4e4540] font-medium">Cek Lapangan</span>
                        </div>
                        <div className="bg-white border border-[#e4e2de]/40 p-3 rounded-xl text-center shadow-xs">
                            <span className="block text-[20px] font-extrabold text-[#bc7700]">Padang</span>
                            <span className="text-[11px] text-[#4e4540] font-medium">Fokus Penuh</span>
                        </div>
                    </div>
                </section>

                {/* 3 Pilar Nilai Kurasi */}
                <section className="px-5 py-5 bg-[#f5f3ef]/70">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-1.5 h-4 rounded-full bg-[#ac3311]" />
                        <h2 className="text-[18px] text-[#0d0401] font-bold tracking-tight">3 Pilar Nilai Kurasi</h2>
                    </div>
                    <p className="text-[12px] text-[#4e4540] mb-4">
                        Standar ketat yang kami gunakan sebelum sebuah kedai masuk katalog rekomendasi Saranwak.
                    </p>
                    <div className="space-y-3">
                        {/* Pilar 1 */}
                        <div className="bg-white p-4 rounded-2xl border border-[#e4e2de]/40 shadow-xs flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-[#ffdbd1] shrink-0 flex items-center justify-center text-[#ac3311]">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#ac3311]/10 text-[#ac3311] font-bold">01</span>
                                    <h3 className="text-[13px] text-[#0d0401] font-bold">Verifikasi Langsung ke Kedai</h3>
                                </div>
                                <p className="text-[12px] text-[#4e4540] leading-relaxed">
                                    Setiap tempat dikunjungi dan diuji langsung oleh tim kurator kami. Tak ada ulasan berbayar siluman atau rating palsu.
                                </p>
                            </div>
                        </div>

                        {/* Pilar 2 */}
                        <div className="bg-white p-4 rounded-2xl border border-[#e4e2de]/40 shadow-xs flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-[#ffddb8] shrink-0 flex items-center justify-center text-[#653e00]">
                                <Zap className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#ac3311]/10 text-[#ac3311] font-bold">02</span>
                                    <h3 className="text-[13px] text-[#0d0401] font-bold">Kebutuhan WFC Pasti</h3>
                                </div>
                                <p className="text-[12px] text-[#4e4540] leading-relaxed">
                                    Kejelasan rasio stopkontak per meja, uji kecepatan Wi-Fi riil (Mbps), kestabilan kursi ergonomis, serta tingkat desibel kebisingan.
                                </p>
                            </div>
                        </div>

                        {/* Pilar 3 */}
                        <div className="bg-white p-4 rounded-2xl border border-[#e4e2de]/40 shadow-xs flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-[#ff6e48]/20 shrink-0 flex items-center justify-center text-[#ac3311]">
                                <Handshake className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#ac3311]/10 text-[#ac3311] font-bold">03</span>
                                    <h3 className="text-[13px] text-[#0d0401] font-bold">Dukungan Kedai Lokal</h3>
                                </div>
                                <p className="text-[12px] text-[#4e4540] leading-relaxed">
                                    Mendorong pertumbuhan ekosistem kedai kopi independen dan roastery artisan lokal di seantero Ranah Minang agar kian berdaya.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tim Pendiri (Kolektif di Balik Saranwak) */}
                <section className="px-5 pt-6 pb-2">
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-4 rounded-full bg-[#ac3311]" />
                            <h2 className="text-[18px] text-[#0d0401] font-bold tracking-tight">Kolektif di Balik Saranwak</h2>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#ffdbd1] text-[#3c0800] text-[10px] font-bold">3 Founders</span>
                    </div>
                    <p className="text-[12px] text-[#4e4540] mb-4">
                        Anak muda Minang yang memadukan kecintaan pada kopi, teknologi, dan eksplorasi sudut kota.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {MOBILE_FOUNDERS.map((founder, index) => {
                            const isThird = index === 2;
                            return (
                                <div
                                    key={founder.name}
                                    className={`bg-white p-3 rounded-2xl border border-[#e4e2de]/40 shadow-xs ${
                                        isThird
                                            ? "col-span-2 flex flex-row items-center gap-3.5"
                                            : "flex flex-col"
                                    }`}
                                >
                                    <div
                                        className={`relative rounded-xl overflow-hidden bg-[#efeeea] shrink-0 ${
                                            isThird
                                                ? "w-24 h-24 aspect-square"
                                                : "w-full aspect-square mb-2.5"
                                        }`}
                                    >
                                        <Image
                                            src={founder.image}
                                            alt={founder.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className={isThird ? "min-w-0 flex-1" : ""}>
                                        <h3 className="text-[13px] text-[#0d0401] font-bold truncate">{founder.name}</h3>
                                        <p className="text-[11px] text-[#ac3311] font-semibold truncate">{founder.role}</p>
                                        <p className="text-[11px] text-[#4e4540] mt-0.5 line-clamp-2 leading-snug">{founder.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Kartu Ajakan & Mitra (Bento Banner Kolaborasi) */}
                <div className="px-5 mt-6 w-full">
                    <div className="relative rounded-2xl overflow-hidden bg-[#291c14] p-5 text-[#fbf9f5] shadow-[0_12px_32px_-4px_rgba(41,28,20,0.2)] border border-[#e4e2de]/20 flex flex-col justify-between group">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
                            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDte2czXe38gSMiqAXgaS9kDMbc00R0hpfJ4OwZ0z2BExLusE3_uWBEV1duOroCmm7zCPT5atvGhcv2BtxLK7UBQgzeZZ_8YWXU2DeCqe9-ktX5RK3FZnVRqj5TzMutwi4HnS2ua-K1WdYPMzaC91cOhvcTdjQ99OJmWlPcldHsrWwwZxzXA59pWsypWuZhmi2gHF5MQRQabWKYr78W8mrEiQoVfS1RqJaxOzjhNw')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0401] via-[#0d0401]/90 to-[#0d0401]/50" />
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#ff6e48]/20 blur-2xl pointer-events-none" />

                        <div className="relative z-10 flex items-start justify-between gap-3 mb-2.5">
                            <div className="flex flex-col items-start flex-1 min-w-0">
                                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ac3311]/30 backdrop-blur-sm border border-[#ffdbd1]/30 text-[#ffddb8] text-[10px] font-bold tracking-wider uppercase mb-2">
                                    <Handshake className="h-3.5 w-3.5 text-[#ffb95f]" />
                                    <span>KOLABORASI &amp; KOMUNITAS</span>
                                </div>
                                <h3 className="text-[17px] font-extrabold text-white tracking-tight leading-tight">
                                    Punya Saran Spot Baru atau Ingin Bermitra? <span className="text-[15px]">✨</span>
                                </h3>
                                <p className="text-[12px] text-[#e4e2de]/95 mt-1.5 leading-snug">
                                    Tahu kedai tersembunyi yang punya colokan melimpah, atau kedaimu ingin dikunjungi kurator kami? Mari duduk bersama.
                                </p>
                            </div>
                            <div className="shrink-0 relative flex flex-col items-center justify-center">
                                <div className="w-14 h-14 rounded-2xl bg-[#ac3311]/25 backdrop-blur-md border border-dashed border-[#ffdbd1]/60 flex items-center justify-center text-center shadow-inner">
                                    <Users className="h-6 w-6 text-[#ffdbd1]" />
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-3.5 mt-2 border-t border-[#e4e2de]/20">
                            <a
                                href={suggestSpotUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#ac3311] hover:bg-[#651400] text-white text-[13px] font-bold shadow-[0_4px_16px_rgba(172,51,17,0.35)] transition-all active:scale-[0.98]"
                            >
                                <MessageCircle className="h-4 w-4" />
                                <span className="truncate">Chat Admin WhatsApp</span>
                            </a>
                            <a
                                href="mailto:redaksi@saranwak.id?subject=Rekomendasi%20Kedai%20Saranwak"
                                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-[12px] font-semibold transition-all active:scale-[0.98] backdrop-blur-sm"
                            >
                                <Mail className="h-4 w-4 text-[#ffdbd1]" />
                                <span className="truncate">Email Redaksi Saranwak</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer Branding Presisi */}
                <div className="px-5 mt-8 pt-5 border-t border-[#e4e2de]/40 flex flex-col items-center text-center relative">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="relative w-5 h-5 rounded-md overflow-hidden shrink-0 shadow-xs">
                            <Image
                                src="/icon-192.png"
                                alt="Saranwak"
                                fill
                                sizes="20px"
                                className="object-cover"
                            />
                        </div>
                        <span className="text-[14px] text-[#0d0401] font-bold">Saranwak</span>
                    </div>
                    <p className="text-[11px] text-[#4e4540] max-w-xs mb-2 leading-relaxed">
                        Kurasi independen kopi &amp; spot WFC Kota Padang. Dibuat dengan kecintaan pada seduhan jujur.
                    </p>
                    <span className="text-[10px] text-[#80756f] leading-tight">
                        &copy; 2025 Saranwak Padang. Seluruh hak cipta dilindungi.
                    </span>
                </div>
            </div>

            {/* Desktop Sections */}
            <div className="hidden sm:block">
                {/* 1. Hero Story Section - Aligned with Stitch 5e380a33d20e4572b25e089a4b05f834 (Desktop) */}
                <section className="relative w-full overflow-hidden border-b border-[#EBE5DC] pb-16 pt-10 lg:pb-20">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                    {/* Category Badge & Breadcrumb */}
                    <div className="mb-6 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFECE5] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D8431F]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5C35]" />
                            CERITA &amp; LATAR BELAKANG • SARANWAK PADANG
                        </span>
                        <span className="hidden text-xs font-semibold uppercase tracking-widest text-[#756A63] sm:inline">
                            / Kurasi Independen Minang
                        </span>
                    </div>

                    {/* Editorial Headline & Story Paragraph */}
                    <div className="mb-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
                        <div className="lg:col-span-7">
                            <h1 className="font-sans text-3xl font-extrabold leading-[1.18] tracking-tight text-[#19120D] sm:text-4xl lg:text-[46px]">
                                Berawal dari Keresahan Mencari{" "}
                                <span className="font-serif font-normal italic text-[#FF5C35]">
                                    Spot Ngopi
                                </span>
                                , Menjadi{" "}
                                <span className="font-serif font-normal italic text-[#FF5C35]">
                                    Kompas Kafe
                                </span>{" "}
                                Ranah Minang.
                            </h1>
                        </div>

                        <div className="flex h-full flex-col justify-between lg:col-span-5 lg:pt-1">
                            <p className="text-sm leading-relaxed text-[#756A63] sm:text-base">
                                Saranwak lahir dari keresahan nyata sehari-hari: betapa sulitnya menemukan
                                coffee shop di Kota Padang yang benar-benar pas dengan kebutuhan saat itu.
                                Terkadang kita butuh spot kondusif untuk WFC dengan colokan dan Wi-Fi stabil;
                                di waktu lain kita butuh kafe nyaman untuk nongkrong santai, ramah ibadah dengan
                                mushola bersih, pemisahan area smoking/non-smoking, hingga tempat nugas ramah
                                kantong mahasiswa. Hadirnya Saranwak mempermudah pencarian tanpa rasa kecewa
                                (tanpa zonk), sekaligus menjadi wadah apresiasi bagi kedai kopi UMKM lokal agar kian dikenal luas.
                            </p>

                            <div className="mt-4 flex items-center gap-2 border-t border-[#EBE5DC] pt-3 text-xs font-bold uppercase tracking-wider text-[#FF5C35]">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Pilihan tepat tanpa zonk. Berdayakan UMKM Padang.</span>
                            </div>
                        </div>
                    </div>

                    {/* Asymmetric Visual Editorial Grid */}
                    <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-12">
                        {/* Large Focus Image Card */}
                        <div className="group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-3xl border border-[#EBE5DC] bg-[#19120D] p-6 shadow-md transition-all md:col-span-7 md:min-h-[460px] md:p-8">
                            <Image
                                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=85"
                                alt="WFC Kondusif & Stopkontak di Padang"
                                fill
                                sizes="(max-width: 768px) 100vw, 60vw"
                                className="object-cover object-center brightness-[0.70] transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                            <div className="relative z-10 text-white">
                                <span className="mb-2.5 inline-flex items-center gap-1 rounded-full bg-[#FF5C35] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                                    <Zap className="h-3.5 w-3.5" /> WFC Kondusif &amp; Stopkontak
                                </span>
                                <h2 className="mb-2 font-sans text-2xl font-bold leading-tight text-white md:text-3xl">
                                    Ruang Kerja Tenang &amp; Ergonomis
                                </h2>
                                <p className="max-w-lg text-sm leading-relaxed text-[#F6DED0]/90 line-clamp-2">
                                    Mempermudah mahasiswa, freelancer, dan pekerja remote Padang menemukan sudut fokus
                                    lengkap dengan koneksi internet stabil tanpa kebisingan berlebih.
                                </p>
                            </div>
                        </div>

                        {/* Two Stacked Editorial Cards */}
                        <div className="flex flex-col gap-5 md:col-span-5">
                            {/* Top Card: Mushola & Fasilitas */}
                            <div className="group relative flex h-[220px] flex-col justify-between overflow-hidden rounded-3xl border border-[#EBE5DC] bg-[#19120D] p-5 shadow-sm transition-all md:h-[222px] md:p-6">
                                <Image
                                    src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80"
                                    alt="Kenyamanan Beribadah & Mushola"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                    className="object-cover object-center brightness-[0.65] transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                                <div className="relative z-10">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#FDBA74] backdrop-blur-md">
                                        Fasilitas Ibadah
                                    </span>
                                </div>
                                <div className="relative z-10 text-white">
                                    <h3 className="font-sans text-lg font-bold leading-snug">
                                        Mushola Bersih &amp; Terawat
                                    </h3>
                                    <p className="mt-1 text-xs text-[#F6DED0]/85 line-clamp-2">
                                        Waktu sholat tiba tanpa perlu buru-buru pulang atau mencari tempat di luar kedai.
                                    </p>
                                </div>
                            </div>

                            {/* Bottom Card: Area Non-Smoking */}
                            <div className="group relative flex h-[220px] flex-col justify-between overflow-hidden rounded-3xl border border-[#EBE5DC] bg-[#19120D] p-5 shadow-sm transition-all md:h-[222px] md:p-6">
                                <Image
                                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
                                    alt="Area Smoking & Non-Smoking Terpisah"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                    className="object-cover object-center brightness-[0.65] transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                                <div className="relative z-10">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#FDBA74] backdrop-blur-md">
                                        Kualitas Udara
                                    </span>
                                </div>
                                <div className="relative z-10 text-white">
                                    <h3 className="font-sans text-lg font-bold leading-snug">
                                        Smoking &amp; Non-Smoking Jelas
                                    </h3>
                                    <p className="mt-1 text-xs text-[#F6DED0]/85 line-clamp-2">
                                        Area indoor bebas asap rokok yang adem bagi yang sensitif aroma dan butuh konsentrasi penuh.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Misi & Dampak Nyata */}
            <section className="w-full border-b border-[#EBE5DC] bg-[#F5F0E8] py-8 sm:py-14 md:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-12">
                        <div className="lg:col-span-5">
                            <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[#FF5C35]">
                                MISI &amp; DAMPAK NYATA
                            </span>
                            <h2 className="font-sans text-xl font-extrabold leading-tight tracking-tight text-[#19120D] sm:text-3xl">
                                Hadir agar tak ada lagi waktu terbuang karena salah pilih tempat.
                            </h2>
                        </div>
                        <div className="flex flex-col gap-2.5 text-xs leading-relaxed text-[#756A63] lg:col-span-7 sm:text-base">
                            <p>
                                Hadirnya Saranwak bertujuan mempermudah mahasiswa, pekerja remote, freelancer,
                                dan warga dalam menemukan tempat yang tepat tanpa rasa kecewa (tanpa zonk).
                                Kami percaya bahwa kedai kopi bukan sekadar tempat mengonsumsi kafein,
                                melainkan panggung penting bagi lahirnya karya, ide segar, dan perjumpaan yang hangat.
                            </p>
                            <p>
                                Sekaligus, Saranwak mendedikasikan diri untuk merangkul dan memberdayakan coffee shop
                                UMKM lokal di Kota Padang agar semakin dikenal luas oleh masyarakat dan pengunjung luar kota,
                                menghidupkan ekosistem kreatif dan perputaran ekonomi lokal Ranah Minang secara berkelanjutan.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Empat Tolok Ukur Kurasi Saranwak */}
            <section className="w-full py-8 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
                    <div className="mb-6 flex flex-col justify-between gap-2.5 sm:mb-10 sm:gap-4 md:flex-row md:items-end">
                        <div>
                            <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#FF5C35]">
                                NILAI &amp; TOLOK UKUR KURASI
                            </span>
                            <h2 className="font-sans text-xl font-extrabold tracking-tight text-[#19120D] sm:text-3xl">
                                Empat Tolok Ukur Saranwak
                            </h2>
                        </div>
                        <p className="max-w-md text-xs leading-relaxed text-[#756A63] sm:text-sm">
                            Setiap rekomendasi yang Anda temukan di Saranwak telah melewati kualifikasi ketat
                            tanpa kompromi demi pengalaman ngopi terbaik Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {/* 01 */}
                        <div className="group flex flex-col justify-between rounded-2xl border border-[#EBE5DC] bg-white p-4 shadow-sm transition-all hover:border-[#FF5C35]/50 hover:shadow-md sm:p-6">
                            <div>
                                <div className="mb-3.5 flex items-center justify-between sm:mb-5">
                                    <span className="font-sans text-xl font-black tracking-tight text-[#FF5C35] sm:text-2xl">01</span>
                                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#19120D] transition-colors group-hover:bg-[#FFECE5] group-hover:text-[#FF5C35]">
                                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                </div>
                                <h3 className="mb-1.5 font-sans text-sm font-bold leading-snug text-[#19120D] sm:text-base">
                                    Kebutuhan Spesifik &amp; Fasilitas Riil
                                </h3>
                                <p className="text-xs leading-relaxed text-[#756A63] sm:text-[13px]">
                                    Verifikasi langsung ketersediaan mushola bersih untuk ibadah, stopkontak memadai
                                    di setiap meja, Wi-Fi kencang, serta pemisahan area smoking dan indoor ber-AC.
                                </p>
                            </div>
                            <div className="mt-4 flex items-center gap-1.5 border-t border-[#F0EAE1] pt-3 text-xs font-bold uppercase tracking-wider text-[#FF5C35] sm:mt-5 sm:pt-4">
                                <ShieldCheck className="h-4 w-4" />
                                <span>Fasilitas Terkonfirmasi</span>
                            </div>
                        </div>

                        {/* 02 */}
                        <div className="group flex flex-col justify-between rounded-2xl border border-[#EBE5DC] bg-white p-4 shadow-sm transition-all hover:border-[#FF5C35]/50 hover:shadow-md sm:p-6">
                            <div>
                                <div className="mb-3.5 flex items-center justify-between sm:mb-5">
                                    <span className="font-sans text-xl font-black tracking-tight text-[#FF5C35] sm:text-2xl">02</span>
                                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#19120D] transition-colors group-hover:bg-[#FFECE5] group-hover:text-[#FF5C35]">
                                        <Laptop className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                </div>
                                <h3 className="mb-1.5 font-sans text-sm font-bold leading-snug text-[#19120D] sm:text-base">
                                    Solusi untuk Nugas &amp; Ngerjain Skripsi
                                </h3>
                                <p className="text-xs leading-relaxed text-[#756A63] sm:text-[13px]">
                                    Membantu mahasiswa dan pekerja remote di Padang menemukan meja yang ergonomis,
                                    suasana kondusif tanpa musik memekakkan telinga, dan harga menu yang bersahabat.
                                </p>
                            </div>
                            <div className="mt-4 flex items-center gap-1.5 border-t border-[#F0EAE1] pt-3 text-xs font-bold uppercase tracking-wider text-[#FF5C35] sm:mt-5 sm:pt-4">
                                <Coffee className="h-4 w-4" />
                                <span>Kondusif &amp; Teruji</span>
                            </div>
                        </div>

                        {/* 03 */}
                        <div className="group flex flex-col justify-between rounded-2xl border border-[#EBE5DC] bg-white p-4 shadow-sm transition-all hover:border-[#FF5C35]/50 hover:shadow-md sm:p-6">
                            <div>
                                <div className="mb-3.5 flex items-center justify-between sm:mb-5">
                                    <span className="font-sans text-xl font-black tracking-tight text-[#FF5C35] sm:text-2xl">03</span>
                                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#19120D] transition-colors group-hover:bg-[#FFECE5] group-hover:text-[#FF5C35]">
                                        <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                </div>
                                <h3 className="mb-1.5 font-sans text-sm font-bold leading-snug text-[#19120D] sm:text-base">
                                    Pemisahan Area yang Nyaman
                                </h3>
                                <p className="text-xs leading-relaxed text-[#756A63] sm:text-[13px]">
                                    Menghargai kebutuhan tiap pengunjung: ruang bebas rokok yang sejuk untuk fokus,
                                    dan area semi-outdoor bagi yang ingin bersantai bersama teman.
                                </p>
                            </div>
                            <div className="mt-4 flex items-center gap-1.5 border-t border-[#F0EAE1] pt-3 text-xs font-bold uppercase tracking-wider text-[#FF5C35] sm:mt-5 sm:pt-4">
                                <Sparkles className="h-4 w-4" />
                                <span>Zonasi Jelas</span>
                            </div>
                        </div>

                        {/* 04 */}
                        <div className="group flex flex-col justify-between rounded-2xl border border-[#EBE5DC] bg-white p-4 shadow-sm transition-all hover:border-[#FF5C35]/50 hover:shadow-md sm:p-6">
                            <div>
                                <div className="mb-3.5 flex items-center justify-between sm:mb-5">
                                    <span className="font-sans text-xl font-black tracking-tight text-[#FF5C35] sm:text-2xl">04</span>
                                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#19120D] transition-colors group-hover:bg-[#FFECE5] group-hover:text-[#FF5C35]">
                                        <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                </div>
                                <h3 className="mb-1.5 font-sans text-sm font-bold leading-snug text-[#19120D] sm:text-base">
                                    Transparansi Harga &amp; Menu Riil
                                </h3>
                                <p className="text-xs leading-relaxed text-[#756A63] sm:text-[13px]">
                                    Rentang harga kopi dan makanan yang transparan, tanpa kejutan kasir,
                                    sehingga Anda bisa merencanakan nongkrong atau kerja dengan tenang.
                                </p>
                            </div>
                            <div className="mt-4 flex items-center gap-1.5 border-t border-[#F0EAE1] pt-3 text-xs font-bold uppercase tracking-wider text-[#FF5C35] sm:mt-5 sm:pt-4">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Bebas Kejutan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Visi Kompas Kopi Terpercaya Banner */}
            <section className="w-full pb-8 sm:pb-16 lg:pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#382B22] bg-[#1F1610] p-5 text-[#F6DED0] shadow-xl sm:p-8 md:p-12">
                        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#FF5C35] opacity-25 blur-3xl" />
                        <div className="relative z-10 max-w-2xl">
                            <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[#FDBA74]">
                                VISI JANGKA PANJANG
                            </span>
                            <h2 className="mb-2 font-sans text-xl font-extrabold text-white sm:text-2xl md:text-3xl">
                                Menjadi Kompas Kopi Terpercaya di Kota Padang
                            </h2>
                            <p className="text-xs leading-relaxed text-[#D6CECA] sm:text-sm">
                                Kami berikhtiar mendokumentasikan setiap denyut kopi Kota Padang — dari gang sempit
                                di pecinan Pondok, sentra edukasi Khatib Sulaiman, hingga tepi sungai Batang Arau.
                                Menjadikan Padang destinasi coffee tourism berkelas dengan kearifan lokal yang terjaga.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Mengenal Tim yang Membangun Saranwak */}
            <section className="w-full border-t border-[#EBE5DC] py-8 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
                    <div className="mb-6 max-w-2xl sm:mb-12">
                        <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#FF5C35]">
                            ORANG DI BALIK LAYAR
                        </span>
                        <h2 className="font-sans text-xl font-extrabold tracking-tight text-[#19120D] sm:text-3xl">
                            Mengenal Tim yang Membangun Saranwak
                        </h2>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#756A63] sm:text-sm">
                            Pemuda yang mendedikasikan waktu, teknologi, dan kecintaan pada kota Padang
                            untuk menghadirkan direktori kafe terlengkap.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                        {TEAM_MEMBERS.map((member) => (
                            <div
                                key={member.name}
                                className="group flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#EBE5DC] bg-white p-4 shadow-sm transition-all hover:border-[#FF5C35]/50 hover:shadow-md sm:p-6"
                            >
                                <div>
                                    <div className="relative mb-3.5 aspect-[4/3] w-full overflow-hidden rounded-xl sm:mb-5 sm:rounded-2xl bg-[#F5F0E8]">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <span className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 rounded-full bg-[#1B120C]/85 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-bold text-white backdrop-blur-md">
                                            {member.role}
                                        </span>
                                    </div>
                                    <div className="mb-1 flex items-center justify-between sm:mb-1.5">
                                        <h3 className="font-sans text-base font-bold text-[#19120D] sm:text-lg">
                                            {member.name}
                                        </h3>
                                        <span className="text-xs font-bold uppercase tracking-wider text-[#FF5C35]">
                                            {member.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-[#756A63] sm:text-[13px]">
                                        {member.desc}
                                    </p>
                                </div>
                                <div className="mt-4 flex items-center justify-between border-t border-[#F0EAE1] pt-3 text-xs font-medium text-[#756A63] sm:mt-5 sm:pt-4">
                                    <span className="flex items-center gap-1.5">
                                        <Code className="h-3.5 w-3.5 text-[#FF5C35]" />
                                        <span>{member.skill}</span>
                                    </span>
                                    <span className="text-[11px] font-semibold text-[#80756F]">
                                        {member.handle}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Tanya Jawab Saranwak */}
            <section className="w-full border-y border-[#EBE5DC] bg-[#F5F0E8] py-8 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
                        <div className="lg:col-span-5">
                            <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#FF5C35]">
                                TANYA JAWAB SARANWAK
                            </span>
                            <h2 className="mb-2 font-sans text-xl font-extrabold leading-tight text-[#19120D] sm:text-3xl sm:mb-4">
                                Keterbukaan &amp; Standar Kerja Saranwak
                            </h2>
                            <p className="mb-4 text-xs leading-relaxed text-[#756A63] sm:text-sm sm:mb-6">
                                Pertanyaan umum seputar kurasi, pendaftaran kafe, objektivitas rekomendasi,
                                dan keterlibatan komunitas di Kota Padang.
                            </p>
                            <a
                                href={registerCafeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl sm:rounded-2xl bg-[#19120D] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#FF5C35] sm:px-5 sm:py-3"
                            >
                                <span>Punya Pertanyaan Lain? Hubungi Kami</span>
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>

                        <div className="flex flex-col gap-3 sm:gap-4 lg:col-span-7">
                            {FAQS.map((faq) => (
                                <div
                                    key={faq.q}
                                    className="rounded-xl sm:rounded-2xl border border-[#EBE5DC] bg-white p-4 shadow-xs transition-all hover:border-[#FF5C35]/40 sm:p-5"
                                >
                                    <h3 className="mb-1.5 font-sans text-sm font-bold text-[#19120D] sm:text-base sm:mb-2">
                                        {faq.q}
                                    </h3>
                                    <p className="text-xs leading-relaxed text-[#756A63] sm:text-sm">
                                        {faq.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. CTA Pemilik Kafe */}
            <section className="w-full pt-8 pb-28 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
                    <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-[#FF5C35]/30 bg-gradient-to-r from-[#1E130B] via-[#2A180E] to-[#140D08] p-5 text-white shadow-2xl sm:p-12 md:flex-row">
                        <div className="relative z-10 max-w-xl text-center md:text-left">
                            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#FF5C35]/40 bg-[#FF5C35]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FDBA74]">
                                <Megaphone className="h-3.5 w-3.5 text-[#FF5C35]" />
                                <span>KHUSUS PEMILIK KAFE</span>
                            </div>
                            <h2 className="mb-2 font-sans text-lg font-extrabold leading-tight text-white sm:text-3xl">
                                Punya Coffee Shop atau Usaha Kedai Kopi di Padang? Daftarkan Spot Kamu Secara Terbuka.
                            </h2>
                            <p className="text-xs leading-relaxed text-[#D4C9C3] sm:text-sm">
                                Bantu mahasiswa, pegiat remote work, dan wisatawan menemukan tempat Anda.
                                Publikasikan menu unggulan, fasilitas, dan suasana kedai Anda di Saranwak.
                            </p>
                        </div>

                        <div className="relative z-10 shrink-0 w-full md:w-auto">
                            <a
                                href={registerCafeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex w-full md:w-auto justify-center items-center gap-2 rounded-xl sm:rounded-2xl bg-[#FF5C35] px-6 py-3 text-xs font-bold text-white shadow-[0_12px_32px_-4px_rgba(255,92,53,0.35)] transition-all duration-300 hover:scale-105 hover:bg-[#D8431F] hover:shadow-2xl active:scale-95 sm:px-7 sm:py-3.5 sm:text-sm"
                            >
                                <span>Daftarkan Tempat Gratis</span>
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            </div>
        </main>
    );
}

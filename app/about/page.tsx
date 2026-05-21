import Link from "next/link";

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

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#F4F1EA] px-4 py-8 text-[#141414] sm:px-6 lg:px-8 lg:py-10">
            <div className="mx-auto max-w-7xl">
                <HeroAbout />

                <section className="mt-6 grid gap-4 md:grid-cols-3">
                    {values.map((item) => (
                        <ValueCard key={item.title} item={item} />
                    ))}
                </section>

                <section className="mt-6 grid gap-6 rounded-[30px] border border-[#E3DED4] bg-[#FFFDF8]/85 p-5 shadow-[0_18px_55px_rgba(47,35,25,0.05)] sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-8">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A] sm:text-xs">
                            Fokus Kami
                        </p>

                        <h2 className="mt-3 max-w-2xl text-3xl font-black leading-[1] tracking-[-0.055em] text-[#201813] sm:text-5xl">
                            Mulai kecil, tapi dibuat serius.
                        </h2>

                        <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#756A60] sm:text-base">
                            Untuk sekarang, Saranwak fokus membangun pengalaman mencari coffee
                            shop di Padang yang lebih rapi, relevan, dan gampang dipakai.
                            Bukan kejar banyak kategori dulu, tapi bikin fondasinya kuat.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {focusPoints.map((item, index) => (
                            <div
                                key={item}
                                className="rounded-[22px] border border-[#E3DED4] bg-[#F8F1E8] p-4"
                            >
                                <p className="text-xs font-black text-[#C8784A]">
                                    0{index + 1}
                                </p>

                                <p className="mt-2 text-sm font-black leading-6 text-[#201813]">
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
        <section className="relative overflow-hidden rounded-[34px] border border-[#E3DED4] bg-[#201813] p-5 text-white shadow-[0_22px_70px_rgba(32,24,19,0.14)] sm:p-7 lg:p-9">
            <HeroDecor />

            <div className="relative grid gap-7 lg:grid-cols-[1fr_0.75fr] lg:items-end">
                <div className="max-w-4xl">
                    <div className="inline-flex rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#F2C38B] sm:text-xs">
                        Tentang Saranwak
                    </div>

                    <h1 className="mt-4 max-w-4xl text-[40px] font-black leading-[0.95] tracking-[-0.065em] text-white sm:text-6xl lg:text-[74px]">
                        Local guide buat cari tempat yang pas.
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/68 sm:text-base">
                        Saranwak membantu orang menemukan coffee shop dan spot lokal di
                        Padang berdasarkan mood, kebutuhan, area, budget, fasilitas, dan
                        vibes.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/places?category=coffee-shop"
                            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F2C38B] px-6 py-3 text-sm font-black text-[#201813] transition hover:-translate-y-0.5 hover:bg-white"
                        >
                            Lihat coffee shop →
                        </Link>

                        <a
                            href={contactUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-[#201813]"
                        >
                            Kerja sama
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
                    <MiniStat value="Padang" label="Fokus awal" />
                    <MiniStat value="Coffee" label="Kategori awal" />
                    <MiniStat value="Mood" label="Cara cari" />
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
        <div className="relative overflow-hidden rounded-[26px] border border-[#E3DED4] bg-[#FFFDF8]/85 p-5 shadow-[0_14px_45px_rgba(47,35,25,0.045)] transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(47,35,25,0.08)]">
            <p className="text-xs font-black text-[#C8784A]">{item.number}</p>

            <h2 className="mt-3 text-xl font-black tracking-[-0.035em] text-[#201813]">
                {item.title}
            </h2>

            <p className="mt-2 text-sm font-semibold leading-6 text-[#756A60]">
                {item.description}
            </p>
        </div>
    );
}

function MiniStat({ value, label }: { value: string; label: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-center backdrop-blur lg:text-left">
            <p className="text-lg font-black text-[#F2C38B] sm:text-2xl">{value}</p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                {label}
            </p>
        </div>
    );
}

function BusinessCTA() {
    return (
        <section className="mt-6 rounded-[30px] border border-[#E3DED4] bg-[#FFFDF8]/85 p-5 shadow-[0_18px_55px_rgba(47,35,25,0.05)] sm:p-6 lg:p-7">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                        Untuk Bisnis Lokal
                    </p>

                    <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#201813] sm:text-3xl">
                        Mau tempat kamu masuk Saranwak?
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#756A60] sm:text-base">
                        Hubungi kami untuk kerja sama, update informasi tempat, promo
                        placement, atau pembuatan website bisnis.
                    </p>
                </div>

                <a
                    href={contactUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1F5A4A] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#18483B]"
                >
                    Contact Us →
                </a>
            </div>
        </section>
    );
}

function HeroDecor() {
    return (
        <>
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#F2C38B]/18 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-[#1F5A4A]/38 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:44px_44px]" />
        </>
    );
}
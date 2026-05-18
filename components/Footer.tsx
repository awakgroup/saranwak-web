import Link from "next/link";

const WHATSAPP_NUMBER = "6281932097214";

const contactUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi SaranWak, saya ingin bekerjasama dengan saranwak.com"
)}`;

const websiteServiceUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi SaranWak, saya ingin membuat website untuk bisnis saya"
)}`;

const menuLinks = [
    {
        label: "Explore",
        href: "/places?category=coffee-shop",
    },
    {
        label: "Rekomendasi",
        href: "/rekomendasi",
    },
    {
        label: "Tentang",
        href: "/about",
    },
];

const businessLinks = [
    {
        label: "Kerja sama",
        href: contactUrl,
    },
    {
        label: "Daftarkan tempat",
        href: contactUrl,
    },
    {
        label: "Buat website bisnis",
        href: websiteServiceUrl,
    },
];

export function Footer() {
    return (
        <footer className="border-t border-[#E3DED4] bg-[#F4F1EA] px-4 py-8 text-[#141414] sm:px-5 md:py-10">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr_0.8fr_1fr]">
                    <div className="rounded-[28px] border border-[#E3DED4] bg-[#FFFDF8] p-5 shadow-[0_14px_45px_rgba(47,35,25,0.05)]">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#181818] text-lg font-black text-[#FFFDF8]">
                                S
                            </div>

                            <div className="min-w-0">
                                <p className="text-xl font-black tracking-tight text-[#201813]">
                                    Saranwak
                                </p>
                                <p className="-mt-1 text-xs font-bold text-[#6F6A61]">
                                    cari tempat yang pas
                                </p>
                            </div>
                        </Link>

                        <p className="mt-4 max-w-sm text-sm font-semibold leading-7 text-[#756A60]">
                            Saranwak bantu kamu nemuin coffee shop di Padang berdasarkan
                            mood, kebutuhan, budget, fasilitas, dan vibes. Biar cari tempat
                            nggak cuma modal nebak dan doa.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {["Padang", "Coffee Shop", "Local Guide"].map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-[#E3DED4] bg-[#F8F1E8] px-3 py-1.5 text-[11px] font-black text-[#4B4038]"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-[#E3DED4] bg-[#FFFDF8] p-5 shadow-[0_14px_45px_rgba(47,35,25,0.05)]">
                        <h3 className="text-xs font-black uppercase tracking-[0.22em] text-[#C8784A]">
                            Menu
                        </h3>

                        <div className="mt-4 grid gap-2 text-sm font-black text-[#4B4038]">
                            {menuLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="rounded-2xl px-3 py-2 transition hover:bg-[#F8F1E8] hover:text-[#1F5A4A]"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-[#E3DED4] bg-[#FFFDF8] p-5 shadow-[0_14px_45px_rgba(47,35,25,0.05)]">
                        <h3 className="text-xs font-black uppercase tracking-[0.22em] text-[#C8784A]">
                            Untuk Bisnis
                        </h3>

                        <div className="mt-4 grid gap-2 text-sm font-black text-[#4B4038]">
                            {businessLinks.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-2xl px-3 py-2 transition hover:bg-[#F8F1E8] hover:text-[#1F5A4A]"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[28px] border border-[#E3DED4] bg-[#181818] p-5 text-white shadow-[0_18px_55px_rgba(24,24,24,0.12)]">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#1F5A4A]/40 blur-2xl" />
                        <div className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-[#C8784A]/35 blur-2xl" />

                        <div className="relative">
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F2C38B]">
                                Owner bisnis?
                            </p>

                            <h3 className="mt-3 text-2xl font-black leading-tight tracking-[-0.04em]">
                                Biar tempat kamu lebih gampang ditemukan.
                            </h3>

                            <p className="mt-3 text-sm font-semibold leading-6 text-white/68">
                                Cocok untuk coffee shop, resto, studio, tempat olahraga, dan
                                bisnis lokal lain yang mau tampil lebih proper.
                            </p>

                            <div className="mt-5 grid gap-2">
                                <a
                                    href={contactUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F2C38B] px-5 py-3 text-sm font-black text-[#181818] transition hover:-translate-y-0.5 hover:bg-white"
                                >
                                    Daftarkan Tempat →
                                </a>

                                <a
                                    href={websiteServiceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-[#181818]"
                                >
                                    Buat Website Bisnis
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-[#E3DED4] pt-5 text-xs font-bold text-[#756A60] sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 Saranwak. Built from Padang.</p>
                    <p>Local guide first. Hype later.</p>
                </div>
            </div>
        </footer>
    );
}
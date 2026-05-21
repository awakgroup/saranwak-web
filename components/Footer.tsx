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
        label: "Buat website",
        href: websiteServiceUrl,
    },
];

export function Footer() {
    return (
        <footer className="border-t border-[#E3DED4] bg-[#F4F1EA] px-4 py-6 text-[#141414] sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="relative overflow-hidden rounded-[28px] border border-[#E3DED4] bg-[#FFFDF8]/85 p-5 shadow-[0_16px_50px_rgba(47,35,25,0.05)] sm:p-6">
                    <FooterDecor />

                    <div className="relative grid gap-6 lg:grid-cols-[1.3fr_0.7fr_0.8fr_1fr] lg:items-start">
                        <div className="max-w-md">
                            <Link href="/" className="inline-flex items-center gap-3">
                                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#201813] text-lg font-black text-[#FFFDF8]">
                                    S
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xl font-black tracking-[-0.04em] text-[#201813]">
                                        Saranwak
                                    </p>
                                    <p className="-mt-1 text-xs font-bold text-[#756A60]">
                                        cari tempat yang pas
                                    </p>
                                </div>
                            </Link>

                            <p className="mt-4 text-sm font-semibold leading-6 text-[#756A60]">
                                Local spot guide dari Padang buat cari coffee shop berdasarkan
                                mood, budget, fasilitas, dan vibes.
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
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

                        <FooterColumn title="Menu">
                            {menuLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="w-fit text-sm font-black text-[#4B4038] transition hover:text-[#1F5A4A]"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </FooterColumn>

                        <FooterColumn title="Bisnis">
                            {businessLinks.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-fit text-sm font-black text-[#4B4038] transition hover:text-[#1F5A4A]"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </FooterColumn>

                        <div className="rounded-[24px] bg-[#201813] p-4 text-white">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F2C38B]">
                                Owner bisnis?
                            </p>

                            <h3 className="mt-2 text-xl font-black leading-tight tracking-[-0.04em]">
                                Mau tempat kamu tampil?
                            </h3>

                            <p className="mt-2 text-xs font-semibold leading-5 text-white/65">
                                Cocok untuk coffee shop, resto, event, dan spot lokal.
                            </p>

                            <a
                                href={contactUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 inline-flex w-full min-h-10 items-center justify-center rounded-full bg-[#F2C38B] px-4 py-2.5 text-xs font-black text-[#201813] transition hover:bg-white"
                            >
                                Kerja sama →
                            </a>
                        </div>
                    </div>

                    <div className="relative mt-6 flex flex-col gap-2 border-t border-[#E3DED4] pt-4 text-xs font-bold text-[#756A60] sm:flex-row sm:items-center sm:justify-between">
                        <p>© 2026 Saranwak. Built from Padang.</p>
                        <p>Local guide first. Hype later.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterColumn({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                {title}
            </h3>

            <div className="mt-3 grid gap-2.5">{children}</div>
        </div>
    );
}

function FooterDecor() {
    return (
        <>
            <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-[#F2C38B]/22 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-[#1F5A4A]/10 blur-3xl" />
        </>
    );
}
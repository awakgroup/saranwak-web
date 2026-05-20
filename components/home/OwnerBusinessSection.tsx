import { websiteServiceUrl } from "@/constant/home";
import Link from "next/link";

const ownerBenefits = [
    "Listing tempat lebih rapi",
    "Arahkan ke Maps, Instagram, dan WhatsApp",
    "Siap untuk promo banner",
];

export function OwnerBusinessSection() {
    return (
        <section
            id="owner-business"
            className="px-4 pb-10 pt-0 sm:px-5 md:pb-14"
        >
            <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-[#E7D8C8] bg-[#181818] p-5 text-white shadow-[0_24px_80px_rgba(24,24,24,0.16)] sm:rounded-[34px] sm:p-7 md:rounded-[38px] md:p-10">
                {/* Mobile compact version */}
                <div className="md:hidden">
                    <MobileOwnerBusiness />
                </div>

                {/* Desktop full version */}
                <div className="hidden md:grid md:gap-7 lg:grid-cols-[1fr_0.82fr] lg:items-center">
                    <OwnerBusinessContent />
                    <OwnerBusinessCard />
                </div>
            </div>
        </section>
    );
}

function MobileOwnerBusiness() {
    return (
        <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#F2C38B]">
                Untuk owner bisnis lokal
            </p>

            <h2 className="mt-3 text-3xl font-black leading-[1.02] tracking-[-0.05em] text-white">
                Bisnis kamu bisa tampil di Saranwak.
            </h2>

            <p className="mt-3 text-sm font-semibold leading-6 text-white/68">
                Cocok untuk coffee shop, resto, event, studio, atau bisnis lokal yang
                mau lebih mudah ditemukan.
            </p>

            <div className="mt-5 grid gap-2">
                <a
                    href={websiteServiceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-12 items-center justify-center rounded-full bg-[#F2C38B] px-5 py-3 text-sm font-black text-[#181818] transition duration-300 active:scale-[0.98]"
                >
                    Konsultasi via WhatsApp
                </a>

                <Link
                    href="/places?category=coffee-shop"
                    className="flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-black text-white transition duration-300 active:scale-[0.98]"
                >
                    Lihat direktori
                </Link>
            </div>

            <div className="mt-5 grid gap-2">
                {ownerBenefits.map((item) => (
                    <div
                        key={item}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3.5 py-3"
                    >
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1F5A4A] text-xs font-black text-white">
                            ✓
                        </span>

                        <p className="text-sm font-bold leading-5 text-white/78">{item}</p>
                    </div>
                ))}
            </div>

            <div className="mt-4 rounded-2xl bg-[#F2C38B] p-4 text-[#201813]">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7A4E2F]">
                    Monetization
                </p>

                <p className="mt-1 text-base font-black leading-snug">
                    Featured listing + promo banner untuk bisnis lokal.
                </p>
            </div>
        </div>
    );
}

function OwnerBusinessContent() {
    return (
        <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#F2C38B]">
                Untuk owner bisnis lokal
            </p>

            <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl md:text-5xl">
                Punya coffee shop atau bisnis lokal?
            </h2>

            <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/68 sm:text-base">
                Saranwak bisa bantu tempat kamu lebih mudah ditemukan. Mulai dari
                listing, promo, featured placement, sampai website bisnis yang lebih
                proper.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                    href={websiteServiceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F2C38B] px-6 py-3 text-sm font-black text-[#181818] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
                >
                    Konsultasi via WhatsApp
                </a>

                <Link
                    href="/places?category=coffee-shop"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#181818]"
                >
                    Lihat direktori
                </Link>
            </div>
        </div>
    );
}

function OwnerBusinessCard() {
    return (
        <div className="rounded-[26px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur sm:p-5">
            <div className="grid gap-3">
                {ownerBenefits.map((item) => (
                    <div
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                    >
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#1F5A4A] text-xs font-black text-white">
                            ✓
                        </span>

                        <p className="text-sm font-bold leading-6 text-white/78">{item}</p>
                    </div>
                ))}
            </div>

            <div className="mt-4 rounded-2xl bg-[#F2C38B] p-4 text-[#201813]">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7A4E2F]">
                    Next monetization
                </p>

                <p className="mt-2 text-lg font-black leading-snug">
                    Featured listing, promo banner, dan halaman profil bisnis.
                </p>
            </div>
        </div>
    );
}
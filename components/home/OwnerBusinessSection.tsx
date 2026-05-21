import { websiteServiceUrl } from "@/constant/home";
import Link from "next/link";

const benefits = ["Featured listing", "Promo banner", "Profil bisnis"];

export function OwnerBusinessSection() {
    return (
        <section id="owner-business" className="relative">
            <div className="relative overflow-hidden rounded-[28px] border border-[#E7D8C8] bg-[#201813] px-5 py-6 text-white shadow-[0_18px_55px_rgba(32,24,19,0.14)] sm:px-7 sm:py-7 lg:px-8">
                <BackgroundDecor />

                <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div className="max-w-3xl">
                        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#F2C38B]">
                            Untuk owner bisnis
                        </div>

                        <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.04em] text-white sm:text-3xl lg:text-4xl">
                            Biar bisnis kamu lebih gampang ditemukan.
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/65 sm:text-base">
                            Tampilkan coffee shop, resto, event, atau spot lokal kamu di
                            Saranwak lewat listing dan promo placement.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {benefits.map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-white/75"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                        <a
                            href={websiteServiceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F2C38B] px-5 py-3 text-sm font-black text-[#201813] shadow-[0_14px_34px_rgba(242,195,139,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
                        >
                            Konsultasi via WhatsApp →
                        </a>

                        <Link
                            href="/places?category=coffee-shop"
                            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#201813]"
                        >
                            Lihat contoh listing
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function BackgroundDecor() {
    return (
        <>
            <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[#F2C38B]/18 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-20 h-64 w-64 rounded-full bg-[#1F5A4A]/35 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:42px_42px]" />
        </>
    );
}
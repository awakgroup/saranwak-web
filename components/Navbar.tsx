"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Sparkles, Info } from "lucide-react";

const desktopNavItems = [
    {
        label: "Explore",
        href: "/places?category=coffee-shop",
        match: "/places",
    },
    {
        label: "Rekomendasi",
        href: "/rekomendasi",
        match: "/rekomendasi",
    },
    {
        label: "Tentang",
        href: "/about",
        match: "/about",
    },
];

const mobileBottomNavItems = [
    {
        label: "Home",
        href: "/",
        icon: Home,
        isActive: (pathname: string) => pathname === "/",
    },
    {
        label: "Explore",
        href: "/places?category=coffee-shop",
        icon: Compass,
        isActive: (pathname: string) => pathname.startsWith("/places"),
    },
    {
        label: "Rekomendasi",
        href: "/rekomendasi",
        icon: Sparkles,
        isActive: (pathname: string) => pathname.startsWith("/rekomendasi"),
    },
    {
        label: "Tentang",
        href: "/about",
        icon: Info,
        isActive: (pathname: string) => pathname.startsWith("/about"),
    },
];

const WHATSAPP_NUMBER = "6281932097214";

const whatsappMessage = encodeURIComponent(
    "Saya ingin bekerjasama dengan saranwak.com"
);

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

export function Navbar() {
    const pathname = usePathname();

    // Sembunyikan navbar publik di area admin
    if (pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <>
            {/* Top Header Navbar */}
            <header className="sticky top-0 z-40 border-b border-[#E3DED4] bg-[#F4F1EA]/88 backdrop-blur-2xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-5">
                    {/* Brand Logo */}
                    <Link
                        href="/"
                        className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#181818] shadow-sm transition duration-300 group-hover:-rotate-6 group-hover:scale-105 sm:h-12 sm:w-12">
                            <Image
                                src="/favicon.png"
                                alt="Saranwak"
                                width={48}
                                height={48}
                                priority
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate font-serif text-xl font-bold tracking-tight text-[#141414] sm:text-2xl">
                                Saranwak
                            </p>
                            <p className="-mt-1 hidden text-[11px] font-bold text-[#6F6A61] sm:block">
                                cari tempat yang pas
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Center Pill Navigation */}
                    <nav className="hidden items-center gap-1 rounded-full border border-[#E3DED4] bg-[#FFFDF8]/80 p-1 text-sm font-bold shadow-sm md:flex">
                        {desktopNavItems.map((item) => {
                            const isActive = pathname.startsWith(item.match);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={[
                                        "rounded-full px-4 py-2 transition duration-200",
                                        isActive
                                            ? "bg-[#181818] text-[#FFFDF8]"
                                            : "text-[#4B4741] hover:bg-[#181818] hover:text-[#FFFDF8]",
                                    ].join(" ")}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Action: Contact Us button */}
                    <div className="flex items-center gap-2">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full bg-[#181818] px-3.5 py-2 text-xs font-black text-[#FFFDF8] transition duration-300 hover:-translate-y-0.5 hover:bg-[#2A2A2A] hover:shadow-lg sm:px-5 sm:text-sm"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Floating Navigation Dock */}
            <nav
                aria-label="Mobile Navigation"
                className="pointer-events-none fixed inset-x-0 bottom-4 z-50 px-4 pb-[env(safe-area-inset-bottom,0px)] md:hidden"
            >
                <div className="pointer-events-auto mx-auto flex max-w-[360px] items-center justify-around gap-1 rounded-full border border-[#E7D8C8] bg-[#FFFDF8]/94 p-1.5 shadow-[0_16px_40px_rgba(32,24,19,0.18)] backdrop-blur-xl">
                    {mobileBottomNavItems.map((item) => {
                        const active = item.isActive(pathname);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={[
                                    "flex flex-1 flex-col items-center justify-center rounded-full py-1.5 transition duration-200",
                                    active
                                        ? "bg-[#181818] text-[#FFFDF8] shadow-sm"
                                        : "text-[#756A60] hover:bg-[#F4F1EA] hover:text-[#201813]",
                                ].join(" ")}
                            >
                                <Icon
                                    className={[
                                        "h-4 w-4 transition-transform duration-200",
                                        active ? "scale-110 text-[#E59B63]" : "text-[#756A60]",
                                    ].join(" ")}
                                    strokeWidth={active ? 2.5 : 2}
                                />
                                <span className="mt-0.5 text-[10px] font-bold tracking-tight">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
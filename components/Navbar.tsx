"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navItems = [
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

const WHATSAPP_NUMBER = "6281932097214";

const whatsappMessage = encodeURIComponent(
    "Saya ingin bekerjasama dengan saranwak.com"
);

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

export function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-[#E3DED4] bg-[#F4F1EA]/88 backdrop-blur-2xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-5">
                <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="group flex min-w-0 items-center gap-3"
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#181818] shadow-sm transition duration-300 group-hover:-rotate-6 group-hover:scale-105 sm:h-12 sm:w-12">
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
                        <p className="truncate text-xl font-black tracking-tight text-[#141414] sm:text-2xl">
                            Saranwak
                        </p>
                        <p className="-mt-1 hidden text-[11px] font-bold text-[#6F6A61] sm:block">
                            cari tempat yang pas
                        </p>
                    </div>
                </Link>

                <nav className="hidden items-center gap-1 rounded-full border border-[#E3DED4] bg-[#FFFDF8]/80 p-1 text-sm font-bold text-[#4B4741] shadow-sm md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-full px-4 py-2 transition duration-300 hover:bg-[#181818] hover:text-[#FFFDF8]"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hidden rounded-full bg-[#181818] px-4 py-2 text-sm font-black text-[#FFFDF8] transition duration-300 hover:-translate-y-0.5 hover:bg-[#2A2A2A] hover:shadow-lg sm:inline-flex md:px-5"
                    >
                        Contact Us
                    </a>

                    <button
                        type="button"
                        onClick={() => setOpen((prev) => !prev)}
                        aria-label={open ? "Tutup menu" : "Buka menu"}
                        aria-expanded={open}
                        className="grid h-11 w-11 place-items-center rounded-2xl border border-[#E3DED4] bg-[#FFFDF8] text-2xl font-black leading-none text-[#181818] shadow-sm transition duration-300 hover:bg-[#181818] hover:text-[#FFFDF8] md:hidden"
                    >
                        {open ? "×" : "≡"}
                    </button>
                </div>
            </div>

            {open ? (
                <div className="border-t border-[#E3DED4] bg-[#F4F1EA]/96 px-4 pb-4 pt-2 backdrop-blur-2xl md:hidden">
                    <div className="mx-auto max-w-6xl overflow-hidden rounded-[24px] border border-[#E3DED4] bg-[#FFFDF8] p-2 shadow-[0_18px_55px_rgba(47,35,25,0.10)]">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="flex min-h-12 items-center justify-between rounded-2xl px-4 py-3 text-sm font-black text-[#201813] transition hover:bg-[#F8F1E8]"
                            >
                                {item.label}
                                <span className="text-[#9B8B7E]">→</span>
                            </Link>
                        ))}

                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setOpen(false)}
                            className="mt-2 flex min-h-12 items-center justify-center rounded-2xl bg-[#181818] px-4 py-3 text-sm font-black text-[#FFFDF8] transition hover:bg-[#1F5A4A]"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            ) : null}
        </header>
    );
}
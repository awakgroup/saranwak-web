import Link from "next/link";

const navItems = [
    {
        label: "Tempat",
        href: "/places",
    },
    {
        label: "Coffee Shop",
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

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-[#E3DED4] bg-[#F4F1EA]/82 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
                <Link href="/" className="group flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#181818] text-lg font-black text-[#FFFDF8] shadow-sm transition duration-300 group-hover:-rotate-6 group-hover:scale-105">
                        S
                    </div>

                    <div>
                        <p className="text-xl font-black tracking-tight text-[#141414]">
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

                <Link
                    href="/places"
                    className="rounded-full bg-[#181818] px-4 py-2 text-sm font-black text-[#FFFDF8] transition duration-300 hover:-translate-y-0.5 hover:bg-[#2A2A2A] hover:shadow-lg md:px-5"
                >
                    Cari Tempat
                </Link>
            </div>
        </header>
    );
}
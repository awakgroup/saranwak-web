import Link from "next/link";

const WHATSAPP_NUMBER = "6281932097214";

const contactUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi SaranWak, saya ingin bekerjasama dengan saranwak.com"
)}`;

const websiteServiceUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi SaranWak, saya ingin membuat website untuk bisnis saya"
)}`;

export function Footer() {
    return (
        <footer className="border-t border-[#E3DED4] bg-[#F4F1EA] px-4 py-10 text-[#141414] sm:px-5 md:py-14">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#181818] text-lg font-black text-[#FFFDF8]">
                                S
                            </div>

                            <div>
                                <p className="text-xl font-black tracking-tight">Saranwak</p>
                                <p className="-mt-1 text-xs font-bold text-[#6F6A61]">
                                    cari tempat yang pas
                                </p>
                            </div>
                        </Link>

                        <p className="mt-5 max-w-sm text-sm leading-7 text-[#756A60]">
                            Saranwak bantu kamu nemuin coffee shop di Padang berdasarkan
                            mood, kebutuhan, area, dan fasilitas. Biar cari tempat nggak cuma
                            modal nebak dan doa.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#C8784A]">
                            Menu
                        </h3>

                        <div className="mt-4 grid gap-3 text-sm font-bold text-[#4B4038]">
                            <Link href="/places?category=coffee-shop" className="hover:text-[#1F5A4A]">
                                Semua
                            </Link>
                            <Link href="/rekomendasi" className="hover:text-[#1F5A4A]">
                                Rekomendasi
                            </Link>
                            <Link href="/about" className="hover:text-[#1F5A4A]">
                                Tentang
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#C8784A]">
                            Untuk Bisnis
                        </h3>

                        <div className="mt-4 grid gap-3 text-sm font-bold text-[#4B4038]">
                            <a href={contactUrl} target="_blank" rel="noreferrer" className="hover:text-[#1F5A4A]">
                                Kerja sama
                            </a>
                            <a href={websiteServiceUrl} target="_blank" rel="noreferrer" className="hover:text-[#1F5A4A]">
                                Buat website bisnis
                            </a>
                            <a href={contactUrl} target="_blank" rel="noreferrer" className="hover:text-[#1F5A4A]">
                                Daftarkan tempat
                            </a>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-[#E3DED4] bg-[#FFFDF8] p-5">
                        <p className="text-sm font-black text-[#181818]">
                            Punya coffee shop atau bisnis lokal?
                        </p>

                        <p className="mt-2 text-sm leading-6 text-[#756A60]">
                            Masuk ke Saranwak atau bikin website bisnis kamu sendiri.
                        </p>

                        <a
                            href={contactUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-5 inline-flex rounded-full bg-[#181818] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#2A2A2A]"
                        >
                            Contact Us →
                        </a>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t border-[#E3DED4] pt-6 text-xs font-bold text-[#756A60] sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 Saranwak. Built from Padang.</p>
                    <p>Local guide first. Hype later.</p>
                </div>
            </div>
        </footer>
    );
}
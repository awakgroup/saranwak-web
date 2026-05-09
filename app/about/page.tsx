import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#F6F0E7] px-5 py-12 text-[#201813]">
            <section className="mx-auto max-w-6xl">
                <div className="rounded-[36px] border border-[#E7D8C8] bg-[#FFFDF8] p-8 md:p-12">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C8784A]">
                        Tentang Saranwak
                    </p>

                    <h1 className="mt-3 max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
                        Guide lokal buat cari tempat yang pas.
                    </h1>

                    <p className="mt-5 max-w-3xl text-lg leading-8 text-[#756A60]">
                        Saranwak adalah platform rekomendasi tempat berbasis kategori, mood,
                        kebutuhan, dan area. Mulai dari coffee shop di Padang, lalu bisa
                        berkembang ke resto, wisata, padel, badminton, coworking, dan spot
                        lokal lainnya.
                    </p>

                    <div className="mt-8">
                        <Link
                            href="/places"
                            className="rounded-full bg-[#1F5A4A] px-6 py-3 text-sm font-black text-white transition hover:bg-[#18483B]"
                        >
                            Mulai cari tempat
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
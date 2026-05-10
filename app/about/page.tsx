import Link from "next/link";

const values = [
    {
        title: "Mulai dari Padang",
        description:
            "Saranwak dimulai dari Padang karena kita percaya rekomendasi lokal paling bagus lahir dari orang yang paham daerahnya.",
    },
    {
        title: "Fokus dulu ke coffee shop",
        description:
            "Daripada langsung banyak kategori tapi datanya berantakan, kita mulai dari coffee shop dulu biar kurasinya lebih rapi.",
    },
    {
        title: "Cari berdasarkan kebutuhan",
        description:
            "Setiap orang punya alasan beda saat cari tempat: nugas, nongkrong, first date, meeting, atau sekadar healing tipis-tipis.",
    },
    {
        title: "Bukan cuma daftar tempat",
        description:
            "Saranwak ingin jadi local guide yang bantu user menentukan pilihan, bukan cuma menampilkan nama tempat lalu selesai.",
    },
];

const focusPoints = [
    "Coffee shop Padang sebagai fokus awal",
    "Informasi tempat yang lebih rapi dan mudah dipahami",
    "Filter berdasarkan mood, kebutuhan, dan fasilitas",
    "Kolaborasi dengan bisnis lokal yang relevan",
];

const WHATSAPP_NUMBER = "6281932097214";

const contactUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi SaranWak, saya ingin bekerjasama dengan saranwak.com"
)}`;

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#F4F1EA] px-4 py-12 text-[#141414] sm:px-5 md:py-16">
            <section className="mx-auto max-w-6xl">
                <div className="rounded-[36px] border border-[#E3DED4] bg-[#FFFDF8] p-6 shadow-sm sm:p-8 md:p-12">
                    <div className="max-w-4xl">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#C8784A] sm:text-sm">
                            Tentang Saranwak
                        </p>

                        <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-7xl">
                            Cari tempat yang pas tanpa harus scroll sampai jempol pensiun.
                        </h1>

                        <p className="mt-6 max-w-3xl text-base leading-8 text-[#756A60] sm:text-lg">
                            Saranwak adalah platform local spot guide yang membantu orang
                            menemukan tempat berdasarkan mood, kebutuhan, area, dan fasilitas.
                            Untuk tahap awal, Saranwak fokus ke rekomendasi coffee shop di
                            Padang.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/places?category=coffee-shop"
                                className="rounded-full bg-[#181818] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#2A2A2A]"
                            >
                                Lihat Coffee Shop
                            </Link>

                            <a
                                href={contactUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-[#E3DED4] bg-[#F4F1EA] px-5 py-3 text-sm font-black text-[#181818] transition hover:border-[#181818] hover:bg-[#181818] hover:text-white"
                            >
                                Kerja Sama →
                            </a>
                        </div>
                    </div>
                </div>

                <section className="mt-8 grid gap-5 md:grid-cols-2">
                    {values.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-[28px] border border-[#E3DED4] bg-[#FFFDF8] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(32,24,19,0.1)]"
                        >
                            <h2 className="text-2xl font-black text-[#201813]">
                                {item.title}
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-[#756A60] sm:text-base">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="mt-8 overflow-hidden rounded-[36px] bg-[#181818] p-6 text-white sm:p-8 md:p-12">
                    <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#F2C38B] sm:text-sm">
                                Fokus Kami
                            </p>

                            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
                                Mulai kecil, tapi dibuat serius.
                            </h2>

                            <p className="mt-5 text-sm leading-7 text-white/70 sm:text-base">
                                Untuk sekarang, Saranwak fokus membangun pengalaman mencari
                                coffee shop di Padang yang lebih rapi, relevan, dan mudah
                                digunakan. Kami tidak mengejar banyak kategori dulu; kami ingin
                                memastikan data, pengalaman pengguna, dan kualitas rekomendasi
                                benar-benar solid.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {focusPoints.map((item, index) => (
                                <div
                                    key={item}
                                    className="rounded-[22px] border border-white/10 bg-white/[0.06] p-4"
                                >
                                    <p className="text-xs font-black text-[#F2C38B]">
                                        0{index + 1}
                                    </p>

                                    <p className="mt-2 text-sm font-black leading-6 text-white">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mt-8 rounded-[36px] border border-[#E3DED4] bg-[#FFFDF8] p-6 sm:p-8 md:p-10">
                    <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#C8784A]">
                                Untuk Bisnis Lokal
                            </p>

                            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                                Punya coffee shop atau tempat yang mau masuk Saranwak?
                            </h2>

                            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#756A60] sm:text-base">
                                Kamu bisa hubungi kami untuk kerja sama, update informasi
                                tempat, atau membuat website bisnis sendiri.
                            </p>
                        </div>

                        <a
                            href={contactUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-fit rounded-full bg-[#1F5A4A] px-6 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#18483B]"
                        >
                            Contact Us →
                        </a>
                    </div>
                </section>
            </section>
        </main>
    );
}
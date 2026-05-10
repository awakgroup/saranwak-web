const reasons = [
    {
        number: "01",
        title: "Cari berdasarkan mood",
        description:
            "Mau nugas, nongkrong, first date, atau sekadar ngopi santai? Pilih kebutuhanmu, biar tempatnya lebih nyambung.",
    },
    {
        number: "02",
        title: "Fokus lokal Padang",
        description:
            "Saranwak mulai dari coffee shop Padang dulu, supaya datanya rapi, relevan, dan nggak asal banyak.",
    },
    {
        number: "03",
        title: "Data dikurasi",
        description:
            "Setiap tempat disusun dengan info penting seperti area, harga, jam buka, foto, Maps, Instagram, dan tag kebutuhan.",
    },
    {
        number: "04",
        title: "Langsung action",
        description:
            "Kalau sudah cocok, kamu bisa langsung buka Google Maps atau Instagram tempatnya. Nggak perlu muter-muter lagi.",
    },
];

export function WhySaranwak() {
    return (
        <section className="px-4 py-14 sm:px-5 md:py-5">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#C8784A] sm:text-sm">
                            Kenapa Saranwak?
                        </p>

                        <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-[#141414] sm:text-4xl md:text-5xl">
                            Biar cari tempat nggak cuma modal scroll dan feeling.
                        </h2>
                    </div>

                    <p className="max-w-md text-sm leading-7 text-[#756A60] sm:text-base">
                        Saranwak dibuat untuk bantu kamu menemukan tempat yang pas dengan
                        kebutuhan hari ini. Bukan sekadar daftar tempat, tapi guide yang
                        lebih relevan.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {reasons.map((reason) => (
                        <div
                            key={reason.number}
                            className="group rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#1F5A4A]/40 hover:shadow-[0_24px_70px_rgba(32,24,19,0.1)]"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <span className="text-sm font-black text-[#C8784A]">
                                    {reason.number}
                                </span>

                                <span className="h-3 w-3 rounded-full bg-[#1F5A4A] transition group-hover:scale-125" />
                            </div>

                            <h3 className="text-xl font-black text-[#201813]">
                                {reason.title}
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-[#756A60]">
                                {reason.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
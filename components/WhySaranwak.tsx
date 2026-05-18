const reasons = [
    {
        number: "01",
        title: "Cari sesuai mood",
        description:
            "Nugas, nongkrong, first date, atau ngopi santai. Pilih kebutuhan, lalu temukan tempat yang lebih nyambung.",
    },
    {
        number: "02",
        title: "Fokus Padang",
        description:
            "Mulai dari coffee shop Padang dulu, supaya datanya rapi, relevan, dan nggak asal banyak.",
    },
    {
        number: "03",
        title: "Info dikurasi",
        description:
            "Area, harga, jam buka, foto, Maps, Instagram, fasilitas, dan vibes disusun biar gampang dibandingkan.",
    },
    {
        number: "04",
        title: "Langsung action",
        description:
            "Kalau sudah cocok, tinggal buka Maps atau Instagram. Nggak perlu muter-muter dan debat di grup lagi.",
    },
];

export function WhySaranwak() {
    return (
        <section className="px-4 py-8 sm:px-5 md:py-10">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 shadow-[0_14px_45px_rgba(47,35,25,0.06)] sm:p-6 md:p-7">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#C8784A] sm:text-xs">
                                Kenapa Saranwak?
                            </p>

                            <h2 className="mt-2 text-2xl font-black leading-tight tracking-[-0.04em] text-[#201813] sm:text-3xl md:text-4xl">
                                Biar cari tempat nggak cuma modal scroll dan feeling.
                            </h2>
                        </div>

                        <p className="max-w-md text-sm font-semibold leading-6 text-[#756A60] sm:leading-7">
                            Saranwak bantu kamu menemukan tempat yang pas dengan kebutuhan
                            hari ini. Bukan sekadar daftar tempat, tapi guide yang lebih
                            relevan.
                        </p>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {reasons.map((reason) => (
                        <div
                            key={reason.number}
                            className="group rounded-[24px] border border-[#E7D8C8] bg-[#FFFDF8] p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#1F5A4A]/40 hover:shadow-[0_18px_55px_rgba(32,24,19,0.09)] sm:p-5"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <span className="rounded-full bg-[#F8F1E8] px-3 py-1.5 text-xs font-black text-[#C8784A] ring-1 ring-[#E7D8C8]">
                                    {reason.number}
                                </span>

                                <span className="h-2.5 w-2.5 rounded-full bg-[#1F5A4A] transition group-hover:scale-125" />
                            </div>

                            <h3 className="text-lg font-black tracking-[-0.02em] text-[#201813] sm:text-xl">
                                {reason.title}
                            </h3>

                            <p className="mt-2 text-sm font-semibold leading-6 text-[#756A60]">
                                {reason.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
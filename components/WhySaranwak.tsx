const reasons = [
    {
        number: "01",
        title: "Cari sesuai mood",
        mobileDesc: "Nugas, nongkrong, first date, atau ngopi santai.",
        description:
            "Nugas, nongkrong, first date, atau ngopi santai. Pilih kebutuhan, lalu temukan tempat yang lebih nyambung.",
    },
    {
        number: "02",
        title: "Fokus Padang",
        mobileDesc: "Mulai dari coffee shop Padang dulu.",
        description:
            "Mulai dari coffee shop Padang dulu, supaya datanya rapi, relevan, dan nggak asal banyak.",
    },
    {
        number: "03",
        title: "Info dikurasi",
        mobileDesc: "Harga, jam buka, Maps, fasilitas, dan vibes.",
        description:
            "Area, harga, jam buka, foto, Maps, Instagram, fasilitas, dan vibes disusun biar gampang dibandingkan.",
    },
    {
        number: "04",
        title: "Langsung action",
        mobileDesc: "Buka Maps atau Instagram kalau sudah cocok.",
        description:
            "Kalau sudah cocok, tinggal buka Maps atau Instagram. Nggak perlu muter-muter dan debat di grup lagi.",
    },
];

export function WhySaranwak() {
    return (
        <section className="px-4 py-6 sm:px-5 md:py-10">
            <div className="mx-auto max-w-6xl">
                {/* Mobile compact header */}
                <div className="mb-4 rounded-[24px] border border-[#E7D8C8] bg-[#FFFDF8] p-4 shadow-[0_12px_35px_rgba(47,35,25,0.05)] md:hidden">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                        Kenapa Saranwak?
                    </p>

                    <h2 className="mt-2 text-2xl font-black leading-[1.05] tracking-[-0.05em] text-[#201813]">
                        Cari tempat nggak cuma modal feeling.
                    </h2>

                    <p className="mt-2 text-sm font-semibold leading-6 text-[#756A60]">
                        Bantu kamu nemu tempat yang lebih pas, cepat, dan relevan.
                    </p>
                </div>

                {/* Desktop header */}
                <div className="mb-6 hidden rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 shadow-[0_14px_45px_rgba(47,35,25,0.06)] sm:p-6 md:block md:p-7">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#C8784A]">
                                Kenapa Saranwak?
                            </p>

                            <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-0.04em] text-[#201813] md:text-4xl">
                                Biar cari tempat nggak cuma modal scroll dan feeling.
                            </h2>
                        </div>

                        <p className="max-w-md text-sm font-semibold leading-7 text-[#756A60]">
                            Saranwak bantu kamu menemukan tempat yang pas dengan kebutuhan
                            hari ini. Bukan sekadar daftar tempat, tapi guide yang lebih
                            relevan.
                        </p>
                    </div>
                </div>

                {/* Mobile compact list */}
                <div className="grid gap-2 md:hidden">
                    {reasons.map((reason) => (
                        <div
                            key={reason.number}
                            className="flex items-start gap-3 rounded-[20px] border border-[#E7D8C8] bg-[#FFFDF8] p-3.5 shadow-sm"
                        >
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F8F1E8] text-xs font-black text-[#C8784A] ring-1 ring-[#E7D8C8]">
                                {reason.number}
                            </span>

                            <div className="min-w-0">
                                <h3 className="text-base font-black tracking-[-0.02em] text-[#201813]">
                                    {reason.title}
                                </h3>

                                <p className="mt-1 text-xs font-semibold leading-5 text-[#756A60]">
                                    {reason.mobileDesc}
                                </p>
                            </div>

                            <span className="ml-auto mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1F5A4A]" />
                        </div>
                    ))}
                </div>

                {/* Desktop cards */}
                <div className="hidden gap-3 sm:grid-cols-2 lg:grid-cols-4 md:grid">
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
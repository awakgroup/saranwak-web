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
        <section className="relative overflow-hidden rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8]/80 p-4 shadow-[0_18px_60px_rgba(47,35,25,0.06)] backdrop-blur sm:p-6 lg:p-8">
            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#F2C38B]/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#1F5A4A]/10 blur-3xl" />

            <div className="relative">
                <div className="grid gap-5 lg:grid-cols-[0.9fr_1.4fr] lg:items-end">
                    <div>
                        <div className="inline-flex rounded-full border border-[#E7D8C8] bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#C8784A] shadow-sm sm:text-xs">
                            Kenapa Saranwak?
                        </div>

                        <h2 className="mt-4 max-w-2xl text-[30px] font-black leading-[0.98] tracking-[-0.055em] text-[#201813] sm:text-5xl lg:text-[54px]">
                            Cari tempat nggak cuma modal feeling.
                        </h2>
                    </div>

                    <p className="max-w-xl text-sm font-semibold leading-7 text-[#756A60] sm:text-base lg:ml-auto">
                        Saranwak bantu kamu menemukan tempat yang pas dengan kebutuhan hari
                        ini. Bukan sekadar daftar tempat, tapi guide lokal yang lebih
                        relevan.
                    </p>
                </div>

                <div className="mt-6 grid gap-3 md:hidden">
                    {reasons.map((reason) => (
                        <ReasonMobileItem key={reason.number} reason={reason} />
                    ))}
                </div>

                <div className="mt-7 hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
                    {reasons.map((reason) => (
                        <ReasonCard key={reason.number} reason={reason} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ReasonMobileItem({
    reason,
}: {
    reason: (typeof reasons)[number];
}) {
    return (
        <div className="group flex items-start gap-3 rounded-[22px] border border-[#E7D8C8] bg-white/75 p-3.5 shadow-sm transition duration-300 active:scale-[0.99]">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F8F1E8] text-xs font-black text-[#C8784A] ring-1 ring-[#E7D8C8]">
                {reason.number}
            </span>

            <div className="min-w-0 flex-1">
                <h3 className="text-base font-black tracking-[-0.02em] text-[#201813]">
                    {reason.title}
                </h3>

                <p className="mt-1 text-xs font-semibold leading-5 text-[#756A60]">
                    {reason.mobileDesc}
                </p>
            </div>

            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1F5A4A]" />
        </div>
    );
}

function ReasonCard({ reason }: { reason: (typeof reasons)[number] }) {
    return (
        <div className="group relative overflow-hidden rounded-[26px] border border-[#E7D8C8] bg-white/75 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#1F5A4A]/35 hover:shadow-[0_18px_55px_rgba(32,24,19,0.09)]">
            <div className="absolute -right-4 -top-4 text-[78px] font-black leading-none tracking-[-0.08em] text-[#F4F1EA] transition duration-300 group-hover:text-[#F2C38B]/35">
                {reason.number}
            </div>

            <div className="relative mb-5 flex items-center justify-between">
                <span className="rounded-full bg-[#F8F1E8] px-3 py-1.5 text-xs font-black text-[#C8784A] ring-1 ring-[#E7D8C8]">
                    {reason.number}
                </span>

                <span className="h-2.5 w-2.5 rounded-full bg-[#1F5A4A] transition duration-300 group-hover:scale-125" />
            </div>

            <h3 className="relative text-xl font-black tracking-[-0.03em] text-[#201813]">
                {reason.title}
            </h3>

            <p className="relative mt-3 text-sm font-semibold leading-6 text-[#756A60]">
                {reason.description}
            </p>
        </div>
    );
}
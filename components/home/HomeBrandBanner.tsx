import Image from "next/image";

export function HomeBrandBanner() {
    return (
        <section className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] border border-[#E7D8C8] bg-[#1A1614] shadow-[0_24px_70px_rgba(32,24,19,0.18)]">
            {/* Background Landscape Photo */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=80"
                    alt="Scenic atmospheric landscape"
                    fill
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-cover object-center opacity-45 brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14100E] via-[#1A1614]/80 to-[#14100E]/70" />
            </div>

            <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-6 py-14 sm:flex-row sm:px-12 sm:py-20 md:px-16">
                {/* Left: Circular Stamp Badge */}
                <div className="flex shrink-0 items-center justify-center">
                    <div className="relative grid h-28 w-28 place-items-center rounded-full border border-dashed border-white/30 bg-white/5 backdrop-blur-sm sm:h-32 sm:w-32">
                        {/* Rotating SVG text border */}
                        <svg
                            viewBox="0 0 120 120"
                            className="absolute inset-0 h-full w-full animate-[spin_24s_linear_infinite]"
                        >
                            <defs>
                                <path
                                    id="stampCircle"
                                    d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                                />
                            </defs>
                            <text
                                fill="rgba(255,255,255,0.7)"
                                fontSize="9.5"
                                fontWeight="bold"
                                letterSpacing="2.8"
                            >
                                <textPath href="#stampCircle">
                                    EXPLORE • BELONG • SARANWAK •
                                </textPath>
                            </text>
                        </svg>

                        {/* Center Icon */}
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-xl text-[#F2C38B]">
                            ☕
                        </div>
                    </div>
                </div>

                {/* Center: Brand Name & Slogan */}
                <div className="text-center">
                    {/* Brand Emblem */}
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 text-[#F2C38B]"
                        >
                            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                        </svg>
                    </div>

                    <h3 className="font-serif text-3xl font-bold tracking-[0.22em] text-white sm:text-4xl">
                        SARANWAK
                    </h3>

                    <div className="mx-auto my-2.5 h-0.5 w-12 bg-[#C8784A]" />

                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/70 sm:text-sm">
                        Go Somewhere New
                    </p>
                </div>

                {/* Right: Handwritten Script Accent */}
                <div className="shrink-0 text-center sm:text-right">
                    <p className="font-serif italic text-3xl leading-snug text-[#F2C38B] sm:text-4xl sm:leading-tight">
                        Good Coffee,
                        <br />
                        <span className="font-serif italic text-white/90">Brighter Days.</span>
                    </p>
                    <p className="mt-1 font-mono text-[11px] font-bold tracking-widest text-white/45">
                        PADANG COFFEE GUIDE
                    </p>
                </div>
            </div>
        </section>
    );
}

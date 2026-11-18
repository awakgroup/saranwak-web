import { CheckCircle2, Wifi, Sparkles, Navigation } from "lucide-react";

const PILLARS = [
    {
        icon: CheckCircle2,
        title: "Kurasi Teruji",
        description: "Diverifikasi langsung ke kedai.",
        bgClass: "bg-[#FFEAE5] text-[#FF5C35]",
    },
    {
        icon: Wifi,
        title: "Wi-Fi & Colokan Pasti",
        description: "Kecepatan riil & stopkontak siap.",
        bgClass: "bg-[#E8F8F0] text-[#10B981]",
    },
    {
        icon: Sparkles,
        title: "Vibe & Suasana Jujur",
        description: "Dari WFC fokus hingga nongkrong.",
        bgClass: "bg-[#FEF3C7] text-[#D97706]",
    },
    {
        icon: Navigation,
        title: "Navigasi Akurat",
        description: "Tautan langsung Google Maps.",
        bgClass: "bg-[#F0EBE1] text-[#19120D]",
    },
];

export function HomeFeaturePillars() {
    return (
        <div className="w-full border-b border-[#EBE5DC]/80 py-6 sm:py-8">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 lg:gap-8">
                {PILLARS.map((pillar) => {
                    const Icon = pillar.icon;
                    return (
                        <div key={pillar.title} className="flex items-center gap-3 sm:gap-3.5">
                            <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11 ${pillar.bgClass}`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-sans text-xs font-bold leading-snug text-[#19120D] sm:text-sm">
                                    {pillar.title}
                                </span>
                                <span className="mt-0.5 line-clamp-1 text-[10px] text-[#756A63] sm:text-[11px]">
                                    {pillar.description}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

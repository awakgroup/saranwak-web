"use client";

import { useMemo } from "react";
import { getPlaceOpenStatus, type PlaceOpenStatus } from "@/lib/opening-hours";

type OpenStatusBadgeProps = {
    openingHours?: string | null;
    mode?: "compact" | "detail";
    className?: string;
};

export function OpenStatusBadge({
    openingHours,
    mode = "compact",
    className = "",
}: OpenStatusBadgeProps) {
    const status: PlaceOpenStatus = useMemo(() => {
        return getPlaceOpenStatus(openingHours);
    }, [openingHours]);

    if (!openingHours || !openingHours.trim()) {
        return null;
    }

    if (mode === "detail") {
        if (status.variant === "24hours") {
            return (
                <div
                    className={[
                        "inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-800",
                        className,
                    ].join(" ")}
                >
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                    </span>
                    <span>Buka 24 Jam Non-Stop</span>
                </div>
            );
        }

        if (status.isOpen) {
            return (
                <div
                    className={[
                        "inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-800",
                        className,
                    ].join(" ")}
                >
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span>Buka Sekarang</span>
                    <span className="text-emerald-700/60">•</span>
                    <span className="font-medium text-emerald-700">{status.detailLabel}</span>
                </div>
            );
        }

        return (
            <div
                className={[
                    "inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-3.5 py-1.5 text-xs font-bold text-neutral-600",
                    className,
                ].join(" ")}
            >
                <span className="h-2 w-2 rounded-full bg-neutral-400" />
                <span>Sedang Tutup</span>
                <span className="text-neutral-400">•</span>
                <span className="font-medium text-neutral-500">{status.detailLabel}</span>
            </div>
        );
    }

    // Mode Compact (Untuk Kartu Tempat)
    if (status.variant === "24hours") {
        return (
            <span
                className={[
                    "inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-950/85 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-amber-200 shadow-sm backdrop-blur-md",
                    className,
                ].join(" ")}
            >
                <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                </span>
                <span>24 Jam</span>
            </span>
        );
    }

    if (status.isOpen) {
        return (
            <span
                className={[
                    "inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-950/85 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-300 shadow-sm backdrop-blur-md",
                    className,
                ].join(" ")}
            >
                <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span>Buka</span>
            </span>
        );
    }

    return (
        <span
            className={[
                "inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/75 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-300 shadow-sm backdrop-blur-md",
                className,
            ].join(" ")}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
            <span>Tutup</span>
        </span>
    );
}

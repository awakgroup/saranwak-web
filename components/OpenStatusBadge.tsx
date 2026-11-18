"use client";

import { useEffect, useMemo, useState } from "react";
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
    const [tick, setTick] = useState(0);

    useEffect(() => {
        // Refresh status setiap 60 detik agar selalu akurat dengan jam berjalan
        const interval = setInterval(() => {
            setTick((prev) => prev + 1);
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const status: PlaceOpenStatus = useMemo(() => {
        return getPlaceOpenStatus(openingHours);
    }, [openingHours, tick]);

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

    // Mode Compact (Untuk Kartu Tempat ala Stitch dec9997f853d48fb839362e5da60ed89)
    if (status.variant === "24hours") {
        return (
            <span
                className={[
                    "inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md shadow-sm",
                    className,
                ].join(" ")}
            >
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                </span>
                <span>24 Jam Non-Stop</span>
            </span>
        );
    }

    if (status.isOpen) {
        const closeText = status.detailLabel.startsWith("Tutup pukul ")
            ? `Hingga ${status.detailLabel.replace("Tutup pukul ", "")}`
            : status.detailLabel;

        return (
            <span
                className={[
                    "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md shadow-sm",
                    className,
                ].join(" ")}
            >
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
                </span>
                <span>Buka • {closeText}</span>
            </span>
        );
    }

    const openNextText = status.detailLabel.startsWith("Buka pukul ")
        ? `Buka ${status.detailLabel.replace("Buka pukul ", "")}`
        : status.detailLabel.startsWith("Buka esok pukul ")
        ? `Esok ${status.detailLabel.replace("Buka esok pukul ", "")}`
        : "Tutup";

    return (
        <span
            className={[
                "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white/80 backdrop-blur-md shadow-sm",
                className,
            ].join(" ")}
        >
            <span className="h-2 w-2 rounded-full bg-[#80756F]" />
            <span>Tutup • {openNextText}</span>
        </span>
    );
}

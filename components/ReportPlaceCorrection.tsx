"use client";

import { MessageSquareWarning } from "lucide-react";

type ReportPlaceCorrectionProps = {
    placeName: string;
    placeSlug: string;
    className?: string;
};

const WHATSAPP_NUMBER = "6281932097214";

export function ReportPlaceCorrection({
    placeName,
    placeSlug,
    className = "",
}: ReportPlaceCorrectionProps) {
    const message = encodeURIComponent(
        `Halo Saranwak, saya menemukan ada informasi/jam buka yang berubah untuk kafe *${placeName}* (https://saranwak.com/places/${placeSlug}):\n\n- Bagian yang perlu diperbarui:\n- Info yang benar:`
    );

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    return (
        <div
            className={`flex items-center justify-between gap-3 rounded-2xl border border-[#E7E0D5] bg-[#FAF7F2] p-3 text-xs text-[#756A63] ${className}`}
        >
            <div className="flex items-center gap-2 min-w-0">
                <MessageSquareWarning className="h-4 w-4 shrink-0 text-[#FF5C35]" />
                <span className="truncate text-[11px] sm:text-xs">
                    Ada info atau jam buka yang berubah?
                </span>
            </div>
            <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded-full border border-[#D5CCC2] bg-white px-2.5 py-1 text-[11px] font-bold text-[#19120D] shadow-2xs transition hover:border-[#25D366] hover:bg-[#F0FDF4] hover:text-[#166534] active:scale-95"
            >
                Laporkan Update
            </a>
        </div>
    );
}

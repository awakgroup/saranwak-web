"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

type CopyAddressButtonProps = {
    address: string;
    className?: string;
    variant?: "compact" | "button";
};

export function CopyAddressButton({
    address,
    className = "",
    variant = "compact",
}: CopyAddressButtonProps) {
    const [copied, setCopied] = useState(false);

    if (!address) return null;

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback copy using textarea
            const textarea = document.createElement("textarea");
            textarea.value = address;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (variant === "button") {
        return (
            <button
                type="button"
                onClick={handleCopy}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#EBE5DC] bg-white px-3 py-2 text-xs font-bold text-[#19120D] shadow-2xs transition hover:border-[#FF5C35] hover:bg-[#FFECE5]/40 hover:text-[#D8431F] active:scale-95 cursor-pointer ${className}`}
                title="Salin alamat lengkap"
            >
                {copied ? (
                    <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Alamat Tersalin!</span>
                    </>
                ) : (
                    <>
                        <Copy className="h-3.5 w-3.5 text-[#80756F]" />
                        <span>Salin Alamat</span>
                    </>
                )}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold transition active:scale-95 cursor-pointer ${
                copied
                    ? "bg-emerald-50 text-emerald-700 font-bold"
                    : "text-[#80756F] hover:bg-[#F4EFEB] hover:text-[#19120D]"
            } ${className}`}
            title="Klik untuk salin alamat"
        >
            {copied ? (
                <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    <span>Tersalin!</span>
                </>
            ) : (
                <>
                    <Copy className="h-3 w-3" />
                    <span>Salin</span>
                </>
            )}
        </button>
    );
}

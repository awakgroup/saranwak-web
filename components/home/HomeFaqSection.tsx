"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { HOME_FAQS, type FaqItem } from "@/lib/faq-data";

export type { FaqItem };
export { HOME_FAQS };

export function HomeFaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    return (
        <section
            id="faq"
            aria-labelledby="faq-heading"
            className="relative overflow-hidden rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8]/80 p-5 shadow-[0_18px_60px_rgba(47,35,25,0.06)] backdrop-blur sm:p-8 lg:p-10"
        >
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#F2C38B]/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-[#1F5A4A]/10 blur-3xl" />

            <div className="relative">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E7D8C8] bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#C8784A] shadow-sm sm:text-xs">
                        <HelpCircle className="h-3.5 w-3.5 text-[#C8784A]" />
                        Pertanyaan Umum
                    </div>

                    <h2
                        id="faq-heading"
                        className="mt-4 font-serif text-[28px] font-bold leading-[1.08] tracking-[-0.03em] text-[#201813] sm:text-4xl lg:text-[42px]"
                    >
                        Tanya Jawab Seputar Saranwak
                    </h2>

                    <p className="mt-3 text-sm font-semibold leading-relaxed text-[#756A60] sm:text-base">
                        Semua yang perlu kamu tahu tentang platform panduan dan kurasi spot ngopi di Kota Padang.
                    </p>
                </div>

                <div className="mt-8 grid gap-3.5">
                    {HOME_FAQS.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={faq.question}
                                className={`rounded-[22px] border transition-all duration-200 ${
                                    isOpen
                                        ? "border-[#C8784A]/40 bg-[#FBF7F0] shadow-sm"
                                        : "border-[#E7D8C8] bg-white/75 hover:bg-white"
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleFaq(index)}
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center justify-between gap-4 p-4.5 text-left text-sm font-bold text-[#201813] sm:p-5 sm:text-base"
                                >
                                    <span className="flex-1 pr-2">{faq.question}</span>
                                    <span
                                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-transform duration-200 ${
                                            isOpen
                                                ? "rotate-180 bg-[#C8784A] text-white"
                                                : "bg-[#F4F1EA] text-[#756A60]"
                                        }`}
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="px-4.5 pb-5 pt-1 text-xs font-medium leading-relaxed text-[#5A4F46] sm:px-5 sm:text-sm sm:leading-6">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

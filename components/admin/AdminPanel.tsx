import type { ReactNode } from "react";

export function AdminPanel({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 sm:rounded-[28px] sm:p-5 md:p-7">
            <h2 className="mb-5 text-xl font-black sm:mb-6 sm:text-2xl">{title}</h2>
            <div className="space-y-5">{children}</div>
        </div>
    );
}
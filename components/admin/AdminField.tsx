import type { ReactNode } from "react";

export function AdminField({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-bold text-neutral-300">
                {label}
            </span>
            {children}
        </label>
    );
}
import type { AdminTab } from "@/types/admin";

type AdminTabsProps = {
    activeTab: AdminTab;
    onChange: (tab: AdminTab) => void;
};

const tabs: {
    value: AdminTab;
    label: string;
}[] = [
        {
            value: "places",
            label: "Kelola Tempat",
        },
        {
            value: "analytics",
            label: "Analytics",
        },
    ];

export function AdminTabs({ activeTab, onChange }: AdminTabsProps) {
    return (
        <div className="mb-6 flex w-full flex-col gap-2 rounded-[24px] border border-white/10 bg-white/[0.03] p-2 sm:w-fit sm:flex-row">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.value;

                return (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => onChange(tab.value)}
                        className={`rounded-2xl px-5 py-3 text-sm font-black transition ${isActive
                                ? "bg-white text-black"
                                : "text-neutral-400 hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
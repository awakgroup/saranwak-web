import type { AdminTab } from "@/types/admin";

type AdminTabsProps = {
    activeTab: AdminTab;
    onChange: (tab: AdminTab) => void;
};

export function AdminTabs({ activeTab, onChange }: AdminTabsProps) {
    return (
        <div className="mb-6 flex flex-wrap gap-2 rounded-[24px] border border-white/10 bg-white/[0.03] p-2">
            <button
                type="button"
                onClick={() => onChange("places")}
                className={[
                    "rounded-2xl px-4 py-3 text-sm font-black transition",
                    activeTab === "places"
                        ? "bg-white text-black"
                        : "text-neutral-400 hover:bg-white/[0.06] hover:text-white",
                ].join(" ")}
            >
                Places
            </button>

            {/* Analytics hidden dulu sampai endpoint /api/admin/analytics siap */}
            {/*
      <button
        type="button"
        onClick={() => onChange("analytics")}
        className={[
          "rounded-2xl px-4 py-3 text-sm font-black transition",
          activeTab === "analytics"
            ? "bg-white text-black"
            : "text-neutral-400 hover:bg-white/[0.06] hover:text-white",
        ].join(" ")}
      >
        Analytics
      </button>
      */}
        </div>
    );
}
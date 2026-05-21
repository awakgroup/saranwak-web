import type { AdminTab } from "@/types/admin";

type AdminHeaderProps = {
    activeTab: AdminTab;
    isEditMode: boolean;
    onLogout: () => void;
};

export function AdminHeader({
    activeTab,
    isEditMode,
    onLogout,
}: AdminHeaderProps) {
    const title =
        activeTab === "places"
            ? isEditMode
                ? "Update Data Tempat"
                : "Input Data Tempat"
            : "Analytics";

    const description =
        activeTab === "places"
            ? "Tambahkan, update, atau hapus coffee shop dan data tempat dari database Saranwak."
            : "Pantau performa website, tempat paling banyak dilihat, dan klik penting untuk kebutuhan marketing.";

    return (
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 sm:text-xs sm:tracking-[0.35em]">
                    Saranwak CMS
                </p>

                <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                    {title}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400 sm:mt-4 sm:text-base">
                    {description}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                <a
                    href="/"
                    className="inline-flex justify-center rounded-full border border-white/10 px-4 py-3 text-center text-xs font-bold transition hover:bg-white hover:text-black sm:px-5 sm:text-sm"
                >
                    Lihat Website
                </a>

                <button
                    type="button"
                    onClick={onLogout}
                    className="inline-flex justify-center rounded-full border border-red-400/20 px-4 py-3 text-center text-xs font-bold text-red-300 transition hover:bg-red-400/10 sm:px-5 sm:text-sm"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
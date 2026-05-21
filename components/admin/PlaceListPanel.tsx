import type { AdminPlace } from "@/types/admin";
import { getCategoryName } from "@/lib/admin-utils";

export type PlaceStatusFilter = "all" | "live" | "draft" | "featured";

export type PlaceSortOption =
    | "newest"
    | "name_asc"
    | "featured_first"
    | "draft_first";

type PlaceSummary = {
    total: number;
    live: number;
    draft: number;
    featured: number;
};

type PlaceListPanelProps = {
    places: AdminPlace[];
    filteredPlaces: AdminPlace[];
    selectedPlaceId: string;
    placeSummary: PlaceSummary;
    placeSearch: string;
    placeStatusFilter: PlaceStatusFilter;
    placeSort: PlaceSortOption;
    loadingDeleteId: string;
    onRefresh: () => void;
    onEdit: (place: AdminPlace) => void;
    onDelete: (place: AdminPlace) => void;
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (value: PlaceStatusFilter) => void;
    onSortChange: (value: PlaceSortOption) => void;
    onResetFilter: () => void;
};

export function PlaceListPanel({
    places,
    filteredPlaces,
    selectedPlaceId,
    placeSummary,
    placeSearch,
    placeStatusFilter,
    placeSort,
    loadingDeleteId,
    onRefresh,
    onEdit,
    onDelete,
    onSearchChange,
    onStatusFilterChange,
    onSortChange,
    onResetFilter,
}: PlaceListPanelProps) {
    const hasActiveFilter =
        placeSearch || placeStatusFilter !== "all" || placeSort !== "newest";

    return (
        <aside className="min-w-0 space-y-6">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 sm:rounded-[28px] sm:p-5 md:p-7 xl:sticky xl:top-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black">Data Tempat</h2>

                        <p className="mt-1 text-sm text-neutral-500">
                            {filteredPlaces.length} dari {places.length} tempat
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onRefresh}
                        className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold transition hover:bg-white hover:text-black"
                    >
                        Refresh
                    </button>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2">
                    <AdminMiniSummary label="Total" value={placeSummary.total} />
                    <AdminMiniSummary label="Live" value={placeSummary.live} />
                    <AdminMiniSummary label="Draft" value={placeSummary.draft} />
                    <AdminMiniSummary label="Featured" value={placeSummary.featured} />
                </div>

                <div className="mb-4 space-y-3 rounded-[22px] border border-white/10 bg-black/20 p-3">
                    <input
                        value={placeSearch}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Cari nama, area, kategori..."
                        className="input-cms"
                    />

                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                        <select
                            value={placeStatusFilter}
                            onChange={(event) =>
                                onStatusFilterChange(event.target.value as PlaceStatusFilter)
                            }
                            className="input-cms"
                        >
                            <option value="all" className="bg-neutral-900">
                                Semua status
                            </option>
                            <option value="live" className="bg-neutral-900">
                                Live
                            </option>
                            <option value="draft" className="bg-neutral-900">
                                Draft
                            </option>
                            <option value="featured" className="bg-neutral-900">
                                Featured
                            </option>
                        </select>

                        <select
                            value={placeSort}
                            onChange={(event) =>
                                onSortChange(event.target.value as PlaceSortOption)
                            }
                            className="input-cms"
                        >
                            <option value="newest" className="bg-neutral-900">
                                Terbaru
                            </option>
                            <option value="name_asc" className="bg-neutral-900">
                                Nama A-Z
                            </option>
                            <option value="featured_first" className="bg-neutral-900">
                                Featured dulu
                            </option>
                            <option value="draft_first" className="bg-neutral-900">
                                Draft dulu
                            </option>
                        </select>
                    </div>

                    {hasActiveFilter ? (
                        <button
                            type="button"
                            onClick={onResetFilter}
                            className="w-full rounded-2xl border border-white/10 px-4 py-3 text-xs font-black text-neutral-300 transition hover:bg-white hover:text-black"
                        >
                            Reset Filter
                        </button>
                    ) : null}
                </div>

                {places.length === 0 ? (
                    <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-neutral-400">
                        Belum ada data tempat.
                    </p>
                ) : filteredPlaces.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm font-bold text-neutral-400">
                        Tidak ada tempat yang cocok dengan filter ini.
                    </div>
                ) : (
                    <div className="space-y-3 overflow-y-auto pr-1 xl:max-h-[calc(100vh-360px)]">
                        {filteredPlaces.map((place) => (
                            <PlaceListItem
                                key={place.id}
                                place={place}
                                selected={selectedPlaceId === place.id}
                                deleting={loadingDeleteId === place.id}
                                onEdit={() => onEdit(place)}
                                onDelete={() => onDelete(place)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}

function PlaceListItem({
    place,
    selected,
    deleting,
    onEdit,
    onDelete,
}: {
    place: AdminPlace;
    selected: boolean;
    deleting: boolean;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div
            className={`rounded-2xl border p-4 transition ${selected
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/[0.03]"
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate font-black leading-tight">{place.name}</h3>

                    <p
                        className={`mt-1 line-clamp-2 text-xs ${selected ? "text-black/60" : "text-neutral-500"
                            }`}
                    >
                        {getCategoryName(place.categories)} · {place.area || "Tanpa area"}
                    </p>

                    <p
                        className={`mt-2 text-xs font-bold ${selected ? "text-black/60" : "text-neutral-500"
                            }`}
                    >
                        Harga: {place.price_range || "Belum ada"}
                    </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <div
                        className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${place.is_published
                                ? selected
                                    ? "bg-black text-white"
                                    : "bg-emerald-400/10 text-emerald-300"
                                : selected
                                    ? "bg-black/10 text-black"
                                    : "bg-neutral-700 text-neutral-300"
                            }`}
                    >
                        {place.is_published ? "Live" : "Draft"}
                    </div>

                    {place.is_featured ? (
                        <div
                            className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${selected
                                    ? "bg-amber-400 text-black"
                                    : "bg-amber-400/10 text-amber-300"
                                }`}
                        >
                            Featured
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={onEdit}
                    className={`rounded-xl px-3 py-2 text-xs font-black transition ${selected
                            ? "bg-black text-white"
                            : "bg-white text-black hover:bg-neutral-200"
                        }`}
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={onDelete}
                    disabled={deleting}
                    className="rounded-xl border border-red-400/20 px-3 py-2 text-xs font-black text-red-300 transition hover:bg-red-400/10 disabled:opacity-60"
                >
                    {deleting ? "..." : "Delete"}
                </button>
            </div>
        </div>
    );
}

function AdminMiniSummary({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">
                {label}
            </p>

            <p className="mt-1 text-xl font-black text-white">{value}</p>
        </div>
    );
}
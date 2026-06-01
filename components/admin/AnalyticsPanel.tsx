"use client";

import { useEffect, useMemo, useState } from "react";

type AnalyticsSummary = {
    total_events?: number;
    total_page_views?: number;
    total_place_views?: number;
    total_searches?: number;
    total_filter_uses?: number;
    total_google_maps_clicks?: number;
    total_instagram_clicks?: number;
    total_whatsapp_clicks?: number;
    total_website_service_clicks?: number;
};

type PopularPlace = {
    place_id?: string | null;
    place_name?: string | null;
    place_slug?: string | null;
    total_views?: number | null;
    total_clicks?: number | null;
    view_count?: number | null;
    click_count?: number | null;
};

type RecentEvent = {
    id?: string | null;
    event_type?: string | null;
    place_id?: string | null;
    place_name?: string | null;
    place_slug?: string | null;
    page_path?: string | null;
    created_at?: string | null;
};

type AnalyticsResponse = {
    success?: boolean;
    message?: string;

    summary?: AnalyticsSummary;
    popular_places?: PopularPlace[];
    popularPlaces?: PopularPlace[];
    recent_events?: RecentEvent[];
    recentEvents?: RecentEvent[];

    total_events?: number;
    total_page_views?: number;
    total_place_views?: number;
    total_searches?: number;
    total_filter_uses?: number;
    total_google_maps_clicks?: number;
    total_instagram_clicks?: number;
    total_whatsapp_clicks?: number;
    total_website_service_clicks?: number;
};

type AnalyticsState = {
    summary: AnalyticsSummary;
    popularPlaces: PopularPlace[];
    recentEvents: RecentEvent[];
};

const emptyAnalytics: AnalyticsState = {
    summary: {
        total_events: 0,
        total_page_views: 0,
        total_place_views: 0,
        total_searches: 0,
        total_filter_uses: 0,
        total_google_maps_clicks: 0,
        total_instagram_clicks: 0,
        total_whatsapp_clicks: 0,
        total_website_service_clicks: 0,
    },
    popularPlaces: [],
    recentEvents: [],
};

export function AnalyticsPanel() {
    const [analytics, setAnalytics] = useState<AnalyticsState>(emptyAnalytics);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const summaryCards = useMemo(() => {
        const summary = analytics.summary;

        return [
            {
                label: "Total Events",
                value: summary.total_events ?? 0,
                description: "Semua event tracking",
            },
            {
                label: "Page Views",
                value: summary.total_page_views ?? 0,
                description: "Kunjungan halaman",
            },
            {
                label: "Place Views",
                value: summary.total_place_views ?? 0,
                description: "Detail tempat dibuka",
            },
            {
                label: "Search",
                value: summary.total_searches ?? 0,
                description: "Pencarian dilakukan",
            },
            {
                label: "Filter",
                value: summary.total_filter_uses ?? 0,
                description: "Filter dipakai user",
            },
            {
                label: "Maps Click",
                value: summary.total_google_maps_clicks ?? 0,
                description: "Klik Google Maps",
            },
            {
                label: "Instagram Click",
                value: summary.total_instagram_clicks ?? 0,
                description: "Klik Instagram",
            },
            {
                label: "WhatsApp Click",
                value: summary.total_whatsapp_clicks ?? 0,
                description: "Klik WhatsApp",
            },
        ];
    }, [analytics.summary]);

    async function loadAnalytics() {
        try {
            setLoading(true);
            setErrorMessage("");

            const response = await fetch("/api/admin/analytics", {
                cache: "no-store",
            });

            const result = await parseAnalyticsResponse(response);

            if (!response.ok) {
                throw new Error(result.message || "Gagal mengambil analytics.");
            }

            setAnalytics(normalizeAnalyticsResponse(result));
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Gagal mengambil analytics."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleExportCsv() {
        try {
            setExporting(true);
            setErrorMessage("");

            const response = await fetch("/api/admin/analytics/export", {
                cache: "no-store",
            });

            if (!response.ok) {
                const result = await parseAnalyticsResponse(response);
                throw new Error(result.message || "Gagal export analytics.");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `saranwak-analytics-${new Date()
                .toISOString()
                .slice(0, 10)}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Gagal export analytics."
            );
        } finally {
            setExporting(false);
        }
    }

    useEffect(() => {
        loadAnalytics();
    }, []);

    return (
        <section className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.28em] text-neutral-500">
                            Analytics
                        </p>

                        <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                            Saranwak Performance
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
                            Pantau aktivitas user, tempat populer, dan klik penting dari
                            website Saranwak.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={loadAnalytics}
                            disabled={loading}
                            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-black text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Refresh"}
                        </button>

                        <button
                            type="button"
                            onClick={handleExportCsv}
                            disabled={exporting}
                            className="rounded-2xl bg-white px-4 py-3 text-xs font-black text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {exporting ? "Exporting..." : "Export CSV"}
                        </button>
                    </div>
                </div>

                {errorMessage ? (
                    <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm font-bold text-red-300">
                        {errorMessage}
                    </div>
                ) : null}
            </div>

            {loading ? (
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-sm text-neutral-300">
                    Loading analytics...
                </div>
            ) : (
                <>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {summaryCards.map((card) => (
                            <article
                                key={card.label}
                                className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5"
                            >
                                <p className="text-xs font-black uppercase tracking-[0.22em] text-neutral-500">
                                    {card.label}
                                </p>

                                <p className="mt-3 text-3xl font-black tracking-tight">
                                    {formatNumber(card.value)}
                                </p>

                                <p className="mt-2 text-xs font-semibold text-neutral-500">
                                    {card.description}
                                </p>
                            </article>
                        ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.24em] text-neutral-500">
                                        Popular Places
                                    </p>
                                    <h3 className="mt-2 text-xl font-black">Tempat Populer</h3>
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                {analytics.popularPlaces.length > 0 ? (
                                    analytics.popularPlaces.map((place, index) => {
                                        const views = place.total_views ?? place.view_count ?? 0;
                                        const clicks = place.total_clicks ?? place.click_count ?? 0;

                                        return (
                                            <article
                                                key={`${place.place_id ?? place.place_slug ?? index}`}
                                                className="rounded-2xl border border-white/10 bg-black/20 p-4"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-black text-white">
                                                            {index + 1}. {place.place_name || "Tanpa nama"}
                                                        </p>

                                                        <p className="mt-1 truncate text-xs text-neutral-500">
                                                            {place.place_slug || place.place_id || "-"}
                                                        </p>
                                                    </div>

                                                    <div className="shrink-0 text-right">
                                                        <p className="text-sm font-black text-white">
                                                            {formatNumber(views)}
                                                        </p>
                                                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                                                            Views
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-3 rounded-xl bg-white/[0.04] px-3 py-2 text-xs font-bold text-neutral-400">
                                                    {formatNumber(clicks)} total clicks
                                                </div>
                                            </article>
                                        );
                                    })
                                ) : (
                                    <EmptyState message="Belum ada data tempat populer." />
                                )}
                            </div>
                        </section>

                        <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.24em] text-neutral-500">
                                    Recent Events
                                </p>
                                <h3 className="mt-2 text-xl font-black">Aktivitas Terbaru</h3>
                            </div>

                            <div className="mt-5 space-y-3">
                                {analytics.recentEvents.length > 0 ? (
                                    analytics.recentEvents.map((event, index) => (
                                        <article
                                            key={`${event.id ?? index}`}
                                            className="rounded-2xl border border-white/10 bg-black/20 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-black text-white">
                                                        {formatEventType(event.event_type)}
                                                    </p>

                                                    <p className="mt-1 truncate text-xs text-neutral-500">
                                                        {event.place_name ||
                                                            event.page_path ||
                                                            event.place_slug ||
                                                            "-"}
                                                    </p>
                                                </div>

                                                <p className="shrink-0 text-xs font-bold text-neutral-500">
                                                    {formatDate(event.created_at)}
                                                </p>
                                            </div>
                                        </article>
                                    ))
                                ) : (
                                    <EmptyState message="Belum ada aktivitas terbaru." />
                                )}
                            </div>
                        </section>
                    </div>
                </>
            )}
        </section>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm font-semibold text-neutral-500">
            {message}
        </div>
    );
}

async function parseAnalyticsResponse(
    response: Response
): Promise<AnalyticsResponse> {
    try {
        return (await response.json()) as AnalyticsResponse;
    } catch {
        return {
            success: false,
            message: "Response analytics tidak valid.",
        };
    }
}

function normalizeAnalyticsResponse(result: AnalyticsResponse): AnalyticsState {
    const summary = result.summary ?? {
        total_events: result.total_events ?? 0,
        total_page_views: result.total_page_views ?? 0,
        total_place_views: result.total_place_views ?? 0,
        total_searches: result.total_searches ?? 0,
        total_filter_uses: result.total_filter_uses ?? 0,
        total_google_maps_clicks: result.total_google_maps_clicks ?? 0,
        total_instagram_clicks: result.total_instagram_clicks ?? 0,
        total_whatsapp_clicks: result.total_whatsapp_clicks ?? 0,
        total_website_service_clicks: result.total_website_service_clicks ?? 0,
    };

    return {
        summary,
        popularPlaces: result.popular_places ?? result.popularPlaces ?? [],
        recentEvents: result.recent_events ?? result.recentEvents ?? [],
    };
}

function formatNumber(value: number) {
    return new Intl.NumberFormat("id-ID").format(value);
}

function formatEventType(value?: string | null) {
    if (!value) return "Unknown Event";

    return value
        .split("_")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function formatDate(value?: string | null) {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}
"use client";

import { useEffect, useMemo, useState } from "react";
import type {
    AnalyticsResponse,
    CityStat,
    PeriodType,
    SimpleStat,
    TopPlaceAnalytics,
} from "@/types/admin";
import {
    buildAnalyticsParams,
    formatEventName,
    formatEventTime,
    formatNumber,
    formatPercent,
    getBestActionRatePlace,
    getPerformanceBadge,
    getRate,
    getTodayInputValue,
    getTopByMetric,
    monthOptions,
} from "@/lib/admin-utils";

export function AnalyticsPanel() {
    const today = getTodayInputValue();
    const currentDate = new Date();

    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);
    const [analyticsError, setAnalyticsError] = useState("");

    const [periodType, setPeriodType] = useState<PeriodType>("monthly");
    const [selectedMonth, setSelectedMonth] = useState(
        String(currentDate.getMonth() + 1)
    );
    const [selectedYear, setSelectedYear] = useState(
        String(currentDate.getFullYear())
    );
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedWeekStart, setSelectedWeekStart] = useState(today);
    const [customStart, setCustomStart] = useState(today);
    const [customEnd, setCustomEnd] = useState(today);

    const analyticsQuery = useMemo(() => {
        return buildAnalyticsParams({
            periodType,
            selectedMonth,
            selectedYear,
            selectedDate,
            selectedWeekStart,
            customStart,
            customEnd,
        }).toString();
    }, [
        periodType,
        selectedMonth,
        selectedYear,
        selectedDate,
        selectedWeekStart,
        customStart,
        customEnd,
    ]);

    async function loadAnalytics() {
        try {
            setLoadingAnalytics(true);
            setAnalyticsError("");

            const response = await fetch(`/api/admin/analytics?${analyticsQuery}`, {
                cache: "no-store",
            });

            const contentType = response.headers.get("content-type") || "";

            if (!contentType.includes("application/json")) {
                const text = await response.text();

                console.error("Analytics API returned non-JSON:", text.slice(0, 300));

                throw new Error(
                    "API analytics tidak mengembalikan JSON. Cek route /api/admin/analytics atau middleware."
                );
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Gagal mengambil analytics.");
            }

            setAnalytics(result);
        } catch (error) {
            setAnalyticsError(
                error instanceof Error ? error.message : "Gagal mengambil analytics."
            );
        } finally {
            setLoadingAnalytics(false);
        }
    }

    function handleExportCsv() {
        window.open(`/api/admin/analytics/export?${analyticsQuery}`, "_blank");
    }

    useEffect(() => {
        loadAnalytics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [analyticsQuery]);

    const detailViews = analytics?.summary.detail_views ?? 0;
    const mapsClicks = analytics?.summary.maps_clicks ?? 0;
    const instagramClicks = analytics?.summary.instagram_clicks ?? 0;
    const whatsappClicks = analytics?.summary.whatsapp_clicks ?? 0;
    const cardClicks = analytics?.summary.card_clicks ?? 0;

    const actionClicks =
        analytics?.summary.action_clicks ??
        mapsClicks + instagramClicks + whatsappClicks;

    const actionRate =
        analytics?.summary.action_click_rate ?? getRate(actionClicks, detailViews);

    const cardToDetailRate =
        analytics?.summary.card_to_detail_rate ?? getRate(detailViews, cardClicks);

    const topPlaces = analytics?.top_places ?? [];
    const topPlace = getTopByMetric(topPlaces, "total_events");
    const bestActionRatePlace = getBestActionRatePlace(topPlaces);
    const topMapsPlace = getTopByMetric(topPlaces, "maps_clicks");
    const topInstagramPlace = getTopByMetric(topPlaces, "instagram_clicks");

    const dominantDevice = analytics?.device_stats?.[0];
    const topCity = analytics?.city_stats?.[0];

    const mobileShare =
        analytics?.device_stats?.find(
            (item) => item.label.toLowerCase() === "mobile"
        )?.percentage ?? 0;

    const summaryCards = [
        {
            label: "Total Reach",
            value: analytics?.summary.total_events ?? 0,
            description: "Total interaksi user yang terekam selama periode aktif.",
            helper: "Semua aktivitas website",
        },
        {
            label: "Listing Views",
            value: detailViews,
            description: "Jumlah halaman detail tempat yang dibuka user.",
            helper: "Minat awal user",
        },
        {
            label: "Intent Clicks",
            value: actionClicks,
            description: "Klik Maps, Instagram, atau WhatsApp. Ini sinyal user serius.",
            helper: "Sinyal mau datang",
        },
        {
            label: "Action Rate",
            value: actionRate,
            description: "Persentase user yang lanjut klik action setelah melihat detail.",
            helper: "Kualitas listing",
            isPercent: true,
        },
    ];

    const funnelCards = [
        {
            label: "Card → Detail",
            value: cardToDetailRate,
            description:
                "Seberapa banyak klik card berubah menjadi kunjungan halaman detail.",
        },
        {
            label: "Detail → Action",
            value: actionRate,
            description:
                "Seberapa banyak detail view berubah menjadi klik Maps/Instagram/WhatsApp.",
        },
        {
            label: "Maps Rate",
            value:
                analytics?.summary.maps_click_rate ?? getRate(mapsClicks, detailViews),
            description: "Persentase detail view yang lanjut ke Google Maps.",
        },
        {
            label: "Instagram Rate",
            value:
                analytics?.summary.instagram_click_rate ??
                getRate(instagramClicks, detailViews),
            description: "Persentase detail view yang lanjut ke Instagram.",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">
                <div className="relative p-5 md:p-8">
                    <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">
                                Saranwak Analytics
                            </p>

                            <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-tight md:text-5xl">
                                Dashboard performa listing yang bisa jadi bahan jualan.
                            </h2>

                            <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-neutral-400">
                                Pantau reach, intent click, action rate, audience, dan performa
                                tiap coffee shop. Data ini bisa kamu pakai untuk evaluasi
                                internal sekaligus bahan report ke merchant.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={loadAnalytics}
                                disabled={loadingAnalytics}
                                className="w-fit rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loadingAnalytics ? "Loading..." : "Refresh Data"}
                            </button>

                            <button
                                type="button"
                                onClick={handleExportCsv}
                                className="w-fit rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-black"
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>

                    <div className="relative mt-7 rounded-[24px] border border-white/10 bg-black/20 p-4">
                        <div className="grid gap-4 lg:grid-cols-[1fr_2fr] lg:items-start">
                            <div>
                                <p className="text-sm font-black text-white">Periode Laporan</p>
                                <p className="mt-1 text-xs font-bold leading-5 text-neutral-500">
                                    Pilih periode untuk membaca performa listing dan export data.
                                </p>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                <div>
                                    <p className="mb-2 text-xs font-bold text-neutral-400">
                                        Tipe Periode
                                    </p>

                                    <select
                                        value={periodType}
                                        onChange={(event) =>
                                            setPeriodType(event.target.value as PeriodType)
                                        }
                                        className="input-cms"
                                    >
                                        <option value="daily" className="bg-neutral-900">
                                            Harian
                                        </option>
                                        <option value="weekly" className="bg-neutral-900">
                                            Mingguan
                                        </option>
                                        <option value="monthly" className="bg-neutral-900">
                                            Bulanan
                                        </option>
                                        <option value="yearly" className="bg-neutral-900">
                                            Tahunan
                                        </option>
                                        <option value="custom" className="bg-neutral-900">
                                            Custom
                                        </option>
                                    </select>
                                </div>

                                {periodType === "daily" ? (
                                    <div>
                                        <p className="mb-2 text-xs font-bold text-neutral-400">
                                            Tanggal
                                        </p>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(event) => setSelectedDate(event.target.value)}
                                            className="input-cms"
                                        />
                                    </div>
                                ) : null}

                                {periodType === "weekly" ? (
                                    <div>
                                        <p className="mb-2 text-xs font-bold text-neutral-400">
                                            Mulai Minggu
                                        </p>
                                        <input
                                            type="date"
                                            value={selectedWeekStart}
                                            onChange={(event) =>
                                                setSelectedWeekStart(event.target.value)
                                            }
                                            className="input-cms"
                                        />
                                    </div>
                                ) : null}

                                {periodType === "monthly" ? (
                                    <>
                                        <div>
                                            <p className="mb-2 text-xs font-bold text-neutral-400">
                                                Bulan
                                            </p>
                                            <select
                                                value={selectedMonth}
                                                onChange={(event) => setSelectedMonth(event.target.value)}
                                                className="input-cms"
                                            >
                                                {monthOptions.map((month) => (
                                                    <option
                                                        key={month.value}
                                                        value={month.value}
                                                        className="bg-neutral-900"
                                                    >
                                                        {month.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs font-bold text-neutral-400">
                                                Tahun
                                            </p>
                                            <input
                                                type="number"
                                                value={selectedYear}
                                                onChange={(event) => setSelectedYear(event.target.value)}
                                                min="2025"
                                                max="2100"
                                                className="input-cms"
                                            />
                                        </div>
                                    </>
                                ) : null}

                                {periodType === "yearly" ? (
                                    <div>
                                        <p className="mb-2 text-xs font-bold text-neutral-400">
                                            Tahun
                                        </p>
                                        <input
                                            type="number"
                                            value={selectedYear}
                                            onChange={(event) => setSelectedYear(event.target.value)}
                                            min="2025"
                                            max="2100"
                                            className="input-cms"
                                        />
                                    </div>
                                ) : null}

                                {periodType === "custom" ? (
                                    <>
                                        <div>
                                            <p className="mb-2 text-xs font-bold text-neutral-400">
                                                Start Date
                                            </p>
                                            <input
                                                type="date"
                                                value={customStart}
                                                onChange={(event) => setCustomStart(event.target.value)}
                                                className="input-cms"
                                            />
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs font-bold text-neutral-400">
                                                End Date
                                            </p>
                                            <input
                                                type="date"
                                                value={customEnd}
                                                onChange={(event) => setCustomEnd(event.target.value)}
                                                className="input-cms"
                                            />
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-4 rounded-2xl bg-white/[0.04] p-4">
                            <p className="text-xs font-bold text-neutral-400">
                                Periode aktif:{" "}
                                <span className="text-white">
                                    {analytics?.period.label || "Belum dimuat"}
                                </span>
                            </p>
                        </div>
                    </div>

                    {analyticsError ? (
                        <div className="relative mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm font-bold text-red-300">
                            {analyticsError}
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((item) => (
                    <ValueMetricCard
                        key={item.label}
                        label={item.label}
                        value={
                            loadingAnalytics
                                ? "..."
                                : item.isPercent
                                    ? formatPercent(item.value)
                                    : formatNumber(item.value)
                        }
                        helper={item.helper}
                        description={item.description}
                    />
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5 md:p-7">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">
                                Merchant Value Snapshot
                            </p>

                            <h3 className="mt-3 text-2xl font-black md:text-3xl">
                                Angka yang bisa dijadikan bahan report ke coffee shop
                            </h3>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                                Section ini menerjemahkan analytics menjadi insight bisnis yang
                                lebih mudah dipahami oleh pemilik tempat.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <MerchantSnapshotCard
                            label="Top Listing"
                            value={topPlace?.place_name || "Belum ada data"}
                            description={
                                topPlace
                                    ? `${formatNumber(topPlace.total_events)} total events pada periode ini.`
                                    : "Listing terbaik akan muncul setelah data masuk."
                            }
                        />

                        <MerchantSnapshotCard
                            label="Best Action Rate"
                            value={bestActionRatePlace?.place_name || "Belum ada data"}
                            description={
                                bestActionRatePlace
                                    ? `${formatPercent(
                                        bestActionRatePlace.action_click_rate ?? 0
                                    )} user lanjut klik action setelah melihat detail.`
                                    : "Tempat dengan action rate terbaik akan muncul di sini."
                            }
                        />

                        <MerchantSnapshotCard
                            label="Most Maps Click"
                            value={topMapsPlace?.place_name || "Belum ada data"}
                            description={
                                topMapsPlace
                                    ? `${formatNumber(
                                        topMapsPlace.maps_clicks
                                    )} klik Google Maps. Ini sinyal minat datang paling kuat.`
                                    : "Tempat dengan klik Maps tertinggi akan muncul di sini."
                            }
                        />

                        <MerchantSnapshotCard
                            label="Most Instagram Click"
                            value={topInstagramPlace?.place_name || "Belum ada data"}
                            description={
                                topInstagramPlace
                                    ? `${formatNumber(
                                        topInstagramPlace.instagram_clicks
                                    )} klik Instagram dari user Saranwak.`
                                    : "Tempat dengan klik Instagram tertinggi akan muncul di sini."
                            }
                        />
                    </div>
                </div>

                <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5 md:p-7">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">
                        Sales Pitch Helper
                    </p>

                    <h3 className="mt-3 text-2xl font-black md:text-3xl">
                        Narasi singkat untuk merchant
                    </h3>

                    <div className="mt-5 rounded-[24px] border border-white/10 bg-black/20 p-5">
                        <p className="text-sm font-semibold leading-7 text-neutral-300">
                            Pada periode{" "}
                            <span className="font-black text-white">
                                {analytics?.period.label || "-"}
                            </span>
                            , Saranwak mencatat{" "}
                            <span className="font-black text-white">
                                {formatNumber(analytics?.summary.total_events ?? 0)}
                            </span>{" "}
                            interaksi,{" "}
                            <span className="font-black text-white">
                                {formatNumber(detailViews)}
                            </span>{" "}
                            kunjungan detail tempat, dan{" "}
                            <span className="font-black text-white">
                                {formatNumber(actionClicks)}
                            </span>{" "}
                            intent clicks ke Maps/Instagram/WhatsApp. Mayoritas user saat ini
                            membuka dari{" "}
                            <span className="font-black text-white">
                                {dominantDevice?.label || "device belum terbaca"}
                            </span>
                            {topCity ? (
                                <>
                                    {" "}
                                    dengan kota teratas{" "}
                                    <span className="font-black text-white">
                                        {topCity.city}
                                        {topCity.country !== "-" ? `, ${topCity.country}` : ""}
                                    </span>
                                    .
                                </>
                            ) : (
                                "."
                            )}
                        </p>
                    </div>

                    <p className="mt-4 text-xs font-bold leading-6 text-neutral-500">
                        Ini bisa kamu screenshot saat menawarkan featured listing, banner
                        promo, atau monthly merchant report. Data jualan, bukan sekadar angka
                        hiasan.
                    </p>
                </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5 md:p-7">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">
                            Audience Insight
                        </p>

                        <h3 className="mt-3 text-2xl font-black md:text-3xl">
                            Siapa yang membuka Saranwak?
                        </h3>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                            Data berbasis analytics anonim. Lokasi memakai estimasi IP, bukan
                            GPS, jadi tetap clean dan tidak mengganggu user.
                        </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                            <p className="text-xs font-bold text-neutral-500">
                                Dominan Device
                            </p>

                            <p className="mt-1 text-2xl font-black text-white">
                                {loadingAnalytics ? "..." : dominantDevice?.label || "Unknown"}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                            <p className="text-xs font-bold text-neutral-500">Mobile Share</p>

                            <p className="mt-1 text-2xl font-black text-white">
                                {loadingAnalytics ? "..." : formatPercent(mobileShare)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                    <AnalyticsStatList
                        title="Device"
                        description="Mobile, desktop, atau tablet."
                        items={analytics?.device_stats ?? []}
                        loading={loadingAnalytics}
                    />

                    <AnalyticsCityList
                        title="Top Cities"
                        description="Estimasi kota berdasarkan IP."
                        items={analytics?.city_stats ?? []}
                        loading={loadingAnalytics}
                    />

                    <AnalyticsStatList
                        title="Browser"
                        description="Browser yang paling sering dipakai."
                        items={analytics?.browser_stats ?? []}
                        loading={loadingAnalytics}
                    />

                    <AnalyticsStatList
                        title="OS"
                        description="Sistem operasi user."
                        items={analytics?.os_stats ?? []}
                        loading={loadingAnalytics}
                    />
                </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5 md:p-7">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">
                            Conversion Funnel
                        </p>

                        <h3 className="mt-3 text-2xl font-black md:text-3xl">
                            Dari lihat listing sampai punya niat datang
                        </h3>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                            Funnel ini membantu membaca apakah user cuma lihat-lihat atau
                            benar-benar lanjut ke action seperti Maps dan Instagram.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                        <p className="text-xs font-bold text-neutral-500">Intent Clicks</p>

                        <p className="mt-1 text-2xl font-black text-white">
                            {loadingAnalytics ? "..." : formatNumber(actionClicks)}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {funnelCards.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-[22px] border border-white/10 bg-white/[0.035] p-5"
                        >
                            <p className="text-sm font-bold text-neutral-500">{item.label}</p>

                            <p className="mt-3 text-4xl font-black text-white">
                                {loadingAnalytics ? "..." : formatPercent(item.value)}
                            </p>

                            <p className="mt-3 text-xs leading-5 text-neutral-500">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                    <FunnelStep
                        label="Card Click"
                        value={cardClicks}
                        description="User tertarik dari card/listing awal."
                    />
                    <FunnelStep
                        label="Detail View"
                        value={detailViews}
                        description="User masuk untuk membaca detail tempat."
                    />
                    <FunnelStep
                        label="Intent Click"
                        value={actionClicks}
                        description="User klik Maps, Instagram, atau WhatsApp."
                    />
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_440px]">
                <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5 md:p-7">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">
                                Listing Performance
                            </p>

                            <h3 className="mt-3 text-2xl font-black md:text-3xl">
                                Ranking performa tiap coffee shop
                            </h3>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                                Cocok dipakai untuk membaca listing mana yang paling menarik dan
                                listing mana yang perlu ditingkatkan.
                            </p>
                        </div>
                    </div>

                    {loadingAnalytics ? (
                        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm font-bold text-neutral-500">
                            Mengambil data listing performance...
                        </div>
                    ) : topPlaces.length ? (
                        <div className="mt-5 space-y-3">
                            {topPlaces.map((place, index) => (
                                <ListingPerformanceCard
                                    key={`${place.place_id}-${index}`}
                                    place={place}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyAnalyticsState message="Belum ada data listing pada periode ini." />
                    )}
                </div>

                <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5 md:p-7">
                    <h3 className="text-2xl font-black">Aktivitas Terbaru</h3>

                    <p className="mt-1 text-sm text-neutral-500">
                        Event tracking terbaru berdasarkan periode aktif.
                    </p>

                    {loadingAnalytics ? (
                        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm font-bold text-neutral-500">
                            Mengambil event terbaru...
                        </div>
                    ) : analytics?.recent_events.length ? (
                        <div className="mt-5 space-y-3">
                            {analytics.recent_events.map((event) => (
                                <div
                                    key={event.id}
                                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-black text-white">
                                                {formatEventName(event.event_name)}
                                            </p>

                                            <p className="mt-1 truncate text-xs text-neutral-500">
                                                {event.place_name || "Tanpa tempat spesifik"}
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-full bg-white/[0.08] px-3 py-1 text-[11px] font-black text-neutral-300">
                                            {event.source || "-"}
                                        </span>
                                    </div>

                                    <p className="mt-3 truncate text-xs font-bold text-neutral-500">
                                        {event.page_path || "-"}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-bold text-neutral-400">
                                            {event.device_type || "unknown"}
                                        </span>

                                        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-bold text-neutral-400">
                                            {event.browser || "unknown"}
                                        </span>

                                        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-bold text-neutral-400">
                                            {event.os || "unknown"}
                                        </span>

                                        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-bold text-neutral-400">
                                            {event.city || "unknown"}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-xs font-bold text-neutral-600">
                                        {formatEventTime(event.created_at)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyAnalyticsState message="Belum ada event tracking pada periode ini." />
                    )}
                </div>
            </div>
        </div>
    );
}

function ValueMetricCard({
    label,
    value,
    helper,
    description,
}: {
    label: string;
    value: string;
    helper: string;
    description: string;
}) {
    return (
        <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-bold text-neutral-500">{label}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-neutral-600">
                        {helper}
                    </p>
                </div>

                <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-black text-neutral-300">
                    Live
                </span>
            </div>

            <p className="mt-4 text-4xl font-black text-white md:text-5xl">{value}</p>

            <p className="mt-4 text-xs font-bold leading-5 text-neutral-500">
                {description}
            </p>
        </div>
    );
}

function MerchantSnapshotCard({
    label,
    value,
    description,
}: {
    label: string;
    value: string;
    description: string;
}) {
    return (
        <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-neutral-500">
                {label}
            </p>

            <h4 className="mt-3 line-clamp-2 text-xl font-black leading-tight text-white">
                {value}
            </h4>

            <p className="mt-3 text-sm font-semibold leading-6 text-neutral-500">
                {description}
            </p>
        </div>
    );
}

function FunnelStep({
    label,
    value,
    description,
}: {
    label: string;
    value: number;
    description: string;
}) {
    return (
        <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-5">
            <p className="text-sm font-black text-white">{label}</p>

            <p className="mt-3 text-3xl font-black text-white">
                {formatNumber(value)}
            </p>

            <p className="mt-3 text-xs font-bold leading-5 text-neutral-500">
                {description}
            </p>
        </div>
    );
}

function ListingPerformanceCard({
    place,
    index,
}: {
    place: TopPlaceAnalytics;
    index: number;
}) {
    const badge = getPerformanceBadge(place);

    return (
        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-black">
                            #{index + 1}
                        </span>

                        <span
                            className={`rounded-full border px-3 py-1 text-xs font-black ${badge.className}`}
                        >
                            {badge.label}
                        </span>
                    </div>

                    <h4 className="mt-3 truncate text-xl font-black text-white">
                        {place.place_name || "-"}
                    </h4>

                    <p className="mt-1 truncate text-xs font-bold text-neutral-500">
                        /places/{place.place_slug}
                    </p>
                </div>

                <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left md:text-right">
                    <p className="text-xs font-bold text-neutral-500">Action Rate</p>

                    <p className="mt-1 text-2xl font-black text-white">
                        {formatPercent(place.action_click_rate ?? 0)}
                    </p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-neutral-400 sm:grid-cols-3 xl:grid-cols-6">
                <AnalyticsMiniStat label="Views" value={place.detail_views} />
                <AnalyticsMiniStat label="Actions" value={place.action_clicks ?? 0} />
                <AnalyticsMiniStat label="Maps" value={place.maps_clicks} />
                <AnalyticsMiniStat label="IG" value={place.instagram_clicks} />
                <AnalyticsMiniStat label="WA" value={place.whatsapp_clicks} />
                <AnalyticsMiniStat label="Cards" value={place.card_clicks} />
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <AnalyticsRatePill
                    label="Action Rate"
                    value={place.action_click_rate ?? 0}
                />
                <AnalyticsRatePill
                    label="Maps Rate"
                    value={place.maps_click_rate ?? 0}
                />
                <AnalyticsRatePill
                    label="IG Rate"
                    value={place.instagram_click_rate ?? 0}
                />
            </div>
        </div>
    );
}

function AnalyticsMiniStat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-xl bg-white/[0.04] p-3">
            {label}
            <p className="mt-1 text-lg font-black text-white">
                {formatNumber(value)}
            </p>
        </div>
    );
}

function AnalyticsStatList({
    title,
    description,
    items,
    loading,
}: {
    title: string;
    description: string;
    items: SimpleStat[];
    loading: boolean;
}) {
    return (
        <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-5">
            <div className="mb-4">
                <h4 className="text-lg font-black text-white">{title}</h4>
                <p className="mt-1 text-xs font-bold leading-5 text-neutral-500">
                    {description}
                </p>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold text-neutral-500">
                    Loading...
                </div>
            ) : items.length > 0 ? (
                <div className="space-y-3">
                    {items.slice(0, 5).map((item) => (
                        <div key={item.label} className="rounded-2xl bg-white/[0.04] p-3">
                            <div className="flex items-center justify-between gap-3">
                                <p className="truncate text-sm font-black text-white">
                                    {item.label}
                                </p>

                                <p className="shrink-0 text-sm font-black text-white">
                                    {formatNumber(item.total)}
                                </p>
                            </div>

                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                                <div
                                    className="h-full rounded-full bg-white"
                                    style={{
                                        width: `${Math.min(item.percentage, 100)}%`,
                                    }}
                                />
                            </div>

                            <p className="mt-2 text-xs font-bold text-neutral-500">
                                {formatPercent(item.percentage)}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyAnalyticsState message="Belum ada data." compact />
            )}
        </div>
    );
}

function AnalyticsCityList({
    title,
    description,
    items,
    loading,
}: {
    title: string;
    description: string;
    items: CityStat[];
    loading: boolean;
}) {
    return (
        <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-5">
            <div className="mb-4">
                <h4 className="text-lg font-black text-white">{title}</h4>
                <p className="mt-1 text-xs font-bold leading-5 text-neutral-500">
                    {description}
                </p>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold text-neutral-500">
                    Loading...
                </div>
            ) : items.length > 0 ? (
                <div className="space-y-3">
                    {items.slice(0, 5).map((item) => {
                        const label =
                            item.city === "Unknown"
                                ? "Unknown"
                                : `${item.city}${item.country !== "-" ? `, ${item.country}` : ""}`;

                        return (
                            <div
                                key={`${item.city}-${item.region}-${item.country}`}
                                className="rounded-2xl bg-white/[0.04] p-3"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-black text-white">
                                            {label}
                                        </p>

                                        <p className="mt-0.5 truncate text-xs font-bold text-neutral-500">
                                            Region: {item.region || "-"}
                                        </p>
                                    </div>

                                    <p className="shrink-0 text-sm font-black text-white">
                                        {formatNumber(item.total)}
                                    </p>
                                </div>

                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                                    <div
                                        className="h-full rounded-full bg-white"
                                        style={{
                                            width: `${Math.min(item.percentage, 100)}%`,
                                        }}
                                    />
                                </div>

                                <p className="mt-2 text-xs font-bold text-neutral-500">
                                    {formatPercent(item.percentage)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <EmptyAnalyticsState message="Belum ada data." compact />
            )}
        </div>
    );
}

function AnalyticsRatePill({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <p className="text-[11px] font-bold text-neutral-500">{label}</p>

            <p className="mt-1 text-sm font-black text-white">
                {formatPercent(value)}
            </p>
        </div>
    );
}

function EmptyAnalyticsState({
    message,
    compact = false,
}: {
    message: string;
    compact?: boolean;
}) {
    return (
        <div
            className={`rounded-2xl border border-dashed border-white/10 bg-white/[0.03] text-sm font-bold text-neutral-500 ${compact ? "p-4" : "p-6"
                }`}
        >
            {message}
        </div>
    );
}
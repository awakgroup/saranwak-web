"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSafePlaceImageUrl } from "@/lib/image-url";

type Category = {
    id: string;
    name: string;
    slug: string;
};

type Tag = {
    id: string;
    name: string;
    slug: string;
    type: string;
};

type AdminPlace = {
    id: string;
    category_id: string | null;
    name: string;
    slug: string;
    description: string | null;
    address: string | null;
    area: string | null;
    city: string | null;
    image_url: string | null;
    google_maps_url: string | null;
    instagram_url: string | null;
    price_range: string | null;
    price_min: number | null;
    price_max: number | null;
    opening_hours: string | null;
    is_featured: boolean;
    is_published: boolean;
    created_at: string;
    categories?:
    | {
        id: string;
        name: string;
        slug: string;
    }
    | {
        id: string;
        name: string;
        slug: string;
    }[]
    | null;
    place_tags?: {
        tag_id: string;
        tags?: Tag | Tag[] | null;
    }[];
    place_photos?: {
        id: string;
        image_url: string;
        caption?: string | null;
        sort_order?: number | null;
    }[];
};

type FormState = {
    id: string;
    name: string;
    slug: string;
    category_id: string;
    description: string;
    address: string;
    area: string;
    city: string;
    image_url: string;
    google_maps_url: string;
    instagram_url: string;
    price_range: string;
    price_min_input: string;
    price_max_input: string;
    opening_hours: string;
    open_time: string;
    close_time: string;
    is_24_hours: boolean;
    photo_urls: string[];
    is_featured: boolean;
    is_published: boolean;
    tag_ids: string[];
};

type AdminTab = "places" | "analytics";

const initialForm: FormState = {
    id: "",
    name: "",
    slug: "",
    category_id: "",
    description: "",
    address: "",
    area: "",
    city: "Padang",
    image_url: "",
    google_maps_url: "",
    instagram_url: "",
    price_range: "",
    price_min_input: "",
    price_max_input: "",
    opening_hours: "",
    open_time: "",
    close_time: "",
    is_24_hours: false,
    photo_urls: [""],
    is_featured: true,
    is_published: true,
    tag_ids: [],
};

function formatShortRupiah(value: string) {
    const numericValue = Number(value.replace(/\D/g, ""));

    if (!numericValue) return "";

    if (numericValue >= 1000) {
        return `Rp${numericValue / 1000}k`;
    }

    return `Rp${numericValue}`;
}

function formatPriceRange(min: string, max: string) {
    const minFormatted = formatShortRupiah(min);
    const maxFormatted = formatShortRupiah(max);

    if (minFormatted && maxFormatted) {
        return `${minFormatted} - ${maxFormatted}`;
    }

    if (minFormatted) {
        return `Mulai ${minFormatted}`;
    }

    if (maxFormatted) {
        return `Sampai ${maxFormatted}`;
    }

    return "";
}

function formatOpeningHours(
    openTime: string,
    closeTime: string,
    is24Hours: boolean
) {
    if (is24Hours) return "Buka 24 Jam";

    if (!openTime && !closeTime) return "";

    const formatTime = (value: string) => value.replace(":", ".");

    if (openTime && closeTime) {
        return `${formatTime(openTime)} - ${formatTime(closeTime)}`;
    }

    if (openTime) {
        return `Buka ${formatTime(openTime)}`;
    }

    return `Tutup ${formatTime(closeTime)}`;
}

function parsePriceRange(priceRange?: string | null) {
    if (!priceRange) {
        return {
            min: "",
            max: "",
        };
    }

    const numbers = priceRange.match(/\d+/g);

    if (!numbers || numbers.length === 0) {
        return {
            min: "",
            max: "",
        };
    }

    const normalize = (value: string) => {
        const number = Number(value);

        if (!number) return "";

        if (number < 1000) {
            return String(number * 1000);
        }

        return String(number);
    };

    return {
        min: normalize(numbers[0]),
        max: normalize(numbers[1] ?? ""),
    };
}

function parseOpeningHours(openingHours?: string | null) {
    if (!openingHours) {
        return {
            open: "",
            close: "",
            is24Hours: false,
        };
    }

    const normalized = openingHours.toLowerCase();

    if (
        normalized.includes("24") ||
        normalized.includes("buka 24 jam") ||
        normalized.includes("24 jam")
    ) {
        return {
            open: "",
            close: "",
            is24Hours: true,
        };
    }

    const matches = openingHours.match(/\d{1,2}[.:]\d{2}/g);

    if (!matches || matches.length === 0) {
        return {
            open: "",
            close: "",
            is24Hours: false,
        };
    }

    const normalize = (value: string) => value.replace(".", ":");

    return {
        open: normalize(matches[0]),
        close: normalize(matches[1] ?? ""),
        is24Hours: false,
    };
}

function getCategoryName(
    category:
        | {
            id: string;
            name: string;
            slug: string;
        }
        | {
            id: string;
            name: string;
            slug: string;
        }[]
        | null
        | undefined
) {
    if (Array.isArray(category)) {
        return category[0]?.name ?? "Tanpa kategori";
    }

    return category?.name ?? "Tanpa kategori";
}

function getPreviewUrls(photoUrls: string[]) {
    return photoUrls
        .map((url) => url.trim())
        .filter(Boolean)
        .slice(0, 5);
}

function getTagTypeLabel(type: string) {
    const labels: Record<string, string> = {
        activity: "Aktivitas",
        mood: "Aktivitas",
        facility: "Fasilitas",
        vibe: "Vibes",
        time: "Operasional",
        general: "Lainnya",
    };

    return labels[type] || type;
}

const tagTypeOrder = ["activity", "mood", "facility", "vibe", "time", "general"];

function sortTagGroups(entries: [string, Tag[]][]) {
    return entries.sort(([typeA], [typeB]) => {
        const indexA = tagTypeOrder.indexOf(typeA);
        const indexB = tagTypeOrder.indexOf(typeB);

        const normalizedA = indexA === -1 ? tagTypeOrder.length : indexA;
        const normalizedB = indexB === -1 ? tagTypeOrder.length : indexB;

        if (normalizedA !== normalizedB) {
            return normalizedA - normalizedB;
        }

        return typeA.localeCompare(typeB);
    });
}

export default function AdminPage() {
    const router = useRouter();

    const [form, setForm] = useState<FormState>(initialForm);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [places, setPlaces] = useState<AdminPlace[]>([]);
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingDeleteId, setLoadingDeleteId] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [activeTab, setActiveTab] = useState<AdminTab>("places");

    const isEditMode = Boolean(form.id);

    const previewPhotoUrls = getPreviewUrls(form.photo_urls);

    const mainImagePreviewUrl = form.image_url.trim()
        ? getSafePlaceImageUrl(form.image_url)
        : "";

    const galleryPreviewUrls = previewPhotoUrls.map((url) =>
        getSafePlaceImageUrl(url)
    );

    const groupedTags = useMemo(() => {
        return tags.reduce<Record<string, Tag[]>>((result, tag) => {
            const type = tag.type || "general";

            if (!result[type]) {
                result[type] = [];
            }

            result[type].push(tag);

            return result;
        }, {});
    }, [tags]);

    async function loadMeta() {
        try {
            setLoadingMeta(true);

            const response = await fetch("/api/admin/places");
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Gagal mengambil data CMS.");
            }

            const loadedCategories = result.categories ?? [];
            const loadedTags = result.tags ?? [];
            const loadedPlaces = result.places ?? [];

            setCategories(loadedCategories);
            setTags(loadedTags);
            setPlaces(loadedPlaces);

            if (!form.category_id && loadedCategories.length > 0) {
                setForm((prev) => ({
                    ...prev,
                    category_id: loadedCategories[0].id,
                }));
            }
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Gagal mengambil data CMS."
            );
        } finally {
            setLoadingMeta(false);
        }
    }

    useEffect(() => {
        loadMeta();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    function toggleTag(tagId: string) {
        setForm((prev) => {
            const isSelected = prev.tag_ids.includes(tagId);

            return {
                ...prev,
                tag_ids: isSelected
                    ? prev.tag_ids.filter((id) => id !== tagId)
                    : [...prev.tag_ids, tagId],
            };
        });
    }

    function updatePhotoUrl(index: number, value: string) {
        setForm((prev) => ({
            ...prev,
            photo_urls: prev.photo_urls.map((url, urlIndex) =>
                urlIndex === index ? value : url
            ),
        }));
    }

    function addPhotoUrlField() {
        setForm((prev) => {
            if (prev.photo_urls.length >= 5) return prev;

            return {
                ...prev,
                photo_urls: [...prev.photo_urls, ""],
            };
        });
    }

    function removePhotoUrlField(index: number) {
        setForm((prev) => {
            const nextPhotoUrls = prev.photo_urls.filter(
                (_, urlIndex) => urlIndex !== index
            );

            return {
                ...prev,
                photo_urls: nextPhotoUrls.length > 0 ? nextPhotoUrls : [""],
            };
        });
    }

    function handleEdit(place: AdminPlace) {
        setMessage("");
        setErrorMessage("");
        setActiveTab("places");

        const tagIds =
            place.place_tags
                ?.map((item) => item.tag_id)
                .filter((value): value is string => Boolean(value)) ?? [];

        const parsedPriceFromRange = parsePriceRange(place.price_range);

        const parsedPrice = {
            min:
                typeof place.price_min === "number"
                    ? String(place.price_min)
                    : parsedPriceFromRange.min,
            max:
                typeof place.price_max === "number"
                    ? String(place.price_max)
                    : parsedPriceFromRange.max,
        };

        const parsedHours = parseOpeningHours(place.opening_hours);

        const photoUrls =
            place.place_photos
                ?.slice()
                .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                .map((photo) => photo.image_url)
                .filter(Boolean) ?? [];

        const normalizedPhotoUrls =
            photoUrls.length > 0 ? photoUrls.slice(0, 5) : [""];

        setForm({
            id: place.id,
            name: place.name ?? "",
            slug: place.slug ?? "",
            category_id: place.category_id ?? categories[0]?.id ?? "",
            description: place.description ?? "",
            address: place.address ?? "",
            area: place.area ?? "",
            city: place.city ?? "Padang",
            image_url: place.image_url ?? "",
            google_maps_url: place.google_maps_url ?? "",
            instagram_url: place.instagram_url ?? "",
            price_range: place.price_range ?? "",
            price_min_input: parsedPrice.min,
            price_max_input: parsedPrice.max,
            opening_hours: place.opening_hours ?? "",
            open_time: parsedHours.open,
            close_time: parsedHours.close,
            is_24_hours: parsedHours.is24Hours,
            photo_urls: normalizedPhotoUrls,
            is_featured: Boolean(place.is_featured),
            is_published: Boolean(place.is_published),
            tag_ids: tagIds,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    function resetForm() {
        setForm({
            ...initialForm,
            category_id: categories[0]?.id ?? "",
        });

        setMessage("");
        setErrorMessage("");
    }

    async function handleLogout() {
        await fetch("/api/admin/logout", {
            method: "POST",
        });

        router.push("/admin/login");
        router.refresh();
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMessage("");
        setErrorMessage("");

        if (!form.name.trim()) {
            setErrorMessage("Nama tempat wajib diisi.");
            return;
        }

        if (!form.category_id) {
            setErrorMessage("Kategori wajib dipilih.");
            return;
        }

        const priceMin = form.price_min_input
            ? Number(form.price_min_input)
            : null;

        const priceMax = form.price_max_input
            ? Number(form.price_max_input)
            : null;

        if (priceMin !== null && Number.isNaN(priceMin)) {
            setErrorMessage("Harga minimum harus berupa angka.");
            return;
        }

        if (priceMax !== null && Number.isNaN(priceMax)) {
            setErrorMessage("Harga maksimum harus berupa angka.");
            return;
        }

        if (priceMin !== null && priceMax !== null && priceMin > priceMax) {
            setErrorMessage("Harga minimum tidak boleh lebih besar dari harga maksimum.");
            return;
        }

        const formattedPriceRange = formatPriceRange(
            form.price_min_input,
            form.price_max_input
        );

        const formattedOpeningHours = formatOpeningHours(
            form.open_time,
            form.close_time,
            form.is_24_hours
        );

        const photoUrls = form.photo_urls
            .map((url) => url.trim())
            .filter(Boolean)
            .slice(0, 5);

        try {
            setLoadingSubmit(true);

            const response = await fetch("/api/admin/places", {
                method: isEditMode ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: form.id,
                    name: form.name,
                    slug: form.slug,
                    category_id: form.category_id,
                    description: form.description,
                    address: form.address,
                    area: form.area,
                    city: form.city,
                    image_url: form.image_url,
                    google_maps_url: form.google_maps_url,
                    instagram_url: form.instagram_url,
                    price_range: formattedPriceRange,
                    price_min: priceMin,
                    price_max: priceMax,
                    opening_hours: formattedOpeningHours,
                    is_featured: form.is_featured,
                    is_published: form.is_published,
                    tag_ids: form.tag_ids,
                    photo_urls: photoUrls,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Gagal menyimpan tempat.");
            }

            setMessage(result.message || "Data berhasil disimpan.");

            setForm((prev) => ({
                ...initialForm,
                category_id: prev.category_id || categories[0]?.id || "",
            }));

            await loadMeta();
            router.refresh();
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Gagal menyimpan tempat."
            );
        } finally {
            setLoadingSubmit(false);
        }
    }

    async function handleDelete(place: AdminPlace) {
        setMessage("");
        setErrorMessage("");

        const confirmed = window.confirm(
            `Hapus "${place.name}"? Data ini akan hilang dari CMS dan website.`
        );

        if (!confirmed) return;

        try {
            setLoadingDeleteId(place.id);

            const response = await fetch(`/api/admin/places?id=${place.id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Gagal menghapus tempat.");
            }

            setMessage(result.message || "Tempat berhasil dihapus.");

            if (form.id === place.id) {
                resetForm();
            }

            await loadMeta();
            router.refresh();
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Gagal menghapus tempat."
            );
        } finally {
            setLoadingDeleteId("");
        }
    }

    return (
        <main className="min-h-screen bg-neutral-950 px-4 py-6 text-white sm:px-5 sm:py-8 lg:py-10">
            <section className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 sm:text-xs sm:tracking-[0.35em]">
                            Saranwak CMS
                        </p>

                        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                            {activeTab === "places"
                                ? isEditMode
                                    ? "Update Data Tempat"
                                    : "Input Data Tempat"
                                : "Analytics"}
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400 sm:mt-4 sm:text-base">
                            {activeTab === "places"
                                ? "Tambahkan, update, atau hapus coffee shop dan data tempat dari database Saranwak."
                                : "Pantau performa website, tempat paling banyak dilihat, dan klik penting untuk kebutuhan marketing."}
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
                            onClick={handleLogout}
                            className="inline-flex justify-center rounded-full border border-red-400/20 px-4 py-3 text-center text-xs font-bold text-red-300 transition hover:bg-red-400/10 sm:px-5 sm:text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="mb-6 flex w-full flex-col gap-2 rounded-[24px] border border-white/10 bg-white/[0.03] p-2 sm:w-fit sm:flex-row">
                    <button
                        type="button"
                        onClick={() => setActiveTab("places")}
                        className={`rounded-2xl px-5 py-3 text-sm font-black transition ${activeTab === "places"
                            ? "bg-white text-black"
                            : "text-neutral-400 hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        Kelola Tempat
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("analytics")}
                        className={`rounded-2xl px-5 py-3 text-sm font-black transition ${activeTab === "analytics"
                            ? "bg-white text-black"
                            : "text-neutral-400 hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        Analytics
                    </button>
                </div>

                {loadingMeta ? (
                    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 text-sm text-neutral-300 sm:rounded-[28px] sm:p-8">
                        Loading CMS...
                    </div>
                ) : activeTab === "places" ? (
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                        <div className="min-w-0 space-y-5 sm:space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                                <Panel title="Data Utama">
                                    {isEditMode ? (
                                        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm font-bold text-amber-200">
                                            Mode edit: {form.name}
                                        </div>
                                    ) : null}

                                    <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                                        <Field label="Nama Tempat">
                                            <input
                                                value={form.name}
                                                onChange={(event) =>
                                                    updateField("name", event.target.value)
                                                }
                                                placeholder="Contoh: Kopi Saranwak"
                                                className="input-cms"
                                            />
                                        </Field>

                                        <Field label="Slug Optional">
                                            <input
                                                value={form.slug}
                                                onChange={(event) =>
                                                    updateField("slug", event.target.value)
                                                }
                                                placeholder="kopi-saranwak"
                                                className="input-cms"
                                            />
                                        </Field>
                                    </div>

                                    <Field label="Kategori">
                                        <select
                                            value={form.category_id}
                                            onChange={(event) =>
                                                updateField("category_id", event.target.value)
                                            }
                                            className="input-cms"
                                        >
                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                    className="bg-neutral-900"
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>

                                    <Field label="Deskripsi">
                                        <textarea
                                            value={form.description}
                                            onChange={(event) =>
                                                updateField("description", event.target.value)
                                            }
                                            placeholder="Deskripsi singkat tempat..."
                                            rows={5}
                                            className="input-cms resize-none"
                                        />
                                    </Field>
                                </Panel>

                                <Panel title="Lokasi & Detail">
                                    <Field label="Alamat">
                                        <textarea
                                            value={form.address}
                                            onChange={(event) =>
                                                updateField("address", event.target.value)
                                            }
                                            placeholder="Alamat lengkap"
                                            rows={3}
                                            className="input-cms resize-none"
                                        />
                                    </Field>

                                    <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                                        <Field label="Area">
                                            <input
                                                value={form.area}
                                                onChange={(event) =>
                                                    updateField("area", event.target.value)
                                                }
                                                placeholder="Contoh: Padang Barat"
                                                className="input-cms"
                                            />
                                        </Field>

                                        <Field label="Kota">
                                            <input
                                                value={form.city}
                                                onChange={(event) =>
                                                    updateField("city", event.target.value)
                                                }
                                                placeholder="Padang"
                                                className="input-cms"
                                            />
                                        </Field>
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div>
                                            <p className="mb-2 block text-sm font-bold text-neutral-300">
                                                Range Harga
                                            </p>

                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={form.price_min_input}
                                                    onChange={(event) =>
                                                        updateField("price_min_input", event.target.value)
                                                    }
                                                    placeholder="Min. 0"
                                                    className="input-cms"
                                                />

                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={form.price_max_input}
                                                    onChange={(event) =>
                                                        updateField("price_max_input", event.target.value)
                                                    }
                                                    placeholder="Max. 99999"
                                                    className="input-cms"
                                                />
                                            </div>

                                            <p className="mt-2 text-xs font-bold text-neutral-500">
                                                Isi angka saja. Contoh: 15000, bukan 15k.
                                            </p>

                                            <p className="mt-1 text-xs font-bold text-neutral-500">
                                                Preview:{" "}
                                                {formatPriceRange(
                                                    form.price_min_input,
                                                    form.price_max_input
                                                ) || "Belum ada info"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="mb-2 block text-sm font-bold text-neutral-300">
                                                Jam Buka
                                            </p>

                                            <label className="mb-3 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                                <div>
                                                    <p className="font-bold text-white">Buka 24 Jam</p>
                                                    <p className="text-xs leading-5 text-neutral-500">
                                                        Aktifkan kalau tempat buka seharian.
                                                    </p>
                                                </div>

                                                <input
                                                    type="checkbox"
                                                    checked={form.is_24_hours}
                                                    onChange={(event) =>
                                                        updateField("is_24_hours", event.target.checked)
                                                    }
                                                    className="h-5 w-5 shrink-0"
                                                />
                                            </label>

                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <input
                                                    type="time"
                                                    value={form.open_time}
                                                    disabled={form.is_24_hours}
                                                    onChange={(event) =>
                                                        updateField("open_time", event.target.value)
                                                    }
                                                    className="input-cms disabled:cursor-not-allowed disabled:opacity-40"
                                                />

                                                <input
                                                    type="time"
                                                    value={form.close_time}
                                                    disabled={form.is_24_hours}
                                                    onChange={(event) =>
                                                        updateField("close_time", event.target.value)
                                                    }
                                                    className="input-cms disabled:cursor-not-allowed disabled:opacity-40"
                                                />
                                            </div>

                                            <p className="mt-2 text-xs font-bold text-neutral-500">
                                                Preview:{" "}
                                                {formatOpeningHours(
                                                    form.open_time,
                                                    form.close_time,
                                                    form.is_24_hours
                                                ) || "Belum ada info"}
                                            </p>
                                        </div>
                                    </div>
                                </Panel>

                                <Panel title="Media & Link">
                                    <Field label="Image URL">
                                        <input
                                            value={form.image_url}
                                            onChange={(event) =>
                                                updateField("image_url", event.target.value)
                                            }
                                            placeholder="https://images.unsplash.com/... atau Google Drive public link"
                                            className="input-cms"
                                        />

                                        <div className="mt-3 overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03]">
                                            {form.image_url.trim() ? (
                                                <img
                                                    src={mainImagePreviewUrl}
                                                    alt="Preview image utama"
                                                    className="h-48 w-full object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <div className="flex h-48 items-center justify-center px-5 text-center text-sm font-bold text-neutral-500">
                                                    Preview image utama akan muncul di sini
                                                </div>
                                            )}
                                        </div>

                                        <p className="mt-2 text-xs font-bold text-neutral-500">
                                            Bisa pakai Google Drive public link, Unsplash, Cloudinary,
                                            ImageKit, atau direct image URL.
                                        </p>
                                    </Field>

                                    <div>
                                        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <p className="text-sm font-bold text-neutral-300">
                                                    Gallery Photo URLs
                                                </p>

                                                <p className="mt-1 text-xs font-bold leading-5 text-neutral-500">
                                                    Default 1 foto, bisa tambah sampai maksimal 5 foto.
                                                    Bisa pakai Google Drive public link, direct image URL,
                                                    Unsplash, Cloudinary, atau ImageKit.
                                                </p>
                                            </div>

                                            <span className="w-fit shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs font-black text-neutral-400">
                                                {form.photo_urls.length}/5
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {form.photo_urls.map((url, index) => (
                                                <div
                                                    key={index}
                                                    className="grid gap-2 sm:grid-cols-[1fr_auto]"
                                                >
                                                    <input
                                                        value={url}
                                                        onChange={(event) =>
                                                            updatePhotoUrl(index, event.target.value)
                                                        }
                                                        placeholder={
                                                            index === 0
                                                                ? "https://drive.google.com/file/d/xxx/view"
                                                                : "https://images.unsplash.com/..."
                                                        }
                                                        className="input-cms"
                                                    />

                                                    {form.photo_urls.length > 1 ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => removePhotoUrlField(index)}
                                                            className="rounded-2xl border border-red-400/20 px-4 py-3 text-sm font-black text-red-300 transition hover:bg-red-400/10 sm:py-0"
                                                        >
                                                            Hapus
                                                        </button>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={addPhotoUrlField}
                                            disabled={form.photo_urls.length >= 5}
                                            className="mt-4 w-full rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 sm:w-fit"
                                        >
                                            + Tambah Foto
                                        </button>

                                        <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-black text-white">
                                                        Preview Gallery
                                                    </p>

                                                    <p className="mt-1 text-xs font-bold text-neutral-500">
                                                        Foto yang terisi akan muncul di bawah ini.
                                                    </p>
                                                </div>

                                                <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-black">
                                                    {previewPhotoUrls.length} foto
                                                </span>
                                            </div>

                                            {galleryPreviewUrls.length > 0 ? (
                                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                    {galleryPreviewUrls.map((url, index) => (
                                                        <div
                                                            key={`${previewPhotoUrls[index]}-${index}`}
                                                            className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900"
                                                        >
                                                            <img
                                                                src={url}
                                                                alt={`Preview gallery ${index + 1}`}
                                                                className="h-32 w-full object-cover"
                                                                referrerPolicy="no-referrer"
                                                            />

                                                            <div className="px-3 py-2">
                                                                <p className="truncate text-xs font-bold text-neutral-400">
                                                                    Foto {index + 1}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-white/10 px-5 text-center text-sm font-bold text-neutral-500">
                                                    Gallery preview akan muncul setelah URL foto diisi
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Field label="Google Maps URL">
                                        <input
                                            value={form.google_maps_url}
                                            onChange={(event) =>
                                                updateField("google_maps_url", event.target.value)
                                            }
                                            placeholder="https://maps.google.com/..."
                                            className="input-cms"
                                        />
                                    </Field>

                                    <Field label="Instagram URL">
                                        <input
                                            value={form.instagram_url}
                                            onChange={(event) =>
                                                updateField("instagram_url", event.target.value)
                                            }
                                            placeholder="https://instagram.com/..."
                                            className="input-cms"
                                        />
                                    </Field>
                                </Panel>

                                <Panel title="Publish & Tags">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                            <div>
                                                <p className="font-bold">Published</p>
                                                <p className="text-sm text-neutral-500">
                                                    Tampilkan di website
                                                </p>
                                            </div>

                                            <input
                                                type="checkbox"
                                                checked={form.is_published}
                                                onChange={(event) =>
                                                    updateField("is_published", event.target.checked)
                                                }
                                                className="h-5 w-5 shrink-0"
                                            />
                                        </label>

                                        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                            <div>
                                                <p className="font-bold">Featured</p>
                                                <p className="text-sm text-neutral-500">
                                                    Tampilkan di homepage
                                                </p>
                                            </div>

                                            <input
                                                type="checkbox"
                                                checked={form.is_featured}
                                                onChange={(event) =>
                                                    updateField("is_featured", event.target.checked)
                                                }
                                                className="h-5 w-5 shrink-0"
                                            />
                                        </label>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="mb-4 font-black">Tags</h3>

                                        {Object.keys(groupedTags).length === 0 ? (
                                            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-neutral-400">
                                                Belum ada tags.
                                            </p>
                                        ) : (
                                            <div className="space-y-5">
                                                {sortTagGroups(Object.entries(groupedTags)).map(([type, tagList]) => (
                                                    <div key={type}>
                                                        <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-neutral-500">
                                                            {getTagTypeLabel(type)}
                                                        </p>

                                                        <div className="flex flex-wrap gap-2">
                                                            {tagList.map((tag) => {
                                                                const active = form.tag_ids.includes(tag.id);

                                                                return (
                                                                    <button
                                                                        key={tag.id}
                                                                        type="button"
                                                                        onClick={() => toggleTag(tag.id)}
                                                                        className={`rounded-full border px-3 py-2 text-xs font-bold transition ${active
                                                                            ? "border-white bg-white text-black"
                                                                            : "border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-white/10"
                                                                            }`}
                                                                    >
                                                                        {tag.name}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {message ? (
                                        <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-300">
                                            {message}
                                        </div>
                                    ) : null}

                                    {errorMessage ? (
                                        <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm font-bold text-red-300">
                                            {errorMessage}
                                        </div>
                                    ) : null}

                                    <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
                                        <button
                                            type="submit"
                                            disabled={loadingSubmit}
                                            className="rounded-2xl bg-white px-5 py-4 text-sm font-black text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {loadingSubmit
                                                ? "Menyimpan..."
                                                : isEditMode
                                                    ? "Update Tempat"
                                                    : "Simpan Tempat"}
                                        </button>

                                        {isEditMode ? (
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="rounded-2xl border border-white/10 px-5 py-4 text-sm font-black text-white transition hover:bg-white/10"
                                            >
                                                Batal Edit
                                            </button>
                                        ) : null}
                                    </div>
                                </Panel>
                            </form>
                        </div>

                        <aside className="min-w-0 space-y-6">
                            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 sm:rounded-[28px] sm:p-5 md:p-7 xl:sticky xl:top-6">
                                <div className="mb-5 flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-black">Data Tempat</h2>
                                        <p className="mt-1 text-sm text-neutral-500">
                                            Total: {places.length}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={loadMeta}
                                        className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold transition hover:bg-white hover:text-black"
                                    >
                                        Refresh
                                    </button>
                                </div>

                                {places.length === 0 ? (
                                    <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-neutral-400">
                                        Belum ada data tempat.
                                    </p>
                                ) : (
                                    <div className="space-y-3 overflow-y-auto pr-1 xl:max-h-[calc(100vh-220px)]">
                                        {places.map((place) => (
                                            <div
                                                key={place.id}
                                                className={`rounded-2xl border p-4 transition ${form.id === place.id
                                                    ? "border-white bg-white text-black"
                                                    : "border-white/10 bg-white/[0.03]"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <h3 className="truncate font-black leading-tight">
                                                            {place.name}
                                                        </h3>

                                                        <p
                                                            className={`mt-1 line-clamp-2 text-xs ${form.id === place.id
                                                                ? "text-black/60"
                                                                : "text-neutral-500"
                                                                }`}
                                                        >
                                                            {getCategoryName(place.categories)} ·{" "}
                                                            {place.area || "Tanpa area"}
                                                        </p>

                                                        <p
                                                            className={`mt-2 text-xs font-bold ${form.id === place.id
                                                                ? "text-black/60"
                                                                : "text-neutral-500"
                                                                }`}
                                                        >
                                                            Harga: {place.price_range || "Belum ada"}
                                                        </p>
                                                    </div>

                                                    <div
                                                        className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black uppercase ${place.is_published
                                                            ? form.id === place.id
                                                                ? "bg-black text-white"
                                                                : "bg-emerald-400/10 text-emerald-300"
                                                            : form.id === place.id
                                                                ? "bg-black/10 text-black"
                                                                : "bg-neutral-700 text-neutral-300"
                                                            }`}
                                                    >
                                                        {place.is_published ? "Live" : "Draft"}
                                                    </div>
                                                </div>

                                                <div className="mt-4 grid grid-cols-2 gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(place)}
                                                        className={`rounded-xl px-3 py-2 text-xs font-black transition ${form.id === place.id
                                                            ? "bg-black text-white"
                                                            : "bg-white text-black hover:bg-neutral-200"
                                                            }`}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(place)}
                                                        disabled={loadingDeleteId === place.id}
                                                        className="rounded-xl border border-red-400/20 px-3 py-2 text-xs font-black text-red-300 transition hover:bg-red-400/10 disabled:opacity-60"
                                                    >
                                                        {loadingDeleteId === place.id ? "..." : "Delete"}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                ) : (
                    <AnalyticsPanel />
                )}
            </section>

            <style jsx global>{`
                .input-cms {
                    width: 100%;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.04);
                    padding: 13px 14px;
                    color: white;
                    outline: none;
                    transition: 0.2s ease;
                    font-size: 14px;
                }

                @media (min-width: 640px) {
                    .input-cms {
                        border-radius: 18px;
                        padding: 14px 16px;
                        font-size: 15px;
                    }
                }

                .input-cms::placeholder {
                    color: rgba(255, 255, 255, 0.35);
                }

                .input-cms:focus {
                    border-color: rgba(255, 255, 255, 0.35);
                    background: rgba(255, 255, 255, 0.07);
                }
            `}</style>
        </main>
    );
}

type AnalyticsPeriod = {
    period: string;
    start: string;
    end: string;
    label: string;
};

type AnalyticsSummary = {
    total_events: number;
    detail_views: number;
    maps_clicks: number;
    instagram_clicks: number;
    whatsapp_clicks: number;
    card_clicks: number;
};

type TopPlaceAnalytics = {
    place_id: string | null;
    place_name: string;
    place_slug: string;
    detail_views: number;
    maps_clicks: number;
    instagram_clicks: number;
    whatsapp_clicks: number;
    card_clicks: number;
    action_clicks?: number;
    action_click_rate?: number;
    maps_click_rate?: number;
    instagram_click_rate?: number;
    total_events: number;
    last_event_at: string | null;
};

type RecentAnalyticsEvent = {
    id: string;
    event_name: string;
    place_id: string | null;
    place_name: string | null;
    place_slug: string | null;
    source: string | null;
    page_path: string | null;
    referrer: string | null;
    metadata: Record<string, unknown> | null;
    session_id: string | null;
    created_at: string;
};

type AnalyticsResponse = {
    period: AnalyticsPeriod;
    summary: AnalyticsSummary;
    top_places: TopPlaceAnalytics[];
    recent_events: RecentAnalyticsEvent[];
};

type PeriodType = "daily" | "weekly" | "monthly" | "yearly" | "custom";

const monthOptions = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
];

function formatNumber(value?: number | null) {
    return Number(value ?? 0).toLocaleString("id-ID");
}

function formatPercent(value?: number | null) {
    return `${Number(value ?? 0).toFixed(1)}%`;
}

function getRate(part: number, total: number) {
    if (!total) return 0;

    return (part / total) * 100;
}

function formatEventTime(value?: string | null) {
    if (!value) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function formatEventName(value: string) {
    return value
        .split("_")
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
        .join(" ");
}

function getTodayInputValue() {
    return new Date().toISOString().slice(0, 10);
}

function buildAnalyticsParams(options: {
    periodType: PeriodType;
    selectedMonth: string;
    selectedYear: string;
    selectedDate: string;
    selectedWeekStart: string;
    customStart: string;
    customEnd: string;
}) {
    const params = new URLSearchParams();

    params.set("period", options.periodType);

    if (options.periodType === "daily") {
        params.set("date", options.selectedDate);
    }

    if (options.periodType === "weekly") {
        params.set("start", options.selectedWeekStart);
    }

    if (options.periodType === "monthly") {
        params.set("month", options.selectedMonth);
        params.set("year", options.selectedYear);
    }

    if (options.periodType === "yearly") {
        params.set("year", options.selectedYear);
    }

    if (options.periodType === "custom") {
        params.set("start", options.customStart);
        params.set("end", options.customEnd);
    }

    return params;
}

function AnalyticsPanel() {
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

    const analyticsParams = buildAnalyticsParams({
        periodType,
        selectedMonth,
        selectedYear,
        selectedDate,
        selectedWeekStart,
        customStart,
        customEnd,
    });

    async function loadAnalytics() {
        try {
            setLoadingAnalytics(true);
            setAnalyticsError("");

            const response = await fetch(
                `/api/admin/analytics?${analyticsParams.toString()}`,
                {
                    cache: "no-store",
                }
            );

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
        window.open(
            `/api/admin/analytics/export?${analyticsParams.toString()}`,
            "_blank"
        );
    }

    useEffect(() => {
        loadAnalytics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const summaryCards = [
        {
            label: "Total Events",
            value: analytics?.summary.total_events ?? 0,
            description: "Semua event yang masuk ke tracker.",
        },
        {
            label: "Detail Views",
            value: analytics?.summary.detail_views ?? 0,
            description: "Total halaman detail tempat dibuka.",
        },
        {
            label: "Maps Click",
            value: analytics?.summary.maps_clicks ?? 0,
            description: "User klik tombol Google Maps.",
        },
        {
            label: "Instagram Click",
            value: analytics?.summary.instagram_clicks ?? 0,
            description: "User klik tombol Instagram.",
        },
        {
            label: "WhatsApp Lead",
            value: analytics?.summary.whatsapp_clicks ?? 0,
            description: "User klik Contact Us atau kerja sama.",
        },
        {
            label: "Card Click",
            value: analytics?.summary.card_clicks ?? 0,
            description: "User klik card tempat dari list/homepage.",
        },
    ];

    const detailViews = analytics?.summary.detail_views ?? 0;
    const mapsClicks = analytics?.summary.maps_clicks ?? 0;
    const instagramClicks = analytics?.summary.instagram_clicks ?? 0;
    const whatsappClicks = analytics?.summary.whatsapp_clicks ?? 0;
    const cardClicks = analytics?.summary.card_clicks ?? 0;

    const actionClicks = mapsClicks + instagramClicks + whatsappClicks;

    const funnelCards = [
        {
            label: "Action Click Rate",
            value: getRate(actionClicks, detailViews),
            description:
                "Persentase user yang lanjut klik Maps, Instagram, atau WhatsApp setelah melihat detail.",
        },
        {
            label: "Maps Click Rate",
            value: getRate(mapsClicks, detailViews),
            description:
                "Persentase user yang klik Google Maps dari total detail views.",
        },
        {
            label: "Instagram Click Rate",
            value: getRate(instagramClicks, detailViews),
            description:
                "Persentase user yang klik Instagram dari total detail views.",
        },
        {
            label: "Card to Detail",
            value: getRate(detailViews, cardClicks),
            description:
                "Rasio detail views dibanding card clicks. Bisa tinggi kalau user masuk dari link langsung atau refresh halaman detail.",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 md:p-7">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">
                            Saranwak Analytics
                        </p>

                        <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
                            Performa Website
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-400">
                            Data ini live dari Supabase dan bisa difilter berdasarkan harian,
                            mingguan, bulanan, tahunan, atau custom date range.
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

                <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="grid gap-4 lg:grid-cols-[1fr_2fr] lg:items-start">
                        <div>
                            <p className="text-sm font-black text-white">Periode Laporan</p>
                            <p className="mt-1 text-xs font-bold leading-5 text-neutral-500">
                                Pilih periode untuk melihat rekap dan export data analytics.
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
                    <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm font-bold text-red-300">
                        {analyticsError}
                    </div>
                ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {summaryCards.map((item) => (
                    <div
                        key={item.label}
                        className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5"
                    >
                        <p className="text-sm font-bold text-neutral-500">{item.label}</p>

                        <p className="mt-3 text-4xl font-black text-white">
                            {loadingAnalytics ? "..." : formatNumber(item.value)}
                        </p>

                        <p className="mt-3 text-xs leading-5 text-neutral-500">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 md:p-7">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">
                            Conversion Funnel
                        </p>

                        <h3 className="mt-3 text-2xl font-black md:text-3xl">
                            Dari lihat detail sampai action
                        </h3>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                            Bagian ini bantu kamu membaca performa tempat: bukan cuma dilihat,
                            tapi apakah user lanjut klik Maps, Instagram, atau WhatsApp.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                        <p className="text-xs font-bold text-neutral-500">
                            Action Clicks
                        </p>

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
                            <p className="text-sm font-bold text-neutral-500">
                                {item.label}
                            </p>

                            <p className="mt-3 text-4xl font-black text-white">
                                {loadingAnalytics ? "..." : formatPercent(item.value)}
                            </p>

                            <p className="mt-3 text-xs leading-5 text-neutral-500">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_440px]">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 md:p-7">
                    <h3 className="text-2xl font-black">Top Coffee Shop</h3>
                    <p className="mt-1 text-sm text-neutral-500">
                        Tempat dengan performa tertinggi berdasarkan periode aktif.
                    </p>

                    {loadingAnalytics ? (
                        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm font-bold text-neutral-500">
                            Mengambil data top coffee shop...
                        </div>
                    ) : analytics?.top_places.length ? (
                        <div className="mt-5 space-y-3">
                            {analytics.top_places.map((place, index) => (
                                <div
                                    key={`${place.place_id}-${index}`}
                                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-xs font-black text-neutral-500">
                                                #{index + 1}
                                            </p>

                                            <h4 className="mt-1 truncate font-black text-white">
                                                {place.place_name || "-"}
                                            </h4>

                                            <p className="mt-1 text-xs font-bold text-neutral-500">
                                                /places/{place.place_slug}
                                            </p>
                                        </div>

                                        <div className="shrink-0 space-y-2 text-right">
                                            <div className="rounded-full bg-white px-3 py-1 text-xs font-black text-black">
                                                {formatNumber(place.total_events)} events
                                            </div>

                                            <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-black text-neutral-300">
                                                {formatPercent(place.action_click_rate ?? 0)} action rate
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-neutral-400 sm:grid-cols-3 xl:grid-cols-6">
                                        <AnalyticsMiniStat
                                            label="Views"
                                            value={place.detail_views}
                                        />
                                        <AnalyticsMiniStat
                                            label="Actions"
                                            value={place.action_clicks ?? 0}
                                        />
                                        <AnalyticsMiniStat
                                            label="Maps"
                                            value={place.maps_clicks}
                                        />
                                        <AnalyticsMiniStat
                                            label="IG"
                                            value={place.instagram_clicks}
                                        />
                                        <AnalyticsMiniStat
                                            label="WA"
                                            value={place.whatsapp_clicks}
                                        />
                                        <AnalyticsMiniStat
                                            label="Cards"
                                            value={place.card_clicks}
                                        />

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
                            ))}
                        </div>
                    ) : (
                        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm font-bold text-neutral-500">
                            Belum ada data pada periode ini.
                        </div>
                    )}
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 md:p-7">
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

                                    <p className="mt-2 text-xs font-bold text-neutral-600">
                                        {formatEventTime(event.created_at)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm font-bold text-neutral-500">
                            Belum ada event tracking pada periode ini.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function AnalyticsMiniStat({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-xl bg-white/[0.04] p-3">
            {label}
            <p className="mt-1 text-lg font-black text-white">
                {formatNumber(value)}
            </p>
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

function Panel({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 sm:rounded-[28px] sm:p-5 md:p-7">
            <h2 className="mb-5 text-xl font-black sm:mb-6 sm:text-2xl">{title}</h2>
            <div className="space-y-5">{children}</div>
        </div>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
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
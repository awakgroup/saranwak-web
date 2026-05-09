"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
    photo_urls_text: string;
    is_featured: boolean;
    is_published: boolean;
    tag_ids: string[];
};

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
    photo_urls_text: "",
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

    const isEditMode = Boolean(form.id);

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

    function handleEdit(place: AdminPlace) {
        setMessage("");
        setErrorMessage("");

        const tagIds =
            place.place_tags
                ?.map((item) => item.tag_id)
                .filter((value): value is string => Boolean(value)) ?? [];

        const parsedPrice = parsePriceRange(place.price_range);
        const parsedHours = parseOpeningHours(place.opening_hours);

        const photoUrlsText =
            place.place_photos
                ?.slice()
                .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                .map((photo) => photo.image_url)
                .join("\n") ?? "";

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
            photo_urls_text: photoUrlsText,
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

        const formattedPriceRange = formatPriceRange(
            form.price_min_input,
            form.price_max_input
        );

        const formattedOpeningHours = formatOpeningHours(
            form.open_time,
            form.close_time,
            form.is_24_hours
        );

        const photoUrls = form.photo_urls_text
            .split("\n")
            .map((url) => url.trim())
            .filter(Boolean);

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
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Gagal menghapus tempat."
            );
        } finally {
            setLoadingDeleteId("");
        }
    }

    return (
        <main className="min-h-screen bg-neutral-950 px-5 py-10 text-white">
            <section className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.35em] text-neutral-500">
                            Saranwak CMS
                        </p>

                        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
                            {isEditMode ? "Update Data Tempat" : "Input Data Tempat"}
                        </h1>

                        <p className="mt-4 max-w-2xl text-neutral-400">
                            Tambahkan, update, atau hapus coffee shop dan data tempat dari
                            database Saranwak.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <a
                            href="/"
                            className="w-fit rounded-full border border-white/10 px-5 py-3 text-sm font-bold transition hover:bg-white hover:text-black"
                        >
                            Lihat Website
                        </a>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-fit rounded-full border border-red-400/20 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/10"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {loadingMeta ? (
                    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-neutral-300">
                        Loading CMS...
                    </div>
                ) : (
                    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
                        <div className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Panel title="Data Utama">
                                    {isEditMode ? (
                                        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm font-bold text-amber-200">
                                            Mode edit: {form.name}
                                        </div>
                                    ) : null}

                                    <div className="grid gap-5 md:grid-cols-2">
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

                                    <div className="grid gap-5 md:grid-cols-2">
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

                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={form.price_min_input}
                                                    onChange={(event) =>
                                                        updateField("price_min_input", event.target.value)
                                                    }
                                                    placeholder="Min. 20000"
                                                    className="input-cms"
                                                />

                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={form.price_max_input}
                                                    onChange={(event) =>
                                                        updateField("price_max_input", event.target.value)
                                                    }
                                                    placeholder="Max. 50000"
                                                    className="input-cms"
                                                />
                                            </div>

                                            <p className="mt-2 text-xs font-bold text-neutral-500">
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

                                            <label className="mb-3 flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                                <div>
                                                    <p className="font-bold text-white">Buka 24 Jam</p>
                                                    <p className="text-xs text-neutral-500">
                                                        Aktifkan kalau tempat buka seharian.
                                                    </p>
                                                </div>

                                                <input
                                                    type="checkbox"
                                                    checked={form.is_24_hours}
                                                    onChange={(event) =>
                                                        updateField("is_24_hours", event.target.checked)
                                                    }
                                                    className="h-5 w-5"
                                                />
                                            </label>

                                            <div className="grid grid-cols-2 gap-3">
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
                                            placeholder="https://images.unsplash.com/..."
                                            className="input-cms"
                                        />
                                    </Field>

                                    <Field label="Gallery Photo URLs">
                                        <textarea
                                            value={form.photo_urls_text}
                                            onChange={(event) =>
                                                updateField("photo_urls_text", event.target.value)
                                            }
                                            placeholder={`Masukkan satu URL foto per baris:
https://drive.google.com/file/d/xxx/view
https://images.unsplash.com/...
https://lh3.googleusercontent.com/...`}
                                            rows={6}
                                            className="input-cms resize-none"
                                        />

                                        <p className="mt-2 text-xs font-bold text-neutral-500">
                                            Satu baris untuk satu foto. Bisa pakai Google Drive
                                            public link, direct image URL, Unsplash, Cloudinary, atau
                                            ImageKit.
                                        </p>
                                    </Field>

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
                                                className="h-5 w-5"
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
                                                className="h-5 w-5"
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
                                                {Object.entries(groupedTags).map(([type, tagList]) => (
                                                    <div key={type}>
                                                        <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-neutral-500">
                                                            {type}
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

                                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                        <button
                                            type="submit"
                                            disabled={loadingSubmit}
                                            className="flex-1 rounded-2xl bg-white px-5 py-4 text-sm font-black text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
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

                        <aside className="space-y-6">
                            <div className="sticky top-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 md:p-7">
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
                                    <div className="max-h-[calc(100vh-220px)] space-y-3 overflow-y-auto pr-1">
                                        {places.map((place) => (
                                            <div
                                                key={place.id}
                                                className={`rounded-2xl border p-4 transition ${form.id === place.id
                                                        ? "border-white bg-white text-black"
                                                        : "border-white/10 bg-white/[0.03]"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <h3 className="font-black leading-tight">
                                                            {place.name}
                                                        </h3>

                                                        <p
                                                            className={`mt-1 text-xs ${form.id === place.id
                                                                    ? "text-black/60"
                                                                    : "text-neutral-500"
                                                                }`}
                                                        >
                                                            {getCategoryName(place.categories)} ·{" "}
                                                            {place.area || "Tanpa area"}
                                                        </p>
                                                    </div>

                                                    <div
                                                        className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${place.is_published
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

                                                <div className="mt-4 flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(place)}
                                                        className={`flex-1 rounded-xl px-3 py-2 text-xs font-black transition ${form.id === place.id
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
                )}
            </section>

            <style jsx global>{`
        .input-cms {
          width: 100%;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          padding: 14px 16px;
          color: white;
          outline: none;
          transition: 0.2s ease;
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

function Panel({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 md:p-7">
            <h2 className="mb-6 text-2xl font-black">{title}</h2>
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
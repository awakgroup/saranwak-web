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
    categories?: {
        id: string;
        name: string;
        slug: string;
    } | null;
    place_tags?: {
        tag_id: string;
        tags?: Tag | null;
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
    opening_hours: string;
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
    opening_hours: "",
    is_featured: true,
    is_published: true,
    tag_ids: [],
};

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
            if (!result[type]) result[type] = [];
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
            opening_hours: place.opening_hours ?? "",
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
                    price_range: form.price_range,
                    opening_hours: form.opening_hours,
                    is_featured: form.is_featured,
                    is_published: form.is_published,
                    tag_ids: form.tag_ids,
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
                            Tambahkan, update, atau hapus coffee shop, resto, wisata, dan
                            tempat lainnya dari database Saranwak.
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
                                                onChange={(e) => updateField("name", e.target.value)}
                                                placeholder="Contoh: Kopi Saranwak"
                                                className="input-cms"
                                            />
                                        </Field>

                                        <Field label="Slug Optional">
                                            <input
                                                value={form.slug}
                                                onChange={(e) => updateField("slug", e.target.value)}
                                                placeholder="kopi-saranwak"
                                                className="input-cms"
                                            />
                                        </Field>
                                    </div>

                                    <Field label="Kategori">
                                        <select
                                            value={form.category_id}
                                            onChange={(e) =>
                                                updateField("category_id", e.target.value)
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
                                            onChange={(e) =>
                                                updateField("description", e.target.value)
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
                                            onChange={(e) => updateField("address", e.target.value)}
                                            placeholder="Alamat lengkap"
                                            rows={3}
                                            className="input-cms resize-none"
                                        />
                                    </Field>

                                    <div className="grid gap-5 md:grid-cols-2">
                                        <Field label="Area">
                                            <input
                                                value={form.area}
                                                onChange={(e) => updateField("area", e.target.value)}
                                                placeholder="Contoh: Padang Barat"
                                                className="input-cms"
                                            />
                                        </Field>

                                        <Field label="Kota">
                                            <input
                                                value={form.city}
                                                onChange={(e) => updateField("city", e.target.value)}
                                                placeholder="Padang"
                                                className="input-cms"
                                            />
                                        </Field>
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-2">
                                        <Field label="Range Harga">
                                            <input
                                                value={form.price_range}
                                                onChange={(e) =>
                                                    updateField("price_range", e.target.value)
                                                }
                                                placeholder="Rp20k - Rp50k"
                                                className="input-cms"
                                            />
                                        </Field>

                                        <Field label="Jam Buka">
                                            <input
                                                value={form.opening_hours}
                                                onChange={(e) =>
                                                    updateField("opening_hours", e.target.value)
                                                }
                                                placeholder="10.00 - 23.00"
                                                className="input-cms"
                                            />
                                        </Field>
                                    </div>
                                </Panel>

                                <Panel title="Media & Link">
                                    <Field label="Image URL">
                                        <input
                                            value={form.image_url}
                                            onChange={(e) =>
                                                updateField("image_url", e.target.value)
                                            }
                                            placeholder="https://..."
                                            className="input-cms"
                                        />
                                    </Field>

                                    <Field label="Google Maps URL">
                                        <input
                                            value={form.google_maps_url}
                                            onChange={(e) =>
                                                updateField("google_maps_url", e.target.value)
                                            }
                                            placeholder="https://maps.google.com/..."
                                            className="input-cms"
                                        />
                                    </Field>

                                    <Field label="Instagram URL">
                                        <input
                                            value={form.instagram_url}
                                            onChange={(e) =>
                                                updateField("instagram_url", e.target.value)
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
                                                onChange={(e) =>
                                                    updateField("is_published", e.target.checked)
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
                                                onChange={(e) =>
                                                    updateField("is_featured", e.target.checked)
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
                                                            {place.categories?.name ?? "Tanpa kategori"} ·{" "}
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
import type { FormEvent } from "react";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import { AdminField } from "@/components/admin/AdminField";
import { AdminPanel } from "@/components/admin/AdminPanel";
import type { Category, Characteristic, FormState, Tag } from "@/types/admin";
import {
    formatOpeningHours,
    formatPriceRange,
    getPreviewUrls,
    getTagTypeLabel,
    sortTagGroups,
} from "@/lib/admin-utils";

type UpdateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
) => void;

type PlaceFormProps = {
    form: FormState;
    categories: Category[];
    groupedTags: Record<string, Tag[]>;
    isEditMode: boolean;
    loadingSubmit: boolean;
    message: string;
    errorMessage: string;
    cleanCharacteristics: Characteristic[];
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onResetForm: () => void;
    updateField: UpdateField;
    updateCharacteristic: (
        index: number,
        key: keyof Characteristic,
        value: string
    ) => void;
    addCharacteristicField: () => void;
    removeCharacteristicField: (index: number) => void;
    updatePhotoUrl: (index: number, value: string) => void;
    addPhotoUrlField: () => void;
    removePhotoUrlField: (index: number) => void;
    toggleTag: (tagId: string) => void;
};

export function PlaceForm({
    form,
    categories,
    groupedTags,
    isEditMode,
    loadingSubmit,
    message,
    errorMessage,
    cleanCharacteristics,
    onSubmit,
    onResetForm,
    updateField,
    updateCharacteristic,
    addCharacteristicField,
    removeCharacteristicField,
    updatePhotoUrl,
    addPhotoUrlField,
    removePhotoUrlField,
    toggleTag,
}: PlaceFormProps) {
    const previewPhotoUrls = getPreviewUrls(form.photo_urls);

    const mainImagePreviewUrl = form.image_url.trim()
        ? getSafePlaceImageUrl(form.image_url)
        : "";

    const galleryPreviewUrls = previewPhotoUrls.map((url) =>
        getSafePlaceImageUrl(url)
    );

    return (
        <form onSubmit={onSubmit} className="space-y-5 sm:space-y-6">
            <AdminPanel title="Data Utama">
                {isEditMode ? (
                    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm font-bold text-amber-200">
                        Mode edit: {form.name}
                    </div>
                ) : null}

                <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                    <AdminField label="Nama Tempat">
                        <input
                            value={form.name}
                            onChange={(event) => updateField("name", event.target.value)}
                            placeholder="Contoh: Kopi Saranwak"
                            className="input-cms"
                        />
                    </AdminField>

                    <AdminField label="Slug Optional">
                        <input
                            value={form.slug}
                            onChange={(event) => updateField("slug", event.target.value)}
                            placeholder="kopi-saranwak"
                            className="input-cms"
                        />
                    </AdminField>
                </div>

                <AdminField label="Kategori">
                    <select
                        value={form.category_id}
                        onChange={(event) =>
                            updateField("category_id", event.target.value)
                        }
                        className="input-cms"
                    >
                        {categories.length === 0 ? (
                            <option value="" className="bg-neutral-900">
                                Belum ada kategori
                            </option>
                        ) : null}

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
                </AdminField>

                <AdminField label="Deskripsi">
                    <textarea
                        value={form.description}
                        onChange={(event) => updateField("description", event.target.value)}
                        placeholder="Deskripsi singkat tempat..."
                        rows={5}
                        className="input-cms resize-none"
                    />
                </AdminField>

                <div>
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm font-bold text-neutral-300">
                                Karakteristik & Keunggulan
                            </p>

                            <p className="mt-1 text-xs font-bold leading-5 text-neutral-500">
                                Setiap item punya judul dan subjudul. Judul akan tampil bold di
                                halaman detail, subjudul tampil normal. Kalau kosong, section
                                ini tidak akan tampil.
                            </p>
                        </div>

                        <span className="w-fit shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs font-black text-neutral-400">
                            {cleanCharacteristics.length} item
                        </span>
                    </div>

                    <div className="space-y-4">
                        {form.characteristics.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4"
                            >
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                                        Item {index + 1}
                                    </p>

                                    {form.characteristics.length > 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => removeCharacteristicField(index)}
                                            className="rounded-full border border-red-400/20 px-3 py-1 text-xs font-black text-red-300 transition hover:bg-red-400/10"
                                        >
                                            Hapus
                                        </button>
                                    ) : null}
                                </div>

                                <div className="grid gap-3">
                                    <input
                                        value={item.title}
                                        onChange={(event) =>
                                            updateCharacteristic(index, "title", event.target.value)
                                        }
                                        placeholder="Judul. Contoh: Pengalaman Slow Bar yang Intim"
                                        className="input-cms"
                                    />

                                    <textarea
                                        value={item.description}
                                        onChange={(event) =>
                                            updateCharacteristic(
                                                index,
                                                "description",
                                                event.target.value
                                            )
                                        }
                                        placeholder="Subjudul/deskripsi. Contoh: Fokus utama di sini adalah interaksi dekat antara barista dan penikmat kopi."
                                        rows={3}
                                        className="input-cms resize-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addCharacteristicField}
                        disabled={form.characteristics.length >= 20}
                        className="mt-4 w-full rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 sm:w-fit"
                    >
                        + Tambah Karakteristik
                    </button>

                    {cleanCharacteristics.length > 0 ? (
                        <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                            <p className="text-sm font-black text-white">
                                Preview Karakteristik
                            </p>

                            <div className="mt-3 space-y-2">
                                {cleanCharacteristics.map((characteristic, index) => (
                                    <div
                                        key={`${characteristic.title}-${index}`}
                                        className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                                    >
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-black">
                                            {index + 1}
                                        </span>

                                        <div>
                                            {characteristic.title ? (
                                                <p className="text-sm font-black leading-6 text-neutral-100">
                                                    {characteristic.title}
                                                </p>
                                            ) : null}

                                            {characteristic.description ? (
                                                <p className="mt-1 text-sm font-medium leading-6 text-neutral-400">
                                                    {characteristic.description}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </AdminPanel>

            <AdminPanel title="Lokasi & Detail">
                <AdminField label="Alamat">
                    <textarea
                        value={form.address}
                        onChange={(event) => updateField("address", event.target.value)}
                        placeholder="Alamat lengkap"
                        rows={3}
                        className="input-cms resize-none"
                    />
                </AdminField>

                <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                    <AdminField label="Area">
                        <input
                            value={form.area}
                            onChange={(event) => updateField("area", event.target.value)}
                            placeholder="Contoh: Padang Barat"
                            className="input-cms"
                        />
                    </AdminField>

                    <AdminField label="Kota">
                        <input
                            value={form.city}
                            onChange={(event) => updateField("city", event.target.value)}
                            placeholder="Padang"
                            className="input-cms"
                        />
                    </AdminField>
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
                            {formatPriceRange(form.price_min_input, form.price_max_input) ||
                                "Belum ada info"}
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
            </AdminPanel>

            <AdminPanel title="Media & Link">
                <AdminField label="Image URL">
                    <input
                        value={form.image_url}
                        onChange={(event) => updateField("image_url", event.target.value)}
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
                        Bisa pakai Google Drive public link, Unsplash, Cloudinary, ImageKit,
                        atau direct image URL.
                    </p>
                </AdminField>

                <div>
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm font-bold text-neutral-300">
                                Gallery Photo URLs
                            </p>

                            <p className="mt-1 text-xs font-bold leading-5 text-neutral-500">
                                Default 1 foto, bisa tambah sampai maksimal 5 foto. Bisa pakai
                                Google Drive public link, direct image URL, Unsplash, Cloudinary,
                                atau ImageKit.
                            </p>
                        </div>

                        <span className="w-fit shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs font-black text-neutral-400">
                            {form.photo_urls.length}/5
                        </span>
                    </div>

                    <div className="space-y-3">
                        {form.photo_urls.map((url, index) => (
                            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_auto]">
                                <input
                                    value={url}
                                    onChange={(event) => updatePhotoUrl(index, event.target.value)}
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
                                <p className="text-sm font-black text-white">Preview Gallery</p>

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

                <AdminField label="Google Maps URL">
                    <input
                        value={form.google_maps_url}
                        onChange={(event) =>
                            updateField("google_maps_url", event.target.value)
                        }
                        placeholder="https://maps.google.com/..."
                        className="input-cms"
                    />
                </AdminField>

                <AdminField label="Instagram URL">
                    <input
                        value={form.instagram_url}
                        onChange={(event) =>
                            updateField("instagram_url", event.target.value)
                        }
                        placeholder="https://instagram.com/..."
                        className="input-cms"
                    />
                </AdminField>
            </AdminPanel>

            <AdminPanel title="Publish & Tags">
                <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div>
                            <p className="font-bold">Published</p>
                            <p className="text-sm text-neutral-500">Tampilkan di website</p>
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
                            {sortTagGroups(Object.entries(groupedTags)).map(
                                ([type, tagList]) => (
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
                                )
                            )}
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
                            onClick={onResetForm}
                            className="rounded-2xl border border-white/10 px-5 py-4 text-sm font-black text-white transition hover:bg-white/10"
                        >
                            Batal Edit
                        </button>
                    ) : null}
                </div>
            </AdminPanel>
        </form>
    );
}
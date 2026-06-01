"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { PlaceForm } from "@/components/admin/PlaceForm";
import {
    PlaceListPanel,
    type PlaceSortOption,
    type PlaceStatusFilter,
} from "@/components/admin/PlaceListPanel";
import type {
    AdminPlace,
    AdminTab,
    Category,
    Characteristic,
    FormState,
    Tag,
} from "@/types/admin";

import {
    formatOpeningHours,
    formatPriceRange,
    generateSlug,
    getCategoryName,
    getCleanCharacteristics,
    getInvalidGalleryImageUrls,
    initialAdminForm,
    isValidGoogleMapsUrl,
    isValidImageUrl,
    isValidInstagramUrl,
    normalizeCharacteristics,
    parseOpeningHours,
    parsePriceRange,
} from "@/lib/admin-utils";

type AdminPlacesResponse = {
    success?: boolean;
    message?: string;
    categories?: Category[];
    tags?: Tag[];
    places?: AdminPlace[];
};

type AdminMutationResponse = {
    success?: boolean;
    message?: string;
};

async function parseAdminPlacesResponse(
    response: Response
): Promise<AdminPlacesResponse> {
    try {
        return (await response.json()) as AdminPlacesResponse;
    } catch {
        return {
            success: false,
            message: "Response CMS tidak valid.",
        };
    }
}

async function parseAdminMutationResponse(
    response: Response
): Promise<AdminMutationResponse> {
    try {
        return (await response.json()) as AdminMutationResponse;
    } catch {
        return {
            success: false,
            message: "Response CMS tidak valid.",
        };
    }
}

export default function AdminPage() {
    const router = useRouter();

    const [form, setForm] = useState<FormState>(initialAdminForm);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [places, setPlaces] = useState<AdminPlace[]>([]);

    const [loadingMeta, setLoadingMeta] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingDeleteId, setLoadingDeleteId] = useState("");

    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    const [activeTab, setActiveTab] = useState<AdminTab>("places");

    const [placeSearch, setPlaceSearch] = useState("");
    const [placeStatusFilter, setPlaceStatusFilter] =
        useState<PlaceStatusFilter>("all");
    const [placeSort, setPlaceSort] = useState<PlaceSortOption>("newest");

    const isEditMode = Boolean(form.id);
    const cleanCharacteristics = getCleanCharacteristics(form.characteristics);

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

    const placeSummary = useMemo(() => {
        const live = places.filter((place) => place.is_published).length;
        const draft = places.filter((place) => !place.is_published).length;
        const featured = places.filter((place) => place.is_featured).length;

        return {
            total: places.length,
            live,
            draft,
            featured,
        };
    }, [places]);

    const filteredPlaces = useMemo(() => {
        const keyword = placeSearch.toLowerCase().trim();

        return places
            .filter((place) => {
                if (!keyword) return true;

                const searchableText = [
                    place.name,
                    place.slug,
                    place.area,
                    place.city,
                    place.price_range,
                    getCategoryName(place.categories),
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(keyword);
            })
            .filter((place) => {
                if (placeStatusFilter === "all") return true;
                if (placeStatusFilter === "live") return place.is_published;
                if (placeStatusFilter === "draft") return !place.is_published;
                if (placeStatusFilter === "featured") return place.is_featured;

                return true;
            })
            .slice()
            .sort((a, b) => {
                if (placeSort === "name_asc") {
                    return a.name.localeCompare(b.name);
                }

                if (placeSort === "featured_first") {
                    return Number(b.is_featured) - Number(a.is_featured);
                }

                if (placeSort === "draft_first") {
                    return Number(a.is_published) - Number(b.is_published);
                }

                return (
                    new Date(b.created_at ?? 0).getTime() -
                    new Date(a.created_at ?? 0).getTime()
                );
            });
    }, [places, placeSearch, placeStatusFilter, placeSort]);

    async function loadMeta() {
        try {
            setLoadingMeta(true);

            const response = await fetch("/api/admin/places", {
                cache: "no-store",
            });

            const result = await parseAdminPlacesResponse(response);

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
        setForm((prev) => {
            const nextForm = {
                ...prev,
                [key]: value,
            };

            if (key === "slug") {
                setIsSlugManuallyEdited(true);

                return {
                    ...nextForm,
                    slug: generateSlug(String(value)),
                };
            }

            if (key === "name" && !isSlugManuallyEdited) {
                return {
                    ...nextForm,
                    slug: generateSlug(String(value)),
                };
            }

            return nextForm;
        });
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

    function updateCharacteristic(
        index: number,
        key: keyof Characteristic,
        value: string
    ) {
        setForm((prev) => ({
            ...prev,
            characteristics: prev.characteristics.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                        ...item,
                        [key]: value,
                    }
                    : item
            ),
        }));
    }

    function addCharacteristicField() {
        setForm((prev) => {
            if (prev.characteristics.length >= 20) return prev;

            return {
                ...prev,
                characteristics: [
                    ...prev.characteristics,
                    {
                        title: "",
                        description: "",
                    },
                ],
            };
        });
    }

    function removeCharacteristicField(index: number) {
        setForm((prev) => {
            const nextCharacteristics = prev.characteristics.filter(
                (_, itemIndex) => itemIndex !== index
            );

            return {
                ...prev,
                characteristics:
                    nextCharacteristics.length > 0
                        ? nextCharacteristics
                        : [
                            {
                                title: "",
                                description: "",
                            },
                        ],
            };
        });
    }

    function handleEdit(place: AdminPlace) {
        setMessage("");
        setErrorMessage("");
        setActiveTab("places");
        setIsSlugManuallyEdited(true);

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
            characteristics: normalizeCharacteristics(place.characteristics),
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
            ...initialAdminForm,
            category_id: categories[0]?.id ?? "",
        });

        setIsSlugManuallyEdited(false);
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

        const priceMin = form.price_min_input ? Number(form.price_min_input) : null;
        const priceMax = form.price_max_input ? Number(form.price_max_input) : null;

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

        if (!isValidImageUrl(form.image_url)) {
            setErrorMessage(
                "Image URL tidak valid. Gunakan link gambar langsung, Unsplash, Google Drive public, Cloudinary, ImageKit, atau Supabase Storage."
            );
            return;
        }

        if (!isValidGoogleMapsUrl(form.google_maps_url)) {
            setErrorMessage(
                "Google Maps URL tidak valid. Gunakan link dari Google Maps, maps.google.com, atau maps.app.goo.gl."
            );
            return;
        }

        if (!isValidInstagramUrl(form.instagram_url)) {
            setErrorMessage("Instagram URL tidak valid. Gunakan link dari instagram.com.");
            return;
        }

        const invalidGalleryUrls = getInvalidGalleryImageUrls(form.photo_urls);

        if (invalidGalleryUrls.length > 0) {
            setErrorMessage(`Ada URL gallery yang tidak valid: ${invalidGalleryUrls[0]}`);
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
                    slug: form.slug || generateSlug(form.name),
                    category_id: form.category_id,
                    description: form.description,
                    characteristics: cleanCharacteristics,
                    address: form.address,
                    area: form.area,
                    city: form.city,
                    image_url: form.image_url.trim(),
                    google_maps_url: form.google_maps_url.trim(),
                    instagram_url: form.instagram_url.trim(),
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

            const result = await parseAdminMutationResponse(response);

            if (!response.ok) {
                throw new Error(result.message || "Gagal menyimpan tempat.");
            }

            setMessage(result.message || "Data berhasil disimpan.");

            setForm((prev) => ({
                ...initialAdminForm,
                category_id: prev.category_id || categories[0]?.id || "",
            }));

            setIsSlugManuallyEdited(false);

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
            `Hapus "${place.name}"? Data ini akan dinonaktifkan dari CMS dan website.`
        );

        if (!confirmed) return;

        try {
            setLoadingDeleteId(place.id);

            const response = await fetch(`/api/admin/places?id=${place.id}`, {
                method: "DELETE",
            });

            const result = await parseAdminMutationResponse(response);

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
                <AdminHeader
                    activeTab={activeTab}
                    isEditMode={isEditMode}
                    onLogout={handleLogout}
                />

                <AdminTabs activeTab={activeTab} onChange={setActiveTab} />

                {loadingMeta ? (
                    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 text-sm text-neutral-300 sm:rounded-[28px] sm:p-8">
                        Loading CMS...
                    </div>
                ) : (
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                        <div className="min-w-0 space-y-5 sm:space-y-6">
                            <PlaceForm
                                form={form}
                                categories={categories}
                                groupedTags={groupedTags}
                                isEditMode={isEditMode}
                                loadingSubmit={loadingSubmit}
                                message={message}
                                errorMessage={errorMessage}
                                cleanCharacteristics={cleanCharacteristics}
                                onSubmit={handleSubmit}
                                onResetForm={resetForm}
                                updateField={updateField}
                                updateCharacteristic={updateCharacteristic}
                                addCharacteristicField={addCharacteristicField}
                                removeCharacteristicField={removeCharacteristicField}
                                updatePhotoUrl={updatePhotoUrl}
                                addPhotoUrlField={addPhotoUrlField}
                                removePhotoUrlField={removePhotoUrlField}
                                toggleTag={toggleTag}
                            />
                        </div>

                        <PlaceListPanel
                            places={places}
                            filteredPlaces={filteredPlaces}
                            selectedPlaceId={form.id}
                            placeSummary={placeSummary}
                            placeSearch={placeSearch}
                            placeStatusFilter={placeStatusFilter}
                            placeSort={placeSort}
                            loadingDeleteId={loadingDeleteId}
                            onRefresh={loadMeta}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onSearchChange={setPlaceSearch}
                            onStatusFilterChange={setPlaceStatusFilter}
                            onSortChange={setPlaceSort}
                            onResetFilter={() => {
                                setPlaceSearch("");
                                setPlaceStatusFilter("all");
                                setPlaceSort("newest");
                            }}
                        />
                    </div>
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
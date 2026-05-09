import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const COOKIE_NAME = "saranwak_admin_session";

function getCookieValue(cookieHeader: string | null, cookieName: string) {
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());

    for (const cookie of cookies) {
        const [name, ...rest] = cookie.split("=");

        if (name === cookieName) {
            return decodeURIComponent(rest.join("="));
        }
    }

    return null;
}

function checkAdminSession(request: Request) {
    const session = getCookieValue(request.headers.get("cookie"), COOKIE_NAME);
    return session === process.env.ADMIN_SESSION_TOKEN;
}

function makeSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export async function GET() {
    try {
        const [categoriesResult, tagsResult, placesResult] = await Promise.all([
            supabaseAdmin
                .from("categories")
                .select("id, name, slug")
                .eq("is_active", true)
                .order("sort_order", { ascending: true }),

            supabaseAdmin
                .from("tags")
                .select("id, name, slug, type")
                .eq("is_active", true)
                .order("sort_order", { ascending: true }),

            supabaseAdmin
                .from("places")
                .select(
                    `
          id,
          category_id,
          name,
          slug,
          description,
          address,
          area,
          city,
          image_url,
          google_maps_url,
          instagram_url,
          price_range,
          opening_hours,
          is_featured,
          is_published,
          created_at,
          categories (
            id,
            name,
            slug
          ),
          place_tags (
            tag_id,
            tags (
              id,
              name,
              slug,
              type
            )
          )
        `
                )
                .order("created_at", { ascending: false }),
        ]);

        if (categoriesResult.error) {
            return NextResponse.json(
                { message: categoriesResult.error.message },
                { status: 500 }
            );
        }

        if (tagsResult.error) {
            return NextResponse.json(
                { message: tagsResult.error.message },
                { status: 500 }
            );
        }

        if (placesResult.error) {
            return NextResponse.json(
                { message: placesResult.error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            categories: categoriesResult.data ?? [],
            tags: tagsResult.data ?? [],
            places: placesResult.data ?? [],
        });
    } catch (error) {
        console.error("GET /api/admin/places error:", error);

        return NextResponse.json(
            { message: "Failed to load CMS data" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        if (!checkAdminSession(request)) {
            return NextResponse.json(
                { message: "Unauthorized. Silakan login ulang." },
                { status: 401 }
            );
        }

        const body = await request.json();

        const name = String(body.name ?? "").trim();
        const categoryId = String(body.category_id ?? "").trim();

        if (!name) {
            return NextResponse.json(
                { message: "Nama tempat wajib diisi." },
                { status: 400 }
            );
        }

        if (!categoryId) {
            return NextResponse.json(
                { message: "Kategori wajib dipilih." },
                { status: 400 }
            );
        }

        const slug = body.slug?.trim() ? makeSlug(body.slug) : makeSlug(name);

        const { data: place, error: placeError } = await supabaseAdmin
            .from("places")
            .insert({
                category_id: categoryId,
                name,
                slug,
                description: body.description || null,
                address: body.address || null,
                area: body.area || null,
                city: body.city || "Padang",
                image_url: body.image_url || null,
                google_maps_url: body.google_maps_url || null,
                instagram_url: body.instagram_url || null,
                price_range: body.price_range || null,
                opening_hours: body.opening_hours || null,
                is_featured: Boolean(body.is_featured),
                is_published: Boolean(body.is_published),
                updated_at: new Date().toISOString(),
            })
            .select("id, name, slug")
            .single();

        if (placeError) {
            console.error("Supabase place insert error:", {
                message: placeError.message,
                details: placeError.details,
                hint: placeError.hint,
                code: placeError.code,
            });

            return NextResponse.json(
                {
                    message: placeError.message,
                    details: placeError.details,
                    hint: placeError.hint,
                    code: placeError.code,
                },
                { status: 500 }
            );
        }

        const tagIds: string[] = Array.isArray(body.tag_ids) ? body.tag_ids : [];

        if (tagIds.length > 0) {
            const { error: tagError } = await supabaseAdmin
                .from("place_tags")
                .insert(
                    tagIds.map((tagId) => ({
                        place_id: place.id,
                        tag_id: tagId,
                    }))
                );

            if (tagError) {
                return NextResponse.json(
                    {
                        message:
                            "Tempat berhasil dibuat, tapi tags gagal disimpan: " +
                            tagError.message,
                        place,
                    },
                    { status: 207 }
                );
            }
        }

        return NextResponse.json({
            message: "Tempat berhasil ditambahkan.",
            place,
        });
    } catch (error) {
        console.error("POST /api/admin/places error:", error);

        return NextResponse.json(
            { message: "Failed to create place" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        if (!checkAdminSession(request)) {
            return NextResponse.json(
                { message: "Unauthorized. Silakan login ulang." },
                { status: 401 }
            );
        }

        const body = await request.json();

        const placeId = String(body.id ?? "").trim();
        const name = String(body.name ?? "").trim();
        const categoryId = String(body.category_id ?? "").trim();

        if (!placeId) {
            return NextResponse.json(
                { message: "ID tempat wajib ada untuk update." },
                { status: 400 }
            );
        }

        if (!name) {
            return NextResponse.json(
                { message: "Nama tempat wajib diisi." },
                { status: 400 }
            );
        }

        if (!categoryId) {
            return NextResponse.json(
                { message: "Kategori wajib dipilih." },
                { status: 400 }
            );
        }

        const slug = body.slug?.trim() ? makeSlug(body.slug) : makeSlug(name);

        const { data: place, error: placeError } = await supabaseAdmin
            .from("places")
            .update({
                category_id: categoryId,
                name,
                slug,
                description: body.description || null,
                address: body.address || null,
                area: body.area || null,
                city: body.city || "Padang",
                image_url: body.image_url || null,
                google_maps_url: body.google_maps_url || null,
                instagram_url: body.instagram_url || null,
                price_range: body.price_range || null,
                opening_hours: body.opening_hours || null,
                is_featured: Boolean(body.is_featured),
                is_published: Boolean(body.is_published),
                updated_at: new Date().toISOString(),
            })
            .eq("id", placeId)
            .select("id, name, slug")
            .single();

        if (placeError) {
            console.error("Supabase place update error:", {
                message: placeError.message,
                details: placeError.details,
                hint: placeError.hint,
                code: placeError.code,
            });

            return NextResponse.json(
                {
                    message: placeError.message,
                    details: placeError.details,
                    hint: placeError.hint,
                    code: placeError.code,
                },
                { status: 500 }
            );
        }

        const tagIds: string[] = Array.isArray(body.tag_ids) ? body.tag_ids : [];

        const { error: deleteTagError } = await supabaseAdmin
            .from("place_tags")
            .delete()
            .eq("place_id", placeId);

        if (deleteTagError) {
            return NextResponse.json(
                {
                    message: "Tempat berhasil diupdate, tapi gagal reset tags: " + deleteTagError.message,
                },
                { status: 500 }
            );
        }

        if (tagIds.length > 0) {
            const { error: insertTagError } = await supabaseAdmin
                .from("place_tags")
                .insert(
                    tagIds.map((tagId) => ({
                        place_id: placeId,
                        tag_id: tagId,
                    }))
                );

            if (insertTagError) {
                return NextResponse.json(
                    {
                        message:
                            "Tempat berhasil diupdate, tapi tags gagal disimpan: " +
                            insertTagError.message,
                        place,
                    },
                    { status: 207 }
                );
            }
        }

        return NextResponse.json({
            message: "Tempat berhasil diupdate.",
            place,
        });
    } catch (error) {
        console.error("PATCH /api/admin/places error:", error);

        return NextResponse.json(
            { message: "Failed to update place" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        if (!checkAdminSession(request)) {
            return NextResponse.json(
                { message: "Unauthorized. Silakan login ulang." },
                { status: 401 }
            );
        }

        const url = new URL(request.url);
        const placeId = url.searchParams.get("id");

        if (!placeId) {
            return NextResponse.json(
                { message: "ID tempat wajib ada untuk delete." },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from("places")
            .delete()
            .eq("id", placeId);

        if (error) {
            console.error("Supabase place delete error:", {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
            });

            return NextResponse.json(
                {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Tempat berhasil dihapus.",
        });
    } catch (error) {
        console.error("DELETE /api/admin/places error:", error);

        return NextResponse.json(
            { message: "Failed to delete place" },
            { status: 500 }
        );
    }
}
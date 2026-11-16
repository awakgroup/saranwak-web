type Env = {
    DB: D1Database;
};

type PlaceRow = {
    id: string;
    name: string;
    slug: string;
    short_description: string | null;
    category_id: string | null;
    area: string | null;
    city: string | null;
    price_min: number | null;
    price_max: number | null;
    price_range: string | null;
    image_url: string | null;
    opening_hours: string | null;
    is_featured: number;
    is_active: number;
    created_at: string;
    updated_at: string;
    category_name: string | null;
    category_slug: string | null;
};

type TagRow = {
    place_id: string;
    id: string;
    name: string;
    slug: string;
    type: string;
};

type CompactTag = {
    id: string;
    name: string;
    slug: string;
    type: string;
};

type ApiResponse = {
    success: boolean;
    data?: unknown;
    message?: string;
};

let hasEnsuredBatAndArrow = false;

async function ensureBatAndArrow(db: D1Database) {
    if (hasEnsuredBatAndArrow) return;
    try {
        const existing = await db.prepare("SELECT id FROM places WHERE slug = 'bat-and-arrow'").first();
        const mainPhotoUrl = 'https://drive.google.com/file/d/1HriYF7IUZ6UxnOUBrdrpc39rdU5mdceU/view?usp=drive_link';

        if (!existing) {
            await db.prepare(`
                INSERT OR IGNORE INTO places (
                  id, name, slug, description, short_description, characteristics,
                  category_id, address, area, city, price_min, price_max, price_range,
                  image_url, instagram_url, google_maps_url, whatsapp_url, website_url,
                  opening_hours, is_featured, is_active, created_at, updated_at
                ) VALUES (
                  'e9a8f211-54b3-4f91-8d26-724bc2f8a801',
                  'Bat & Arrow',
                  'bat-and-arrow',
                  'Menempati bangunan cagar budaya bekas gudang kolonial Belanda di tepi muara Batang Arau, Bat & Arrow (sering disebut Bat and Row) menghadirkan perpaduan unik antara kedai kopi, restoran, dan open-air beer garden berkonsep rustic-industrial dengan atmosfer tropis ala Bali. Menjadi salah satu magnet nongkrong dan nightlife paling ikonik di Kota Padang, tempat ini menawarkan pemandangan langsung ke aliran sungai, perahu nelayan, serta gemerlap senja menuju Jembatan Siti Nurbaya.',
                  'Kafe, resto & beer garden (Bat and Row) berkonsep heritage industrial tepi sungai Batang Arau dekat Jembatan Siti Nurbaya.',
                  '[{"title":"Riverside View Sungai Batang Arau","description":"Menghadap langsung ke dermaga perahu tradisional dan panorama senja memukau di muara Batang Arau menuju Jembatan Siti Nurbaya."},{"title":"Arsitektur Heritage Bekas Gudang Kolonial","description":"Revitalisasi gudang tua peninggalan Belanda dengan pilar bata ekspos kokoh dan sentuhan tropical beer garden yang estetik."},{"title":"Pusat Nightlife & Hangout Ikonik","description":"Atmosfer malam yang hidup dengan hiburan live music, meja biliar, dan menjadi titik temu favorit wisatawan lokal maupun mancanegara."},{"title":"Ragam Menu Western, Pizza & Minuman Lengkap","description":"Menyajikan artisan pizza, burger, aneka pasta, makanan Meksiko, sajian kopi, mocktail segar, hingga varian minuman lengkap."},{"title":"Area Semi-Outdoor Sejuk untuk Sunset Chill","description":"Area duduk terbuka yang lapang dengan hembusan angin sungai yang sejuk, sangat pas untuk santai sore, me-time, maupun nge-date."}]',
                  '3fff9d59-eb4d-4d58-a3fd-0b94ee412ee5',
                  'Jl. Batang Arau No. 25-28, Batang Arau, Kec. Padang Selatan, Kota Padang, Sumatera Barat 25118',
                  'Padang Selatan',
                  'Padang',
                  25000,
                  85000,
                  'Rp25k - Rp85k',
                  ?,
                  'https://www.instagram.com/batandarrow_official/',
                  'https://www.google.com/maps/search/?api=1&query=Bat+%26+Arrow+Padang',
                  NULL,
                  NULL,
                  'Senin - Jumat 14.00 - 23.30, Sabtu 16.00 - 02.00 WIB',
                  1,
                  1,
                  '2026-11-16 10:45:00+00',
                  '2026-11-16 10:45:00+00'
                )
            `).bind(mainPhotoUrl).run();

            const tagIds = [
                'd32ddb31-b92b-4968-8f57-94834f873f41',
                '770dd8a2-9cc8-4fde-abdb-b4bf3307a45d',
                '338d18a9-d869-46be-9e99-f7bffcc9820f',
                '6a8e1d9e-88fb-48aa-a9c1-5a68935dc297',
                'd30f0c87-4384-474d-ae52-976300282f7a',
                'd0765037-ba39-4f2b-90cd-a536a9cd46c9',
                '5b4daff9-8fcd-4799-b23e-cf80a41f3376',
                'b50b3f65-221b-4414-a95b-3f861176d5f9',
                'b92499b7-880d-4c02-8aac-a4073c213a4c',
                'd4d6cb33-3692-4482-9450-bcebd328fd96',
            ];
            for (const tagId of tagIds) {
                await db.prepare('INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES (?, ?)')
                    .bind('e9a8f211-54b3-4f91-8d26-724bc2f8a801', tagId)
                    .run();
            }
        }

        // Always ensure image_url is set
        await db.prepare("UPDATE places SET image_url = ? WHERE slug = 'bat-and-arrow' AND (image_url IS NULL OR image_url = '')")
            .bind(mainPhotoUrl)
            .run();
    } catch {
        // Ignored
    }
    hasEnsuredBatAndArrow = true;
}

let hasEnsuredKamtumi = false;

async function ensureKamtumi(db: D1Database) {
    if (hasEnsuredKamtumi) return;
    try {
        const existing = await db.prepare("SELECT id FROM places WHERE slug = 'kamtumi-coffee'").first();
        const mainPhotoUrl = 'https://drive.google.com/file/d/107fx1KQ3EusFiJ7hPdDgmQX6R7crKlqr/view?usp=drive_link';

        if (!existing) {
            await db.prepare(`
                INSERT OR IGNORE INTO places (
                  id, name, slug, description, short_description, characteristics,
                  category_id, address, area, city, price_min, price_max, price_range,
                  image_url, instagram_url, google_maps_url, whatsapp_url, website_url,
                  opening_hours, is_featured, is_active, created_at, updated_at
                ) VALUES (
                  'c7a10f82-913a-4e2b-bb81-18f9e61234a1',
                  'Kamtumi Coffee',
                  'kamtumi-coffee',
                  'Berlokasi di kawasan strategis Ujung Gurun, Kamtumi Coffee mengusung konsep industrial minimalis dengan sentuhan vintage yang hangat dan estetik. Menawarkan area indoor ber-AC yang tenang dan ramah laptop untuk Work From Cafe (WFC), serta area semi-outdoor sejuk untuk nongkrong santai. Menyajikan aneka racikan kopi susu khas, artisan tea, hingga makanan pengganjal lapar dari pagi hingga tengah malam.',
                  'Coffee shop bernuansa industrial vintage di Ujung Gurun yang nyaman untuk WFC, nugas, dan nongkrong malam.',
                  '[{"title":"Spot Favorit WFC & Nugas di Pusat Kota","description":"Didesain dengan meja ergonomis, pencahayaan nyaman, koneksi WiFi stabil, dan colokan listrik memadai untuk bekerja atau mengerjakan tugas berjam-jam."},{"title":"Zonasi Ruang Indoor AC & Semi-Outdoor","description":"Menyediakan ruang indoor ber-AC bebas asap rokok yang adem untuk fokus, serta teras semi-outdoor yang asri untuk merokok dan mengobrol santai."},{"title":"Jam Buka Panjang (08.00 - 00.00 WIB)","description":"Menjadi andalan bagi penikmat kopi pagi sebelum mulai beraktivitas hingga tempat berkumpul santai di larut malam."},{"title":"Signature Kopi Susu & Minuman Kekinian","description":"Terkenal dengan racikan Es Kopi Susu Kamtumi, Kopi Susu Krimi, Seasalt Butterscotch, hingga Cheese Cream Series yang lembut."},{"title":"Pilihan Makanan & Cemilan Beragam","description":"Menyajikan aneka pasta seperti Spaghetti Carbonara & Bolognese, Risol Beef Mayo, Keju Aroma, dan cemilan gurih pendamping ngopi."}]',
                  '3fff9d59-eb4d-4d58-a3fd-0b94ee412ee5',
                  'Jl. Ujung Gurun No. 152, Ujung Gurun, Kec. Padang Barat, Kota Padang, Sumatera Barat 25114',
                  'Padang Barat',
                  'Padang',
                  20000,
                  45000,
                  'Rp20k - Rp45k',
                  ?,
                  'https://www.instagram.com/kamtumicoffee/',
                  'https://www.google.com/maps/search/?api=1&query=Kamtumi+Coffee+Padang',
                  NULL,
                  NULL,
                  'Buka Setiap Hari 08.00 - 00.00 WIB',
                  0,
                  1,
                  '2026-11-16 11:38:00+00',
                  '2026-11-16 11:38:00+00'
                )
            `).bind(mainPhotoUrl).run();

            const tagIds = [
                '0dee3434-90df-45e7-855f-b896c866762c',
                '48b8f0d3-830a-4011-8f40-2bf22a1cb91b',
                '1318851f-58c0-413a-bbef-c9fc99ab56b2',
                '6ba823b6-24f3-4385-8d59-67e019ba002b',
                'b50b3f65-221b-4414-a95b-3f861176d5f9',
                '0ea4a96b-179f-4632-9afc-ef98cdd9cb1b',
                '770dd8a2-9cc8-4fde-abdb-b4bf3307a45d',
                'd32ddb31-b92b-4968-8f57-94834f873f41',
                'd30f0c87-4384-474d-ae52-976300282f7a',
                'd0765037-ba39-4f2b-90cd-a536a9cd46c9',
                'b92499b7-880d-4c02-8aac-a4073c213a4c',
                'd4d6cb33-3692-4482-9450-bcebd328fd96',
            ];
            for (const tagId of tagIds) {
                await db.prepare('INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES (?, ?)')
                    .bind('c7a10f82-913a-4e2b-bb81-18f9e61234a1', tagId)
                    .run();
            }
        }

        // Always ensure image_url is set
        await db.prepare("UPDATE places SET image_url = ? WHERE slug = 'kamtumi-coffee' AND (image_url IS NULL OR image_url = '')")
            .bind(mainPhotoUrl)
            .run();
    } catch {
        // Ignored
    }
    hasEnsuredKamtumi = true;
}

let hasEnsuredLalitoAndKubik = false;

async function ensureLalitoAndKubik(db: D1Database) {
    if (hasEnsuredLalitoAndKubik) return;
    try {
        // 1. Lalito Coffee Bar
        const existingLalito = await db.prepare("SELECT id FROM places WHERE slug = 'lalito-coffee'").first();
        const lalitoPhotoUrl = 'https://drive.google.com/file/d/1YswnlvrIo3ueCnF6C-iVI7GuckmZaPpe/view?usp=drive_link';

        if (!existingLalito) {
            await db.prepare(`
                INSERT OR IGNORE INTO places (
                  id, name, slug, description, short_description, characteristics,
                  category_id, address, area, city, price_min, price_max, price_range,
                  image_url, instagram_url, google_maps_url, whatsapp_url, website_url,
                  opening_hours, is_featured, is_active, created_at, updated_at
                ) VALUES (
                  'fa320b12-9c44-486a-8b1e-7f610a123001',
                  'Lalito Coffee Bar',
                  'lalito-coffee',
                  'Menjadi salah satu destinasi utama bagi penikmat kopi sejati di Kota Padang, Lalito Coffee Bar & Roastery menghadirkan pengalaman menikmati kopi artisanal dengan kurasi biji kopi lokal unggulan Sumatera Barat seperti Solok Radjo, Situjuh, dan Kerinci. Menempati ruang bernuansa industrial warm yang intim, tempat ini sangat cocok untuk slow-bar coffee tasting, me-time, maupun obrolan mendalam bersama teman.',
                  'Specialty coffee bar & in-house roastery bernuansa industrial warm dengan kurasi beans terbaik Sumatera Barat.',
                  '[{"title":"In-House Roastery & Specialty Beans","description":"Menyangrai sendiri biji kopi pilihan dengan profil sangrai presisi, menyajikan deretan single origin terbaik lokal Sumbar hingga nusantara."},{"title":"Artisan Manual Brew Slow Bar","description":"Menyediakan metode seduh manual lengkap seperti V60, Aeropress, Kalita Wave, hingga Syphon yang disajikan langsung oleh barista berdedikasi."},{"title":"Atmosfer Industrial Warm & Intim","description":"Desain interior bertema industrial dengan bata gelap, lampu gantung pipa vintage, dan pencahayaan temaram yang nyaman dan tenang."},{"title":"Menu Signature Kopi & Mocktail Kreatif","description":"Menghadirkan kreasi signature drinks berbasis espresso, cold brew segar, hingga mocktail kopi buah yang menyegarkan."},{"title":"Spot Edukasi & Diskusi Kultur Kopi","description":"Tempat yang ramah bagi siapa saja yang ingin berdiskusi mengenai teknik seduh, karakteristik rasa biji kopi, maupun membeli freshly roasted beans untuk dibawa pulang."}]',
                  '3fff9d59-eb4d-4d58-a3fd-0b94ee412ee5',
                  'Jl. Wolter Monginsidi No. 2A, Belakang Tangsi, Kec. Padang Barat, Kota Padang, Sumatera Barat 25118',
                  'Padang Barat',
                  'Padang',
                  22000,
                  48000,
                  'Rp22k - Rp48k',
                  ?,
                  'https://www.instagram.com/lalitocoffee/',
                  'https://www.google.com/maps/search/?api=1&query=Lalito+Coffee+Padang',
                  NULL,
                  NULL,
                  'Senin - Minggu 10.00 - 23.00 WIB',
                  1,
                  1,
                  '2026-11-16 13:50:00+00',
                  '2026-11-16 13:50:00+00'
                )
            `).bind(lalitoPhotoUrl).run();

            const lalitoTagIds = [
                'ed331b75-08e4-46d0-a9a1-7d583c300560',
                '0fa44681-f5da-4dcb-9656-31b714bd20f4',
                '1318851f-58c0-413a-bbef-c9fc99ab56b2',
                '6ba823b6-24f3-4385-8d59-67e019ba002b',
                'b50b3f65-221b-4414-a95b-3f861176d5f9',
                '0ea4a96b-179f-4632-9afc-ef98cdd9cb1b',
                '6a8e1d9e-88fb-48aa-a9c1-5a68935dc297',
                'd30f0c87-4384-474d-ae52-976300282f7a',
                'b92499b7-880d-4c02-8aac-a4073c213a4c',
                'd4d6cb33-3692-4482-9450-bcebd328fd96',
            ];
            for (const tagId of lalitoTagIds) {
                await db.prepare('INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES (?, ?)')
                    .bind('fa320b12-9c44-486a-8b1e-7f610a123001', tagId)
                    .run();
            }
        }

        await db.prepare("UPDATE places SET image_url = ? WHERE slug = 'lalito-coffee' AND (image_url IS NULL OR image_url = '')")
            .bind(lalitoPhotoUrl)
            .run();

        // 2. Kubik Koffie
        const existingKubik = await db.prepare("SELECT id FROM places WHERE slug = 'kubik-koffie'").first();
        const kubikPhotoUrl = 'https://drive.google.com/file/d/1qHrNLxbLNDHRJYN3rneU3QSusgZ9m7L0/view?usp=drive_link';

        if (!existingKubik) {
            await db.prepare(`
                INSERT OR IGNORE INTO places (
                  id, name, slug, description, short_description, characteristics,
                  category_id, address, area, city, price_min, price_max, price_range,
                  image_url, instagram_url, google_maps_url, whatsapp_url, website_url,
                  opening_hours, is_featured, is_active, created_at, updated_at
                ) VALUES (
                  '8c91a033-6b55-4d22-9a1f-4b512c345002',
                  'Kubik Koffie',
                  'kubik-koffie',
                  'Berdiri sejak 2014 di kawasan Olo Ladang, Kubik Koffie merupakan pelopor kafe urban berkonsep industrial-recycle dan coworking space di Padang. Menggabungkan area kedai kopi yang lapang, ruang pertemuan (meeting room), dan galeri seni, Kubik menjadi destinasi favorit pelajar, mahasiswa, dan profesional untuk Work From Cafe (WFC), mengerjakan tugas, rapat kerja, hingga menikmati live music akhir pekan.',
                  'Pionir coworking, art space & coffee shop di Olo Ladang dengan fasilitas meeting room dan area kerja luas.',
                  '[{"title":"Fasilitas Coworking & Meeting Room","description":"Menyediakan ruang rapat ber-AC khusus dengan proyektor dan papan tulis, sangat ideal untuk kerja tim, diskusi kelompok, atau presentasi bisnis."},{"title":"Pionir Konsep Industrial & Art Space","description":"Memanfaatkan elemen material daur ulang (kayu palet, kontainer, dan ornamen besi) yang dipadukan dengan mural seni dinding yang estetik."},{"title":"Area Sangat Luas (Indoor AC & Veranda Hijau)","description":"Memiliki daya tampung besar dengan pilihan tempat duduk bervariasi, mulai dari meja kerja komunal hingga teras luar beratap kanopi yang asri."},{"title":"Dukungan Fasilitas Kerja Lengkap","description":"Koneksi internet berkecepatan tinggi, stopkontak melimpah di setiap area meja, dan pencahayaan terang yang menjaga fokus kerja berjam-jam."},{"title":"Pilihan Menu Kopi & Makanan Lengkap","description":"Menyajikan Es Kopi Susu Kubik, Cafe Latte berkualitas, aneka pasta, nasi goreng spesial, serta camilan pendamping kerja."}]',
                  '3fff9d59-eb4d-4d58-a3fd-0b94ee412ee5',
                  'Jl. Olo Ladang No. 12, Olo, Kec. Padang Barat, Kota Padang, Sumatera Barat 25115',
                  'Padang Barat',
                  'Padang',
                  20000,
                  45000,
                  'Rp20k - Rp45k',
                  ?,
                  'https://www.instagram.com/kubikkoffie/',
                  'https://www.google.com/maps/search/?api=1&query=Kubik+Koffie+Padang',
                  NULL,
                  NULL,
                  'Buka Setiap Hari 09.00 - 23.30 WIB',
                  1,
                  1,
                  '2026-11-16 13:50:00+00',
                  '2026-11-16 13:50:00+00'
                )
            `).bind(kubikPhotoUrl).run();

            const kubikTagIds = [
                '0dee3434-90df-45e7-855f-b896c866762c',
                '48b8f0d3-830a-4011-8f40-2bf22a1cb91b',
                '33870e90-b97b-439a-ba92-f42a44ef695d',
                '1318851f-58c0-413a-bbef-c9fc99ab56b2',
                '6ba823b6-24f3-4385-8d59-67e019ba002b',
                'b50b3f65-221b-4414-a95b-3f861176d5f9',
                '0ea4a96b-179f-4632-9afc-ef98cdd9cb1b',
                '770dd8a2-9cc8-4fde-abdb-b4bf3307a45d',
                'd32ddb31-b92b-4968-8f57-94834f873f41',
                'd30f0c87-4384-474d-ae52-976300282f7a',
                'd0765037-ba39-4f2b-90cd-a536a9cd46c9',
                'b92499b7-880d-4c02-8aac-a4073c213a4c',
                'd4d6cb33-3692-4482-9450-bcebd328fd96',
            ];
            for (const tagId of kubikTagIds) {
                await db.prepare('INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES (?, ?)')
                    .bind('8c91a033-6b55-4d22-9a1f-4b512c345002', tagId)
                    .run();
            }
        }

        await db.prepare("UPDATE places SET image_url = ? WHERE slug = 'kubik-koffie' AND (image_url IS NULL OR image_url = '')")
            .bind(kubikPhotoUrl)
            .run();
    } catch {
        // Ignored
    }
    hasEnsuredLalitoAndKubik = true;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        await ensureBatAndArrow(context.env.DB);
        await ensureKamtumi(context.env.DB);
        await ensureLalitoAndKubik(context.env.DB);
        const url = new URL(context.request.url);

        const search = url.searchParams.get("search")?.trim() ?? "";
        const featured = url.searchParams.get("featured");
        const rawLimit = Number(url.searchParams.get("limit") ?? "100");

        const safeLimit = Math.min(
            Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 100,
            100
        );

        const conditions: string[] = ["p.is_active = 1"];
        const params: unknown[] = [];

        if (search) {
            conditions.push(
                `(
          p.name LIKE ?
          OR p.short_description LIKE ?
          OR p.area LIKE ?
          OR p.city LIKE ?
          OR c.name LIKE ?
        )`
            );

            const keyword = `%${search}%`;
            params.push(keyword, keyword, keyword, keyword, keyword);
        }

        if (featured === "true") {
            conditions.push("p.is_featured = 1");
        }

        const placesQuery = `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.short_description,
        p.category_id,
        p.area,
        p.city,
        p.price_min,
        p.price_max,
        p.price_range,
        p.image_url,
        p.opening_hours,
        p.is_featured,
        p.is_active,
        p.created_at,
        p.updated_at,
        c.name AS category_name,
        c.slug AS category_slug
      FROM places p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE ${conditions.join(" AND ")}
      ORDER BY p.is_featured DESC, p.created_at DESC
      LIMIT ?
    `;

        params.push(safeLimit);

        const placesResult = await context.env.DB
            .prepare(placesQuery)
            .bind(...params)
            .all<PlaceRow>();

        const places = placesResult.results ?? [];

        if (places.length === 0) {
            return publicJson({
                success: true,
                data: [],
            });
        }

        const placeIds = places.map((place) => place.id);
        const tagsByPlaceId = await getTagsByPlaceId(context.env.DB, placeIds);

        const data = places.map((place) => {
            const tags = tagsByPlaceId.get(place.id) ?? [];

            return {
                id: place.id,
                name: place.name,
                slug: place.slug,

                short_description: compactText(place.short_description, 180),

                category_id: place.category_id,
                area: place.area,
                city: place.city,

                price_min: place.price_min,
                price_max: place.price_max,
                price_range: place.price_range,

                image_url: place.image_url,
                opening_hours: place.opening_hours,

                is_featured: Boolean(place.is_featured),
                is_active: Boolean(place.is_active),
                is_published: Boolean(place.is_active),

                created_at: place.created_at,
                updated_at: place.updated_at,

                categories: place.category_id
                    ? {
                        id: place.category_id,
                        name: place.category_name,
                        slug: place.category_slug,
                    }
                    : null,

                tags,
            };
        });

        return publicJson({
            success: true,
            data,
        });
    } catch (error) {
        console.error("GET /api/places error:", error);

        return errorJson(
            {
                success: false,
                message: "Failed to fetch places",
            },
            500
        );
    }
};

export const onRequestHead: PagesFunction<Env> = async () => {
    return new Response(null, {
        status: 200,
        headers: getPublicCacheHeaders(),
    });
};

async function getTagsByPlaceId(db: D1Database, placeIds: string[]) {
    const tagsByPlaceId = new Map<string, CompactTag[]>();

    if (placeIds.length === 0) {
        return tagsByPlaceId;
    }

    const placeholders = placeIds.map(() => "?").join(",");

    const tagsResult = await db
        .prepare(
            `
      SELECT
        pt.place_id,
        t.id,
        t.name,
        t.slug,
        t.type
      FROM place_tags pt
      INNER JOIN tags t ON t.id = pt.tag_id
      WHERE pt.place_id IN (${placeholders})
      ORDER BY t.type ASC, t.name ASC
    `
        )
        .bind(...placeIds)
        .all<TagRow>();

    for (const tag of tagsResult.results ?? []) {
        const currentTags = tagsByPlaceId.get(tag.place_id) ?? [];

        currentTags.push({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            type: tag.type,
        });

        tagsByPlaceId.set(tag.place_id, currentTags);
    }

    return tagsByPlaceId;
}

function compactText(value: string | null, maxLength: number) {
    const text = String(value ?? "").trim();

    if (text.length <= maxLength) {
        return text || null;
    }

    return `${text.slice(0, maxLength).trim()}...`;
}

function getPublicCacheHeaders() {
    return {
        "Cache-Control":
            "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
        "CDN-Cache-Control": "public, max-age=300",
        "Cloudflare-CDN-Cache-Control": "public, max-age=300",
        "X-Saranwak-Api-Version": "places-lite-v3",
    };
}

function publicJson(body: ApiResponse, status = 200) {
    return Response.json(body, {
        status,
        headers: getPublicCacheHeaders(),
    });
}

function errorJson(body: ApiResponse, status = 500) {
    return Response.json(body, {
        status,
        headers: {
            "Cache-Control": "no-store",
            "X-Saranwak-Api-Version": "places-lite-v3-error",
        },
    });
}
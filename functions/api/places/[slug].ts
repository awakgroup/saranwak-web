type Env = {
    DB: D1Database;
};

type PlaceRow = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    characteristics?: string | null;
    category_id: string | null;
    address: string | null;
    area: string | null;
    city: string | null;
    price_min: number | null;
    price_max: number | null;
    price_range: string | null;
    image_url: string | null;
    instagram_url: string | null;
    google_maps_url: string | null;
    whatsapp_url: string | null;
    website_url: string | null;
    opening_hours: string | null;
    is_featured: number;
    is_active: number;
    created_at: string;
    updated_at: string;
    category_name: string | null;
    category_slug: string | null;
};

type TagRow = {
    id: string;
    name: string;
    slug: string;
    type: string;
};

type GalleryRow = {
    id: string;
    image_url: string;
    alt_text: string | null;
    sort_order: number;
};

let hasEnsuredCharacteristicsColumn = false;

async function ensureCharacteristicsColumn(db: D1Database) {
    if (hasEnsuredCharacteristicsColumn) return;
    try {
        await db.prepare("ALTER TABLE places ADD COLUMN characteristics TEXT").run();
    } catch {
        // Ignored if column already exists
    }
    hasEnsuredCharacteristicsColumn = true;
}

let hasEnsuredBatAndArrowSlug = false;

async function ensureBatAndArrowSlug(db: D1Database) {
    if (hasEnsuredBatAndArrowSlug) return;
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
                  0,
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

        // Always update image_url if null or empty
        await db.prepare("UPDATE places SET image_url = ? WHERE slug = 'bat-and-arrow' AND (image_url IS NULL OR image_url = '')")
            .bind(mainPhotoUrl)
            .run();

        const galleries = [
            {
                id: 'e9a8f211-54b3-4f91-8d26-photo-001',
                url: 'https://drive.google.com/file/d/1HriYF7IUZ6UxnOUBrdrpc39rdU5mdceU/view?usp=drive_link',
                caption: 'Fasad heritage bekas gudang kolonial Belanda dengan logo Bat & Arrow',
                order: 0
            },
            {
                id: 'e9a8f211-54b3-4f91-8d26-photo-002',
                url: 'https://drive.google.com/file/d/1R0ula9oMQThjTi3dx6NJHK1j0ZDlhUuP/view?usp=drive_link',
                caption: 'Deck semi-outdoor tepi aliran sungai Batang Arau',
                order: 1
            },
            {
                id: 'e9a8f211-54b3-4f91-8d26-photo-003',
                url: 'https://drive.google.com/file/d/11uC7bAEX8zjMSAeULX_IqA9BjoarZSGd/view?usp=drive_link',
                caption: 'Suasana malam hangat dengan neon sign Bat & Arrow di area courtyard',
                order: 2
            },
            {
                id: 'e9a8f211-54b3-4f91-8d26-photo-004',
                url: 'https://drive.google.com/file/d/1sGQQ13Evgtgv--HZpx1zkJ1MQZago0sB/view?usp=drive_link',
                caption: 'Area duduk terbuka dengan dinding tanaman merambat ala tropical garden',
                order: 3
            },
            {
                id: 'e9a8f211-54b3-4f91-8d26-photo-005',
                url: 'https://drive.google.com/file/d/1iz71rg2FR6gk_jaZ06C3gdcDgFjeU05f/view?usp=drive_link',
                caption: 'Tempat hangout favorit komunitas dan traveler di Batang Arau',
                order: 4
            }
        ];

        for (const g of galleries) {
            await db.prepare('INSERT OR IGNORE INTO galleries (id, place_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?, ?)')
                .bind(g.id, 'e9a8f211-54b3-4f91-8d26-724bc2f8a801', g.url, g.caption, g.order)
                .run();
        }
    } catch {
        // Ignored
    }
    hasEnsuredBatAndArrowSlug = true;
}

let hasEnsuredKamtumiSlug = false;

async function ensureKamtumiSlug(db: D1Database) {
    if (hasEnsuredKamtumiSlug) return;
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

        // Always update image_url if null or empty
        await db.prepare("UPDATE places SET image_url = ? WHERE slug = 'kamtumi-coffee' AND (image_url IS NULL OR image_url = '')")
            .bind(mainPhotoUrl)
            .run();

        const galleries = [
            {
                id: 'c7a10f82-913a-4e2b-photo-001',
                url: 'https://drive.google.com/file/d/107fx1KQ3EusFiJ7hPdDgmQX6R7crKlqr/view?usp=drive_link',
                caption: 'Area duduk komunal bernuansa vintage dengan meja kayu solid dan tirai tanaman hijau',
                order: 0
            },
            {
                id: 'c7a10f82-913a-4e2b-photo-002',
                url: 'https://drive.google.com/file/d/13vBSSgjxxX3yRqPD8ZmkTGdUgF_pSnG7/view?usp=drive_link',
                caption: 'Teras outdoor asri dengan kanopi tanaman berbunga dan neon sign Kamtumi',
                order: 1
            },
            {
                id: 'c7a10f82-913a-4e2b-photo-003',
                url: 'https://drive.google.com/file/d/1pjzV_TxMrkMvOJTE7L83dUZHsSUNJgGV/view?usp=drive_link',
                caption: 'Ruang indoor tenang yang ramah laptop dan dilengkapi colokan untuk WFC',
                order: 2
            },
            {
                id: 'c7a10f82-913a-4e2b-photo-004',
                url: 'https://drive.google.com/file/d/1yA-qdzIxqZSZJ66uv9jbgXc1r4rGOAQ4/view?usp=drive_link',
                caption: 'Sudut indoor bernuansa hangat dengan jendela kayu klasik dan neon box Kamtumi',
                order: 3
            },
            {
                id: 'c7a10f82-913a-4e2b-photo-005',
                url: 'https://drive.google.com/file/d/1jmexxKYPTmrgLp-vrNowis2XbsG2mD-M/view?usp=drive_link',
                caption: 'Halaman terbuka dengan pintu kayu rustic dan tanaman hias untuk santai sore',
                order: 4
            }
        ];

        for (const g of galleries) {
            await db.prepare('INSERT OR IGNORE INTO galleries (id, place_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?, ?)')
                .bind(g.id, 'c7a10f82-913a-4e2b-bb81-18f9e61234a1', g.url, g.caption, g.order)
                .run();
        }
    } catch {
        // Ignored
    }
    hasEnsuredKamtumiSlug = true;
}

let hasEnsuredLalitoSlug = false;

async function ensureLalitoSlug(db: D1Database) {
    if (hasEnsuredLalitoSlug) return;
    try {
        const existing = await db.prepare("SELECT id FROM places WHERE slug = 'lalito-coffee'").first();
        const mainPhotoUrl = 'https://drive.google.com/file/d/1YswnlvrIo3ueCnF6C-iVI7GuckmZaPpe/view?usp=drive_link';

        if (!existing) {
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
                  0,
                  1,
                  '2026-11-16 13:50:00+00',
                  '2026-11-16 13:50:00+00'
                )
            `).bind(mainPhotoUrl).run();

            const tagIds = [
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
            for (const tagId of tagIds) {
                await db.prepare('INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES (?, ?)')
                    .bind('fa320b12-9c44-486a-8b1e-7f610a123001', tagId)
                    .run();
            }
        }

        // Always update image_url if null or empty
        await db.prepare("UPDATE places SET image_url = ? WHERE slug = 'lalito-coffee' AND (image_url IS NULL OR image_url = '')")
            .bind(mainPhotoUrl)
            .run();

        const galleries = [
            {
                id: 'fa320b12-photo-001',
                url: 'https://drive.google.com/file/d/1YswnlvrIo3ueCnF6C-iVI7GuckmZaPpe/view?usp=drive_link',
                caption: 'Bar espresso & barista brewing di suasana industrial warm Lalito',
                order: 0
            },
            {
                id: 'fa320b12-photo-002',
                url: 'https://drive.google.com/file/d/1MVArfUBdXMC7CcsJAy4JTUMjBsHEZb3c/view?usp=drive_link',
                caption: 'Proses pengemasan biji kopi freshly roasted di balik kaca Lalito',
                order: 1
            },
            {
                id: 'fa320b12-photo-003',
                url: 'https://drive.google.com/file/d/1IrnNmE4tEANyXRltDnoLC9XkodJCn7xy/view?usp=drive_link',
                caption: 'Suasana slow bar intim untuk manual brew dan diskusi kopi',
                order: 2
            },
            {
                id: 'fa320b12-photo-004',
                url: 'https://drive.google.com/file/d/1E6TB3PRxqWWu-OB6puJ9nAYbJo3tWT1a/view?usp=drive_link',
                caption: 'Sudut tempat duduk yang tenang untuk me-time dan membaca buku',
                order: 3
            },
            {
                id: 'fa320b12-photo-005',
                url: 'https://drive.google.com/file/d/1JHPRoXUC6lGgo2c7rzwcXXLd7gwO3QTG/view?usp=drive_link',
                caption: 'Area duduk semi-outdoor santai untuk nongkrong sore',
                order: 4
            }
        ];

        for (const g of galleries) {
            await db.prepare('INSERT OR IGNORE INTO galleries (id, place_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?, ?)')
                .bind(g.id, 'fa320b12-9c44-486a-8b1e-7f610a123001', g.url, g.caption, g.order)
                .run();
        }
    } catch {
        // Ignored
    }
    hasEnsuredLalitoSlug = true;
}

let hasEnsuredKubikSlug = false;

async function ensureKubikSlug(db: D1Database) {
    if (hasEnsuredKubikSlug) return;
    try {
        const existing = await db.prepare("SELECT id FROM places WHERE slug = 'kubik-koffie'").first();
        const mainPhotoUrl = 'https://drive.google.com/file/d/1qHrNLxbLNDHRJYN3rneU3QSusgZ9m7L0/view?usp=drive_link';

        if (!existing) {
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
                  0,
                  1,
                  '2026-11-16 13:50:00+00',
                  '2026-11-16 13:50:00+00'
                )
            `).bind(mainPhotoUrl).run();

            const tagIds = [
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
            for (const tagId of tagIds) {
                await db.prepare('INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES (?, ?)')
                    .bind('8c91a033-6b55-4d22-9a1f-4b512c345002', tagId)
                    .run();
            }
        }

        // Always update image_url if null or empty
        await db.prepare("UPDATE places SET image_url = ? WHERE slug = 'kubik-koffie' AND (image_url IS NULL OR image_url = '')")
            .bind(mainPhotoUrl)
            .run();

        const galleries = [
            {
                id: '8c91a033-photo-001',
                url: 'https://drive.google.com/file/d/1qHrNLxbLNDHRJYN3rneU3QSusgZ9m7L0/view?usp=drive_link',
                caption: 'Secangkir kopi hangat berlogo merah khas di depan bar Kubik Koffie',
                order: 0
            },
            {
                id: '8c91a033-photo-002',
                url: 'https://drive.google.com/file/d/12CbHTT49OJAQRjcmHa9ufeVGJw6PyGpj/view?usp=drive_link',
                caption: 'Fasad luar Kubik Koffie dengan penanda Coworking & Art Space',
                order: 1
            },
            {
                id: '8c91a033-photo-003',
                url: 'https://drive.google.com/file/d/15PysjSQNRx8L6S1Tl8DcNolnFg-bn4p8/view?usp=drive_link',
                caption: 'Teras luar beratap kanopi dengan pepohonan rindang yang teduh dan sejuk',
                order: 2
            },
            {
                id: '8c91a033-photo-004',
                url: 'https://drive.google.com/file/d/1TKtdjMu2koTjsDbXSPhUOc1-qWYrLVoS/view?usp=drive_link',
                caption: 'Sajian Cafe Latte dengan latte art presisi racikan barista Kubik',
                order: 3
            },
            {
                id: '8c91a033-photo-005',
                url: 'https://drive.google.com/file/d/1vQcCtC3ToHbCwFEFgi1VRuC01SgF87t6/view?usp=drive_link',
                caption: 'Dinding bata ekspos berhias instalasi seni Scrabble di area seating',
                order: 4
            }
        ];

        for (const g of galleries) {
            await db.prepare('INSERT OR IGNORE INTO galleries (id, place_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?, ?)')
                .bind(g.id, '8c91a033-6b55-4d22-9a1f-4b512c345002', g.url, g.caption, g.order)
                .run();
        }
    } catch {
        // Ignored
    }
    hasEnsuredKubikSlug = true;
}

let hasEnsuredHqSitebaSlug = false;

async function ensureHqSitebaSlug(db: D1Database) {
    if (hasEnsuredHqSitebaSlug) return;
    try {
        const existing = await db.prepare("SELECT id FROM places WHERE slug = 'hq-coffee-eatery-siteba'").first();
        const mainPhotoUrl = 'https://drive.google.com/file/d/1WIGtteX3a2UVWmfi-jzU9nHq6ucVZoBR/view?usp=drive_link';

        if (!existing) {
            await db.prepare(`
                INSERT OR IGNORE INTO places (
                  id, name, slug, description, short_description, characteristics,
                  category_id, address, area, city, price_min, price_max, price_range,
                  image_url, instagram_url, google_maps_url, whatsapp_url, website_url,
                  opening_hours, is_featured, is_active, created_at, updated_at
                ) VALUES (
                  'a7d8c521-48e2-4f39-9d18-84ec92b15e01',
                  'HQ Coffee & Eatery (Siteba)',
                  'hq-coffee-eatery-siteba',
                  'HQ Coffee & Eatery Cabang Siteba hadir sebagai destinasi kopi dan ruang nongkrong modern di kawasan Nanggalo, Kota Padang. Memadukan arsitektur minimalis bertingkat dengan sentuhan roster industrial, HQ Siteba menyediakan pilihan area yang fleksibel: ruang indoor ber-AC dengan meja kayu luas yang sangat mendukung produktivitas (WFC/nugas), area semi-outdoor lantai dua yang sejuk, hingga halaman outdoor beralas koral asri yang pas untuk kongko santai sore hingga malam hari.',
                  'Coffee shop & eatery modern berlantai dua di Siteba dengan ruang indoor AC nyaman untuk WFC serta area outdoor koral yang asri.',
                  '[{"title":"Ruang Indoor AC Produktif & Nyaman","description":"Dilengkapi meja kayu luas, colokan memadai, pencahayaan hangat, dan pendingin ruangan yang ideal untuk kerja jarak jauh (WFC) atau nugas skripsi."},{"title":"Area Semi-Outdoor Lantai Dua yang Lega","description":"Menyuguhkan bukaan udara segar dengan dinding kaca dan partisi roster modern untuk menikmati suasana sore Siteba."},{"title":"Courtyard Outdoor Beralas Koral Asri","description":"Halaman terbuka dengan bebatuan koral, kanopi peneduh, dan tanaman hijau yang syahdu untuk hangout santai bersama kawan."},{"title":"Pilihan Kopi & Makanan Lengkap","description":"Menyajikan racikan espresso-based, aneka minuman kekinian, aneka kudapan ringan, hingga sajian makanan berat yang ramah di kantong."},{"title":"Fasilitas Komplit & Akses Mudah di Siteba","description":"Area parkir motor yang luas, rak helm terorganisir, musala/toilet bersih, dan akses lokasi strategis di jalur utama Siteba."}]',
                  '3fff9d59-eb4d-4d58-a3fd-0b94ee412ee5',
                  'Jl. Raya Siteba, Surau Gadang, Kec. Nanggalo, Kota Padang, Sumatera Barat 25143',
                  'Nanggalo',
                  'Padang',
                  21000,
                  56000,
                  'Rp21k - Rp56k',
                  ?,
                  'https://www.instagram.com/hq_coffeeandeatery/',
                  'https://maps.app.goo.gl/Z7aJbnMTKvSBwtR59',
                  NULL,
                  NULL,
                  'Setiap Hari 10.00 - 23.00 WIB',
                  0,
                  1,
                  '2026-11-20 01:00:00+00',
                  '2026-11-20 01:00:00+00'
                )
            `).bind(mainPhotoUrl).run();

            const tagIds = [
                '0dee3434-90df-45e7-855f-b896c866762c',
                '48b8f0d3-830a-4011-8f40-2bf22a1cb91b',
                'd32ddb31-b92b-4968-8f57-94834f873f41',
                '33870e90-b97b-439a-ba92-f42a44ef695d',
                '770dd8a2-9cc8-4fde-abdb-b4bf3307a45d',
                '1318851f-58c0-413a-bbef-c9fc99ab56b2',
                '6ba823b6-24f3-4385-8d59-67e019ba002b',
                'b50b3f65-221b-4414-a95b-3f861176d5f9',
                '0ea4a96b-179f-4632-9afc-ef98cdd9cb1b',
                'd4d6cb33-3692-4482-9450-bcebd328fd96',
                'b92499b7-880d-4c02-8aac-a4073c213a4c',
                'd30f0c87-4384-474d-ae52-976300282f7a',
                '6a8e1d9e-88fb-48aa-a9c1-5a68935dc297',
                'aaf7132f-7daa-4461-8c91-355409f07f17',
                'd0765037-ba39-4f2b-90cd-a536a9cd46c9',
            ];
            for (const tagId of tagIds) {
                await db.prepare('INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES (?, ?)')
                    .bind('a7d8c521-48e2-4f39-9d18-84ec92b15e01', tagId)
                    .run();
            }
        }

        await db.prepare("UPDATE places SET image_url = ? WHERE slug = 'hq-coffee-eatery-siteba' AND (image_url IS NULL OR image_url = '')")
            .bind(mainPhotoUrl)
            .run();

        const galleries = [
            {
                id: 'a7d8c521-photo-001',
                url: 'https://drive.google.com/file/d/1WIGtteX3a2UVWmfi-jzU9nHq6ucVZoBR/view?usp=drive_link',
                caption: 'Fasad modern minimalis HQ Coffee & Eatery Siteba dengan area parkir dan suasana hangat',
                order: 0
            },
            {
                id: 'a7d8c521-photo-002',
                url: 'https://drive.google.com/file/d/1lZvupUscayePaDKIo0llXa1I8RIwByBE/view?usp=drive_link',
                caption: 'Area indoor ber-AC yang tenang dan nyaman dengan meja kayu komunal untuk WFC dan nugas',
                order: 1
            },
            {
                id: 'a7d8c521-photo-003',
                url: 'https://drive.google.com/file/d/1h9Dat_DePm98-ckIU5QIpSsgP0usLxNj/view?usp=drive_link',
                caption: 'Lantai dua luas dengan jendela kaca besar dan perpaduan seating semi-outdoor',
                order: 2
            },
            {
                id: 'a7d8c521-photo-004',
                url: 'https://drive.google.com/file/d/1Cr-iZ4Rsm3D2x2Rgcu9O-4QDsFKX_tyC/view?usp=drive_link',
                caption: 'Courtyard outdoor beralas koral estetik di bawah kanopi dengan tanaman hijau',
                order: 3
            },
            {
                id: 'a7d8c521-photo-005',
                url: 'https://drive.google.com/file/d/1TQdJzQeNwIq0n7utBgAJTVBKwr9owVRi/view?usp=drive_link',
                caption: 'Sudut semi-outdoor beratap dengan partisi roster beton industrial dan lampu gantung',
                order: 4
            }
        ];

        for (const g of galleries) {
            await db.prepare('INSERT OR IGNORE INTO galleries (id, place_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?, ?)')
                .bind(g.id, 'a7d8c521-48e2-4f39-9d18-84ec92b15e01', g.url, g.caption, g.order)
                .run();
        }
    } catch {
        // Ignored
    }
    hasEnsuredHqSitebaSlug = true;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const slug = context.params.slug;

        if (!slug || typeof slug !== "string") {
            return Response.json(
                {
                    success: false,
                    message: "Slug is required",
                },
                { status: 400 }
            );
        }

        await ensureCharacteristicsColumn(context.env.DB);
        if (slug === "bat-and-arrow") {
            await ensureBatAndArrowSlug(context.env.DB);
        } else if (slug === "kamtumi-coffee") {
            await ensureKamtumiSlug(context.env.DB);
        } else if (slug === "lalito-coffee") {
            await ensureLalitoSlug(context.env.DB);
        } else if (slug === "kubik-koffie") {
            await ensureKubikSlug(context.env.DB);
        } else if (slug === "hq-coffee-eatery-siteba") {
            await ensureHqSitebaSlug(context.env.DB);
        }

        const place = await context.env.DB
            .prepare(
                `
        SELECT
          p.id,
          p.name,
          p.slug,
          p.description,
          p.short_description,
          p.characteristics,
          p.category_id,
          p.address,
          p.area,
          p.city,
          p.price_min,
          p.price_max,
          p.price_range,
          p.image_url,
          p.instagram_url,
          p.google_maps_url,
          p.whatsapp_url,
          p.website_url,
          p.opening_hours,
          p.is_featured,
          p.is_active,
          p.created_at,
          p.updated_at,
          c.name AS category_name,
          c.slug AS category_slug
        FROM places p
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE p.slug = ? AND p.is_active = 1
        LIMIT 1
      `
            )
            .bind(slug)
            .first<PlaceRow>();

        if (!place) {
            return Response.json(
                {
                    success: false,
                    message: "Place not found",
                },
                { status: 404 }
            );
        }

        let characteristics = null;
        if (place.characteristics) {
            try {
                characteristics = JSON.parse(place.characteristics);
            } catch {
                characteristics = null;
            }
        }

        const tags = await context.env.DB
            .prepare(
                `
        SELECT 
          t.id,
          t.name,
          t.slug,
          t.type
        FROM tags t
        INNER JOIN place_tags pt ON pt.tag_id = t.id
        WHERE pt.place_id = ?
        ORDER BY t.type ASC, t.name ASC
      `
            )
            .bind(place.id)
            .all<TagRow>();

        const galleries = await context.env.DB
            .prepare(
                `
        SELECT 
          id,
          image_url,
          alt_text,
          sort_order
        FROM galleries
        WHERE place_id = ?
        ORDER BY sort_order ASC, created_at ASC
      `
            )
            .bind(place.id)
            .all<GalleryRow>();

        return Response.json({
            success: true,
            data: {
                ...place,
                characteristics,
                tags: tags.results ?? [],
                galleries: galleries.results ?? [],
            },
        });
    } catch (error) {
        console.error("GET /api/places/[slug] error:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to fetch place detail",
            },
            { status: 500 }
        );
    }
};
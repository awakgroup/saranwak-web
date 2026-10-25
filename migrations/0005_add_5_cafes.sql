-- Migration 0005: Add 5 new popular cafes in Padang
-- Kupi Batigo, Safari Cafe & Resto, Lalito Coffee Bar, Foresthree, Rimbun Espresso

INSERT OR IGNORE INTO places (
  id, name, slug, description, short_description, category_id,
  address, area, city, price_min, price_max, price_range,
  image_url, instagram_url, google_maps_url, opening_hours,
  is_featured, is_active, created_at, updated_at
) VALUES (
  'a01b1001-cafe-4001-8001-batigo000001', 'Kupi Batigo', 'kupi-batigo', 'Kupi Batigo adalah salah satu ikon tempat nongkrong dan berdiskusi di Padang. Mengusung konsep lapau modern yang memadukan interior artistik dengan area outdoor asri di depan Masjid Raya Syekh Ahmad Khatib Al-Minangkabawi. Menyediakan aneka kopi khas, teh talua, dan hidangan lokal dengan harga bersahabat.', 'Lapau modern berkonsep heritage dengan area indoor bernuansa artistik dan outdoor hijau, cocok untuk nugas, diskusi, dan berkumpul.', '3fff9d59-eb4d-4d58-a3fd-0b94ee412ee5',
  'Jl. KH. Ahmad Dahlan No.19, Alai Parak Kopi, Kec. Padang Utara, Kota Padang, Sumatera Barat 25111', 'Padang Utara', 'Padang', 15000, 35000, 'Rp15k - Rp35k',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80', 'https://www.instagram.com/kupibatigo/', 'https://maps.app.goo.gl/3f82hB2F6ZqR8VqW8', '08.00 - 23.00 WIB',
  1, 1, datetime('now'), datetime('now')
);

INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1001-cafe-4001-8001-batigo000001', '48b8f0d3-830a-4011-8f40-2bf22a1cb91b');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1001-cafe-4001-8001-batigo000001', '0fa44681-f5da-4dcb-9656-31b714bd20f4');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1001-cafe-4001-8001-batigo000001', 'd32ddb31-b92b-4968-8f57-94834f873f41');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1001-cafe-4001-8001-batigo000001', 'b50b3f65-221b-4414-a95b-3f861176d5f9');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1001-cafe-4001-8001-batigo000001', '0ea4a96b-179f-4632-9afc-ef98cdd9cb1b');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1001-cafe-4001-8001-batigo000001', '2777944a-8de2-4013-8db2-06ff2366cc91');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1001-cafe-4001-8001-batigo000001', '770dd8a2-9cc8-4fde-abdb-b4bf3307a45d');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1001-cafe-4001-8001-batigo000001', 'b92499b7-880d-4c02-8aac-a4073c213a4c');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1001-cafe-4001-8001-batigo000001', '1318851f-58c0-413a-bbef-c9fc99ab56b2');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1001-cafe-4001-8001-batigo000001', 'd30f0c87-4384-474d-ae52-976300282f7a');

INSERT OR IGNORE INTO places (
  id, name, slug, description, short_description, category_id,
  address, area, city, price_min, price_max, price_range,
  image_url, instagram_url, google_maps_url, opening_hours,
  is_featured, is_active, created_at, updated_at
) VALUES (
  'a01b1002-cafe-4002-8002-safari000002', 'Safari Cafe & Resto', 'safari-cafe-resto', 'Safari Cafe & Resto menyuguhkan suasana taman terbuka yang teduh dengan desain arsitektur hangat dan pencahayaan estetik saat malam hari. Pilihan tepat untuk santap malam, kencan santai, hingga acara kumpul komunitas dengan menu kopi dan makanan yang lengkap.', 'Cafe & resto legendaris bernuansa taman tropis yang luas dan estetik di Padang Barat, cocok untuk kumpul keluarga, meeting, dan first date.', '3fff9d59-eb4d-4d58-a3fd-0b94ee412ee5',
  'Jl. Berok Nipah No.28, Berok Nipah, Kec. Padang Barat, Kota Padang, Sumatera Barat 25118', 'Padang Barat', 'Padang', 25000, 65000, 'Rp25k - Rp65k',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', 'https://www.instagram.com/safarigarden_padang/', 'https://maps.app.goo.gl/uX7G8R6YqN2B3yXj6', '10.00 - 23.00 WIB',
  0, 1, datetime('now'), datetime('now')
);

INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1002-cafe-4002-8002-safari000002', 'd32ddb31-b92b-4968-8f57-94834f873f41');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1002-cafe-4002-8002-safari000002', '5b4daff9-8fcd-4799-b23e-cf80a41f3376');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1002-cafe-4002-8002-safari000002', '770dd8a2-9cc8-4fde-abdb-b4bf3307a45d');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1002-cafe-4002-8002-safari000002', '1318851f-58c0-413a-bbef-c9fc99ab56b2');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1002-cafe-4002-8002-safari000002', '33870e90-b97b-439a-ba92-f42a44ef695d');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1002-cafe-4002-8002-safari000002', '6ba823b6-24f3-4385-8d59-67e019ba002b');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1002-cafe-4002-8002-safari000002', 'b92499b7-880d-4c02-8aac-a4073c213a4c');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1002-cafe-4002-8002-safari000002', '2777944a-8de2-4013-8db2-06ff2366cc91');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1002-cafe-4002-8002-safari000002', 'd0765037-ba39-4f2b-90cd-a536a9cd46c9');

INSERT OR IGNORE INTO places (
  id, name, slug, description, short_description, category_id,
  address, area, city, price_min, price_max, price_range,
  image_url, instagram_url, google_maps_url, opening_hours,
  is_featured, is_active, created_at, updated_at
) VALUES (
  'a01b1003-cafe-4003-8003-lalito000003', 'Lalito Coffee Bar', 'lalito-coffee-bar', 'Lalito Coffee Bar menyajikan racikan biji kopi specialty pilihan dengan metode seduh manual brew dan espresso-based berkualitas. Tempat duduk minimalis dan atmosfer tenang menjadikannya pilihan favorit untuk nugas laptopan atau obrolan intim.', 'Specialty coffee bar berkonsep minimalis modern di Padang Barat, tempat tenang favorit barista lokal dan mahasiswa untuk WFC.', '3fff9d59-eb4d-4d58-a3fd-0b94ee412ee5',
  'Jl. WR. Supratman No.1, Belakang Tangsi, Kec. Padang Barat, Kota Padang, Sumatera Barat 25118', 'Padang Barat', 'Padang', 20000, 40000, 'Rp20k - Rp40k',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80', 'https://www.instagram.com/lalitocoffeebar/', 'https://maps.app.goo.gl/vL7A9W8B6Q3Y2rKm9', '13.00 - 23.00 WIB',
  0, 1, datetime('now'), datetime('now')
);

INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1003-cafe-4003-8003-lalito000003', '48b8f0d3-830a-4011-8f40-2bf22a1cb91b');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1003-cafe-4003-8003-lalito000003', '0dee3434-90df-45e7-855f-b896c866762c');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1003-cafe-4003-8003-lalito000003', '0fa44681-f5da-4dcb-9656-31b714bd20f4');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1003-cafe-4003-8003-lalito000003', '0ea4a96b-179f-4632-9afc-ef98cdd9cb1b');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1003-cafe-4003-8003-lalito000003', 'b50b3f65-221b-4414-a95b-3f861176d5f9');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1003-cafe-4003-8003-lalito000003', '6ba823b6-24f3-4385-8d59-67e019ba002b');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1003-cafe-4003-8003-lalito000003', '1318851f-58c0-413a-bbef-c9fc99ab56b2');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1003-cafe-4003-8003-lalito000003', 'aaf7132f-7daa-4461-8c91-355409f07f17');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1003-cafe-4003-8003-lalito000003', 'd30f0c87-4384-474d-ae52-976300282f7a');

INSERT OR IGNORE INTO places (
  id, name, slug, description, short_description, category_id,
  address, area, city, price_min, price_max, price_range,
  image_url, instagram_url, google_maps_url, opening_hours,
  is_featured, is_active, created_at, updated_at
) VALUES (
  'a01b1004-cafe-4004-8004-foresthree04', 'Foresthree Coffee Raden Saleh', 'foresthree-coffee-raden-saleh', 'Foresthree Coffee cabang Raden Saleh menjadi spot favorit anak muda Padang untuk nongkrong sore hingga malam. Dilengkapi photobox kekinian, WiFi stabil, dan variasi menu kopi susu serta juice blend segar yang terjangkau.', 'Coffee shop hits dengan area indoor luas, photobox seru, dan aneka minuman kopi buah segar dengan harga ramah kantong.', '3fff9d59-eb4d-4d58-a3fd-0b94ee412ee5',
  'Jl. Raden Saleh No.43, Rimbo Kaluang, Kec. Padang Barat, Kota Padang, Sumatera Barat 25111', 'Padang Barat', 'Padang', 18000, 35000, 'Rp18k - Rp35k',
  'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=80', 'https://www.instagram.com/foresthreecoffee.padang/', 'https://maps.app.goo.gl/hW8X7B5N9M2Z4vKq7', '09.00 - 22.00 WIB',
  0, 1, datetime('now'), datetime('now')
);

INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1004-cafe-4004-8004-foresthree04', 'd32ddb31-b92b-4968-8f57-94834f873f41');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1004-cafe-4004-8004-foresthree04', '48b8f0d3-830a-4011-8f40-2bf22a1cb91b');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1004-cafe-4004-8004-foresthree04', '580dfac1-efe1-4339-84af-bbc86dbc63c9');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1004-cafe-4004-8004-foresthree04', 'b50b3f65-221b-4414-a95b-3f861176d5f9');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1004-cafe-4004-8004-foresthree04', '0ea4a96b-179f-4632-9afc-ef98cdd9cb1b');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1004-cafe-4004-8004-foresthree04', '6ba823b6-24f3-4385-8d59-67e019ba002b');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1004-cafe-4004-8004-foresthree04', '770dd8a2-9cc8-4fde-abdb-b4bf3307a45d');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1004-cafe-4004-8004-foresthree04', '1318851f-58c0-413a-bbef-c9fc99ab56b2');

INSERT OR IGNORE INTO places (
  id, name, slug, description, short_description, category_id,
  address, area, city, price_min, price_max, price_range,
  image_url, instagram_url, google_maps_url, opening_hours,
  is_featured, is_active, created_at, updated_at
) VALUES (
  'a01b1005-cafe-4005-8005-rimbun000005', 'Rimbun Espresso & Brew Bar', 'rimbun-espresso-brew-bar', 'Rimbun Espresso & Brew Bar menghadirkan perpaduan kedai kopi artisan dengan nuansa alam yang rindang di kawasan Jati Baru Padang Timur. Dikenal dengan kopi seduh manual yang kaya rasa, area semi-outdoor sejuk, dan vibes tenang untuk melepas penat.', 'Tempat ngopi asri berbalut pepohonan rimbun di Jati Padang Timur, menyajikan kopi artisan dan suasana tenang untuk first date & me-time.', '3fff9d59-eb4d-4d58-a3fd-0b94ee412ee5',
  'Jl. KIS. Mangunsarkoro No.24, Jati Baru, Kec. Padang Timur, Kota Padang, Sumatera Barat 25129', 'Padang Timur', 'Padang', 22000, 48000, 'Rp22k - Rp48k',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80', 'https://www.instagram.com/rimbunespresso/', 'https://maps.app.goo.gl/xK9Y7B4N8M1Z3vLp8', '08.00 - 22.00 WIB',
  1, 1, datetime('now'), datetime('now')
);

INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1005-cafe-4005-8005-rimbun000005', '770dd8a2-9cc8-4fde-abdb-b4bf3307a45d');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1005-cafe-4005-8005-rimbun000005', '0fa44681-f5da-4dcb-9656-31b714bd20f4');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1005-cafe-4005-8005-rimbun000005', '5b4daff9-8fcd-4799-b23e-cf80a41f3376');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1005-cafe-4005-8005-rimbun000005', 'ed331b75-08e4-46d0-a9a1-7d583c300560');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1005-cafe-4005-8005-rimbun000005', 'd0765037-ba39-4f2b-90cd-a536a9cd46c9');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1005-cafe-4005-8005-rimbun000005', 'b50b3f65-221b-4414-a95b-3f861176d5f9');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1005-cafe-4005-8005-rimbun000005', '0ea4a96b-179f-4632-9afc-ef98cdd9cb1b');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1005-cafe-4005-8005-rimbun000005', '2777944a-8de2-4013-8db2-06ff2366cc91');
INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES ('a01b1005-cafe-4005-8005-rimbun000005', 'b92499b7-880d-4c02-8aac-a4073c213a4c');


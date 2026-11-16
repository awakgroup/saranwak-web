-- Migration 0008: Add Lalito Coffee Bar and Kubik Koffie with photos and galleries

-- 1. Lalito Coffee Bar
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
  'https://drive.google.com/file/d/1YswnlvrIo3ueCnF6C-iVI7GuckmZaPpe/view?usp=drive_link',
  'https://www.instagram.com/lalitocoffee/',
  'https://www.google.com/maps/search/?api=1&query=Lalito+Coffee+Padang',
  NULL,
  NULL,
  'Senin - Minggu 10.00 - 23.00 WIB',
  1,
  1,
  '2026-11-16 13:50:00+00',
  '2026-11-16 13:50:00+00'
);

INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES
  ('fa320b12-9c44-486a-8b1e-7f610a123001', 'ed331b75-08e4-46d0-a9a1-7d583c300560'),
  ('fa320b12-9c44-486a-8b1e-7f610a123001', '0fa44681-f5da-4dcb-9656-31b714bd20f4'),
  ('fa320b12-9c44-486a-8b1e-7f610a123001', '1318851f-58c0-413a-bbef-c9fc99ab56b2'),
  ('fa320b12-9c44-486a-8b1e-7f610a123001', '6ba823b6-24f3-4385-8d59-67e019ba002b'),
  ('fa320b12-9c44-486a-8b1e-7f610a123001', 'b50b3f65-221b-4414-a95b-3f861176d5f9'),
  ('fa320b12-9c44-486a-8b1e-7f610a123001', '0ea4a96b-179f-4632-9afc-ef98cdd9cb1b'),
  ('fa320b12-9c44-486a-8b1e-7f610a123001', '6a8e1d9e-88fb-48aa-a9c1-5a68935dc297'),
  ('fa320b12-9c44-486a-8b1e-7f610a123001', 'd30f0c87-4384-474d-ae52-976300282f7a'),
  ('fa320b12-9c44-486a-8b1e-7f610a123001', 'b92499b7-880d-4c02-8aac-a4073c213a4c'),
  ('fa320b12-9c44-486a-8b1e-7f610a123001', 'd4d6cb33-3692-4482-9450-bcebd328fd96');

INSERT OR IGNORE INTO galleries (id, place_id, image_url, alt_text, sort_order) VALUES
  ('fa320b12-photo-001', 'fa320b12-9c44-486a-8b1e-7f610a123001', 'https://drive.google.com/file/d/1YswnlvrIo3ueCnF6C-iVI7GuckmZaPpe/view?usp=drive_link', 'Bar espresso & barista brewing di suasana industrial warm Lalito', 0),
  ('fa320b12-photo-002', 'fa320b12-9c44-486a-8b1e-7f610a123001', 'https://drive.google.com/file/d/1MVArfUBdXMC7CcsJAy4JTUMjBsHEZb3c/view?usp=drive_link', 'Proses pengemasan biji kopi freshly roasted di balik kaca Lalito', 1),
  ('fa320b12-photo-003', 'fa320b12-9c44-486a-8b1e-7f610a123001', 'https://drive.google.com/file/d/1IrnNmE4tEANyXRltDnoLC9XkodJCn7xy/view?usp=drive_link', 'Suasana slow bar intim untuk manual brew dan diskusi kopi', 2),
  ('fa320b12-photo-004', 'fa320b12-9c44-486a-8b1e-7f610a123001', 'https://drive.google.com/file/d/1E6TB3PRxqWWu-OB6puJ9nAYbJo3tWT1a/view?usp=drive_link', 'Sudut tempat duduk yang tenang untuk me-time dan membaca buku', 3),
  ('fa320b12-photo-005', 'fa320b12-9c44-486a-8b1e-7f610a123001', 'https://drive.google.com/file/d/1JHPRoXUC6lGgo2c7rzwcXXLd7gwO3QTG/view?usp=drive_link', 'Area duduk semi-outdoor santai untuk nongkrong sore', 4);

-- 2. Kubik Koffie
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
  'https://drive.google.com/file/d/1qHrNLxbLNDHRJYN3rneU3QSusgZ9m7L0/view?usp=drive_link',
  'https://www.instagram.com/kubikkoffie/',
  'https://www.google.com/maps/search/?api=1&query=Kubik+Koffie+Padang',
  NULL,
  NULL,
  'Buka Setiap Hari 09.00 - 23.30 WIB',
  1,
  1,
  '2026-11-16 13:50:00+00',
  '2026-11-16 13:50:00+00'
);

INSERT OR IGNORE INTO place_tags (place_id, tag_id) VALUES
  ('8c91a033-6b55-4d22-9a1f-4b512c345002', '0dee3434-90df-45e7-855f-b896c866762c'),
  ('8c91a033-6b55-4d22-9a1f-4b512c345002', '48b8f0d3-830a-4011-8f40-2bf22a1cb91b'),
  ('8c91a033-6b55-4d22-9a1f-4b512c345002', '33870e90-b97b-439a-ba92-f42a44ef695d'),
  ('8c91a033-6b55-4d22-9a1f-4b512c345002', '1318851f-58c0-413a-bbef-c9fc99ab56b2'),
  ('8c91a033-6b55-4d22-9a1f-4b512c345002', '6ba823b6-24f3-4385-8d59-67e019ba002b'),
  ('8c91a033-6b55-4d22-9a1f-4b512c345002', 'b50b3f65-221b-4414-a95b-3f861176d5f9'),
  ('8c91a033-6b55-4d22-9a1f-4b512c345002', '0ea4a96b-179f-4632-9afc-ef98cdd9cb1b'),
  ('8c91a033-6b55-4d22-9a1f-4b512c345002', '770dd8a2-9cc8-4fde-abdb-b4bf3307a45d'),
  ('8c91a033-6b55-4d22-9a1f-4b512c345002', 'd32ddb31-b92b-4968-8f57-94834f873f41'),
  ('8c91a033-6b55-4d22-9a1f-4b512c345002', 'd30f0c87-4384-474d-ae52-976300282f7a'),
  ('8c91a033-6b55-4d22-9a1f-4b512c345002', 'd0765037-ba39-4f2b-90cd-a536a9cd46c9'),
  ('8c91a033-6b55-4d22-9a1f-4b512c345002', 'b92499b7-880d-4c02-8aac-a4073c213a4c'),
  ('8c91a033-6b55-4d22-9a1f-4b512c345002', 'd4d6cb33-3692-4482-9450-bcebd328fd96');

INSERT OR IGNORE INTO galleries (id, place_id, image_url, alt_text, sort_order) VALUES
  ('8c91a033-photo-001', '8c91a033-6b55-4d22-9a1f-4b512c345002', 'https://drive.google.com/file/d/1qHrNLxbLNDHRJYN3rneU3QSusgZ9m7L0/view?usp=drive_link', 'Cup ikonik merah Kubik Koffie berlatar ruang indoor dan bar kopi', 0),
  ('8c91a033-photo-002', '8c91a033-6b55-4d22-9a1f-4b512c345002', 'https://drive.google.com/file/d/12CbHTT49OJAQRjcmHa9ufeVGJw6PyGpj/view?usp=drive_link', 'Fasad depan bangunan Kubik Koffie Coworking & Artspace', 1),
  ('8c91a033-photo-003', '8c91a033-6b55-4d22-9a1f-4b512c345002', 'https://drive.google.com/file/d/15PysjSQNRx8L6S1Tl8DcNolnFg-bn4p8/view?usp=drive_link', 'Teras berkanopi hijau Kubik Koffie dengan tanaman tropis', 2),
  ('8c91a033-photo-004', '8c91a033-6b55-4d22-9a1f-4b512c345002', 'https://drive.google.com/file/d/1TKtdjMu2koTjsDbXSPhUOc1-qWYrLVoS/view?usp=drive_link', 'Sajian Cafe Latte hangat dengan latte art di atas bar', 3),
  ('8c91a033-photo-005', '8c91a033-6b55-4d22-9a1f-4b512c345002', 'https://drive.google.com/file/d/1vQcCtC3ToHbCwFEFgi1VRuC01SgF87t6/view?usp=drive_link', 'Area duduk dinding bata ekspos dengan hiasan tipografi Scrabble', 4);

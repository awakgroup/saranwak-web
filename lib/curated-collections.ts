import type { Place } from "@/types/database";

export interface CuratedCollection {
    slug: string;
    title: string;
    shortTitle: string;
    metaTitle: string;
    metaDescription: string;
    emoji: string;
    badge: string;
    lead: string;
    editorialParagraphs: string[];
    filterTags: string[];
    customFilter?: (place: Place) => boolean;
    tips: string[];
    faqs: { question: string; answer: string }[];
}

export const CURATED_COLLECTIONS: CuratedCollection[] = [
    {
        slug: "outdoor",
        title: "Rekomendasi Cafe Outdoor Terbaik di Padang — Suasana Sejuk & Asri",
        shortTitle: "Cafe Outdoor",
        metaTitle: "Rekomendasi Cafe Outdoor Terbaik di Padang | Saranwak",
        metaDescription:
            "Daftar coffee shop outdoor terbaik di Padang dengan area terbuka yang luas, suasana asri, dan pemandangan senja yang cocok untuk nongkrong sore hingga malam.",
        emoji: "🌿",
        badge: "Open Air & Vibe Asik",
        lead: "Pilihan coffee shop dengan area outdoor luas di Padang untuk menikmati angin sore, senja, dan suasana santai bareng teman.",
        editorialParagraphs: [
            "Kota Padang memiliki iklim tropis pesisir yang paling nikmat dinikmati saat sore menjelang malam. Banyak cafe lokal di Padang kini merancang area terbuka (outdoor) dengan tata tanaman hijau, pepohonan rindang, hingga konsep industrial modern yang lega.",
            "Area outdoor sangat ideal untuk nongkrong santai bersama komunitas atau teman tanpa merasa pengap. Di daftar ini, Saranwak memilihkan tempat-tempat ngopi outdoor terbaik di Padang yang memiliki pencahayaan temaram hangat saat malam hari dan sirkulasi udara yang nyaman.",
        ],
        filterTags: ["outdoor"],
        tips: [
            "Waktu terbaik berkunjung adalah pukul 16.30 - 18.30 WIB untuk menikmati pemandangan senja Padang tanpa terik panas.",
            "Pastikan memilih tempat yang memiliki kanopi atau area semi-outdoor cadangan jika tiba-tiba turun hujan sore khas Padang.",
        ],
        faqs: [
            {
                question: "Kapan waktu paling pas nongkrong di cafe outdoor Padang?",
                answer:
                    "Sore hari mulai pukul 16.30 WIB adalah waktu favorit karena cuaca mulai teduh dan angin pesisir Padang mulai sejuk menjelang matahari terbenam.",
            },
            {
                question: "Apakah cafe outdoor di Padang menyediakan colokan listrik?",
                answer:
                    "Sebagian besar cafe outdoor menyediakan colokan di meja yang menempel ke dinding atau pilar utama. Namun jika butuh colokan banyak untuk laptop, area semi-outdoor atau indoor tetap lebih disarankan.",
            },
        ],
    },
    {
        slug: "nugas-wfc",
        title: "Rekomendasi Cafe Nugas & WFC di Padang — WiFi Kencang & Colokan Banyak",
        shortTitle: "Cafe Nugas & WFC",
        metaTitle: "Rekomendasi Cafe Nugas & WFC di Padang (WiFi & Colokan) | Saranwak",
        metaDescription:
            "Kumpulan coffee shop ternyaman untuk nugas skripsi, kerja remote (WFC), dan laptopan di Padang dengan WiFi stabil, stopkontak memadai, dan ruangan AC tenang.",
        emoji: "💻",
        badge: "Fokus & Produktif",
        lead: "Cari tempat nugas laptopan atau kerja remote yang kondusif di Padang dengan WiFi kencang, banyak colokan, dan kursi nyaman.",
        editorialParagraphs: [
            "Bagi mahasiswa universitas di Padang (seperti UNAND, UNP, UIN IB) maupun profesional yang bekerja secara remote / WFC (Work from Cafe), mencari coffee shop yang tepat bukan cuma soal rasa kopi, tapi soal kestabilan koneksi internet dan ketersediaan stopkontak.",
            "Saranwak mengkurasi cafe nugas di Padang yang memenuhi kriteria meja ergonomis yang pas untuk laptop, jarak antar meja yang tidak terlalu sempit, serta suasana yang tidak terlalu bising di jam-jam siang hingga malam.",
        ],
        filterTags: ["nugas", "wfc", "colokan", "wifi"],
        tips: [
            "Datang di siang hari antara pukul 11.00 - 15.00 WIB untuk mendapatkan spot dekat colokan dan suasana yang lebih tenang sebelum ramai di sore hari.",
            "Pilih tempat yang menyediakan area indoor ber-AC dan stopkontak di setiap barisan meja.",
        ],
        faqs: [
            {
                question: "Fasilitas apa saja yang penting untuk nugas di cafe Padang?",
                answer:
                    "Prioritas utama adalah koneksi WiFi stabil minimal 20-50 Mbps, stopkontak listrik mudah dijangkau, meja dengan tinggi standar, dan pencahayaan yang cukup.",
            },
            {
                question: "Apakah ada cafe di Padang yang buka hingga larut malam untuk nugas?",
                answer:
                    "Ya, ada beberapa spot ngopi di Padang yang buka 24 jam atau hingga pukul 00.00 WIB seperti Kopi Kita Fabriek dan sejumlah coffee shop di area Koto Tangah dan Padang Barat.",
            },
        ],
    },
    {
        slug: "nongkrong",
        title: "Tempat Nongkrong Santai di Padang — Cafe Asik & Seru Bareng Teman",
        shortTitle: "Tempat Nongkrong",
        metaTitle: "Tempat Nongkrong Santai & Asik di Padang | Saranwak",
        metaDescription:
            "Temukan tempat nongkrong terfavorit di Padang untuk kumpul santai bareng teman, obrolan seru, hingga hangout akhir pekan dengan suasana nyaman.",
        emoji: "💬",
        badge: "Hangout & Seru",
        lead: "Pilihan spot ngopi dan nongkrong paling hits di Padang untuk kumpul teman, obrolan santai, hingga suasana hidup di akhir pekan.",
        editorialParagraphs: [
            "Nongkrong di coffee shop sudah menjadi bagian tak terpisahkan dari gaya hidup anak muda dan komunitas di Padang. Mulai dari obrolan santai sore hari, diskusi proyek kreatif, hingga reuni kecil bersama sahabat.",
            "Kategori nongkrong ini memuat cafe-cafe di Padang yang memiliki tempat duduk komunal yang lapang, menu cemilan sharing yang beragam, serta atmosfer hangat yang bikin betah duduk berjam-jam tanpa canggung.",
        ],
        filterTags: ["nongkrong", "rame"],
        tips: [
            "Untuk kumpul rombongan di atas 5 orang, pilih cafe dengan kapasitas seating area komunal atau meja panjang di area outdoor.",
            "Cek apakah cafe memiliki variasi menu non-kopi dan makanan ringan sharing seperti kentang goreng, tahu cabe garam, atau roti bakar.",
        ],
        faqs: [
            {
                question: "Berapa rata-rata budget nongkrong di cafe Padang?",
                answer:
                    "Rata-rata pengeluaran berkisar antara Rp20.000 hingga Rp45.000 per orang untuk satu minuman dan cemilan ringan.",
            },
        ],
    },
    {
        slug: "first-date",
        title: "Rekomendasi Cafe First Date di Padang — Suasana Hangat, Tenang & Aesthetic",
        shortTitle: "Cafe First Date",
        metaTitle: "Rekomendasi Cafe First Date & Romantis di Padang | Saranwak",
        metaDescription:
            "Spot cafe pilihan di Padang yang paling cocok untuk first date atau ngobrol berdua dengan vibes hangat, pencahayaan estetik, dan musik yang tidak bising.",
        emoji: "💕",
        badge: "Warm & Intimate",
        lead: "Pilihan coffee shop aesthetic dengan suasana tenang dan intim di Padang untuk kencan pertama yang nyaman tanpa canggung.",
        editorialParagraphs: [
            "First date butuh tempat yang mendukung percakapan mengalir lancar. Tempat yang terlalu bising atau musik yang terlalu keras seringkali membuat obrolan terasa melelahkan, sementara tempat yang terlalu kaku bisa membuat suasana canggung.",
            "Kurasi ini memilihkan coffee shop di Padang yang memiliki tata ruang nyaman, pencahayaan warm aesthetic, serta alunan playlist musik yang lembut sehingga kamu dan teman kencan bisa saling bercerita dengan nyaman.",
        ],
        filterTags: ["nge-date", "tenang", "aesthetic"],
        tips: [
            "Pilih jam temu sekitar pukul 16.30 atau 19.30 WIB untuk suasana pencahayaan lampu temaram yang paling estetik.",
            "Pilih tempat duduk pojok semi-private agar percakapan lebih fokus dan tidak terganggu lalu-lalang pengunjung lain.",
        ],
        faqs: [
            {
                question: "Ciri cafe yang cocok untuk first date di Padang?",
                answer:
                    "Volume musik latar tidak terlalu keras, jarak antar meja memiliki privasi yang cukup, tempat bersih, dan memiliki variasi menu mocktail atau dessert yang menarik.",
            },
        ],
    },
    {
        slug: "murah",
        title: "Rekomendasi Cafe Murah di Padang — Hemat & Ramah Kantong Mahasiswa",
        shortTitle: "Cafe Murah & Hemat",
        metaTitle: "Rekomendasi Cafe Murah & Hemat di Padang (<25k) | Saranwak",
        metaDescription:
            "Daftar coffee shop terjangkau di Padang dengan harga menu di bawah Rp25.000, cocok untuk mahasiswa yang ingin ngopi dan nugas tanpa bikin kantong jebol.",
        emoji: "🏷️",
        badge: "Ramah Kantong",
        lead: "Koleksi coffee shop enak dan nyaman di Padang dengan harga bersahabat di bawah Rp25rb, pas untuk kantong pelajar dan mahasiswa.",
        editorialParagraphs: [
            "Ngopi enak dan nugas nyaman tidak harus mahal. Di berbagai sudut kota Padang—mulai dari sekitaran kampus hingga pusat kota—terdapat banyak coffee shop berkualitas dengan harga menu yang sangat ramah kantong mahasiswa.",
            "Saranwak menyeleksi tempat-tempat dengan harga kopi susu atau minuman mulai belasan ribu rupiah, namun tetap menyediakan fasilitas tempat duduk yang layak, colokan, dan WiFi gratis.",
        ],
        filterTags: ["nugas", "nongkrong"],
        customFilter: (place: Place) => {
            const min = place.price_min ?? 0;
            const max = place.price_max ?? 999999;
            return min <= 20000 || max <= 30000;
        },
        tips: [
            "Cek promo 'happy hour' atau paket bundling kopi + toast yang sering ditawarkan cafe di hari kerja (weekdays).",
        ],
        faqs: [
            {
                question: "Berapa kisaran harga menu di cafe murah Padang?",
                answer:
                    "Harga minuman kopi susu signature biasanya dibanderol mulai Rp15.000 - Rp22.000, dan cemilan berkisar antara Rp12.000 - Rp20.000.",
            },
        ],
    },
    {
        slug: "board-game",
        title: "Rekomendasi Cafe Board Game di Padang — Seru Main Bareng Teman",
        shortTitle: "Cafe Board Game",
        metaTitle: "Cafe Board Game di Padang — Tempat Seru Main Bareng | Saranwak",
        metaDescription:
            "Pilihan coffee shop di Padang yang menyediakan berbagai permainan board game seru seperti Uno, Catan, Werewolf, dan kartu untuk nongkrong rame-rame.",
        emoji: "🎲",
        badge: "Game & Komunal",
        lead: "Tempat nongkrong di Padang yang menyediakan aneka board game seru untuk dimainkan bareng teman sambil ngopi santai.",
        editorialParagraphs: [
            "Bosan nongkrong yang cuma masing-masing sibuk melihat layar smartphone? Cafe dengan fasilitas board game adalah solusi terbaik untuk mencairkan suasana dan membangun interaksi seru bersama teman-teman.",
            "Di Padang, spot ngopi dengan koleksi permainan meja seperti Uno Stacko, kartu, catur, hingga aneka game strategi menjadi magnet tersendiri untuk hangout akhir pekan yang penuh tawa.",
        ],
        filterTags: ["board-game"],
        tips: [
            "Ajak minimal 3-6 orang teman agar permainan board game seperti Uno Stacko atau Werewolf menjadi jauh lebih meriah.",
        ],
        faqs: [
            {
                question: "Apakah bermain board game di cafe Padang dikenakan biaya tambahan?",
                answer:
                    "Umumnya board game disediakan gratis bagi pengunjung yang memesan makanan atau minuman di cafe tersebut.",
            },
        ],
    },
];

export function getCuratedCollection(slug: string): CuratedCollection | undefined {
    return CURATED_COLLECTIONS.find((c) => c.slug === slug);
}

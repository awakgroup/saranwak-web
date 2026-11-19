import type { Metadata } from "next";
import { SavedPlacesPageClient } from "@/components/SavedPlacesPageClient";

export const metadata: Metadata = {
    title: "Tempat Tersimpan — Koleksi Coffee Shop & Spot WFC Favorit di Padang | Saranwak",
    description:
        "Daftar coffee shop dan spot WFC favorit yang kamu simpan di Saranwak Padang. Akses cepat rute Google Maps dan info jam buka.",
    alternates: {
        canonical: "https://saranwak.com/saved",
    },
    openGraph: {
        title: "Tempat Tersimpan | Saranwak Padang",
        description: "Daftar coffee shop pilihan yang kamu simpan.",
        url: "https://saranwak.com/saved",
        type: "website",
    },
};

export default function SavedPage() {
    return <SavedPlacesPageClient />;
}

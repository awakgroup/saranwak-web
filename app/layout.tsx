import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const siteUrl = "https://saranwak.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: "Saranwak - Rekomendasi Tempat di Padang",
  description:
    "Cari coffee shop, tempat nugas, tempat nongkrong, dan destinasi lokal terbaik di Padang.",

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },

  openGraph: {
    title: "Saranwak - Rekomendasi Tempat di Padang",
    description:
      "Cari coffee shop, tempat nugas, tempat nongkrong, dan destinasi lokal terbaik di Padang.",
    url: siteUrl,
    siteName: "Saranwak",
    images: [
      {
        url: `${siteUrl}/og-saranwak-banner.png`,
        width: 1200,
        height: 630,
        alt: "Saranwak - Rekomendasi Tempat di Padang",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Saranwak - Rekomendasi Tempat di Padang",
    description:
      "Cari coffee shop, tempat nugas, tempat nongkrong, dan destinasi lokal terbaik di Padang.",
    images: [`${siteUrl}/og-saranwak-banner.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
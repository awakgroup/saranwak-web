import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const siteUrl = "https://saranwak.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Saranwak - Rekomendasi Coffee Shop di Padang",
    template: "%s | Saranwak",
  },

  description:
    "Cari coffee shop di Padang berdasarkan mood, kebutuhan, fasilitas, dan area. Temukan tempat nugas, nongkrong, first date, dan ngopi santai.",

  keywords: [
    "Saranwak",
    "coffee shop Padang",
    "rekomendasi coffee shop Padang",
    "tempat nongkrong Padang",
    "tempat nugas Padang",
    "cafe Padang",
    "rekomendasi cafe Padang",
    "coffee shop untuk nugas",
    "coffee shop aesthetic Padang",
  ],

  authors: [
    {
      name: "Saranwak",
    },
  ],

  creator: "Saranwak",
  publisher: "Saranwak",

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },

  openGraph: {
    title: "Saranwak - Rekomendasi Coffee Shop di Padang",
    description:
      "Cari coffee shop di Padang berdasarkan mood, kebutuhan, fasilitas, dan area. Temukan tempat nugas, nongkrong, first date, dan ngopi santai.",
    url: siteUrl,
    siteName: "Saranwak",
    images: [
      {
        url: `${siteUrl}/og-saranwak-banner.png`,
        width: 1200,
        height: 630,
        alt: "Saranwak - Rekomendasi Coffee Shop di Padang",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Saranwak - Rekomendasi Coffee Shop di Padang",
    description:
      "Cari coffee shop di Padang berdasarkan mood, kebutuhan, fasilitas, dan area.",
    images: [`${siteUrl}/og-saranwak-banner.png`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
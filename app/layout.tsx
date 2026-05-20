import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const siteUrl = "https://saranwak.com";

const siteTitle =
  "Saranwak — Cari Coffee Shop di Padang Sesuai Mood dan Kebutuhan";

const siteDescription =
  "Temukan coffee shop di Padang berdasarkan budget, aktivitas, fasilitas, dan vibes. Cocok untuk nugas, nongkrong, first date, meeting, dan me time.";

const ogImage = `${siteUrl}/og-saranwak-banner.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: siteTitle,
    template: "%s | Saranwak",
  },

  description: siteDescription,

  keywords: [
    "Saranwak",
    "coffee shop Padang",
    "cafe Padang",
    "rekomendasi coffee shop Padang",
    "rekomendasi cafe Padang",
    "tempat nongkrong Padang",
    "tempat nugas Padang",
    "tempat first date Padang",
    "coffee shop wifi Padang",
    "coffee shop colokan Padang",
    "coffee shop aesthetic Padang",
    "coffee shop murah Padang",
    "local guide Padang",
    "tempat ngopi Padang",
    "WFC Padang",
  ],

  authors: [
    {
      name: "Saranwak",
      url: siteUrl,
    },
  ],

  creator: "Saranwak",
  publisher: "Saranwak",
  applicationName: "Saranwak",
  category: "Local Guide",

  alternates: {
    canonical: siteUrl,
  },

  icons: {
    icon: [
      {
        url: "/favicon.png",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },

  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Saranwak",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Saranwak - Cari coffee shop di Padang sesuai mood dan kebutuhan",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F4F1EA",
  colorScheme: "light",
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
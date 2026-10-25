import type { ReactNode } from "react";
import { promises as fs } from "fs";
import path from "path";

import { FeaturedPlacesSection } from "@/components/home/FeaturedPlacesSection";
import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HOME_FAQS } from "@/lib/faq-data";
import { OwnerBusinessSection } from "@/components/home/OwnerBusinessSection";
import PromoBannerCarousel from "@/components/PromoBannerCarousel";
import { WhySaranwak } from "@/components/WhySaranwak";
import { getFeaturedPlaces, type ApiPlace } from "@/lib/api/places";
import type { Place } from "@/types/database";

export const revalidate = 3600;

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://saranwak.com/#website",
      "url": "https://saranwak.com",
      "name": "Saranwak",
      "alternateName": [
        "Saran Wak",
        "Saranwak Padang",
        "saranwak.com",
        "Saranwak Coffee Guide"
      ],
      "description":
        "Platform panduan lokal dan direktori kurasi coffee shop di Padang berdasarkan suasana, kebutuhan nugas/WFC, budget, dan fasilitas.",
      "disambiguatingDescription":
        "Saranwak adalah direktori kurasi lokal independen untuk mencari rekomendasi coffee shop, cafe, dan ruang kerja di Kota Padang, Sumatera Barat. Bukan layanan konseling atau curhat pribadi.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://saranwak.com/places?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
      "inLanguage": "id-ID",
    },
    {
      "@type": "Organization",
      "@id": "https://saranwak.com/#organization",
      "name": "Saranwak",
      "alternateName": ["Saran Wak", "Saranwak Padang"],
      "url": "https://saranwak.com",
      "logo": "https://saranwak.com/favicon.png",
      "description":
        "Panduan lokal terkurasi untuk menemukan coffee shop, cafe, dan tempat nongkrong di Padang sesuai mood dan kebutuhan.",
      "disambiguatingDescription":
        "Saranwak adalah platform teknologi dan direktori kurasi spot ngopi lokal di Kota Padang, Sumatera Barat, Indonesia.",
      "knowsAbout": [
        "Coffee Shop di Padang",
        "Rekomendasi Cafe di Padang",
        "Tempat Nugas dan WFC di Padang",
        "Tempat Nongkrong Padang",
        "Kuliner dan Wisata Kota Padang",
        "Direktori Kafe Sumatera Barat"
      ],
      "areaServed": {
        "@type": "City",
        "name": "Padang",
        "containedInPlace": {
          "@type": "State",
          "name": "Sumatera Barat",
          "addressCountry": "ID",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -0.9471,
          "longitude": 100.4172,
        },
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://saranwak.com/#faq",
      "mainEntity": HOME_FAQS.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    },
  ],
};

export default async function Home() {
  const places = await getHomeFeaturedPlaces();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4F1EA] text-[#141414]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeJsonLd),
        }}
      />
      <HomeBackground />

      <div className="relative z-10">
        <HomeHeroSection />

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-14 sm:gap-12 sm:px-6 lg:gap-14 lg:px-8 lg:pb-20">
          <SectionBlock variant="compact">
            <PromoBannerCarousel />
          </SectionBlock>

          <SectionBlock>
            <FeaturedPlacesSection places={places} />
          </SectionBlock>

          <SectionBlock>
            <WhySaranwak />
          </SectionBlock>

          <SectionBlock>
            <HomeFaqSection />
          </SectionBlock>

          <SectionBlock variant="last">
            <OwnerBusinessSection />
          </SectionBlock>
        </div>
      </div>
    </main>
  );
}

async function getHomeFeaturedPlaces(): Promise<Place[]> {
  try {
    const places = await getFeaturedPlaces(6);

    if (places && places.length > 0) {
      return places.map(mapApiPlaceToLegacyPlace);
    }
  } catch (error) {
    console.error("Featured places D1 fetch error:", error);
  }

  try {
    const filePath = path.join(process.cwd(), "public", "data", "places.json");
    const fileContent = await fs.readFile(filePath, "utf8");
    const jsonPlaces = JSON.parse(fileContent) as Place[];
    return jsonPlaces.filter((p) => p.is_featured).slice(0, 6);
  } catch (fallbackError) {
    console.error("Featured places JSON fallback error:", fallbackError);
    return [];
  }
}

function mapApiPlaceToLegacyPlace(place: ApiPlace): Place {
  return {
    ...place,

    /**
     * Adapter field lama.
     * Component existing Saranwak kemungkinan masih pakai nama field lama.
     */
    maps_url: place.google_maps_url,
    is_published: Boolean(place.is_active),
    is_featured: Boolean(place.is_featured),

    /**
     * Fallback supaya komponen lama tidak crash kalau field ini belum ada.
     */
    tags: [],
    gallery: [],
  } as unknown as Place;
}

function SectionBlock({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "compact" | "last";
}) {
  return (
    <section
      className={[
        "relative",
        variant === "compact" ? "pt-0" : "",
        variant === "last" ? "pt-1" : "",
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function HomeBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      {/* Mid-page ambient warmth for Featured Places & Promos */}
      <div className="absolute left-[-160px] top-[750px] h-[500px] w-[500px] rounded-full bg-[#E5A86D]/15 blur-[120px]" />
      <div className="absolute right-[-140px] top-[1400px] h-[520px] w-[520px] rounded-full bg-[#1F5A4A]/10 blur-[130px]" />
      <div className="absolute bottom-[400px] left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-[#F6D7A7]/15 blur-[110px]" />

      {/* Global subtle paper grain */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
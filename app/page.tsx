import type { ReactNode } from "react";

import { FeaturedPlacesSection } from "@/components/home/FeaturedPlacesSection";
import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import { OwnerBusinessSection } from "@/components/home/OwnerBusinessSection";
import PromoBannerCarousel from "@/components/PromoBannerCarousel";
import { WhySaranwak } from "@/components/WhySaranwak";
import { getFeaturedPlaces, type ApiPlace } from "@/lib/api/places";
import type { Place } from "@/types/database";

export const revalidate = 3600;

export default async function Home() {
  const places = await getHomeFeaturedPlaces();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4F1EA] text-[#141414]">
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

    return places.map(mapApiPlaceToLegacyPlace);
  } catch (error) {
    console.error("Featured places D1 fetch error:", error);
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
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute left-[-160px] top-[-140px] h-[360px] w-[360px] rounded-full bg-[#E8B86D]/25 blur-3xl" />
      <div className="absolute right-[-180px] top-[220px] h-[420px] w-[420px] rounded-full bg-[#C47A3B]/15 blur-3xl" />
      <div className="absolute bottom-[260px] left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#F6D7A7]/20 blur-3xl" />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.45),rgba(244,241,234,0.6)_32%,rgba(244,241,234,1))]" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
    </div>
  );
}
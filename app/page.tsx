import { FeaturedPlacesSection } from "@/components/home/FeaturedPlacesSection";
import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import { OwnerBusinessSection } from "@/components/home/OwnerBusinessSection";
import PromoBannerCarousel from "@/components/PromoBannerCarousel";
import { WhySaranwak } from "@/components/WhySaranwak";
import { getFeaturedPlaces } from "@/lib/queries/places";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const places = await getFeaturedPlaces();

  return (
    <main className="min-h-screen overflow-hidden bg-[#F4F1EA] text-[#141414]">
      <PromoBannerCarousel />

      <HomeHeroSection />

      <WhySaranwak />

      <FeaturedPlacesSection places={places} />

      <OwnerBusinessSection />
    </main>
  );
}
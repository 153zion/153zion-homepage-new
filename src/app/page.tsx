import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import StorySection from "@/components/sections/StorySection";
import ServiceSection from "@/components/sections/ServiceSection";
import ProcessSection from "@/components/sections/ProcessSection";
import ProofSection from "@/components/sections/ProofSection";
import LeadMagnetSection from "@/components/sections/LeadMagnetSection";
import OfferSection from "@/components/sections/OfferSection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ProblemSection />
      <StorySection />
      <ServiceSection />
      <ProcessSection />
      <ProofSection />
      <LeadMagnetSection />
      <OfferSection />
    </div>
  );
}

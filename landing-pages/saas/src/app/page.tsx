import { Header } from "@/components/sections/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { SocialProof } from "@/components/sections/SocialProof";
import { BentoFeatures } from "@/components/sections/BentoFeatures";
import { PricingSection } from "@/components/sections/PricingSection";
import { TestimonialFAQSection } from "@/components/sections/TestimonialFAQSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <HeroSection />
      <SocialProof />
      <BentoFeatures />
      <PricingSection />
      <TestimonialFAQSection />
      <Footer />
    </main>
  );
}

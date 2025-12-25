import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { EventTypesSection } from "@/components/sections/EventTypesSection";
import { PortfolioPreviewSection } from "@/components/sections/PortfolioPreviewSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { HowItWorksPreviewSection } from "@/components/sections/HowItWorksPreviewSection";
import { CTASection } from "@/components/sections/CTASection";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <Layout>
      <SEO 
        title="VibeLink Ghana | Digital Event Invitations for Weddings, Funerals & More"
        description="Ghana's premier digital invitation service. Create stunning interactive invitations for weddings, funerals, naming ceremonies, graduations & corporate events. Share via WhatsApp!"
        canonical="/"
      />
      <HeroSection />
      <FeaturesSection />
      <EventTypesSection />
      <PortfolioPreviewSection />
      <TestimonialsSection />
      <HowItWorksPreviewSection />
      <CTASection />
    </Layout>
  );
};

export default Index;

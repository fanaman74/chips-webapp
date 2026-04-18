import { Hero } from "@/components/marketing/hero";
import { LogoWall } from "@/components/marketing/logo-wall";
import { ProgramCards } from "@/components/marketing/program-cards";
import { FeaturedProjects } from "@/components/marketing/featured-projects";
import { OpenCallsSection } from "@/components/marketing/open-calls";
import { EuropeMap } from "@/components/marketing/europe-map";
import { NewsSection } from "@/components/marketing/news-section";
import { CtaBand } from "@/components/marketing/cta-band";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoWall />
      <ProgramCards />
      <FeaturedProjects />
      <OpenCallsSection />
      <EuropeMap />
      <NewsSection />
      <CtaBand />
    </>
  );
}

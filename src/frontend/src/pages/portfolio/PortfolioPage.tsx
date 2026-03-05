import React, { useCallback } from "react";
import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";
import { GallerySection } from "./GallerySection";
import { HeroSection } from "./HeroSection";
import { Navbar } from "./Navbar";
import { StatsSection } from "./StatsSection";

export function PortfolioPage() {
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onScrollToSection={scrollToSection} />
      <main>
        <HeroSection onScrollToSection={scrollToSection} />
        <AboutSection />
        <GallerySection />
        <StatsSection />
        <ContactSection />
      </main>
    </div>
  );
}

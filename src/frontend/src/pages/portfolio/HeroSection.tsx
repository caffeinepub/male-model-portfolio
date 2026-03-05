import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface HeroSectionProps {
  onScrollToSection: (id: string) => void;
}

export function HeroSection({ onScrollToSection }: HeroSectionProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const scrollY = window.scrollY;
        // Move background at 40% of scroll speed for depth
        bgRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="hero"
      data-ocid="hero.section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background */}
      <div
        ref={bgRef}
        className="absolute inset-0 scale-110"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-main.dim_1200x1800.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          willChange: "transform",
        }}
      />

      {/* Multi-layer overlay for depth — lighter so photo reads clearly */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10" />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Hero content — anchored to bottom so face is fully visible */}
      <div className="absolute bottom-24 left-0 right-0 z-10 text-center px-6">
        {/* Agency tag */}
        <p
          className={`text-[10px] tracking-widest3 uppercase font-sans font-light text-white/45 mb-4 transition-all duration-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          Elite Model Management
        </p>

        {/* Main name */}
        <h1
          className={`font-display font-black uppercase leading-none tracking-tight transition-all duration-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            fontSize: "clamp(2rem, 5vw, 4.5rem)",
            letterSpacing: "-0.02em",
            transitionDelay: "400ms",
          }}
        >
          <span className="block text-white">ALEXANDER</span>
          <span className="block text-gold-shimmer">CROSS</span>
        </h1>

        {/* Thin divider */}
        <div
          className={`flex items-center justify-center gap-3 my-4 transition-all duration-1000 ${
            loaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold/50" />
          <span className="text-gold text-[10px]">✦</span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold/50" />
        </div>

        {/* Tagline */}
        <p
          className={`font-sans font-light text-[10px] tracking-widest2 uppercase text-white/60 transition-all duration-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          Model · Editorial · Runway
        </p>
      </div>

      {/* Scroll indicator */}
      <button
        type="button"
        onClick={() => onScrollToSection("about")}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
        aria-label="Scroll to about section"
      >
        <span className="text-xs tracking-widest uppercase font-sans font-light">
          Scroll
        </span>
        <ChevronDown className="h-5 w-5 animate-bounce-gentle" />
      </button>
    </section>
  );
}

import { useGetBio } from "@/hooks/useQueries";
import React, { useEffect, useRef } from "react";

const DEFAULT_BIO = `Born in Milan and raised between the catwalks of Paris and the studios of New York, Alexander Cross has established himself as one of the most sought-after faces in contemporary fashion. His commanding presence and versatile aesthetic have graced the covers of Vogue Hommes, GQ Italia, and Harper's Bazaar.

With over seven years in the industry, Alexander has collaborated with the world's leading designers — from Valentino's Spring Couture to Burberry's latest campaign, his work spans the full spectrum of high fashion. Known for his ability to embody both raw masculinity and refined elegance, he brings a rare depth to every shoot.

When not traveling for editorial shoots across four continents, Alexander studies classical sculpture at the Beaux-Arts, a passion that informs his approach to posture, form, and the architecture of the human figure.`;

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data: bio } = useGetBio();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            for (const el of section.querySelectorAll(
              ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right",
            )) {
              el.classList.add("revealed");
            }
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const bioText = bio && bio.length > 0 ? bio : DEFAULT_BIO;

  return (
    <section
      id="about"
      data-ocid="about.section"
      ref={sectionRef}
      className="relative py-28 lg:py-40 overflow-hidden"
      style={{
        backgroundColor: "oklch(0.09 0 0)",
      }}
    >
      {/* Subtle background image overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url('/assets/generated/about-bg.dim_1600x900.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "luminosity",
        }}
      />

      {/* Decorative vertical line */}
      <div className="absolute left-1/2 top-0 w-px h-16 bg-gradient-to-b from-transparent to-gold/30 hidden lg:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left — decorative vertical name */}
          <div className="scroll-reveal-left hidden lg:flex flex-col items-start justify-start">
            {/* Large decorative initial */}
            <div className="relative">
              <span
                className="font-display font-black text-white/5 select-none leading-none"
                style={{ fontSize: "clamp(8rem, 18vw, 20rem)" }}
              >
                AC
              </span>
              {/* Vertical text overlay */}
              <div className="absolute top-8 left-6 flex flex-col gap-1">
                <span className="text-xs tracking-widest3 uppercase text-white/30 font-sans">
                  {Array.from("Alexander Cross").map((char, idx) => (
                    <span
                      // biome-ignore lint/suspicious/noArrayIndexKey: static decorative character list
                      key={idx}
                      className="block"
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>
              </div>
            </div>

            {/* Gold accent line */}
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px w-24 bg-gradient-to-r from-gold to-transparent" />
              <span className="text-gold text-xs tracking-widest uppercase font-sans">
                Est. 2017
              </span>
            </div>

            {/* Quote */}
            <blockquote className="mt-10 text-white/40 font-display italic text-xl leading-relaxed max-w-xs">
              "Fashion is the armor to survive the reality of everyday life."
            </blockquote>
          </div>

          {/* Right — bio text */}
          <div className="scroll-reveal">
            {/* Section label */}
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px w-10 bg-gold" />
              <span className="text-gold text-xs tracking-widest2 uppercase font-sans font-medium">
                About
              </span>
            </div>

            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight mb-8">
              The Model.
              <br />
              <span className="text-white/50">The Artist.</span>
            </h2>

            {/* Bio paragraphs */}
            <div className="space-y-5">
              {bioText.split("\n\n").map((para, idx) => (
                <p
                  // biome-ignore lint/suspicious/noArrayIndexKey: bio paragraphs are content-split, index is stable
                  key={idx}
                  className="font-sans text-white/65 leading-relaxed text-base lg:text-lg"
                >
                  {para.trim()}
                </p>
              ))}
            </div>

            {/* Stats strip */}
            <div className="mt-12 pt-10 border-t border-white/8 grid grid-cols-3 gap-6">
              {[
                { value: "7+", label: "Years" },
                { value: "50+", label: "Campaigns" },
                { value: "4", label: "Continents" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="font-display text-3xl font-bold text-gold leading-none">
                    {item.value}
                  </div>
                  <div className="font-sans text-xs uppercase tracking-widest text-white/40 mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import type { ModelStats } from "@/backend";
import { useGetModelStats } from "@/hooks/useQueries";
import React, { useState, useEffect, useRef } from "react";

const DEFAULT_STATS: ModelStats = {
  height: 188,
  chest: 38,
  waist: 31,
  hips: 36,
  shoes: 11,
  agencyName: "Elite Model Management",
  agencyUrl: "https://elitemodel.com",
  experience: 7n,
};

interface StatItemProps {
  value: string;
  label: string;
  unit?: string;
  animate?: boolean;
  numericValue?: number;
}

function StatItem({
  value,
  label,
  unit,
  animate,
  numericValue,
}: StatItemProps) {
  const [displayed, setDisplayed] = useState(animate ? "0" : value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!animate || !numericValue || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1500;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const current = Math.round(numericValue * eased);
      setDisplayed(current.toString());
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }, [animate, numericValue]);

  return (
    <div className="text-center py-8 px-4 relative group">
      {/* Subtle hover highlight */}
      <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/3 transition-colors duration-500" />

      <div className="relative z-10">
        <div className="stat-number mb-2">
          {animate && numericValue ? displayed : value}
          {unit && (
            <span
              className="font-sans font-light text-xl text-white/30 ml-1"
              style={{ fontSize: "1rem" }}
            >
              {unit}
            </span>
          )}
        </div>
        <div className="font-sans text-xs uppercase tracking-widest2 text-white/35 font-medium">
          {label}
        </div>
      </div>
    </div>
  );
}

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { data: stats } = useGetModelStats();

  const displayStats = stats || DEFAULT_STATS;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            for (const el of section.querySelectorAll(".scroll-reveal")) {
              el.classList.add("revealed");
            }
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="stats"
      data-ocid="stats.section"
      ref={sectionRef}
      className="relative py-28 lg:py-40 overflow-hidden"
      style={{ backgroundColor: "oklch(0.10 0 0)" }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            oklch(0.9 0 0 / 0.3) 40px,
            oklch(0.9 0 0 / 0.3) 41px
          )`,
        }}
      />

      {/* Gold gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="scroll-reveal text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-10 bg-gold" />
            <span className="text-gold text-xs tracking-widest2 uppercase font-sans font-medium">
              The Model
            </span>
            <div className="h-px w-10 bg-gold" />
          </div>
          <h2 className="font-display text-4xl lg:text-6xl font-bold text-white leading-tight">
            Statistics
          </h2>
        </div>

        {/* Stats grid */}
        <div className="scroll-reveal">
          {/* Measurements grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border border-white/8 divide-x divide-y divide-white/8">
            <StatItem
              value={`${displayStats.height}`}
              label="Height"
              unit="cm"
              animate={isVisible}
              numericValue={displayStats.height}
            />
            <StatItem
              value={`${displayStats.chest}`}
              label="Chest"
              unit="in"
              animate={isVisible}
              numericValue={displayStats.chest}
            />
            <StatItem
              value={`${displayStats.waist}`}
              label="Waist"
              unit="in"
              animate={isVisible}
              numericValue={displayStats.waist}
            />
            <StatItem
              value={`${displayStats.hips}`}
              label="Hips"
              unit="in"
              animate={isVisible}
              numericValue={displayStats.hips}
            />
            <StatItem
              value={`${displayStats.shoes}`}
              label="Shoes"
              unit="US"
              animate={isVisible}
              numericValue={displayStats.shoes}
            />
            <StatItem
              value={`${displayStats.experience}`}
              label="Years Exp."
              unit="+"
              animate={isVisible}
              numericValue={Number(displayStats.experience)}
            />
          </div>

          {/* Agency info */}
          <div className="mt-12 border border-white/8 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="font-sans text-xs uppercase tracking-widest2 text-white/30 mb-2">
                Represented by
              </div>
              <div className="font-display text-2xl font-semibold text-white">
                {displayStats.agencyName}
              </div>
            </div>

            {displayStats.agencyUrl && (
              <a
                href={displayStats.agencyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gold/40 text-gold text-xs tracking-widest uppercase font-sans font-medium hover:bg-gold/10 hover:border-gold transition-all duration-300"
              >
                Visit Agency
                <span className="text-gold">→</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

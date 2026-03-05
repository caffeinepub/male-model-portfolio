import type { ContactInfo } from "@/backend";
import { useGetContactInfo } from "@/hooks/useQueries";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import type React from "react";
import { useEffect, useRef } from "react";

const DEFAULT_CONTACT: ContactInfo = {
  email: "booking@alexandercross.com",
  phone: "+1 (212) 555-0178",
  instagram: "@alexandercross",
  location: "New York · Paris · Milan",
};

interface ContactItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

function ContactItem({ icon, label, value, href }: ContactItemProps) {
  const content = (
    <div className="flex items-start gap-4 group">
      <div className="mt-1 text-gold/60 group-hover:text-gold transition-colors duration-300">
        {icon}
      </div>
      <div>
        <div className="font-sans text-xs uppercase tracking-widest2 text-white/30 mb-1">
          {label}
        </div>
        <div className="font-sans text-base text-white/80 group-hover:text-white transition-colors duration-300">
          {value}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
}

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data: contact } = useGetContactInfo();

  const displayContact = contact || DEFAULT_CONTACT;

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

  const year = new Date().getFullYear();

  return (
    <section
      id="contact"
      data-ocid="contact.section"
      ref={sectionRef}
      className="relative py-28 lg:py-40 overflow-hidden"
      style={{ backgroundColor: "oklch(0.07 0 0)" }}
    >
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
        {/* Header */}
        <div className="scroll-reveal mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-10 bg-gold" />
            <span className="text-gold text-xs tracking-widest2 uppercase font-sans font-medium">
              Connect
            </span>
            <div className="h-px w-10 bg-gold" />
          </div>
          <h2 className="font-display text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Get In Touch
          </h2>
          <p className="font-sans text-white/45 text-base leading-relaxed max-w-xl mx-auto">
            Available for editorial, commercial, and runway bookings worldwide.
            Represented exclusively by Elite Model Management.
          </p>
        </div>

        {/* Contact card */}
        <div
          className="scroll-reveal border border-white/8 relative overflow-hidden"
          style={{ background: "oklch(0.12 0 0)" }}
        >
          {/* Subtle gold corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold/30" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold/30" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold/30" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold/30" />

          <div className="relative z-10 p-10 grid sm:grid-cols-2 gap-8 text-left">
            <ContactItem
              icon={<Mail className="h-5 w-5" />}
              label="Email"
              value={displayContact.email}
              href={`mailto:${displayContact.email}`}
            />
            <ContactItem
              icon={<Phone className="h-5 w-5" />}
              label="Phone"
              value={displayContact.phone}
              href={`tel:${displayContact.phone.replace(/[^+\d]/g, "")}`}
            />
            <ContactItem
              icon={<Instagram className="h-5 w-5" />}
              label="Instagram"
              value={displayContact.instagram}
              href={`https://instagram.com/${displayContact.instagram.replace("@", "")}`}
            />
            <ContactItem
              icon={<MapPin className="h-5 w-5" />}
              label="Location"
              value={displayContact.location}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="scroll-reveal mt-12">
          <a
            href={`mailto:${displayContact.email}`}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-black font-sans font-semibold text-sm uppercase tracking-widest hover:bg-gold/90 transition-all duration-300 hover:shadow-gold"
          >
            Book Alexander
            <span>→</span>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 pt-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-white/25 text-xs">
            © {year} Alexander Cross. All rights reserved.
          </p>
          <p className="font-sans text-white/20 text-xs">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/35 hover:text-white/60 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </section>
  );
}

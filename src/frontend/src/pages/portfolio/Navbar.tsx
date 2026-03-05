import { Menu, X } from "lucide-react";
import React, { useState, useEffect } from "react";

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "portfolio", label: "Portfolio" },
  { id: "stats", label: "Stats" },
  { id: "contact", label: "Contact" },
];

interface NavbarProps {
  onScrollToSection: (id: string) => void;
}

export function Navbar({ onScrollToSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (id: string) => {
    onScrollToSection(id);
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${
            scrolled
              ? "bg-black/90 backdrop-blur-md border-b border-white/5 py-4"
              : "bg-transparent py-6"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNav("hero")}
            data-ocid="nav.link"
            className="font-display text-white font-bold tracking-widest uppercase text-sm hover:text-gold transition-colors"
          >
            A · C
          </button>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map(({ id, label }) => (
              <li key={id}>
                <button
                  type="button"
                  data-ocid="nav.link"
                  onClick={() => handleNav(id)}
                  className="nav-link font-sans text-xs tracking-widest uppercase font-medium text-white/60 hover:text-white transition-colors"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* Admin link — desktop */}
          <a
            href="/admin"
            className="hidden md:inline-block font-sans text-xs tracking-widest uppercase font-medium px-4 py-2 border border-white/15 text-white/40 hover:border-gold/40 hover:text-gold transition-all duration-300"
          >
            Admin
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white/60 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/98 flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Mobile logo */}
        <div className="font-display text-white font-bold tracking-widest uppercase text-2xl mb-4">
          Alexander Cross
        </div>

        {NAV_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            data-ocid="nav.link"
            onClick={() => handleNav(id)}
            className="font-sans text-xl tracking-widest uppercase font-light text-white/70 hover:text-white transition-colors"
          >
            {label}
          </button>
        ))}

        <a
          href="/admin"
          className="mt-4 font-sans text-sm tracking-widest uppercase font-medium px-6 py-3 border border-white/15 text-white/40 hover:border-gold/40 hover:text-gold transition-all"
        >
          Admin
        </a>
      </div>
    </>
  );
}

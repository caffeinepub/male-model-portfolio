import type { Photo } from "@/backend";
import { PhotoCategory, useGetAllPhotos } from "@/hooks/useQueries";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

// Static fallback photos
const FALLBACK_PHOTOS: Array<{
  id: string;
  src: string;
  caption: string;
  category: PhotoCategory;
}> = [
  {
    id: "f1",
    src: "/assets/generated/gallery-editorial-1.dim_800x800.jpg",
    caption: "Monochrome Study, Vogue Italia",
    category: PhotoCategory.editorial,
  },
  {
    id: "f2",
    src: "/assets/generated/gallery-editorial-2.dim_800x1100.jpg",
    caption: "Winter Editorial, GQ France",
    category: PhotoCategory.editorial,
  },
  {
    id: "f3",
    src: "/assets/generated/gallery-editorial-3.dim_800x1000.jpg",
    caption: "Shadow & Light, Numero Homme",
    category: PhotoCategory.editorial,
  },
  {
    id: "f4",
    src: "/assets/generated/gallery-commercial-1.dim_800x1000.jpg",
    caption: "Armani Exchange Spring Campaign",
    category: PhotoCategory.commercial,
  },
  {
    id: "f5",
    src: "/assets/generated/gallery-commercial-2.dim_800x1100.jpg",
    caption: "Hugo Boss Fragrance",
    category: PhotoCategory.commercial,
  },
  {
    id: "f6",
    src: "/assets/generated/gallery-runway-1.dim_800x1200.jpg",
    caption: "Valentino Couture SS24",
    category: PhotoCategory.runway,
  },
  {
    id: "f7",
    src: "/assets/generated/gallery-lifestyle-1.dim_1200x800.jpg",
    caption: "Italian Riviera Lookbook",
    category: PhotoCategory.lifestyle,
  },
];

type FilterCategory = "all" | PhotoCategory;

interface DisplayPhoto {
  id: string;
  src: string;
  caption: string;
  category: PhotoCategory;
}

const CATEGORIES: Array<{ key: FilterCategory; label: string }> = [
  { key: "all", label: "All" },
  { key: PhotoCategory.editorial, label: "Editorial" },
  { key: PhotoCategory.commercial, label: "Commercial" },
  { key: PhotoCategory.runway, label: "Runway" },
  { key: PhotoCategory.lifestyle, label: "Lifestyle" },
];

export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [photosRevealed, setPhotosRevealed] = useState(false);

  const { data: backendPhotos } = useGetAllPhotos();

  // Build display photos — use backend photos if available, else fallbacks
  const displayPhotos: DisplayPhoto[] = useMemo(() => {
    if (backendPhotos && backendPhotos.length > 0) {
      return backendPhotos.map((p: Photo) => ({
        id: p.id,
        src: p.blob.getDirectURL(),
        caption: p.caption,
        category: p.category,
      }));
    }
    return FALLBACK_PHOTOS;
  }, [backendPhotos]);

  const filteredPhotos =
    filter === "all"
      ? displayPhotos
      : displayPhotos.filter((p) => p.category === filter);

  // Intersection Observer for section entrance
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
            setTimeout(() => setPhotosRevealed(true), 200);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setLightboxIndex((i) =>
          i !== null ? (i + 1) % filteredPhotos.length : null,
        );
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((i) =>
          i !== null
            ? (i - 1 + filteredPhotos.length) % filteredPhotos.length
            : null,
        );
      } else if (e.key === "Escape") {
        setLightboxIndex(null);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, filteredPhotos.length]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  return (
    <section
      id="portfolio"
      data-ocid="portfolio.section"
      ref={sectionRef}
      className="py-28 lg:py-40"
      style={{ backgroundColor: "oklch(0.07 0 0)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="scroll-reveal text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-10 bg-gold" />
            <span className="text-gold text-xs tracking-widest2 uppercase font-sans font-medium">
              Portfolio
            </span>
            <div className="h-px w-10 bg-gold" />
          </div>
          <h2 className="font-display text-4xl lg:text-6xl font-bold text-white leading-tight">
            The Work
          </h2>
        </div>

        {/* Category filters */}
        <div className="scroll-reveal flex flex-wrap justify-center gap-2 mb-14">
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              data-ocid="gallery.tab"
              onClick={() => {
                setFilter(key);
                setPhotosRevealed(false);
                setTimeout(() => setPhotosRevealed(true), 50);
              }}
              className={`
                px-5 py-2 text-xs tracking-widest uppercase font-sans font-medium
                border transition-all duration-300
                ${
                  filter === key
                    ? "border-gold text-gold bg-gold/10"
                    : "border-white/15 text-white/50 hover:border-white/40 hover:text-white/80"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="masonry-grid cols-3">
          {filteredPhotos.map((photo, index) => (
            <button
              type="button"
              key={`${photo.id}-${filter}`}
              data-ocid={`gallery.item.${index + 1}`}
              className={`masonry-item gallery-item scroll-reveal w-full text-left ${photosRevealed ? "revealed" : ""}`}
              style={{ transitionDelay: `${Math.min(index * 50, 400)}ms` }}
              onClick={() => openLightbox(index)}
              aria-label={`View ${photo.caption}`}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                className="w-full block"
              />
              <div className="overlay">
                <div>
                  <p className="font-sans text-white text-sm font-medium leading-tight">
                    {photo.caption}
                  </p>
                  <span className="inline-block mt-1 text-xs text-gold uppercase tracking-widest font-sans">
                    {photo.category}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div
            data-ocid="gallery.empty_state"
            className="text-center py-24 text-white/30"
          >
            <p className="font-sans text-lg">No photos in this category yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          data-ocid="lightbox.modal"
          className="lightbox-overlay"
          onClick={closeLightbox}
          onKeyDown={(e) => e.key === "Escape" && closeLightbox()}
          aria-label="Photo lightbox"
          tabIndex={-1}
        >
          <div
            className="relative max-w-5xl max-h-screen w-full mx-4 flex items-center"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              data-ocid="lightbox.close_button"
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors p-2"
              aria-label="Close lightbox"
            >
              <X className="h-7 w-7" />
            </button>

            {/* Prev button */}
            <button
              type="button"
              data-ocid="lightbox.pagination_prev"
              onClick={() =>
                setLightboxIndex(
                  (lightboxIndex - 1 + filteredPhotos.length) %
                    filteredPhotos.length,
                )
              }
              className="absolute left-0 -translate-x-14 text-white/60 hover:text-white transition-colors p-2 hidden md:block"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            {/* Image */}
            <div className="w-full">
              <img
                src={filteredPhotos[lightboxIndex].src}
                alt={filteredPhotos[lightboxIndex].caption}
                className="max-h-[85vh] w-full object-contain mx-auto block"
              />
              <div className="mt-4 text-center">
                <p className="font-sans text-white/80 text-sm">
                  {filteredPhotos[lightboxIndex].caption}
                </p>
                <span className="text-gold text-xs uppercase tracking-widest font-sans">
                  {filteredPhotos[lightboxIndex].category}
                </span>
                <p className="text-white/30 text-xs mt-2 font-sans">
                  {lightboxIndex + 1} / {filteredPhotos.length}
                </p>
              </div>
            </div>

            {/* Next button */}
            <button
              type="button"
              data-ocid="lightbox.pagination_next"
              onClick={() =>
                setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)
              }
              className="absolute right-0 translate-x-14 text-white/60 hover:text-white transition-colors p-2 hidden md:block"
              aria-label="Next photo"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Mobile prev/next */}
            <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-8 md:hidden">
              <button
                type="button"
                data-ocid="lightbox.pagination_prev"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + filteredPhotos.length) %
                      filteredPhotos.length,
                  )
                }
                className="text-white/60 hover:text-white transition-colors p-2"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                type="button"
                data-ocid="lightbox.pagination_next"
                onClick={() =>
                  setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)
                }
                className="text-white/60 hover:text-white transition-colors p-2"
                aria-label="Next photo"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

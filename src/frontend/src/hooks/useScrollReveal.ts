import { useEffect, useRef } from "react";

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold },
    );

    // Observe the element and all children with scroll-reveal classes
    const targets = [
      el.classList.contains("scroll-reveal") ||
      el.classList.contains("scroll-reveal-left") ||
      el.classList.contains("scroll-reveal-right")
        ? el
        : null,
      ...Array.from(
        el.querySelectorAll(
          ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right",
        ),
      ),
    ].filter(Boolean);

    for (const target of targets) {
      observer.observe(target as Element);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

export function useCountUp(target: number, duration = 1500, trigger = false) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!trigger || !ref.current) return;
    const el = ref.current;
    const start = 0;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - (1 - progress) ** 3;
      const current = Math.round(start + (target - start) * eased);
      el.textContent = current.toString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [target, duration, trigger]);

  return ref;
}

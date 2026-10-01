"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: content stays visible without JS or with reduced motion. */
export function DemoMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (preference.matches) continue;
          const animation = entry.target.animate(
            [
              { opacity: 0.35, transform: "translateY(24px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 650, easing: "cubic-bezier(.22,1,.36,1)" },
          );
          animations.add(animation);
          animation.finished
            .then(() => animations.delete(animation))
            .catch(() => {});
        }
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(
        ".section-heading, .experience-section > div, .experience-steps > li, .help-section > div, .gala-manifesto, .editorial-story > div, .institutional-intro, .institutional-feature, .gala-hero > h1, .editorial-hero > h1, .ticket-introduction",
      )
      .forEach((el) => observer.observe(el));
    const stop = () => {
      if (preference.matches)
        animations.forEach((animation) => animation.cancel());
    };
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", stop);
      animations.forEach((animation) => animation.cancel());
    };
  }, [pathname]);
  return null;
}

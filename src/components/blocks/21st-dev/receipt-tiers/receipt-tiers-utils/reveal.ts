"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./reveal.module.css";

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setShown(true);
        observer.disconnect();
      }
    }, { threshold: 0 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, shown };
}

// Content stays visible when JavaScript or IntersectionObserver is unavailable.
export function revealClass(shown: boolean) {
  return shown ? styles.reveal : undefined;
}

export function revealDelay(position: number): CSSProperties {
  return { animationDelay: `${Math.min(position, 5) * 90}ms` };
}

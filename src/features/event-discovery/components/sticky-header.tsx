"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}
export function useCompactHeader() {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > 70,
    () => false,
  );
}

/** Reserve the expanded header's space so compacting never shifts the page. */
export function StickyHeader({ children }: { children: ReactNode }) {
  const compact = useCompactHeader();
  const frame = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();
  useEffect(() => {
    const element = frame.current;
    if (!element || compact) return;
    const observer = new ResizeObserver(() =>
      setHeight(element.getBoundingClientRect().height),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [compact]);
  return (
    <div className="sticky-header-slot" style={{ height }}>
      <div
        ref={frame}
        className={`sticky-header-frame${compact ? " is-compact" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

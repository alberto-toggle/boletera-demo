"use client";

import { useRef } from "react";
import { Timeline, type TimelineEntry } from "./timeline";

export default function TimelineDemo({ data }: { data: readonly TimelineEntry[] }) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  return (
    <div ref={scrollContainer} tabIndex={0} role="region" aria-label="Línea de tiempo con desplazamiento"
      className="relative h-[min(85svh,850px)] min-h-96 overflow-y-auto overscroll-y-contain rounded-xl border focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
      <Timeline data={data} scrollContainer={scrollContainer} />
    </div>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  ContainerScrollAnimation,
  ContainerScrollScale,
  ContainerScrollTranslate,
} from "./scroll-trigger-animations";

export default function ScrollTriggerAnimationsDemo() {
  const container = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={container}
      tabIndex={0}
      role="region"
      aria-label="Animación de escala al desplazarse"
      className="relative h-[min(80svh,760px)] min-h-80 overflow-y-auto overscroll-y-contain rounded-xl border bg-muted/30 [container-type:size] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      <ContainerScrollAnimation
        container={container}
        offset={["start start", "end end"]}
        spacerClass="h-[100cqh]"
      >
        <div className="sticky top-0 flex h-[100cqh] items-center justify-center overflow-hidden px-6 py-8">
          <ContainerScrollTranslate yRange={[48, 0]} className="w-full">
            <ContainerScrollScale className="overflow-hidden rounded-4xl shadow" scaleRange={[0.4, 1]}>
              <Image
                src="https://cdn.21st.dev/assets/mirror/1a/1a7829ab92f922524ed0c06bebc20c1aa7c4eb93ca236c23762cdba603081c41.jpg"
                alt="Vista de Tokio"
                width={1600}
                height={1000}
                unoptimized
                className="max-h-[85cqh] w-full object-cover"
              />
            </ContainerScrollScale>
          </ContainerScrollTranslate>
        </div>
      </ContainerScrollAnimation>
    </div>
  );
}

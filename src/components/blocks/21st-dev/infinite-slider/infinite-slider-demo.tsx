'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { InfiniteSlider } from './infinite-slider';
import { infiniteSliderLogos } from './infinite-slider-data';

export default function InfiniteSliderDemo() {
  const [paused, setPaused] = useState(false);

  return (
    <div>
      <Button variant="outline" className="mb-4" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
        {paused ? 'Reanudar animación' : 'Pausar animación'}
      </Button>
      <section aria-label="Carrusel continuo de logotipos" className="overflow-hidden rounded-xl border bg-white py-12">
        <InfiniteSlider gap={24} reverse paused={paused} className="w-full bg-white">
          {infiniteSliderLogos.map((logo) => (
            <Image key={logo.name} src={logo.src} alt={logo.name} width={240} height={120} unoptimized className="h-[120px] w-auto shrink-0" />
          ))}
        </InfiniteSlider>
      </section>
    </div>
  );
}

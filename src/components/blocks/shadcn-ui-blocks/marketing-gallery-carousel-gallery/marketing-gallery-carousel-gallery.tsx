"use client";

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const images: GalleryImage[] = [
    {
      src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1470&auto=format&fit=crop',
      alt: 'Modern architecture with glass and steel structures',
      width: 1470,
      height: 980,
    },
    {
      src: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1474&auto=format&fit=crop',
      alt: 'Historic building with ornate details and columns',
      width: 1474,
      height: 982,
    },
    {
      src: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=1470&auto=format&fit=crop',
      alt: 'Minimalist concrete structure with clean lines',
      width: 1470,
      height: 980,
    },
    {
      src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1470&auto=format&fit=crop',
      alt: 'Futuristic museum design with curved surfaces',
      width: 1470,
      height: 980,
    },
    {
      src: 'https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1467&auto=format&fit=crop',
      alt: 'Brutalist architectural style with raw concrete elements',
      width: 1467,
      height: 978,
    },
  ];


export default function CarouselGallery() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Configuration options
  const [autoPlay, setAutoPlay] = React.useState(true);
  const [hovered, setHovered] = React.useState(false);
  const reducedMotion = useReducedMotion();
  const touchStart = React.useRef<{ x: number; y: number } | null>(null);
  const playing = autoPlay && !hovered && reducedMotion === false;
  const autoPlayInterval = 5000;
  const showThumbnails = true;


  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Auto play functionality
  React.useEffect(() => {
    if (!playing) return;

    const interval = setInterval(() => {
      setCurrentIndex((index) => (index + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, playing, autoPlayInterval]);


  return (
    <section className="w-full p-4 md:p-6" aria-label="Galería de imágenes" aria-roledescription="carrusel"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setAutoPlay(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          setAutoPlay(false);
          if (event.key === 'ArrowRight') nextSlide(); else prevSlide();
        }
      }}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live={playing ? 'off' : 'polite'}>
          Imagen {currentIndex + 1} de {images.length}
        </p>
        <Button type="button" variant="outline" size="sm" disabled={reducedMotion === true}
          onClick={() => setAutoPlay((value) => !value)}>
          {reducedMotion ? 'Movimiento reducido' : autoPlay ? 'Pausar' : 'Reproducir'}
        </Button>
      </div>
      {/* Main carousel */}
      <div className="relative overflow-hidden rounded-lg" style={{ touchAction: 'pan-y' }}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = { x: touch.clientX, y: touch.clientY };
          setAutoPlay(false);
        }}
        onTouchCancel={() => { touchStart.current = null; }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          const end = event.changedTouches[0];
          if (!start || !end) return;
          const dx = end.clientX - start.x;
          const dy = end.clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) nextSlide(); else prevSlide();
          }
        }}>
        <div className="relative aspect-video w-full overflow-hidden">
          {images.map((image, index) => (
            <div
              key={`slide-${index}`}
              aria-hidden={index !== currentIndex}
              className={cn(
                'absolute inset-0 transform transition-all duration-500 ease-in-out motion-reduce:transition-none',
                index === currentIndex
                  ? 'translate-x-0 opacity-100'
                  : index < currentIndex
                    ? '-translate-x-full opacity-0'
                    : 'translate-x-full opacity-0'
              )}
            >
              {/* External images retained from the supplied gallery. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <Button
          size="icon"
          className="absolute top-1/2 left-2 -translate-y-1/2"
          aria-label="Imagen anterior"
          onClick={() => { setAutoPlay(false); prevSlide(); }}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </Button>

        <Button
          size="icon"
          className="absolute top-1/2 right-2 -translate-y-1/2"
          aria-label="Imagen siguiente"
          onClick={() => { setAutoPlay(false); nextSlide(); }}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </Button>

        {/* Caption */}
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-sm text-white">
          {images[currentIndex]!.alt}
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && (
        <div className="mt-4 flex gap-2 overflow-x-auto px-2 py-2">
          {images.map((image, index) => (
            <button
              key={`thumb-${index}`}
              type="button"
              aria-label={`Ver imagen ${index + 1}: ${image.alt}`}
              aria-pressed={index === currentIndex}
              className={cn(
                'relative h-20 w-20 flex-shrink-0 transition-all duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
                index === currentIndex
                  ? 'ring-primary ring-2 ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              )}
              onClick={() => { setAutoPlay(false); setCurrentIndex(index); }}
            >
              {/* External images retained from the supplied gallery. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt=""
                width={80}
                height={80}
                className="h-full w-full rounded-sm object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

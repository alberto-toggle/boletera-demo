"use client";

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilmstripImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export default function FilmstripGallery() {
  const reducedMotion = useReducedMotion();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(false);

  // Static images array with film/photography theme
  const images = React.useMemo<FilmstripImage[]>(
    () => [
      {
        src: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=1476&auto=format&fit=crop',
        alt: 'Vintage film camera with leather case',
        width: 1476,
        height: 984,
      },
      {
        src: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?q=80&w=1470&auto=format&fit=crop',
        alt: 'Collection of film rolls and negatives',
        width: 1470,
        height: 980,
      },
      {
        src: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?q=80&w=1528&auto=format&fit=crop',
        alt: '35mm camera with film roll',
        width: 1528,
        height: 1019,
      },
      {
        src: 'https://images.unsplash.com/photo-1587614313085-5da51cebd8ac?q=80&w=1470&auto=format&fit=crop',
        alt: 'Vintage photo prints spread out',
        width: 1470,
        height: 980,
      },
      {
        src: 'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?q=80&w=1374&auto=format&fit=crop',
        alt: 'Person developing film in darkroom',
        width: 1374,
        height: 916,
      },
      {
        src: 'https://images.unsplash.com/photo-1515634928627-2a4e0dae3ddf?q=80&w=1470&auto=format&fit=crop',
        alt: 'Stack of vintage Polaroid photos',
        width: 1470,
        height: 980,
      },
      {
        src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1528&auto=format&fit=crop',
        alt: 'Photographer adjusting vintage film camera',
        width: 1528,
        height: 1019,
      },
      {
        src: 'https://images.unsplash.com/photo-1519458246479-6acae7536988?q=80&w=1470&auto=format&fit=crop',
        alt: 'Developed film negatives on light table',
        width: 1470,
        height: 980,
      },
      {
        src: 'https://images.unsplash.com/photo-1635315619556-5826839a1bea?q=80&w=1470&auto=format&fit=crop',
        alt: 'Retro movie projector in action',
        width: 1470,
        height: 980,
      },
    ],
    []
  );

  // Handle scroll arrows visibility
  const handleScroll = React.useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    // Show left arrow if scrolled right
    setShowLeftArrow(scrollLeft > 1);

    // Hide right arrow if reached the end
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  // Attach scroll listener
  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      const observer = new ResizeObserver(handleScroll);
      observer.observe(scrollContainer);
      if (scrollContainer.firstElementChild) observer.observe(scrollContainer.firstElementChild);
      const frame = requestAnimationFrame(handleScroll);

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
        observer.disconnect();
        cancelAnimationFrame(frame);
      };
    }
  }, [handleScroll]);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    }
  };

  return (
    <div className="w-full p-4 md:p-6">
      <div className="relative">
        {/* Title */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Film Collection</h2>
          <p className="text-muted-foreground mt-2">
            Scroll to explore the gallery →
          </p>
        </div>

        {/* Scroll controls */}
        {(
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-1/2 -left-3 z-10 h-10 w-10 -translate-y-1/2 rounded-full shadow-md md:-left-5"
            disabled={!showLeftArrow}
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        {(
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-1/2 -right-3 z-10 h-10 w-10 -translate-y-1/2 rounded-full shadow-md md:-right-5"
            disabled={!showRightArrow}
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}

        {/* Filmstrip container */}
        <div
          ref={scrollContainerRef}
          role="region"
          aria-label="Film collection"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              if (event.key === 'ArrowLeft') scrollLeft(); else scrollRight();
            }
          }}
          className="no-scrollbar flex w-full overflow-x-auto pb-8 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="flex gap-5">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative flex-shrink-0"
                style={{ width: '280px' }}
              >
                {/* Film frame */}
                <div className="flex flex-col overflow-hidden rounded-lg bg-black pt-3 pb-5">
                  {/* Sprocket holes at top */}
                  <div className="mb-3 flex justify-center gap-6 px-3">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-3 w-3 rounded-full border border-gray-500 bg-transparent"
                      />
                    ))}
                  </div>

                  {/* Image */}
                  <div className="relative aspect-[3/2] overflow-hidden">
                    {/* Original external photography retained from the registry. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <div className="absolute inset-0 border border-gray-800 shadow-inner"></div>
                  </div>

                  {/* Sprocket holes at bottom */}
                  <div className="mt-3 flex justify-center gap-6 px-3">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-3 w-3 rounded-full border border-gray-500 bg-transparent"
                      />
                    ))}
                  </div>

                  {/* Frame number */}
                  <div className="mt-2 text-center text-xs text-gray-400">
                    FRAME {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Caption */}
                <div className="mt-2 text-center text-sm">{image.alt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

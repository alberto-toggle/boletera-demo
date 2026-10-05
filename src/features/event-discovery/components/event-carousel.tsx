"use client";
// Scroll/resize navigation adapted from the installed Filmstrip Gallery.
import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { EventCard } from "./event-card";
import { EventPreview } from "./event-preview";
import { formatEventDate, formatPrice, type DiscoveryEvent } from "../model";
import { useMotionPreference } from "@/features/immersive/use-motion-preference";
export function EventCarousel({
  events,
  film = false,
  categoryAnchors = false,
}: {
  events: readonly DiscoveryEvent[];
  film?: boolean;
  categoryAnchors?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null),
    id = useId(),
    reduced = useMotionPreference();
  const [position, setPosition] = useState({
    first: 1,
    last: Math.min(3, events.length),
    left: false,
    right: events.length > 3,
  });
  const update = useCallback(() => {
    const el = ref.current,
      first = el?.firstElementChild;
    if (!el || !first) return;
    const step = first.getBoundingClientRect().width + 24;
    const start = Math.round(el.scrollLeft / step);
    setPosition({
      first: start + 1,
      last: Math.min(
        events.length,
        start + Math.max(1, Math.round((el.clientWidth + 24) / step)),
      ),
      left: el.scrollLeft > 2,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 2,
    });
  }, [events.length]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update);
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [update]);
  const scroll = (direction: number) => {
    const el = ref.current;
    if (el)
      el.scrollBy({
        left: direction * (el.clientWidth + 24),
        behavior: reduced ? "instant" : "smooth",
      });
  };
  return (
    <section
      className={`event-carousel ${film ? "event-carousel-film" : ""}`}
      aria-label="Carrusel de eventos"
      aria-roledescription="carrusel"
    >
      <div
        className="event-carousel-track"
        ref={ref}
        id={id}
        tabIndex={0}
        aria-label="Eventos; usa las flechas para explorar"
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            scroll(e.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {events.map((event, index) => (
          <div
            className="event-carousel-slide"
            key={event.id}
            id={
              categoryAnchors &&
              events.findIndex((e) => e.category === event.category) === index
                ? `tipo-${event.category.toLowerCase()}`
                : undefined
            }
            role="group"
            aria-label={`${index + 1} de ${events.length}`}
          >
            {film ? (
              <article className="event-hit-area carousel-film-card">
                <Image
                  src={event.image}
                  alt={event.imageAlt}
                  style={{ objectPosition: event.imagePosition }}
                  fill
                  sizes="(max-width:700px) 85vw,33vw"
                />
                <div className="filmstrip-top">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{event.category}</span>
                </div>
                <div className="filmstrip-content">
                  <p className="eyebrow">{formatEventDate(event.startsAt)}</p>
                  <h3>{event.title}</h3>
                  <p>Desde {formatPrice(event.price)} MXN</p>
                  <EventPreview
                    event={event}
                    className="filmstrip-link stretched-trigger"
                  >
                    Descubrir <ArrowUpRight size={20} />
                  </EventPreview>
                </div>
              </article>
            ) : (
              <EventCard event={event} index={index} />
            )}
          </div>
        ))}
      </div>
      <div className="event-carousel-controls">
        <p role="status">
          {position.first}–{position.last}{" "}
          <span>de {events.length} eventos</span>
        </p>
        <div>
          <button
            type="button"
            aria-label="Eventos anteriores"
            aria-controls={id}
            disabled={!position.left}
            onClick={() => scroll(-1)}
          >
            <ArrowLeft size={19} />
          </button>
          <button
            type="button"
            aria-label="Más eventos"
            aria-controls={id}
            disabled={!position.right}
            onClick={() => scroll(1)}
          >
            <ArrowRight size={19} />
          </button>
        </div>
      </div>
    </section>
  );
}

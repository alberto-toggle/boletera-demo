"use client";

// Sora Labs strip masks + Carousel Gallery navigation adapted for event photos.
import Image from "next/image";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMotionPreference } from "@/features/immersive/use-motion-preference";
import gsap from "gsap";
import {
  ChevronLeft,
  ChevronRight,
  Images,
  Pause,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import type { DiscoveryEvent } from "@/features/event-discovery/model";
import type { EventPhoto } from "../model";
import { buildStripMask, createStripBounds } from "./gallery-strip-mask";

export function EventHeroGallery({
  event,
  photos,
}: {
  event: DiscoveryEvent;
  photos: readonly EventPhoto[];
}) {
  const slides = useMemo(
    () => [
      { src: event.image, alt: event.imageAlt, caption: event.title },
      ...photos.filter(
        (photo, index) =>
          photo.src !== event.image &&
          photos.findIndex((item) => item.src === photo.src) === index,
      ),
    ],
    [event, photos],
  );
  const [index, setIndex] = useState(0);
  const [manualTarget, setManualTarget] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [opened, setOpened] = useState(false);
  const [visible, setVisible] = useState(true);
  const [inView, setInView] = useState(true);
  const reduced = useMotionPreference();
  const root = useRef<HTMLDivElement>(null);
  const imageStack = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const nextIndex = (index + 1) % slides.length;
  const active = playing && !opened && inView && visible && reduced === false;
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      document.removeEventListener("visibilitychange", update);
      observer.disconnect();
    };
  }, []);
  useLayoutEffect(() => {
    const layers =
      imageStack.current?.querySelectorAll<HTMLElement>(".event-hero-layer");
    if (!layers) return;
    // Keep decoded image nodes mounted. The revealed layer becomes the base
    // before paint, without hiding it or replacing its image at the handoff.
    layers.forEach((item, i) => {
      gsap.set(item, {
        opacity: i === index ? 1 : 0,
        scale: 1,
        zIndex: i === index ? 1 : 0,
      });
      item.style.maskImage = "none";
      item.style.webkitMaskImage = "none";
    });
    const target = manualTarget ?? nextIndex;
    const layer = layers[target];
    if (
      (!active && manualTarget === null) ||
      opened ||
      slides.length < 2 ||
      !layer
    )
      return;
    const bounds = createStripBounds(20);
    let cancelled = false;
    let tween: gsap.core.Tween | undefined;
    const timer = window.setTimeout(
      async () => {
        const img = layer.querySelector("img");
        try {
          await img?.decode();
        } catch {
          return;
        }
        if (cancelled) return;
        if (reduced) {
          setIndex(target);
          setManualTarget(null);
          return;
        }
        const progress = { value: 0 };
        layer.style.maskImage = buildStripMask(bounds, () => 0);
        layer.style.webkitMaskImage = layer.style.maskImage;
        gsap.set(layer, { opacity: 1, scale: 1.08, zIndex: 2 });
        tween = gsap.to(progress, {
          value: 1,
          duration: 1.1,
          ease: "power2.inOut",
          onUpdate: () => {
            const mask = buildStripMask(
              bounds,
              (_j, strip) => (progress.value - strip.delay) * 2,
            );
            layer.style.maskImage = mask;
            layer.style.webkitMaskImage = mask;
            layer.style.transform = `scale(${1.08 - progress.value * 0.08})`;
          },
          onComplete: () => {
            setIndex(target);
            setManualTarget(null);
          },
        });
      },
      manualTarget === null ? 2200 : 0,
    );
    return () => {
      cancelled = true;
      clearTimeout(timer);
      tween?.kill();
    };
  }, [active, index, nextIndex, slides.length, manualTarget, opened, reduced]);
  function navigateCover(delta: number) {
    setPlaying(false);
    if (manualTarget !== null) return;
    const target = (index + delta + slides.length) % slides.length;
    if (reduced) setIndex(target);
    else setManualTarget(target);
  }
  function open(button: HTMLButtonElement) {
    setManualTarget(null);
    opener.current = button;
    setPlaying(false);
    setOpened(true);
  }
  function close() {
    setOpened(false);
    requestAnimationFrame(() => opener.current?.focus());
  }
  return (
    <div className="event-hero-gallery" ref={root}>
      <div className="event-hero-photo">
        <button
          type="button"
          ref={imageStack}
          className="event-hero-open"
          aria-label="Abrir galería de fotos"
          onClick={(e) => open(e.currentTarget)}
        >
          {slides.map((photo, i) => (
            <div
              className="event-hero-layer"
              key={photo.src}
              aria-hidden={i !== index}
              style={{ opacity: i === index ? 1 : 0 }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : "eager"}
                sizes="(max-width: 760px) 100vw, 65vw"
                style={{
                  objectPosition: i === 0 ? event.imagePosition : undefined,
                }}
              />
            </div>
          ))}
        </button>
        <div className="event-cover-arrows">
          <button
            type="button"
            aria-label="Foto anterior de portada"
            onClick={() => navigateCover(-1)}
            disabled={slides.length < 2 || manualTarget !== null}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            aria-label="Foto siguiente de portada"
            onClick={() => navigateCover(1)}
            disabled={slides.length < 2 || manualTarget !== null}
          >
            <ChevronRight size={22} />
          </button>
        </div>
        <div
          className="event-photo-caption"
          aria-live={active ? "off" : "polite"}
        >
          <span>{slides[index].caption}</span>
          <span>
            {index + 1} / {slides.length}
          </span>
        </div>
      </div>
      <div className="event-gallery-controls">
        <button
          type="button"
          aria-pressed={playing && !reduced}
          disabled={reduced === true || slides.length < 2}
          onClick={() => setPlaying(!playing)}
        >
          {playing && !reduced ? <Pause size={16} /> : <Play size={16} />}
          {reduced
            ? "Movimiento reducido"
            : playing
              ? "Pausar"
              : "Reproducir galería"}
        </button>
        {index !== 0 && (
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setManualTarget(null);
              setIndex(0);
            }}
          >
            <RotateCcw size={16} /> Portada
          </button>
        )}
        <button type="button" onClick={(e) => open(e.currentTarget)}>
          <Images size={16} /> Ver todas las fotos
        </button>
      </div>
      {opened && (
        <PhotoDialog
          slides={slides}
          index={index}
          onIndex={setIndex}
          onClose={close}
        />
      )}
    </div>
  );
}

function PhotoDialog({
  slides,
  index,
  onIndex,
  onClose,
}: {
  slides: readonly EventPhoto[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const id = useId();
  const navigate = (delta: number) =>
    onIndex((index + delta + slides.length) % slides.length);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="event-photo-dialog"
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          navigate(e.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <header>
        <h2 id={id}>Fotos del evento</h2>
        <button type="button" aria-label="Cerrar galería" onClick={onClose}>
          <X size={22} />
        </button>
      </header>
      <div
        className="event-photo-viewer"
        onTouchStart={(e) => {
          touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchCancel={() => {
          touch.current = null;
        }}
        onTouchEnd={(e) => {
          const start = touch.current;
          touch.current = null;
          const end = e.changedTouches[0];
          if (!start || !end) return;
          const dx = end.clientX - start.x;
          const dy = end.clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy))
            navigate(dx < 0 ? 1 : -1);
        }}
      >
        {slides.map((photo, i) => (
          <div
            key={photo.src}
            className="event-dialog-slide"
            aria-hidden={i !== index}
            data-active={i === index}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="90vw"
              loading="eager"
            />
          </div>
        ))}
        <button
          className="photo-prev"
          type="button"
          aria-label="Imagen anterior"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft />
        </button>
        <button
          className="photo-next"
          type="button"
          aria-label="Imagen siguiente"
          onClick={() => navigate(1)}
        >
          <ChevronRight />
        </button>
      </div>
      <p className="event-dialog-caption" aria-live="polite">
        {index + 1} de {slides.length} · {slides[index].caption}
      </p>
      <div className="event-photo-thumbnails" aria-label="Seleccionar foto">
        {slides.map((photo, i) => (
          <button
            type="button"
            key={photo.src}
            aria-label={`Ver imagen ${i + 1}: ${photo.caption}`}
            aria-pressed={i === index}
            onClick={() => onIndex(i)}
          >
            <Image src={photo.src} alt="" fill sizes="80px" />
          </button>
        ))}
      </div>
    </dialog>
  );
}

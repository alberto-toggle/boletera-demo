"use client";

// Adapted from anelkabag/navbar2: floating shell, expanding panel, link columns and image preview.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { Brand } from "@/features/event-discovery/components/chrome";
import { AccountPreview } from "@/features/event-discovery/components/event-preview";
import {
  eventCategories,
  type DiscoveryEvent,
} from "@/features/event-discovery/model";
import { useMotionPreference } from "../use-motion-preference";

export function MegaNavigation({
  events,
}: {
  events: readonly DiscoveryEvent[];
}) {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const container = useRef<HTMLElement>(null);
  const desktopTrigger = useRef<HTMLButtonElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const reduced = useMotionPreference();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > 70));
  useEffect(() => {
    const handleOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !container.current?.contains(event.target)
      )
        setOpen(false);
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, []);
  const close = () => setOpen(false);
  return (
    <header
      ref={container}
      className={`immersive-nav ${compact ? "is-compact" : ""}`}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !open) return;
        close();
        const trigger = desktopTrigger.current?.getClientRects().length
          ? desktopTrigger.current
          : mobileTrigger.current;
        trigger?.focus();
      }}
    >
      <motion.div
        layout={!reduced}
        transition={{ duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="mega-shell"
      >
        <div className="mega-top">
          <Link href="#inicio" onClick={close} aria-label="Boletera, inicio">
            <Brand />
          </Link>
          <nav aria-label="Navegación principal" className="mega-desktop">
            <button
              ref={desktopTrigger}
              type="button"
              aria-expanded={open}
              aria-controls="immersive-mega-panel"
              onClick={() => setOpen(!open)}
            >
              Encuentra tu evento{" "}
              <ChevronDown className={open ? "rotate-180" : ""} size={16} />
            </button>
            <a href="#experiencia" onClick={close}>
              La experiencia
            </a>
            <a href="#ayuda" onClick={close}>
              Ayuda
            </a>
          </nav>
          <div className="mega-actions">
            <AccountPreview />
            <Link href="#agenda" onClick={close} className="mega-agenda">
              Ver agenda <ArrowUpRight size={16} />
            </Link>
            <button
              className="mega-mobile-toggle"
              ref={mobileTrigger}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              aria-controls="immersive-mega-panel"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="immersive-mega-panel"
              className="mega-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.28 }}
            >
              <div className="mega-panel-grid">
                <div>
                  <span className="mega-eyebrow">ELIGE TU OCASIÓN</span>
                  <ul>
                    {eventCategories.map((category) => (
                      <li key={category}>
                        <Link
                          href={`#tipo-${category.toLowerCase()}`}
                          onClick={close}
                        >
                          {category}
                          <ArrowUpRight size={18} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="#agenda"
                    className="mega-secondary"
                    onClick={close}
                  >
                    Toda la agenda 2027 →
                  </Link>
                </div>
                <div>
                  <span className="mega-eyebrow">NOS VEMOS PRONTO</span>
                  <ul>
                    {events.slice(0, 3).map((event) => (
                      <li key={event.id}>
                        <Link
                          href={`/demo-inmersiva/eventos/${event.id}`}
                          onClick={close}
                        >
                          {event.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mega-mobile-links">
                    <a href="#experiencia" onClick={close}>
                      La experiencia
                    </a>
                    <a href="#ayuda" onClick={close}>
                      Ayuda
                    </a>
                  </div>
                </div>
                <Link
                  className="mega-preview"
                  href="/demo-inmersiva/eventos/noche-independencia"
                  onClick={close}
                >
                  <Image
                    src="/images/events/architecture.jpg"
                    alt="Papel picado para la Noche de Independencia"
                    fill
                    sizes="300px"
                  />
                  <div>
                    <span>15 SEPTIEMBRE · EVENTO DESTACADO</span>
                    <strong>
                      Lo que nos une,
                      <br />
                      merece celebrarse.
                    </strong>
                    <ArrowUpRight size={22} />
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}

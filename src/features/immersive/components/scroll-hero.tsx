"use client";

// Adapted from arunachalam/scroll-expansion-hero: sticky expanding media and title displacement.
// Uses document scrolling instead of trapping scroll inside the playground preview.
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useMotionPreference } from "../use-motion-preference";
import type { DiscoveryEvent } from "@/features/event-discovery/model";

export function ScrollHero({ event }: { event: DiscoveryEvent }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMotionPreference();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const width = useTransform(scrollYProgress, [0, 1], ["66%", "100%"]);
  const height = useTransform(scrollYProgress, [0, 1], ["62%", "100%"]);
  const radius = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const mediaY = useTransform(scrollYProgress, [0, 1], [35, 0]);
  const leftX = useTransform(scrollYProgress, [0, 1], [0, -38]);
  const rightX = useTransform(scrollYProgress, [0, 1], [0, 38]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  return (
    <section
      ref={ref}
      className="immersive-hero"
      aria-label="Una invitación a celebrar"
    >
      <div className="immersive-hero-sticky">
        <span className="hero-coordinate">
          CIUDAD DE MÉXICO
          <br />
          TEMPORADA 2027
        </span>
        <span className="hero-issue">
          09 ENCUENTROS
          <br />
          INFINITOS RECUERDOS
        </span>
        <motion.div
          className="expanding-photo"
          style={{
            width: reduced ? "100%" : width,
            height: reduced ? "100%" : height,
            borderRadius: reduced ? 0 : radius,
            y: reduced ? 0 : mediaY,
          }}
        >
          <motion.div
            className="parallax-photo"
            style={{ scale: reduced ? 1 : scale }}
          >
            <Image
              src={event.image}
              alt={event.imageAlt}
              style={{ objectPosition: event.imagePosition }}
              fill
              priority
              sizes="100vw"
            />
          </motion.div>
          <div className="hero-shade" />
        </motion.div>
        <div className="immersive-hero-type">
          <p className="eyebrow">HAY MOMENTOS QUE MERECEN VIVIRSE.</p>
          <h1>
            <motion.span style={{ x: reduced ? 0 : leftX }}>
              No lo imagines.
            </motion.span>
            <motion.em style={{ x: reduced ? 0 : rightX }}>Vívelo.</motion.em>
          </h1>
          <Link
            href={`/demo-inmersiva/eventos/${event.id}`}
            className="immersive-hero-cta"
          >
            Tu lugar está aquí <ArrowUpRight size={20} />
          </Link>
        </div>
        <div className="hero-bottom-line">
          <a href="#agenda">
            <ArrowDown size={18} /> DESCUBRE LA AGENDA
          </a>
          <div>
            <span>NUESTRA PRÓXIMA GRAN NOCHE</span>
            <strong>{event.title}</strong>
          </div>
          <span>15 / 09 / 2027</span>
        </div>
      </div>
    </section>
  );
}

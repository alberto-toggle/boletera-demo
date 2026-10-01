"use client";
// Adapted from shadcnspace/timeline-02: selectable dates, animated story and photograph.
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { pastEvents } from "../fixtures";
import { useMotionPreference } from "@/features/immersive/use-motion-preference";
export function PastEvents() {
  const [active, setActive] = useState(0);
  const reduced = useMotionPreference();
  const item = pastEvents[active];
  return (
    <section className="past-events" id="eventos-anteriores">
      <div className="section-heading">
        <div>
          <p className="eyebrow">LO QUE SE QUEDA CON NOSOTROS</p>
          <h2>
            Los encuentros pasan.
            <br />
            <em>Los recuerdos, no.</em>
          </h2>
        </div>
        <p className="archive-note">
          Ediciones ficticias de 2026. <br />
          Un vistazo a cómo se verá nuestro archivo.
        </p>
      </div>
      <div className="past-timeline">
        <div
          className="past-dates"
          role="group"
          aria-label="Eventos anteriores"
        >
          {pastEvents.map((entry, index) => (
            <button
              type="button"
              key={entry.id}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
            >
              <span className="timeline-dot" />
              {entry.date}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="past-story"
            key={item.id}
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
          >
            <div className="past-copy" aria-live="polite">
              <p className="eyebrow">MEMORIAS DE TEMPORADA</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span>Fotografía de ambiente · edición de ejemplo</span>
            </div>
            <div className="past-photo">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width:700px) 90vw, 50vw"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

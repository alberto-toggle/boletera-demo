"use client";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { SiSpacex } from "react-icons/si";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import { createContext, useContext, useId, useRef, type RefObject } from "react";
import { launchSchedule } from "./modern-hero-data";

const PreviewContext = createContext<{ container: RefObject<HTMLDivElement | null>; scheduleId: string } | null>(null);
function usePreview() {
  const context = useContext(PreviewContext);
  if (!context) throw new Error("Modern Hero requires its preview context");
  return context;
}

export const SmoothScrollHero = () => {
  const container = useRef<HTMLDivElement>(null);
  const scheduleId = useId();
  return (
    <PreviewContext.Provider value={{ container, scheduleId }}>
      <div className="relative overflow-hidden rounded-xl bg-zinc-950">
        <Nav />
        <div ref={container} tabIndex={0} role="region" aria-label="Vista previa de Modern Hero" className="relative h-[min(85svh,850px)] min-h-96 overflow-y-auto overscroll-y-contain [container-type:size] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white">
          <Hero />
          <Schedule />
        </div>
      </div>
    </PreviewContext.Provider>
  );
};

const Nav = () => {
  const { container, scheduleId } = usePreview();
  const reducedMotion = useReducedMotion();
  return (
    <nav className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-zinc-950/80 px-6 py-3 text-white">
      <SiSpacex role="img" aria-label="SpaceX" className="text-3xl mix-blend-difference" />
      <button
        onClick={() => {
          const section = document.getElementById(scheduleId);
          if (section) container.current?.scrollTo({ top: section.offsetTop - 60, behavior: reducedMotion ? "instant" : "smooth" });
        }}
        type="button"
        className="flex items-center gap-1 text-xs text-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        LAUNCH SCHEDULE <FiArrowRight />
      </button>
    </nav>
  );
};

const SECTION_HEIGHT = 1500;

const Hero = () => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100cqh)` }}
      className="relative w-full"
    >
      <CenterImage />

      <ParallaxImages />

      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-zinc-950/0 to-zinc-950" />
    </div>
  );
};

const CenterImage = () => {
  const { container } = usePreview();
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll({ container });

  const clip1 = useTransform(scrollY, [0, 1500], [25, 0]);
  const clip2 = useTransform(scrollY, [0, 1500], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollY,
    [0, SECTION_HEIGHT + 500],
    ["170%", "100%"]
  );
  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  return (
    <motion.div
      className="sticky top-0 h-[100cqh] w-full"
      style={{
        clipPath: reducedMotion ? "none" : clipPath,
        backgroundSize: reducedMotion ? "cover" : backgroundSize,
        opacity: reducedMotion ? 1 : opacity,
        backgroundImage:
          "url(https://cdn.21st.dev/assets/mirror/3e/3ea1ee3ce8a8134c194baf880a7afabc7a43bad8d5672f7b0f74fff87344dcc4.jpg)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

const ParallaxImages = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      <ParallaxImg
        src="https://cdn.21st.dev/assets/mirror/68/68fd4edf19855762d0020e6ddbf3fdd31b7f768a6c65014d50ec6b36ef305b54.jpg"
        alt="And example of a space launch"
        start={-200}
        end={200}
        className="w-1/3"
      />
      <ParallaxImg
        src="https://cdn.21st.dev/assets/mirror/bc/bca64f76b38b6b3e0f1c2357292903fc428e16d47b49005201be8ba51377ce8c.jpg"
        alt="An example of a space launch"
        start={200}
        end={-250}
        className="mx-auto w-2/3"
      />
      <ParallaxImg
        src="https://cdn.21st.dev/assets/mirror/04/04691b2e29925f30eac3817ea8f65d973484b711822252a13c15248859e464da.jpg"
        alt="Orbiting satellite"
        start={-200}
        end={200}
        className="ml-auto w-1/3"
      />
      <ParallaxImg
        src="https://cdn.21st.dev/assets/mirror/71/711f1a9ccb3786dcc00e8031191dc4d58c9377cefb54bf927806921a4a05a818.jpg"
        alt="Orbiting satellite"
        start={0}
        end={-500}
        className="ml-24 w-5/12"
      />
    </div>
  );
};

const ParallaxImg = ({ className, alt, src, start, end }: { className: string; alt: string; src: string; start: number; end: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { container } = usePreview();
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    container,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);

  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.div className={className} ref={ref} style={{ transform: reducedMotion ? "none" : transform, opacity: reducedMotion ? 1 : opacity }}>
      <Image src={src} alt={alt} width={1200} height={800} unoptimized className="h-auto w-full" />
    </motion.div>
  );
};

const Schedule = () => {
  const { scheduleId, container } = usePreview();
  const reducedMotion = useReducedMotion();
  return (
    <section
      id={scheduleId}
      className="mx-auto max-w-5xl px-4 py-48 text-white"
    >
      <motion.h2
        initial={reducedMotion ? false : { y: 48, opacity: 0 }}
      viewport={{ root: container }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: reducedMotion ? 0 : 0.75 }}
        className="mb-20 text-4xl font-black uppercase text-zinc-50"
      >
        Launch Schedule
      </motion.h2>
      {launchSchedule.map((item) => <ScheduleItem key={item.title + item.date} {...item} />)}
    </section>
  );
};

const ScheduleItem = ({ title, date, location }: { title: string; date: string; location: string }) => {
  const { container } = usePreview();
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={reducedMotion ? false : { y: 48, opacity: 0 }}
      viewport={{ root: container }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: reducedMotion ? 0 : 0.75 }}
      className="mb-9 flex items-center justify-between border-b border-zinc-800 px-3 pb-9"
    >
      <div>
        <p className="mb-1.5 text-xl text-zinc-50">{title}</p>
        <p className="text-sm uppercase text-zinc-500">{date}</p>
      </div>
      <div className="flex items-center gap-1.5 text-end text-sm uppercase text-zinc-500">
        <p>{location}</p>
        <FiMapPin />
      </div>
    </motion.div>
  );
};
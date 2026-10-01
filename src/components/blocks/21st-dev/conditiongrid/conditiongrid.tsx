"use client";

import { MoveUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

export interface ConditionGridProject {
  id: string;
  img: string;
  title: string;
  des: string;
}

export default function ConditionGrid({ projects }: { projects: readonly ConditionGridProject[] }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="@container">
      <div className="grid grid-cols-12 gap-4 overflow-hidden px-5 pb-5">
        {projects.map((project, index) => {
          let colSpanClass = "col-span-12 @min-[640px]:col-span-6";
          if (index === 0) {
            colSpanClass = "col-span-12 @min-[640px]:col-span-5";
          } else if (index === 1 || index === projects.length - 2) {
            colSpanClass = "col-span-12 @min-[640px]:col-span-7";
          } else if (index === projects.length - 1) {
            colSpanClass = "col-span-12 @min-[640px]:col-span-5";
          }

          return (
            <motion.article
              key={project.id}
              initial={reducedMotion ? false : { y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ ease: "easeOut", duration: reducedMotion ? 0 : 0.3 }}
              viewport={{ once: false }}
              className={`relative ${colSpanClass}`}
            >
              <div className="h-full w-auto">
                <Image
                  src={project.img}
                  alt={project.title}
                  height={600}
                  width={1200}
                  unoptimized
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>
              <div className="absolute bottom-0 flex w-full items-center justify-between gap-2 p-4 text-black @min-[900px]:bottom-2">
                <h3 className="rounded-xl bg-black px-4 py-2 text-sm text-white @min-[900px]:text-xl">
                  {project.title}
                </h3>
                <span aria-hidden="true" className="grid size-10 shrink-0 place-content-center rounded-full bg-black text-white @min-[900px]:size-12">
                  <MoveUpRight />
                </span>
              </div>
              <p className="sr-only">{project.des}</p>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

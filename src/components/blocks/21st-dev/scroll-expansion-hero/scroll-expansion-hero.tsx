"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [progress, setProgress] = useState(0);
  const reducedMotion = useReducedMotion();
  const scrollProgress = reducedMotion ? 1 : progress;
  const textTranslateX = scrollProgress * 150;
  const mediaWidth = `calc(280px + (100cqw - 280px) * ${scrollProgress})`;
  const mediaHeight = `calc(45cqh + 40cqh * ${scrollProgress})`;

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Vista previa del hero con expansión al desplazarse"
      onScroll={(event) => {
        const panel = event.currentTarget;
        setProgress(Math.min(1, Math.max(0, panel.scrollTop / Math.max(1, panel.clientHeight))));
      }}
      className="h-[min(80svh,800px)] min-h-96 overflow-y-auto overscroll-y-contain rounded-xl bg-black text-white [container-type:size] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      <section style={{ height: reducedMotion ? "100cqh" : "200cqh" }} className="relative">
        <div className="sticky top-0 w-full flex flex-col items-center h-[100cqh] overflow-hidden">
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              unoptimized
              src={bgImageSrc}
              alt=""
              width={1920}
              height={1080}
              className="w-full h-full"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-black/10" />
          </motion.div>

          <div className="w-full mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-[100cqh] relative">
              <div
                className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl"
                style={{
                  width: mediaWidth,
                  height: mediaHeight,
                  maxWidth: "95cqw",
                  maxHeight: "85cqh",
                  boxShadow: "0px 0px 50px rgba(0, 0, 0, 0.3)",
                }}
              >
                {mediaType === "video" ? (
                  mediaSrc.includes("youtube.com") ? (
                    <div className="relative w-full h-full ">
                      <iframe
                        title={title || "Video del hero"}
                        width="100%"
                        height="100%"
                        src={
                          mediaSrc.includes("embed")
                            ? mediaSrc +
                              (mediaSrc.includes("?") ? "&" : "?") +
                              `autoplay=${reducedMotion ? 0 : 1}&mute=1&loop=1&controls=1&rel=0`
                            : mediaSrc.replace("watch?v=", "embed/") +
                              `?autoplay=${reducedMotion ? 0 : 1}&mute=1&loop=1&controls=1&rel=0&playlist=` +
                              mediaSrc.split("v=")[1]
                        }
                        className="w-full h-full rounded-xl"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <div
                        className="absolute inset-0 z-10"
                        style={{ pointerEvents: "none" }}
                      ></div>

                      <motion.div
                        className="pointer-events-none absolute inset-0 bg-black/30 rounded-xl"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-full ">
                      <video
                        src={mediaSrc}
                        poster={posterSrc}
                        autoPlay={!reducedMotion}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover rounded-xl"
                        controls
                        disablePictureInPicture
                        disableRemotePlayback
                      />
                      <div
                        className="absolute inset-0 z-10"
                        style={{ pointerEvents: "none" }}
                      ></div>

                      <motion.div
                        className="pointer-events-none absolute inset-0 bg-black/30 rounded-xl"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : (
                  <div className="relative w-full h-full">
                    <Image
              unoptimized
                      src={mediaSrc}
                      alt={title || "Media content"}
                      width={1280}
                      height={720}
                      className="w-full h-full object-cover rounded-xl"
                    />

                    <motion.div
                      className="pointer-events-none absolute inset-0 bg-black/50 rounded-xl"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                <div className="flex flex-col items-center text-center relative z-10 mt-4 transition-none">
                  {date && (
                    <p
                      className="text-2xl text-blue-200"
                      style={{ transform: `translateX(-${textTranslateX}cqw)` }}
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className="text-blue-200 font-medium text-center"
                      style={{ transform: `translateX(${textTranslateX}cqw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 pointer-events-none transition-none flex-col ${
                  textBlend ? "mix-blend-difference" : "mix-blend-normal"
                }`}
              >
                <motion.h2
                  className="text-4xl @min-[640px]:text-5xl @min-[900px]:text-6xl font-bold text-blue-200 transition-none"
                  style={{ transform: `translateX(-${textTranslateX}cqw)` }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className="text-4xl @min-[640px]:text-5xl @min-[900px]:text-6xl font-bold text-center text-blue-200 transition-none"
                  style={{ transform: `translateX(${textTranslateX}cqw)` }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>
            </div>


          </div>
        </div>
      </section>
      {children && <section className="relative bg-background px-6 py-12 text-foreground">{children}</section>}
    </div>
  );
};

export default ScrollExpandMedia;

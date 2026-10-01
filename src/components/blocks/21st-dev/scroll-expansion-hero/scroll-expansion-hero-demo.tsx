"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ScrollExpandMedia from "./scroll-expansion-hero";
import { sampleMediaContent } from "./scroll-expansion-hero-data";

export default function ScrollExpansionHeroDemo() {
  const [mediaType, setMediaType] = useState<"video" | "image">("video");
  const [textBlend, setTextBlend] = useState(false);
  const media = sampleMediaContent[mediaType];

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Opciones del hero">
        <Button variant={mediaType === "video" ? "default" : "outline"} aria-pressed={mediaType === "video"} onClick={() => setMediaType("video")}>Video</Button>
        <Button variant={mediaType === "image" ? "default" : "outline"} aria-pressed={mediaType === "image"} onClick={() => setMediaType("image")}>Imagen</Button>
        <Button variant="outline" aria-pressed={textBlend} onClick={() => setTextBlend((value) => !value)}>Mezcla de texto</Button>
      </div>
      <ScrollExpandMedia
        key={mediaType}
        mediaType={mediaType}
        mediaSrc={media.src}
        posterSrc={media.poster}
        bgImageSrc={media.background}
        title={media.title}
        date={media.date}
        scrollToExpand="Desplázate para expandir"
        textBlend={textBlend}
      >
        <div className="mx-auto max-w-4xl space-y-6">
          <h3 className="text-2xl font-semibold">About This Component</h3>
          <p>{media.about.overview}</p>
          <p>{media.about.conclusion}</p>
        </div>
      </ScrollExpandMedia>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { interactiveMapData } from "./interactive-map-data";

const AdvancedMap = dynamic(() => import("./interactive-map"), {
  ssr: false,
  loading: () => <div role="status" className="flex h-[600px] items-center justify-center rounded-xl border">Cargando mapa…</div>,
});

export default function InteractiveMapDemo() {
  return <AdvancedMap {...interactiveMapData} />;
}

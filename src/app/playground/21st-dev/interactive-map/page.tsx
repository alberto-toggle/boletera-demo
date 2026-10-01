import type { Metadata } from "next";
import Link from "next/link";
import InteractiveMapDemo from "@/components/blocks/21st-dev/interactive-map/interactive-map-demo";

export const metadata: Metadata = { title: "Interactive Map | Playground" };

export default function InteractiveMapPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Interactive Map</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@lovesickfromthe6ix/components/interactive-map" target="_blank" rel="noreferrer" className="underline underline-offset-4">lovesickfromthe6ix / 21st.dev</a>.
        {" "}Mapas de OpenStreetMap y Esri, búsqueda mediante Nominatim y figuras ilustrativas del autor. «Mi ubicación» solicita permiso al navegador.
      </p>
      <div className="mt-8"><InteractiveMapDemo /></div>
    </main>
  );
}

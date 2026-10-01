import type { Metadata } from "next";
import Link from "next/link";
import ScrollTriggerAnimationsDemo from "@/components/blocks/21st-dev/scroll-trigger-animations/scroll-trigger-animations-demo";

export const metadata: Metadata = { title: "Scroll Trigger Animations | Playground" };

export default function ScrollTriggerAnimationsPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Scroll Trigger Animations</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@youcefbnm/components/scroll-trigger-animations" target="_blank" rel="noreferrer" className="underline underline-offset-4">youcefbnm / 21st.dev</a>.
        {" "}Ejemplo de escala y desplazamiento. Haz scroll dentro de la vista previa; también puedes enfocarla y usar las flechas o Av Pág.
      </p>
      <div className="mt-8"><ScrollTriggerAnimationsDemo /></div>
    </main>
  );
}

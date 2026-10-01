import type { Metadata } from "next";
import Link from "next/link";
import FeatureSections from "@/components/blocks/21st-dev/feature-sections/feature-sections";
import FeatureSectionsImageList from "@/components/blocks/21st-dev/feature-sections/feature-sections-image-list";

export const metadata: Metadata = { title: "Feature Sections | Playground" };

export default function FeatureSectionsPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Feature Sections</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen: 21st.dev, integrado desde el código compartido. Dos variantes del archivo original.
        Los textos y las ilustraciones son de ejemplo; no describen funciones implementadas en Boletera.
      </p>
      <section className="mt-8" aria-labelledby="feature-cards-heading">
        <h2 id="feature-cards-heading" className="mb-4 text-lg font-medium">Tarjetas ilustradas</h2>
        <div lang="en" className="overflow-hidden rounded-xl border bg-background px-4 sm:px-8">
          <FeatureSections />
        </div>
      </section>
      <section className="mt-10" aria-labelledby="feature-list-heading">
        <h2 id="feature-list-heading" className="mb-4 text-lg font-medium">Imagen y lista de características</h2>
        <div lang="en" className="overflow-hidden rounded-xl border bg-background p-4 py-10 sm:p-8">
          <FeatureSectionsImageList />
        </div>
      </section>
    </main>
  );
}

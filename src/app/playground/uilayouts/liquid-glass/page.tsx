import Link from "next/link";
import LiquidGlassDemo from "@/components/blocks/uilayouts/liquid-glass/demo";

export const metadata = { title: "Liquid Glass · UI Layouts | Playground" };

export default function Page() {
  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Liquid Glass</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Origen: UI Layouts. Vidrio con distorsión SVG, desenfoque, reflejos y
        movimiento. El efecto puede variar según el navegador.
      </p>
      <div className="mt-8">
        <LiquidGlassDemo />
      </div>
    </main>
  );
}

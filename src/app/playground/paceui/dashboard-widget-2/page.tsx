import type { Metadata } from "next";
import Link from "next/link";
import { Widget2 } from "@/components/blocks/paceui/dashboard-widget-2/dashboard-widget-2";

export const metadata: Metadata = { title: "Dashboard Widget 2 | Playground" };

export default function DashboardWidget2Page() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Dashboard Widget 2</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen: Pace UI. Selector de asientos con categorías, disponibilidad y total.
        Selecciona varios asientos para probarlo; son datos ficticios y no se realizan reservas.
      </p>
      <div lang="en" className="mt-8 flex justify-center"><Widget2 /></div>
    </main>
  );
}

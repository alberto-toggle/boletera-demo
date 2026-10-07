import type { Metadata } from "next";
import Link from "next/link";
import { Stat4 } from "@/components/blocks/paceui/dashboard-stat-4/dashboard-stat-4";
import { TooltipProvider } from "@/components/ui/tooltip";
export const metadata: Metadata = { title: "Dashboard Stat 4 | Playground" };
export default function Page() {
  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Dashboard Stat 4</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Origen: Pace UI. Bloque de muestra con datos ficticios; las acciones no
        realizan operaciones reales.
      </p>
      <div lang="en" className="mt-8 min-w-0">
        <TooltipProvider>
          <Stat4 />
        </TooltipProvider>
      </div>
    </main>
  );
}

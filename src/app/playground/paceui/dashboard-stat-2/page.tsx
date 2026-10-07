import type { Metadata } from "next";
import Link from "next/link";
import { Stat2 } from "@/components/blocks/paceui/dashboard-stat-2/dashboard-stat-2";
import { TooltipProvider } from "@/components/ui/tooltip";
export const metadata: Metadata = { title: "Dashboard Stat 2 | Playground" };
export default function Page() {
  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Dashboard Stat 2</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Origen: Pace UI. Bloque de muestra con datos ficticios; las acciones no
        realizan operaciones reales.
      </p>
      <div lang="en" className="mt-8 min-w-0">
        <TooltipProvider>
          <Stat2
            title="Subscriptions"
            value="1,284"
            trendValue={8.4}
            footerLabel="Steady growth"
            footerSubtext="Compared with the previous month"
          />
        </TooltipProvider>
      </div>
    </main>
  );
}

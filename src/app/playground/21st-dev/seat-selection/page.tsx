import type { Metadata } from "next";
import Link from "next/link";
import { SeatSelectionDemo } from "@/components/blocks/21st-dev/seat-selection/seat-selection-demo";

export const metadata: Metadata = { title: "Selección de asientos | Playground" };

export default function SeatSelectionPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Selección de asientos</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen: lavikatiyar / 21st.dev, integrado desde el código compartido.
        Prueba la selección múltiple por categoría; los asientos ocupados están bloqueados.
        Es una demo local con datos ficticios, sin reservas ni pagos.
      </p>
      <div className="mt-8 overflow-hidden rounded-xl border"><SeatSelectionDemo /></div>
    </main>
  );
}

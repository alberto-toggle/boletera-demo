import type { Metadata } from "next";
import Link from "next/link";
import CalendarEventDetails from "@/components/blocks/shadcn-io/calendar-event-details/calendar-event-details";

export const metadata: Metadata = {
  title: "Calendar Event Details | Playground",
};

export default function CalendarEventDetailsPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Calendar Event Details</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Bloque de shadcn.io con datos de reunión y asistentes de ejemplo. Puedes
        cambiar tu respuesta local y copiar el enlace ficticio. No se envían
        confirmaciones; la edición está inactiva.
      </p>
      <div className="mt-8 rounded-xl border bg-muted/20 py-4">
        <CalendarEventDetails />
      </div>
    </main>
  );
}

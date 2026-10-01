import type { Metadata } from "next";
import Link from "next/link";
import TicketStubFooterDemo from "@/components/blocks/21st-dev/ticket-stub-footer/ticket-stub-footer-demo";

export const metadata: Metadata = { title: "Ticket Stub Footer | Playground" };

export default function TicketStubFooterPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Ticket Stub Footer</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen:{" "}
        <a href="https://21st.dev/@kedhareswer/components/ticket-stub-footer" target="_blank" rel="noreferrer" className="underline underline-offset-4">kedhareswer / 21st.dev</a>.
        {" "}Footer con talón interactivo, contador y marca con efecto de puntos.
        Prueba el talón, pausa el contador o mueve el cursor sobre la marca.
        Las cifras y enlaces son ilustrativos.
      </p>
      <section lang="en" aria-label="Vista previa de Ticket Stub Footer" className="mt-8 overflow-hidden rounded-xl border">
        <TicketStubFooterDemo />
      </section>
    </main>
  );
}

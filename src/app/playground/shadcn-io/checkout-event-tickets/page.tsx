import type { Metadata } from "next";
import Link from "next/link";
import CheckoutEventTickets from "@/components/blocks/shadcn-io/checkout-event-tickets/checkout-event-tickets";

export const metadata: Metadata = {
  title: "Checkout Event Tickets | Playground",
};

export default function CheckoutEventTicketsPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Checkout Event Tickets</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Bloque de shadcn.io con datos de ejemplo. Prueba el tipo de boleto, la
        cantidad y los nombres de asistentes. El mapa es un espacio reservado;
        la compra no está conectada.
      </p>
      <div className="mt-8 rounded-xl border bg-muted/20 py-4">
        <CheckoutEventTickets />
      </div>
    </main>
  );
}

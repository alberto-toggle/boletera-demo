import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedTicket } from "@/components/blocks/21st-dev/ticket-confirmation-card/ticket-confirmation-card";

export const metadata: Metadata = { title: "Ticket Confirmation Card | Playground" };

export default function TicketConfirmationCardPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">← Volver al playground</Link>
      <h1 className="mt-6 text-2xl font-semibold">Ticket Confirmation Card</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Origen: 21st.dev, integrado desde el código compartido. Confirmación visual con datos ficticios en USD.
        No se realizó una compra ni se emitió un boleto válido; el código de barras es decorativo.
      </p>
      <div lang="en" className="mt-8 overflow-hidden rounded-xl border bg-background py-8">
        <AnimatedTicket
          ticketId="0120034399434"
          amount={305.50}
          date={new Date("2025-06-19T10:15:00Z")}
          cardHolder="Liana80 Tudakova"
          last4Digits="8237"
          barcodeValue="28937261273650"
        />
      </div>
    </main>
  );
}

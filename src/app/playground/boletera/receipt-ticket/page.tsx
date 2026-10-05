import type { Metadata } from "next";
import Link from "next/link";
import ReceiptTicketDemo from "@/components/blocks/boletera/receipt-ticket/receipt-ticket-demo";

export const metadata: Metadata = { title: "Boleto clásico | Playground" };

export default function ReceiptTicketPage() {
  return (
    <main
      lang="es"
      className="mx-auto w-full min-w-0 max-w-[1400px] flex-1 px-4 py-10 sm:px-8"
    >
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Boleto clásico</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
        Origen: adaptación propia de Boletera, inspirada en{" "}
        <Link
          href="/playground/21st-dev/receipt-tiers"
          className="underline underline-offset-4"
        >
          Receipt Tiers
        </Link>
        . Dos formatos, QR de demostración y talón desprendible. La interacción
        es visual y no registra asistencia. En pantallas pequeñas, el horizontal
        se apila para mantener la lectura.
      </p>
      <div className="mt-8">
        <ReceiptTicketDemo />
      </div>
    </main>
  );
}

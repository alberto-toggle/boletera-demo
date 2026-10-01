import type { Metadata } from "next";
import Link from "next/link";
import {
  CreditCard, CreditCardBack, CreditCardChip, CreditCardCvv,
  CreditCardExpiry, CreditCardFlipper, CreditCardFront, CreditCardMagStripe,
  CreditCardName, CreditCardNumber, CreditCardServiceProvider,
} from "@/components/blocks/kibo-ui/credit-card/credit-card";

export const metadata: Metadata = { title: "Credit Card | Playground" };

export default function CreditCardPage() {
  return (
    <main lang="es" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      <Link href="/playground" className="text-sm underline underline-offset-4">
        ← Volver al playground
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Credit Card</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Tarjeta visual de Kibo UI con datos ficticios. Pasa el cursor sobre ella,
        tócala en móvil o usa Enter o Espacio al enfocarla para ver el reverso.
      </p>
      <div className="mt-8 flex flex-col items-center gap-6 rounded-xl border bg-muted/20 px-4 py-12">
        <CreditCard>
          <CreditCardFlipper>
            <CreditCardFront className="bg-linear-to-br from-slate-800 to-slate-950">
              <p className="text-xs font-semibold tracking-widest">BOLETERA · DEMO</p>
              <CreditCardChip className="top-[38%]" />
              <CreditCardNumber className="absolute bottom-[27%] left-0 text-sm">
                4242 4242 4242 4242
              </CreditCardNumber>
              <div className="absolute bottom-0 left-0 space-y-2">
                <CreditCardName className="text-xs">Alex Ejemplo</CreditCardName>
                <CreditCardExpiry className="text-xs">12/30</CreditCardExpiry>
              </div>
              <CreditCardServiceProvider type="Visa" />
            </CreditCardFront>
            <CreditCardBack className="bg-linear-to-br from-slate-800 to-slate-950">
              <CreditCardMagStripe />
              <div className="absolute top-[45%] left-0 flex w-full items-center justify-between gap-4 rounded bg-white/90 px-3 py-2 text-slate-900">
                <span className="text-xs italic">Alex Ejemplo</span>
                <CreditCardCvv aria-label="Código de ejemplo: 123" className="text-sm">123</CreditCardCvv>
              </div>
              <p className="absolute bottom-0 left-0 text-xs text-white/70">
                Tarjeta de muestra · Sin pagos conectados
              </p>
            </CreditCardBack>
          </CreditCardFlipper>
        </CreditCard>
        <p className="text-center text-xs text-muted-foreground">
          Frente y reverso con chip, marca, titular y vencimiento.
        </p>
      </div>
    </main>
  );
}

"use client";

import { CreditCard, Wifi } from "lucide-react";
import { CardFolder } from "./card-folder";

const cards = [
  {
    title: "Personal",
    number: "4242424242424242",
    expiry: "12/30",
    brand: "VISA",
    color: "from-slate-700 to-slate-950",
  },
  {
    title: "Viajes",
    number: "5555555555554444",
    expiry: "08/29",
    brand: "Mastercard",
    color: "from-emerald-700 to-emerald-950",
  },
] as const;

export function CardFolderDemo() {
  return (
    <div className="grid grid-cols-1 justify-items-center gap-16 rounded-2xl border bg-muted/20 px-4 py-14 sm:px-8 xl:grid-cols-2">
      {cards.map((card) => (
        <CardFolder
          key={card.title}
          className="w-full min-w-0 max-w-96"
          title={card.title}
          cardNumber={card.number}
          expiry={card.expiry}
          cvv="123"
          card={
            <span
              className={`relative flex size-full flex-col justify-between bg-linear-to-br ${card.color} p-5 text-white sm:p-7`}
            >
              <span className="flex items-center justify-between text-xs font-semibold tracking-widest">
                BOLETERA · DEMO <Wifi className="size-5 rotate-90" />
              </span>
              <CreditCard className="size-9 text-amber-200" />
              <span className="font-mono text-lg tracking-widest">
                •••• •••• •••• {card.number.slice(-4)}
              </span>
              <span className="flex items-end justify-between gap-3">
                <span className="text-xs">
                  ALEX HERNÁNDEZ
                  <br />
                  {card.expiry}
                </span>
                <span className="text-lg font-semibold italic">
                  {card.brand}
                </span>
              </span>
            </span>
          }
        />
      ))}
    </div>
  );
}

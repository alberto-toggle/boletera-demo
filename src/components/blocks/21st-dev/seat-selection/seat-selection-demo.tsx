"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SeatSelection, type SeatCategoryInfo, type SeatRowInfo } from "./seat-selection";

function makeRow(rowId: string): SeatRowInfo {
  const seats = Array.from({ length: 10 }, (_, index) => ({
    id: `${rowId}${index + 1}`,
    number: index + 1,
  }));
  return {
    rowId,
    seats: [...seats.slice(0, 5), { id: `${rowId}-aisle`, isSpacer: true }, ...seats.slice(5)],
  };
}

const layout: SeatCategoryInfo[] = [
  { categoryName: "PREFERENTE", price: 350, rows: [makeRow("A"), makeRow("B")] },
  { categoryName: "CLÁSICO", price: 200, rows: [makeRow("C"), makeRow("D")] },
  { categoryName: "BALCÓN PREFERENTE", price: 180, rows: [makeRow("E"), makeRow("F")] },
  { categoryName: "BALCÓN CENTRAL", price: 150, rows: [makeRow("G"), makeRow("H")] },
  { categoryName: "LATERAL", price: 120, rows: [makeRow("I"), makeRow("J")] },
  { categoryName: "GENERAL", price: 100, rows: [makeRow("K"), makeRow("L")] },
];
const occupiedSeats = [
  "A3", "A4", "B7", "C2", "C8", "D5",
  "E2", "E3", "F8", "G5", "H6", "H7",
  "I1", "I2", "J9", "K4", "K5", "L10",
];
const prices = new Map(layout.flatMap((category) =>
  category.rows.flatMap((row) => row.seats.filter((seat) => !seat.isSpacer).map((seat) => [seat.id, category.price] as const))
));
const formatPrice = (amount: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);

export function SeatSelectionDemo() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const subtotal = selectedSeats.reduce((sum, id) => sum + (prices.get(id) ?? 0), 0);

  const toggleSeat = (id: string) => {
    if (!prices.has(id) || occupiedSeats.includes(id)) return;
    setSelectedSeats((current) => current.includes(id) ? current.filter((seat) => seat !== id) : [...current, id]);
  };

  return (
    <div>
      <div lang="es">
        <SeatSelection layout={layout} selectedSeats={selectedSeats} occupiedSeats={occupiedSeats} onSeatSelect={toggleSeat} />
      </div>
      <div className="flex flex-wrap justify-center gap-5 border-t px-4 py-5 text-sm" aria-label="Leyenda de asientos">
        <span className="flex items-center gap-2"><span aria-hidden="true" className="size-4 rounded border bg-card" />Disponible</span>
        <span className="flex items-center gap-2"><span aria-hidden="true" className="size-4 rounded bg-primary" />Seleccionado</span>
        <span className="flex items-center gap-2"><span aria-hidden="true" className="size-4 rounded border bg-muted opacity-50" />Ocupado</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t p-4 sm:p-6">
        <div aria-live="polite" aria-atomic="true" className="min-w-0 space-y-1">
          <p className="break-words text-sm">Asientos: {selectedSeats.length ? selectedSeats.join(", ") : "Ninguno"}</p>
          <p className="font-semibold">Subtotal: {formatPrice(subtotal)}</p>
          <p className="text-xs text-muted-foreground">Precios ficticios en pesos mexicanos (MXN). Impuestos no calculados.</p>
        </div>
        <Button variant="outline" disabled={!selectedSeats.length} onClick={() => setSelectedSeats([])}>Limpiar selección</Button>
      </div>
    </div>
  );
}

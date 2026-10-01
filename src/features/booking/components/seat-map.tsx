// Adapted from lavikatiyar/seat-selection (21st.dev). See ../README.md.
"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { formatPrice } from "@/features/event-discovery/model";
import { cn } from "@/lib/utils"; // Assumes shadcn/ui's utility function

// SECTION: Type Definitions for component props

export interface SeatInfo {
  id: string; // Unique identifier for the seat, e.g., 'A1'
  number?: number; // The display number on the seat
  isSpacer?: boolean; // Renders an empty space instead of a seat
}

export interface SeatRowInfo {
  rowId: string; // The row identifier, e.g., 'A'
  seats: SeatInfo[];
}

export interface SeatCategoryInfo {
  categoryName: string; // e.g., 'PRIME', 'CLASSIC'
  priceMinor: number;
  rows: SeatRowInfo[];
}

interface SeatSelectionProps {
  arrangement: "tables" | "rows";
  layout: SeatCategoryInfo[];
  selectedSeats: string[];
  occupiedSeats: string[];
  onSeatSelect: (seatId: string) => void; // Callback function for seat interaction
  className?: string;
}

// !SECTION

// --- Sub-components ---

// Renders the curved screen at the top
const Screen = ({ reduced }: { reduced: boolean }) => (
  <div className="relative w-full flex justify-center items-center mb-12">
    <motion.div
      className="h-12 w-full max-w-2xl border-b-4 border-foreground"
      style={{
        borderBottomLeftRadius: "50%",
        borderBottomRightRadius: "50%",
        boxShadow:
          "0px 15px 30px -5px color-mix(in oklab, var(--foreground) 50%, transparent)",
      }}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.8, ease: "easeOut" }}
    />
    <motion.span
      className="absolute -bottom-2 text-sm font-medium tracking-widest text-muted-foreground"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      ESCENARIO
    </motion.span>
  </div>
);

// Renders an individual seat
interface SeatProps {
  seat: SeatInfo;
  status: "available" | "selected" | "occupied";
  onSelect: (id: string) => void;
}

const Seat = React.memo(({ seat, status, onSelect }: SeatProps) => {
  const reduced = useReducedMotion();
  // Render a spacer div if the seat is a spacer
  if (seat.isSpacer) {
    return (
      <div className="w-8 h-8 md:w-10 md:h-10 shrink-0" aria-hidden="true" />
    );
  }

  const isOccupied = status === "occupied";

  return (
    <motion.button
      type="button"
      onClick={() => !isOccupied && onSelect(seat.id)}
      disabled={isOccupied}
      tabIndex={isOccupied ? -1 : 0}
      aria-label={`Asiento ${seat.id}, ${{ available: "disponible", selected: "seleccionado", occupied: "ocupado" }[status]}`}
      aria-pressed={status === "selected"}
      className={cn(
        "w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-md border flex items-center justify-center text-xs font-semibold transition-colors duration-300 motion-reduce:transition-none ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring focus-visible:ring-offset-background",
        {
          "bg-card text-card-foreground hover:bg-accent hover:border-primary cursor-pointer":
            status === "available",
          "bg-primary text-primary-foreground border-primary cursor-pointer":
            status === "selected",
          "bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50":
            isOccupied,
        },
      )}
      // Animation props for visual feedback
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={
        reduced
          ? undefined
          : { scale: isOccupied ? 1 : 1.1, y: isOccupied ? 0 : -2 }
      }
      whileTap={reduced ? undefined : { scale: isOccupied ? 1 : 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {seat.number}
    </motion.button>
  );
});
Seat.displayName = "Seat";

// --- Main Component ---

export const SeatMap = ({
  layout,
  selectedSeats,
  occupiedSeats,
  onSeatSelect,
  className,
  arrangement,
}: SeatSelectionProps) => {
  const reduced = useReducedMotion();
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center gap-12 p-4 bg-background",
        className,
      )}
    >
      <Screen reduced={reduced === true} />
      <motion.div className="w-full flex flex-col gap-6" initial={false}>
        {layout.map((category) => (
          <div
            key={category.categoryName}
            className="flex flex-col items-center gap-3"
          >
            <h3 className="text-sm font-semibold text-foreground">
              {category.categoryName} (
              {formatPrice({
                amountMinor: category.priceMinor,
                currency: "MXN",
              })}{" "}
              MXN)
            </h3>
            <div
              role="region"
              aria-label={`Asientos ${category.categoryName}`}
              tabIndex={0}
              className={cn(
                "seat-zone w-full overflow-x-auto bg-card p-2 sm:p-4 rounded-lg border flex flex-col gap-2 focus-visible:outline-2 focus-visible:outline-ring",
                arrangement === "tables" && "seat-zone-tables",
              )}
            >
              {category.rows.map((row) => (
                <motion.div
                  key={row.rowId}
                  className={cn(
                    "seat-row flex min-w-max items-center justify-center gap-2",
                    arrangement === "tables" && "seat-table",
                  )}
                  initial={false}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="w-6 shrink-0 text-sm font-medium text-muted-foreground select-none">
                    {row.rowId}
                  </div>
                  <div className="flex-1 flex justify-center items-center gap-1.5 sm:gap-2 flex-nowrap">
                    {row.seats.map((seat) => (
                      <Seat
                        key={seat.id}
                        seat={seat}
                        onSelect={onSeatSelect}
                        status={
                          occupiedSeats.includes(seat.id)
                            ? "occupied"
                            : selectedSeats.includes(seat.id)
                              ? "selected"
                              : "available"
                        }
                      />
                    ))}
                  </div>
                  <div className="w-6 shrink-0 text-sm font-medium text-muted-foreground select-none">
                    {row.rowId}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

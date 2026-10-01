"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SeatStatus = "available" | "preferred" | "vip" | "accessible" | "reserved";

export const Widget2 = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const cols = Array.from({ length: 14 }, (_, i) => i + 1);

    const getInitialStatus = (row: string, col: number): SeatStatus => {
        const isReserved =
            (row === "A" && (col === 3 || col === 4)) ||
            (row === "B" && (col === 7 || col === 8)) ||
            (row === "C" && (col === 2 || col === 11)) ||
            (row === "D" && (col === 5 || col === 6)) ||
            (row === "E" && (col === 9 || col === 10));

        if (isReserved) return "reserved";

        if (row === "A" && (col === 1 || col === 12)) return "accessible";
        if (row === "B" && (col === 1 || col === 12)) return "accessible";

        if (row === "E" || row === "F") return "vip";

        if (row === "C" || row === "D") return "preferred";

        return "available";
    };

    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [hoveredSeat, setHoveredSeat] = useState<{ row: string; col: number; status: SeatStatus } | null>(null);

    const toggleSeat = (row: string, col: number, status: SeatStatus) => {
        if (status === "reserved") return;
        const seatId = `${row}${col}`;
        setSelectedSeats((prev) => (prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]));
    };

    const getSeatClasses = (row: string, col: number, status: SeatStatus) => {
        const seatId = `${row}${col}`;
        const isSelected = selectedSeats.includes(seatId);

        if (isSelected) {
            return "border-chart-2 bg-chart-2/70 scale-110";
        }

        switch (status) {
            case "reserved":
                return "border-border bg-muted/40 cursor-not-allowed opacity-40";
            case "vip":
                return "border-chart-4 bg-chart-4/15 hover:border-chart-4 hover:bg-chart-4/25 hover:scale-110";
            case "preferred":
                return "border-chart-1 bg-chart-1/15 hover:border-chart-1 hover:bg-chart-1/25 hover:scale-110";
            case "accessible":
                return "border-chart-5 bg-chart-5/15 hover:border-chart-5 hover:bg-chart-5/25 hover:scale-110";
            case "available":
            default:
                return "border-chart-3 bg-chart-3/15 hover:border-chart-3 hover:bg-chart-3/25 hover:scale-110";
        }
    };

    const getSeatPrice = (seatId: string) => {
        const row = seatId.charAt(0);
        const col = parseInt(seatId.slice(1));

        if (row === "A" && (col === 1 || col === 12)) return 10;
        if (row === "B" && (col === 1 || col === 12)) return 10;
        if (row === "E" || row === "F") return 22;
        if (row === "C" || row === "D") return 16;
        return 12;
    };

    const totalPrice = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader className="flex justify-between">
                <div>
                    <CardTitle className="text-lg">Seat Booking</CardTitle>
                    <CardDescription>Select your preferred seats</CardDescription>
                </div>
                <Badge variant="outline">Stage 4</Badge>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                    <div className="via-foreground/10 h-1.5 w-full rounded-full bg-linear-to-r from-transparent to-transparent" />
                    <span className="text-muted-foreground text-xs tracking-widest uppercase">Event</span>
                </div>

                <div className="grid grid-cols-[repeat(14,minmax(24px,1fr))] gap-1.5 overflow-x-auto px-1 py-2">
                    {rows.map((row) =>
                        cols.map((col) => {
                            const status = getInitialStatus(row, col);
                            return (
                                <button
                                    key={`${row}-${col}`}
                                    type="button"
                                    aria-label={`Seat ${row}${col}, ${status}${status === "reserved" ? "" : `, $${getSeatPrice(`${row}${col}`)}`}`}
                                    aria-pressed={selectedSeats.includes(`${row}${col}`)}
                                    aria-disabled={status === "reserved"}
                                    onFocus={() => setHoveredSeat({ row, col, status })}
                                    onBlur={() => setHoveredSeat(null)}
                                    onClick={() => toggleSeat(row, col, status)}
                                    onMouseEnter={() => setHoveredSeat({ row, col, status })}
                                    onMouseLeave={() => setHoveredSeat(null)}
                                    className={`size-6 cursor-pointer rounded-md border-2 transition-all duration-200 motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${getSeatClasses(row, col, status)}`}
                                />
                            );
                        }),
                    )}
                </div>

                <div className="flex h-4 items-center justify-center">
                    {hoveredSeat ? (
                        <span className="text-xs">
                            Seat {hoveredSeat.row}
                            {hoveredSeat.col} •{" "}
                            <span
                                className={
                                    hoveredSeat.status === "reserved"
                                        ? ""
                                        : selectedSeats.includes(`${hoveredSeat.row}${hoveredSeat.col}`)
                                          ? "text-chart-2 motion-safe:animate-pulse"
                                          : hoveredSeat.status === "vip"
                                            ? "text-chart-4"
                                            : hoveredSeat.status === "preferred"
                                              ? "text-chart-1"
                                              : hoveredSeat.status === "accessible"
                                                ? "text-chart-5"
                                                : "text-chart-3"
                                }>
                                {hoveredSeat.status === "reserved"
                                    ? "Reserved"
                                    : selectedSeats.includes(`${hoveredSeat.row}${hoveredSeat.col}`)
                                      ? "Selected"
                                      : hoveredSeat.status === "vip"
                                        ? "VIP ($22)"
                                        : hoveredSeat.status === "preferred"
                                          ? "Preferred ($16)"
                                          : hoveredSeat.status === "accessible"
                                            ? "Accessible ($10)"
                                            : "Standard ($12)"}
                            </span>
                        </span>
                    ) : (
                        <span className="motion-safe:animate-pulse text-xs">Hover or focus seats to view details</span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 px-2 text-xs sm:grid-cols-3">
                    <div className="flex items-center gap-1.5">
                        <span className="bg-muted/40 size-2.5 rounded-md border" />
                        <span>Reserved</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="border-chart-3 bg-chart-3/15 size-2.5 rounded-md border" />
                        <span>Standard ($12)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="border-chart-1 bg-chart-1/15 size-2.5 rounded-md border" />
                        <span>Preferred ($16)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="border-chart-4 bg-chart-4/15 size-2.5 rounded-md border" />
                        <span>VIP ($22)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="border-chart-5 bg-chart-5/15 size-2.5 rounded-md border" />
                        <span>Accessible ($10)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="border-chart-2 bg-chart-2/25 size-2.5 rounded-md border" />
                        <span className="text-chart-2">Selected</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4" aria-live="polite" aria-atomic="true">
                    <div className="flex flex-col gap-1.5">
                        <span>Selected Seats</span>
                        <div className="flex items-center gap-2">
                            <div className="bg-chart-2 h-7 w-1 rounded-md" />
                            <span className="text-3xl">{selectedSeats.length}</span>
                        </div>
                    </div>

                    {/* Total Price */}
                    <div className="flex flex-col gap-1.5">
                        <span>Total Price</span>
                        <div className="flex items-center gap-2">
                            <div className="bg-chart-3 h-7 w-1 rounded-md" />
                            <span className="text-3xl">${totalPrice}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

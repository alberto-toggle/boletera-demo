import type { Sale } from "./model";
export interface DateRange {
  from: string;
  to: string;
}
export function mexicoDay(timestamp: number): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(timestamp));
  const part = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export const datePresets = [
  "Todo el periodo",
  "Hoy",
  "Esta semana",
  "Semana pasada",
  "Este mes",
  "Mes pasado",
] as const;
export function presetRange(preset: string, now: number): DateRange {
  const today = mexicoDay(now);
  const d = new Date(`${today}T12:00:00Z`);
  const iso = (date: Date) => date.toISOString().slice(0, 10);
  const shift = (days: number) => new Date(d.getTime() + days * 86400000);
  const monday = (d.getUTCDay() + 6) % 7;
  switch (preset) {
    case "Hoy":
      return { from: today, to: today };
    case "Esta semana":
      return { from: iso(shift(-monday)), to: today };
    case "Semana pasada":
      return { from: iso(shift(-monday - 7)), to: iso(shift(-monday - 1)) };
    case "Este mes":
      return { from: `${today.slice(0, 7)}-01`, to: today };
    case "Mes pasado":
      return {
        from: iso(
          new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, 1)),
        ),
        to: iso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 0))),
      };
    default:
      return { from: "", to: "" };
  }
}
export function paymentKind(
  sale: Sale,
): "none" | "cash" | "terminal" | "mixed" {
  const methods = new Set(sale.payments.map((p) => p.method));
  if (sale.pendingTerminal) methods.add("terminal");
  return methods.size > 1
    ? "mixed"
    : methods.has("cash")
      ? "cash"
      : methods.has("terminal")
        ? "terminal"
        : "none";
}

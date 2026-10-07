import type { Sale } from "./model";
export type OperationGroup = "active" | "completed" | "closed";
export const operationGroups = [
  { id: "active", label: "En curso" },
  { id: "completed", label: "Ventas completadas" },
  { id: "closed", label: "Canceladas y vencidas" },
] as const;
export function operationGroup(sale: Sale, now: number): OperationGroup {
  if (sale.status === "confirmed") return "completed";
  if (
    sale.status === "cancelled" ||
    sale.status === "expired" ||
    (sale.status === "pending" && sale.expiresAt <= now)
  )
    return "closed";
  return "active";
}
export function remainingHoldSeconds(expiresAt: number, now: number) {
  return Math.max(0, Math.ceil((expiresAt - now) / 1000));
}

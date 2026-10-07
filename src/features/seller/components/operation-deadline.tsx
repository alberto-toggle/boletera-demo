import { remainingHoldSeconds } from "../operations";
import type { Sale } from "../model";
export function OperationDeadline({ sale, now }: { sale: Sale; now: number }) {
  if (sale.status === "pending") {
    const seconds = remainingHoldSeconds(sale.expiresAt, now);
    const value = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
    return (
      <span
        className={`seller-operation-deadline${seconds <= 60 ? " is-urgent" : ""}`}
      >
        {seconds ? (
          <>
            Vence en{" "}
            <time role="timer" aria-label={`Tiempo restante: ${value}`}>
              {value}
            </time>
          </>
        ) : (
          "Apartado vencido"
        )}
      </span>
    );
  }
  if (sale.status === "partial")
    return (
      <span className="seller-operation-deadline">
        Pago parcial · Pendiente de completar
      </span>
    );
  if (sale.status === "terminal" || sale.status === "review")
    return (
      <span className="seller-operation-deadline is-urgent">
        Requiere revisión
      </span>
    );
  return null;
}

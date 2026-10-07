import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { OperationDeadline } from "./operation-deadline";
import { paymentKind } from "../sales-filters";
import {
  date,
  paid,
  balance,
  money,
  statusLabels,
  total,
  type Sale,
} from "../model";

export function OperationRow({
  sale: s,
  eventTitle,
  now,
}: {
  sale: Sale;
  eventTitle: string;
  now: number;
}) {
  return (
    <Link
      className="seller-sale-row"
      href={`/operacion/vendedor/venta/${s.id}`}
    >
      <div>
        <span className={`seller-status ${s.status}`}>
          {statusLabels[s.status]}
        </span>
        <OperationDeadline sale={s} now={now} />
        <h2>{eventTitle}</h2>
        <p>
          {(s.customerDraft ?? s.customer)?.name || "Sin identificar"} ·{" "}
          {s.seats.length} lugares
        </p>
        <small>
          {s.id} · {date(new Date(s.createdAt).toISOString())}
        </small>
      </div>
      <div>
        <strong>{money(total(s))}</strong>
        <small>
          {paymentKind(s) === "mixed"
            ? "Pago mixto"
            : paymentKind(s) === "cash"
              ? "Efectivo"
              : paymentKind(s) === "terminal"
                ? "Terminal"
                : "Sin cobros"}{" "}
          · {s.payments.length} {s.payments.length === 1 ? "cobro" : "cobros"}
        </small>
        {paid(s) > 0 && s.status !== "confirmed" && (
          <small>Pendiente: {money(balance(s))}</small>
        )}
        <span>
          {s.status === "confirmed" ? "Ver boletos" : "Ver operación"}{" "}
          <ArrowUpRight size={15} />
        </span>
      </div>
    </Link>
  );
}

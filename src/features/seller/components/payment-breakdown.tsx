import { Banknote, CreditCard } from "lucide-react";
import { money, paid, balance, type Sale } from "../model";
export function PaymentBreakdown({ sale }: { sale: Sale }) {
  return (
    <section
      className="seller-payment-breakdown"
      aria-label="Desglose de cobros"
    >
      <h3>Cobros registrados</h3>
      {!sale.payments.length && (
        <p className="seller-muted">Todavía no hay cobros registrados.</p>
      )}
      {sale.payments.map((payment, index) => (
        <div className="seller-payment-entry" key={payment.id}>
          {payment.method === "cash" ? (
            <Banknote size={19} />
          ) : (
            <CreditCard size={19} />
          )}
          <div>
            <strong>
              {index + 1}. {payment.method === "cash" ? "Efectivo" : "Terminal"}
            </strong>
            <small>
              {payment.method === "cash"
                ? `Recibido ${money(payment.receivedMinor)} · Cambio ${money(payment.receivedMinor - payment.amountMinor)}`
                : `Referencia: ${payment.reference}`}
            </small>
          </div>
          <strong>{money(payment.amountMinor)}</strong>
        </div>
      ))}
      <div className="seller-balance">
        <span>
          Pagado <strong>{money(paid(sale))}</strong>
        </span>
        <span>
          Saldo pendiente <strong>{money(balance(sale))}</strong>
        </span>
      </div>
    </section>
  );
}

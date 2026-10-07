import { dayKey, saleTotal, type AdminSale, type DateRange } from "../model";
import type { RevenuePoint } from "../charts/revenue-area";
import type { PaymentPoint } from "../charts/payment-bars";

export function revenueSeries(
  sales: readonly AdminSale[],
  range: DateRange,
): RevenuePoint[] {
  const buckets = new Map<string, RevenuePoint>();
  for (const sale of sales) {
    const date = dayKey(sale.createdAt);
    const point = buckets.get(date) ?? { date, web: 0, boxOffice: 0 };
    point[sale.channel === "web" ? "web" : "boxOffice"] += saleTotal(sale);
    buckets.set(date, point);
  }
  // Calendar dates are iterated in UTC; transaction dates already use Mexico City.
  if (range.from && range.to) {
    for (
      let ms = Date.parse(`${range.from}T00:00:00Z`);
      ms <= Date.parse(`${range.to}T00:00:00Z`);
      ms += 86400000
    ) {
      const date = new Date(ms).toISOString().slice(0, 10);
      if (!buckets.has(date)) buckets.set(date, { date, web: 0, boxOffice: 0 });
    }
  }
  return [...buckets.values()].sort((a, b) => a.date.localeCompare(b.date));
}
export function paymentSeries(sales: readonly AdminSale[]): PaymentPoint[] {
  return (
    [
      ["online", "En línea"],
      ["terminal", "Terminal"],
      ["cash", "Efectivo"],
    ] as const
  ).map(([method, label]) => ({
    method,
    label,
    amount: sales.reduce(
      (sum, sale) =>
        sum +
        sale.payments
          .filter((payment) => payment.method === method)
          .reduce((total, payment) => total + payment.amountMinor, 0),
      0,
    ),
  }));
}
export function activitySeries(sales: readonly AdminSale[]) {
  const days = new Map<string, number>();
  for (const sale of sales) {
    const date = dayKey(sale.createdAt);
    days.set(date, (days.get(date) ?? 0) + 1);
  }
  return [...days].map(([date, count]) => ({ date, count }));
}

/** Inclusive rolling window anchored to the explicit demo reference date. */
export function activityRange(reference: string, days: number): DateRange {
  const end = Date.parse(`${reference}T00:00:00Z`);
  return {
    from: new Date(end - (days - 1) * 86400000).toISOString().slice(0, 10),
    to: reference,
  };
}

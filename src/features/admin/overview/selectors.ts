import { inRange, saleTotal, type AdminSale, type DateRange } from "../model";
export function salesSummary(sales: readonly AdminSale[], range: DateRange) {
  const confirmed = sales.filter(
    (sale) => sale.status === "confirmed" && inRange(sale, range),
  );
  const revenue = confirmed.reduce((sum, sale) => sum + saleTotal(sale), 0);
  const tickets = confirmed.reduce((sum, sale) => sum + sale.tickets.length, 0);
  const channels = (["web", "box-office"] as const).map((channel) => {
    const matching = confirmed.filter((sale) => sale.channel === channel);
    return {
      channel,
      revenue: matching.reduce((sum, sale) => sum + saleTotal(sale), 0),
      tickets: matching.reduce((sum, sale) => sum + sale.tickets.length, 0),
    };
  });
  return {
    confirmed,
    revenue,
    tickets,
    channels,
    average: confirmed.length ? Math.round(revenue / confirmed.length) : 0,
  };
}

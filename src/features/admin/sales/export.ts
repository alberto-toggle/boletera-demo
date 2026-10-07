import {
  dateLabel,
  saleTotal,
  saleStatusLabels,
  type AdminEvent,
  type AdminSale,
} from "../model";
// CSV cells are escaped and formula-leading values are neutralized for spreadsheet apps.
const cell = (value: string) =>
  `"${(/^[=+@\-\t\r]/.test(value) ? "'" : "") + value.replaceAll('"', '""')}"`;
export function exportSales(
  sales: readonly AdminSale[],
  events: readonly AdminEvent[],
) {
  const rows = [
    [
      "Folio",
      "Evento",
      "Fecha CDMX",
      "Comprador",
      "Canal",
      "Estado",
      "Boletos",
      "Importe solicitado MXN",
      "Ingreso confirmado MXN",
    ],
    ...sales.map((sale) => [
      sale.id,
      events.find((event) => event.id === sale.eventId)?.title ?? "Evento",
      dateLabel(sale.createdAt, true),
      sale.buyer.name,
      sale.channel === "web" ? "En línea" : "Taquilla",
      saleStatusLabels[sale.status],
      String(sale.tickets.length),
      (saleTotal(sale) / 100).toFixed(2),
      (sale.status === "confirmed" ? saleTotal(sale) / 100 : 0).toFixed(2),
    ]),
  ];
  const blob = new Blob(
    ["\uFEFF", rows.map((row) => row.map(cell).join(",")).join("\r\n")],
    { type: "text/csv;charset=utf-8;" },
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "boletera-ventas.csv";
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

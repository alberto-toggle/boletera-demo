import type { Courtesy } from "@/features/access/demo/courtesies";
import { dateLabel } from "../model";
export async function downloadCourtesy(ticket: Courtesy) {
  const [{ jsPDF }, { encode }] = await Promise.all([
    import("jspdf"),
    import("uqr"),
  ]);
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  pdf.setFillColor(30, 59, 48);
  pdf.roundedRect(20, 25, 170, 220, 5, 5, "F");
  pdf.setTextColor(255);
  pdf.setFontSize(14);
  pdf.text("BOLETERA · CORTESÍA", 32, 42);
  pdf.setFontSize(22);
  pdf.text(pdf.splitTextToSize(ticket.event.title, 144), 32, 62);
  pdf.setFontSize(11);
  pdf.text(dateLabel(ticket.event.startsAt, true), 32, 95);
  pdf.text(ticket.event.venue, 32, 104);
  pdf.setFontSize(16);
  pdf.text(ticket.seat, 32, 122);
  pdf.setFontSize(12);
  pdf.text(pdf.splitTextToSize(ticket.buyer, 140), 32, 135);
  const qr = encode(ticket.id, { ecc: "M", border: 4 });
  const size = 60,
    x = 75,
    y = 151,
    cell = size / qr.size;
  pdf.setFillColor(255, 255, 255);
  pdf.rect(x, y, size, size, "F");
  pdf.setFillColor(0, 0, 0);
  qr.data.forEach((row, ri) =>
    row.forEach((dark, ci) => {
      if (dark) pdf.rect(x + ci * cell, y + ri * cell, cell, cell, "F");
    }),
  );
  pdf.setFontSize(9);
  pdf.text(ticket.id, 105, 220, { align: "center" });
  pdf.text(
    "Acceso principal · Un ingreso por boleto · Sin valor de venta",
    105,
    232,
    { align: "center" },
  );
  pdf.setTextColor(80);
  pdf.text(
    "Demostración. Boleto sin validez para ingresar a un evento real.",
    105,
    258,
    { align: "center" },
  );
  pdf.save(`${ticket.id}.pdf`);
}

import "@/features/tickets/design-gallery.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import "@/features/seating/map.css";
import "@/features/tickets/admission-ticket.css";
import "@/features/seller/seller.css";
export const metadata: Metadata = {
  title: "Taquilla · Boletera",
  description: "Demostración del flujo de vendedor",
};
export default function SellerLayout({ children }: { children: ReactNode }) {
  return children;
}

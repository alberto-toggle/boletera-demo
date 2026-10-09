import type { ReactNode } from "react";
import { InternalGate } from "@/features/internal-access/access";
import "@/features/staff/staff.css";
export const metadata = { title: "Control de acceso · Boletera" };
export default function Layout({ children }: { children: ReactNode }) {
  return <InternalGate area="staff">{children}</InternalGate>;
}

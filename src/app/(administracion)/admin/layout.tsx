import type { ReactNode } from "react";
import { AdminProvider } from "@/features/admin/demo/provider";
import { AdminShell } from "@/features/admin/components/admin-shell";
import "@/features/admin/admin.css";
export const metadata = {
  title: { default: "Administración · Boletera", template: "%s · Boletera" },
};
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}

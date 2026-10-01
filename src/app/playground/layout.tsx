import type { ReactNode } from "react";
import NavbarSidebarToggle from "@/components/blocks/shadcn-io/navbar-sidebar-toggle/navbar-sidebar-toggle";

export default function PlaygroundLayout({ children }: { children: ReactNode }) {
  return <NavbarSidebarToggle>{children}</NavbarSidebarToggle>;
}

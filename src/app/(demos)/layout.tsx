import "@/features/event-experience/experience.css";
import { DemoMotion } from "@/features/event-discovery/components/demo-motion";
import type { ReactNode } from "react";
import "@/features/event-discovery/discovery.css";
import "@/features/account/account.css";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <DemoMotion />
    </>
  );
}

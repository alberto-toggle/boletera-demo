"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { DiscoveryEvent } from "../model";
export { AccountMenu as AccountPreview } from "@/features/account/components/account-menu";

export function EventPreview({
  event,
  className = "demo-button",
  children,
}: {
  event: DiscoveryEvent;
  className?: string;
  children?: ReactNode;
}) {
  const pathname = usePathname();
  const parent = pathname.split("/")[1];
  const base = [
    "demo-institucional",
    "demo-gala",
    "demo-editorial",
    "demo-inmersiva",
  ].includes(parent)
    ? parent
    : "demo-institucional";
  const href = `/${base}/eventos/${event.id}`;
  const label = children ?? (
    <>
      Ver evento <ArrowUpRight aria-hidden="true" />
    </>
  );
  return className.includes("stretched-trigger") ? (
    <>
      <span
        aria-hidden="true"
        className={buttonVariants({ variant: "ghost", className })}
      >
        {label}
      </span>
      <Link
        href={href}
        className="card-hit-button"
        aria-label={`Ver ${event.title}`}
      />
    </>
  ) : (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

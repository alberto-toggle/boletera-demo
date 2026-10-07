// Adapted from ShadcnStore Dashboard + Landing, dashboard-2/metrics-overview.tsx.
// MIT license retained in ../THIRD_PARTY_LICENSE.md. Fixtures removed; typed, data-driven cards.
import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
export interface Metric {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}
export function MetricCards({ items }: { items: readonly Metric[] }) {
  return (
    <div className="admin-metrics">
      {items.map(({ label, value, detail, icon: Icon }) => (
        <Card className="admin-metric" key={label}>
          <CardHeader>
            <CardDescription>{label}</CardDescription>
            <CardAction>
              <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
            </CardAction>
            <CardTitle>{value}</CardTitle>
          </CardHeader>
          <p>{detail}</p>
        </Card>
      ))}
    </div>
  );
}

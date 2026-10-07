"use client";
// Local Base UI support adapter for the controls omitted from the registry payload.
import { ChartNoAxesColumn, ChartSpline } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { ChartView } from "./metric-chart";
export interface PeriodOption {
  label: string;
  points?: number;
}
export function PeriodSelect({
  value,
  options,
  onChange,
  accentText,
}: {
  value: string;
  options: PeriodOption[];
  onChange: (option: PeriodOption) => void;
  accentText: string;
}) {
  return (
    <div className="pointer-events-auto" style={{ color: accentText }}>
      <Select
        value={value}
        onValueChange={(v) => {
          const option = options.find((o) => o.label === v);
          if (option) onChange(option);
        }}
      >
        <SelectTrigger aria-label="Period">
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {options.map((o) => (
            <SelectItem key={o.label} value={o.label}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
export function ViewToggle({
  value,
  onChange,
}: {
  value: ChartView;
  onChange: (view: ChartView) => void;
}) {
  return (
    <div className="pointer-events-auto flex gap-1">
      <button
        type="button"
        aria-label="Line chart"
        aria-pressed={value !== "bar"}
        className="rounded p-1.5 hover:bg-muted"
        onClick={() => onChange("line")}
      >
        <ChartSpline size={16} />
      </button>
      <button
        type="button"
        aria-label="Bar chart"
        aria-pressed={value === "bar"}
        className="rounded p-1.5 hover:bg-muted"
        onClick={() => onChange("bar")}
      >
        <ChartNoAxesColumn size={16} />
      </button>
    </div>
  );
}

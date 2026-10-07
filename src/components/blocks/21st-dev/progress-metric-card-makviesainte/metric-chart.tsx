"use client";
// Local support adapter: the registry payload omits the author's metric-chart module.
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";
export interface SeriesPoint {
  value: number;
  date: string;
}
export type MetricAccent = "emerald" | "rose" | "neutral" | "blue" | "violet";
export type ChartView = "line" | "bar" | "area" | "curve";
export interface MetricSeries {
  name: string;
  data: SeriesPoint[];
  accent?: MetricAccent;
}
export interface ChartSeries {
  name: string;
  data: SeriesPoint[];
  color: string;
}
export const ACCENTS = {
  emerald: { stroke: "#10b981", text: "#047857" },
  rose: { stroke: "#f43f5e", text: "#be123c" },
  neutral: { stroke: "#64748b", text: "#475569" },
  blue: { stroke: "#3b82f6", text: "#2563eb" },
  violet: { stroke: "#8b5cf6", text: "#7c3aed" },
};
export const SERIES_COLORS = ["#3b82f6", "#14b8a6", "#f59e0b", "#8b5cf6"];
export const formatCompact = (value: number) =>
  Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
export function MetricChart({
  series,
  view,
  valueFormatter,
  dateFormatter,
}: {
  series: ChartSeries[];
  view: ChartView;
  defaultIndex?: number;
  valueFormatter: (value: number) => string;
  dateFormatter: (date: string) => string;
}) {
  const data =
    series[0]?.data.map((point, i) =>
      Object.fromEntries([
        ["date", point.date],
        ...series.map((s) => [s.name, s.data[i]?.value ?? 0]),
      ]),
    ) ?? [];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 90, left: 0, right: 0, bottom: 55 }}
      >
        <XAxis dataKey="date" hide />
        <Tooltip
          formatter={(value) => valueFormatter(Number(value))}
          labelFormatter={(label) => dateFormatter(String(label))}
        />
        {series.map((s) =>
          view === "bar" ? (
            <Bar
              key={s.name}
              dataKey={s.name}
              fill={s.color}
              radius={[4, 4, 0, 0]}
            />
          ) : (
            <Area
              key={s.name}
              dataKey={s.name}
              type="monotone"
              stroke={s.color}
              strokeWidth={3}
              fill={s.color}
              fillOpacity={0.12}
            />
          ),
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

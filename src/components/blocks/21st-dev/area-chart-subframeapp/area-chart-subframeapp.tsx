"use client";
// Subframe public component contract adapted to the installed Recharts engine.
import { forwardRef } from "react";
import {
  ResponsiveContainer,
  AreaChart as Chart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
type DataPoint = Record<string, string | number>;
interface AreaChartProps {
  data?: DataPoint[];
  categories?: string[];
  index?: string;
  stacked?: boolean;
  className?: string;
  colors?: string[];
  dark?: boolean;
}
const defaultData = [
  { Year: "2018", Psychology: 125, Business: 120, Biology: 90 },
  { Year: "2019", Psychology: 110, Business: 130, Biology: 85 },
  { Year: "2020", Psychology: 135, Business: 100, Biology: 95 },
  { Year: "2021", Psychology: 105, Business: 115, Biology: 120 },
  { Year: "2022", Psychology: 140, Business: 125, Biology: 130 },
];
export const AreaChart = forwardRef<HTMLDivElement, AreaChartProps>(
  function AreaChart(
    {
      data = defaultData,
      categories = ["Psychology", "Business", "Biology"],
      index = "Year",
      stacked = false,
      className,
      colors = ["#0c6d62", "#12a594", "#10b3a3"],
      dark = false,
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "h-80 w-full",
          dark && "rounded-xl bg-slate-950 text-white",
          className,
        )}
      >
        <ResponsiveContainer width="100%" height="100%">
          <Chart
            data={data}
            margin={{ top: 16, right: 16, bottom: 8, left: 0 }}
          >
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey={index} tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            {categories.map((category, i) => (
              <Area
                key={category}
                type="monotone"
                dataKey={category}
                stackId={stacked ? "total" : undefined}
                stroke={colors[i % colors.length]}
                fill={colors[i % colors.length]}
                fillOpacity={0.16}
              />
            ))}
          </Chart>
        </ResponsiveContainer>
      </div>
    );
  },
);
export default AreaChart;

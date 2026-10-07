"use client";
// Adapted from Pace UI Dashboard Chart 5: separated, rounded bars and light grid.
import { useReducedMotion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { money } from "../model";
import { chartColors } from "./chart-tokens";
export interface PaymentPoint {
  method: "online" | "cash" | "terminal";
  label: string;
  amount: number;
}
export function PaymentBars({ data }: { data: PaymentPoint[] }) {
  const reduced = useReducedMotion();
  return (
    <div
      className="admin-payment-plot"
      role="img"
      aria-label="Importe cobrado por método de pago"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 12, right: 24, left: 6, bottom: 0 }}
          barSize={22}
        >
          <CartesianGrid
            horizontal={false}
            stroke={chartColors.grid}
            strokeDasharray="3 5"
          />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: chartColors.muted }}
            tickFormatter={(value) => `$${Number(value) / 100000}k`}
          />
          <YAxis
            type="category"
            dataKey="label"
            axisLine={false}
            tickLine={false}
            width={94}
            tick={{ fontSize: 12, fill: chartColors.muted }}
          />
          <Tooltip
            formatter={(value) => money(Number(value))}
            cursor={{ fill: "#f4f7fc" }}
            contentStyle={{ borderRadius: 12, fontSize: 12 }}
          />
          <Bar
            name="Cobrado"
            dataKey="amount"
            radius={[0, 5, 5, 0]}
            isAnimationActive={!reduced}
            animationDuration={900}
          >
            {data.map((item) => (
              <Cell key={item.method} fill={chartColors[item.method]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

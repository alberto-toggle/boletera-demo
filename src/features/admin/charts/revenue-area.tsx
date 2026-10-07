"use client";
// Adapted from sean0205 Area Charts 2: gradient areas, cursor and compact tooltip.
import { useId } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { money } from "../model";
import { chartColors } from "./chart-tokens";
export interface RevenuePoint {
  date: string;
  web: number;
  boxOffice: number;
}
const date = (value: string) => value.slice(5).split("-").reverse().join("/");
export function RevenueArea({ points }: { points: RevenuePoint[] }) {
  const id = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  return (
    <div
      className="admin-analytics-plot"
      role="img"
      aria-label="Ingresos diarios en pesos por canal. Detalles disponibles en la tabla de datos."
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={points}
          margin={{ top: 16, right: 16, bottom: 0, left: 8 }}
        >
          <defs>
            {(["web", "boxOffice"] as const).map((key) => (
              <linearGradient
                key={key}
                id={`${id}-${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={chartColors[key]}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={chartColors[key]}
                  stopOpacity={0.02}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            vertical={false}
            stroke={chartColors.grid}
            strokeDasharray="3 5"
          />
          <XAxis
            dataKey="date"
            tickFormatter={date}
            axisLine={false}
            tickLine={false}
            minTickGap={42}
            tick={{ fontSize: 11, fill: chartColors.muted }}
            dy={9}
          />
          <YAxis
            tickFormatter={(value) => `$${Number(value) / 100000}k`}
            axisLine={false}
            tickLine={false}
            width={58}
            tick={{ fontSize: 11, fill: chartColors.muted }}
          />
          <Tooltip
            labelFormatter={(value) => date(String(value))}
            formatter={(value) => money(Number(value))}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e3e8f1",
              fontSize: 12,
              boxShadow: "0 8px 30px #24395712",
            }}
          />
          <Area
            name="En línea"
            dataKey="web"
            type="monotone"
            stroke={chartColors.web}
            fill={`url(#${id}-web)`}
            strokeWidth={2.5}
            isAnimationActive={!reduced}
            animationDuration={850}
            activeDot={{ r: 5, strokeWidth: 3, stroke: "white" }}
          />
          <Area
            name="Taquilla"
            dataKey="boxOffice"
            type="monotone"
            stroke={chartColors.boxOffice}
            fill={`url(#${id}-boxOffice)`}
            strokeWidth={2.5}
            isAnimationActive={!reduced}
            animationDuration={1050}
            activeDot={{ r: 5, strokeWidth: 3, stroke: "white" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

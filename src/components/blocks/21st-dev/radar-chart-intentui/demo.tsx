"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Chart,
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "./radar-chart-intentui";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

const chartData = [
  { category: "Electronics", sales: 186 },
  { category: "Clothing", sales: 305 },
  { category: "Groceries", sales: 237 },
  { category: "Furniture", sales: 273 },
  { category: "Toys", sales: 209 },
  { category: "Beauty", sales: 214 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function Component() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>By Category</CardTitle>
        <CardDescription>
          Sales performance by category (Jan - Jun 2024)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Chart
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="category" />
            <PolarGrid />
            <Radar
              dataKey="sales"
              fill="var(--color-sales)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </Chart>
      </CardContent>
    </Card>
  );
}

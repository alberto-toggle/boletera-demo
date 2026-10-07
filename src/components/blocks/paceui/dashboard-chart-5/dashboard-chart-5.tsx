"use client";
import { useState } from "react";

import { ChevronDownIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const chartData = [
  { month: "Jan", newSignups: 450, churned: 80 },
  { month: "Feb", newSignups: 520, churned: 95 },
  { month: "Mar", newSignups: 610, churned: 110 },
  { month: "Apr", newSignups: 580, churned: 90 },
  { month: "May", newSignups: 710, churned: 105 },
  { month: "Jun", newSignups: 800, churned: 120 },
  { month: "Jul", newSignups: 750, churned: 115 },
  { month: "Aug", newSignups: 820, churned: 130 },
  { month: "Sep", newSignups: 900, churned: 140 },
];

const chartConfig: ChartConfig = {
  newSignups: {
    label: "New Signups",
    color: "var(--chart-2)",
  },
  churned: {
    label: "Churned",
    color: "var(--chart-1)",
  },
};

const CustomBar = (props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
}) => {
  const { x, y, width, height, fill } = props;
  if (height === undefined || height === null || height <= 0) {
    return null;
  }
  const gap = 4;
  const adjustedY = (y ?? 0) + gap / 2;
  const adjustedHeight = Math.max(0, height - gap);
  return (
    <rect
      x={x}
      y={adjustedY}
      width={width}
      height={adjustedHeight}
      rx={4}
      ry={4}
      fill={fill}
    />
  );
};

export const Chart5 = () => {
  const [range, setRange] = useState("This Year");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-lg font-medium tracking-tight">
            Customer Growth
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            View new customer signups and churn over time
          </CardDescription>
        </div>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm" className="gap-1.5">
                  <span>{range}</span>
                  <ChevronDownIcon className="size-3.5" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => setRange("This Year")}>
                This Year
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRange("Last Year")}>
                Last Year
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRange("All Time")}>
                All Time
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="ps-0 pe-5">
        <ChartContainer config={chartConfig} className="h-68 w-full">
          <BarChart data={chartData}>
            <defs fill="var(--color-newSignups)">
              <pattern
                id="signups-stripes"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect width="8" height="8" fill="var(--color-newSignups)" />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="8"
                  stroke="oklch(1 0 0 / 25%)"
                  strokeWidth="3"
                />
              </pattern>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              className="text-muted-foreground text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              ticks={[200, 400, 600, 800, 1000]}
              domain={[0, 1100]}
              tickFormatter={(value) => (value > 0 ? `${value}` : "")}
              className="text-muted-foreground text-xs"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Month: ${value}`}
                  indicator="dot"
                  className="rounded-md shadow-none"
                />
              }
            />
            <Bar
              dataKey="churned"
              stackId="a"
              fill="var(--color-churned)"
              shape={<CustomBar />}
              maxBarSize={28}
            />
            <Bar
              dataKey="newSignups"
              stackId="a"
              fill="url(#signups-stripes)"
              shape={<CustomBar />}
              maxBarSize={28}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

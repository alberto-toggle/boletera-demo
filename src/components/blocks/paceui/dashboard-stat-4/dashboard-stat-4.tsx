"use client";
import { UserCheckIcon } from "lucide-react";
import { Area, AreaChart } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

export type Stat4Props = {
  title?: string;
  value?: string | number;
  changeValue?: string;
  timeText?: string;
  trend?: "up" | "down";
  chartData?: { value: number }[];
};

const defaultChartData = [
  { value: 40 },
  { value: 46 },
  { value: 44 },
  { value: 48 },
  { value: 52 },
  { value: 58 },
  { value: 64 },
];

const chartConfig: ChartConfig = {
  activation: {
    label: "Activation Rate",
    color: "var(--chart-2)",
  },
};

export const Stat4 = ({
  title = "User Activation",
  value = "64.2%",
  changeValue = "+4.8%",
  timeText = "vs last month",
  trend = "up",
  chartData = defaultChartData,
}: Stat4Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-medium">{title}</CardTitle>
        <CardAction>
          <UserCheckIcon className="size-5" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/20 rounded-md border py-0 ps-5 pe-2">
          <div className="grid grid-cols-2 items-center gap-4">
            <div>
              <div className="text-3xl font-semibold">{value}</div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <span
                  className={
                    trend === "up"
                      ? "font-medium text-green-500"
                      : "text-destructive font-medium"
                  }
                >
                  {changeValue}
                </span>
                <span className="text-muted-foreground">{timeText}</span>
              </div>
            </div>
            <div className="h-20 w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="fillActivation"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-activation)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-activation)"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="value"
                    type="monotone"
                    fill="url(#fillActivation)"
                    stroke="var(--color-activation)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

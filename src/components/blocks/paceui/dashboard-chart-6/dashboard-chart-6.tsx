"use client";
import { Maximize2Icon, MoreHorizontalIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";

type ChartData = {
  date: string;
  premium: number;
  basic: number;
};

const generateChartData = () => {
  const data: ChartData[] = [];
  const today = new Date("2026-10-07T12:00:00Z");
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const premium = Math.floor((((i * 37 + 11) % 97) / 97) * 10) + 15;
    const basic = Math.floor((((i * 37 + 11) % 97) / 97) * 20) + 30;
    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      premium,
      basic,
    });
  }
  return data;
};

const chartData = generateChartData();

const premiumTotal = 1420;
const basicTotal = 3840;
const trialTotal = 650;
const totalCustomers = premiumTotal + basicTotal + trialTotal;
const previousTotal = 5480;
const diff = totalCustomers - previousTotal;
const badgeText = diff >= 0 ? `+${diff}` : `${diff}`;

const maxVal = Math.max(...chartData.map((d) => d.premium + d.basic));

const chartConfig = {
  premium: {
    label: "Premium",
    color: "var(--chart-1)",
  },
  basic: {
    label: "Basic",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export const Chart6 = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">
            Customers Segment
          </CardTitle>
          <Badge variant="secondary" className="font-medium max-sm:hidden">
            {badgeText} new
          </Badge>
        </div>
        <CardAction className="flex items-center gap-1.5">
          <Button variant="outline" size="icon-sm">
            <MoreHorizontalIcon className="size-4" />
          </Button>
          <Button variant="outline" size="icon-sm">
            <Maximize2Icon className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="-mt-2 flex flex-col gap-4 ps-2 pe-4">
        <div className="flex flex-col gap-0.5 px-4">
          <div className="text-3xl font-semibold tracking-tight">
            {totalCustomers.toLocaleString()}
          </div>
          <div className="text-muted-foreground text-xs">
            {previousTotal.toLocaleString()} previous period
          </div>
        </div>
        <ChartContainer
          config={chartConfig}
          className="mt-4 aspect-auto h-40 w-full"
        >
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-muted/50"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value, idx) => {
                if (idx === 0) return value;
                if (idx === chartData.length - 1) return "Today";
                return "";
              }}
              className="text-muted-foreground text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, maxVal]}
              ticks={[0, maxVal]}
              className="text-muted-foreground text-xs"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="rounded-md shadow-none"
                />
              }
            />
            <Bar
              dataKey="premium"
              stackId="a"
              fill="var(--chart-1)"
              radius={[0, 0, 2, 2]}
              maxBarSize={8}
            />
            <Bar
              dataKey="basic"
              stackId="a"
              fill="var(--chart-2)"
              radius={[2, 2, 0, 0]}
              maxBarSize={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="grid w-full grid-cols-[1fr_auto_1fr_auto_1fr] items-center text-center">
          <div>
            <div className="text-lg font-semibold tracking-tight">
              {premiumTotal.toLocaleString()}
            </div>
            <div className="text-muted-foreground font-medium">Premium</div>
          </div>
          <Separator orientation="vertical" className="h-11" />
          <div>
            <div className="text-lg font-semibold tracking-tight">
              {basicTotal.toLocaleString()}
            </div>
            <div className="text-muted-foreground font-medium">Basic</div>
          </div>
          <Separator orientation="vertical" className="h-11" />
          <div>
            <div className="text-lg font-semibold tracking-tight">
              {trialTotal.toLocaleString()}
            </div>
            <div className="text-muted-foreground font-medium">Trial</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

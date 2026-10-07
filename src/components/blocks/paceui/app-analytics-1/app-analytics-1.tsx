"use client";
import {
  BookOpen,
  ChevronUp,
  Mail,
  MoreVertical,
  RefreshCw,
  Settings,
} from "lucide-react";
import { Bar, BarChart, Cell, XAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
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

const chartConfig = {
  normal: {
    label: "Subscribers",
    color: "var(--chart-2)",
  },
  highlighted: {
    label: "Peak Subscribers",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const chartData = [
  { day: "Mo", value: 120 },
  { day: "Tu", value: 150 },
  { day: "We", value: 135 },
  { day: "Th", value: 160 },
  { day: "Fr", value: 245 },
  { day: "Sa", value: 98 },
  { day: "Su", value: 110 },
];

const metrics = [
  {
    title: "Active Readers",
    subtitle: "Premium members",
    value: "2,840",
    badgeText: "14.2%",
    icon: BookOpen,
  },
  {
    title: "Newsletter Leads",
    subtitle: "Email campaigns",
    value: "918",
    badgeText: "32.1%",
    icon: Mail,
  },
];

export const Analytics1 = () => {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Audience Growth</CardTitle>
        <CardDescription>Weekly subscription trends</CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="cursor-pointer"
                >
                  <MoreVertical className="size-4" />
                </Button>
              }
            ></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="cursor-pointer gap-2 text-xs">
                <RefreshCw className="size-3.5" />
                <span>Refresh</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 text-xs">
                <Settings className="size-3.5" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/40 grid grid-cols-[1fr_auto] items-center gap-4 rounded-md border px-4 py-2.5">
          <div className="grid gap-0.5">
            <p className="text-3xl font-medium tracking-tight">3,758</p>
            <p className="text-muted-foreground text-xs">
              Total weekly active subscribers
            </p>
          </div>
          <Badge variant="outline">
            <ChevronUp className="size-3" />
            <span>+18.4%</span>
          </Badge>
        </div>
        <div className="grid gap-4">
          {metrics.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="grid grid-cols-[1fr_auto] items-center gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`bg-muted flex size-10 items-center justify-center rounded-md`}
                  >
                    <IconComponent className="size-5" />
                  </div>
                  <div className="grid gap-0.5">
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-muted-foreground text-xs">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.value}</span>
                  <Badge>
                    <ChevronUp className="size-3" />
                    <span>{item.badgeText}</span>
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
        <div className="h-36 w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-muted-foreground text-xs"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.day}
                    fill={
                      index === 4
                        ? "var(--color-highlighted)"
                        : "var(--color-normal)"
                    }
                    className="cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

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
} from "./bar-chart-intentui";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

const projectData = [
  { team: "Engineering", completed: 42, ongoing: 15 },
  { team: "Design", completed: 30, ongoing: 5 },
  { team: "Marketing", completed: 25, ongoing: 10 },
  { team: "Sales", completed: 20, ongoing: 8 },
  { team: "Support", completed: 35, ongoing: 12 },
  { team: "Engineering", completed: 42, ongoing: 15 },
  { team: "Design", completed: 30, ongoing: 5 },
  { team: "Marketing", completed: 25, ongoing: 10 },
  { team: "Sales", completed: 20, ongoing: 8 },
  { team: "Support", completed: 35, ongoing: 12 },
  { team: "Engineering", completed: 42, ongoing: 15 },
  { team: "Design", completed: 30, ongoing: 5 },
];

const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--chart-1)",
  },
  ongoing: {
    label: "Ongoing",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--bg)",
  },
} satisfies ChartConfig;

export default function Component() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Project Status</CardTitle>
        <CardDescription>Completed vs Ongoing Projects by Team</CardDescription>
      </CardHeader>
      <CardContent>
        <Chart config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={projectData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="team"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis dataKey="completed" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="completed" fill="var(--color-completed)" radius={4}>
              <LabelList
                dataKey="team"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="completed"
                position="right"
                offset={8}
                className="fill-fg"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </Chart>
      </CardContent>
    </Card>
  );
}

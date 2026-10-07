"use client";
import { Globe, MoreVertical, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Analytics3 = () => {
  const ranges = ["This Month", "Last Month", "This Quarter"];

  const metric = {
    title: "Revenue Overview",
    value: "54.8k",
    trend: "+14.6%",
    segments: [
      {
        name: "Paid Acquisition",
        percentage: "58.2%",
        count: "$31,893",
      },
      {
        name: "Organic Search",
        percentage: "41.8%",
        count: "$22,907",
      },
    ],
  };

  return (
    <Card className="gap-4">
      <CardHeader>
        <div>
          <CardTitle>{metric.title}</CardTitle>
          <div className="mt-1.5 flex items-center gap-2.5">
            <span className="text-3xl font-semibold">
              <span className="text-muted-foreground me-0.5 align-super text-xl font-medium">
                $
              </span>
              {metric.value}
            </span>
            <span className="text-sm font-medium text-green-500">
              {metric.trend}
            </span>
          </div>
        </div>
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
              {ranges.map((item) => (
                <DropdownMenuItem key={item} className="cursor-pointer text-sm">
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-md">
                <Target className="size-4" />
              </div>
              <span className="truncate text-sm font-medium">
                {metric.segments[0].name}
              </span>
            </div>
            <div className="grid gap-0.5">
              <span className="text-2xl font-medium">
                {metric.segments[0].percentage}
              </span>
              <span className="text-muted-foreground text-sm">
                {metric.segments[0].count}
              </span>
            </div>
          </div>

          <div className="relative flex h-full items-center justify-center sm:flex-col">
            <div className="bg-border max-sm:h-px max-sm:w-full sm:h-full sm:w-px" />
            <div className="bg-card text-muted-foreground absolute top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md border text-xs font-medium">
              VS
            </div>
          </div>

          <div className="grid justify-items-end gap-3 text-end">
            <div className="flex flex-row-reverse items-center gap-2">
              <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-md">
                <Globe className="size-4" />
              </div>
              <span className="truncate text-sm font-medium">
                {metric.segments[1].name}
              </span>
            </div>
            <div className="grid gap-0.5">
              <span className="text-2xl font-medium">
                {metric.segments[1].percentage}
              </span>
              <span className="text-muted-foreground text-sm">
                {metric.segments[1].count}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-muted flex h-2 w-full overflow-hidden rounded-md">
          <div
            className="h-full transition-all"
            style={{ width: "58.2%", backgroundColor: "var(--chart-1)" }}
          />
          <div
            className="h-full transition-all"
            style={{ width: "41.8%", backgroundColor: "var(--chart-2)" }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

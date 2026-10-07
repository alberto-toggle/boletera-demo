"use client";
import { MoreVertical, RefreshCw, Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";

export const Analytics2 = () => {
  const metrics = [
    {
      title: "User Retention",
      subtitle: "1.2k new cohorts",
      value: 78,
      badgeText: "+8.2%",
      percentageText: "78%",
      progressClass: "[&_[data-slot=progress-indicator]]:bg-chart-1",
    },
    {
      title: "Goal Completions",
      subtitle: "3.2k completed goals",
      value: 62,
      badgeText: "+15k",
      percentageText: "62%",
      progressClass: "[&_[data-slot=progress-indicator]]:bg-chart-2",
    },
  ];

  return (
    <Card className="gap-3">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Statistics</CardTitle>
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
        {metrics.map((item, idx) => (
          <div key={idx} className="flex w-full items-end gap-4">
            <div className="grow space-y-1.5">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-muted-foreground text-xs">{item.subtitle}</p>
              </div>
              <Progress value={item.value} className={item.progressClass} />
            </div>
            <div className="flex h-full flex-col items-end justify-end gap-1.5">
              <Badge variant="secondary">{item.badgeText}</Badge>
              <span className="text-muted-foreground text-xs font-medium">
                {item.percentageText}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

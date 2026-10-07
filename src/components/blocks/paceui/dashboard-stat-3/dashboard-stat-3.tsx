"use client";
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  type LucideIcon,
  UsersIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type Stat3Props = {
  title: string;
  value: string | number;
  growthValue: number;
  timeText: string;
  icon?: LucideIcon;
  goalProgress?: number;
};

export const Stat3 = ({
  title,
  value,
  growthValue,
  timeText,
  icon: Icon = UsersIcon,
  goalProgress = 82,
}: Stat3Props) => {
  const isPositive = growthValue > 0;
  const TrendIcon = isPositive ? ArrowUpRightIcon : ArrowDownRightIcon;
  const trendColor = isPositive ? "text-green-500" : "text-destructive";

  return (
    <Card>
      <CardHeader className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <CardDescription className="font-medium">{title}</CardDescription>
          <CardTitle className="text-2xl leading-none font-semibold">
            {value}
          </CardTitle>
        </div>
        <div className="bg-muted flex size-10 items-center justify-center rounded-md">
          <Icon className="size-5" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <span className={cn("flex items-center gap-0.5", trendColor)}>
            <TrendIcon className="size-4" />
            {isPositive ? "+" : ""}
            {growthValue}%
          </span>
          <span className="text-muted-foreground">{timeText}</span>
        </div>
        {goalProgress !== undefined && (
          <div className="grid gap-1.5 pt-2">
            <div className="flex items-center justify-between text-sm">
              <p>Goal</p>
              <span className="font-medium">{goalProgress}%</span>
            </div>
            <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

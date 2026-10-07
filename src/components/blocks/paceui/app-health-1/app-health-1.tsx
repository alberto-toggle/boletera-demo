"use client";
import { Check, Flame, MoreHorizontal, X } from "lucide-react";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DayStreak {
  id: string;
  label: string;
  status: "active" | "completed" | "uncompleted";
}

const streakDays: DayStreak[] = [
  { id: "1", label: "01", status: "active" },
  { id: "2", label: "02", status: "active" },
  { id: "3", label: "03", status: "active" },
  { id: "4", label: "04", status: "active" },
  { id: "5", label: "05", status: "active" },
  { id: "6", label: "06", status: "completed" },
  { id: "7", label: "07", status: "completed" },
  { id: "8", label: "08", status: "uncompleted" },
  { id: "9", label: "09", status: "uncompleted" },
  { id: "10", label: "10", status: "uncompleted" },
];

const getStatusIcon = (status: DayStreak["status"]) => {
  switch (status) {
    case "active":
      return <Flame className="size-3.5" />;
    case "completed":
      return <Check className="size-3.5" />;
    case "uncompleted":
      return <X className="size-3.5" />;
  }
};

export const Health1 = () => {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Weekly Streak</CardTitle>
        <CardDescription>Learning Habit Tracker</CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-xs">
                  <MoreHorizontal className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <span>Reset Streak</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Share Progress</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">7 Days</p>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Longest Streak</span>
          <span className="text-sm font-medium">10 days</span>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {streakDays.map((day) => (
            <div
              key={day.id}
              className={`flex flex-col items-center justify-center gap-1 rounded-md border px-2 py-3 ${
                day.status === "active"
                  ? "bg-muted"
                  : day.status === "completed"
                    ? ""
                    : "border-dashed"
              }`}
            >
              <span className="text-sm font-medium">{day.label}</span>
              <div
                className={`flex size-5 items-center justify-center rounded-md ${
                  day.status === "active"
                    ? "border"
                    : day.status === "completed"
                      ? "bg-background text-muted-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {getStatusIcon(day.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

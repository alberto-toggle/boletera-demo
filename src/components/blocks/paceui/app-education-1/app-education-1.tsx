"use client";
import { useState } from "react";

import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Lock,
  Play,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ModuleTask {
  id: string;
  number: number;
  title: string;
  description: string;
  tasksCount: number;
  status: "completed" | "current" | "upcoming";
  isLocked: boolean;
}

const modules: ModuleTask[] = [
  {
    id: "module-1",
    number: 1,
    title: "Monorepos and Package Managers",
    description:
      "Understand workspaces, dependency caching, and setting up clean multi-package architectures.",
    tasksCount: 8,
    status: "completed",
    isLocked: false,
  },
  {
    id: "module-2",
    number: 2,
    title: "Vite and Modern Build Tooling",
    description:
      "Optimize build times, configure hot module replacement, and manage custom asset loaders.",
    tasksCount: 3,
    status: "completed",
    isLocked: false,
  },
  {
    id: "module-3",
    number: 3,
    title: "Advanced React Concepts",
    description:
      "Deep dive into concurrent rendering, transition hooks, server actions, and portal management.",
    tasksCount: 6,
    status: "current",
    isLocked: false,
  },
  {
    id: "module-4",
    number: 4,
    title: "State Management and Querying",
    description:
      "Implement high-performance global stores with Zustand and sync server state with React Query.",
    tasksCount: 2,
    status: "upcoming",
    isLocked: false,
  },
  {
    id: "module-5",
    number: 5,
    title: "CI/CD and Automated Testing",
    description:
      "Set up unit tests, component integration suites, and deploy pipeline testing protocols.",
    tasksCount: 4,
    status: "upcoming",
    isLocked: true,
  },
];

export const Education1 = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleTask = (id: string, isLocked: boolean) => {
    if (isLocked) return;
    setExpandedTaskId(expandedTaskId === id ? null : id);
  };

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">3/5</Badge>
            <h3 className="text-base leading-none font-medium">
              Advanced Frontend Architecture
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={toggleCollapse}
            className="cursor-pointer"
            aria-label="Toggle details"
          >
            {isCollapsed ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronUp className="size-4" />
            )}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Master modern build configurations, scalable monorepo architectures,
          high-performance state layers, and automated release strategies.
        </p>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-semibold">60% done</span>
              <span className="text-muted-foreground">2 weeks left</span>
            </div>
            <Progress value={60} className="w-full" />
          </div>
          <Button className="cursor-pointer" size="sm">
            Continue Learning
          </Button>
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="pt-0">
          <div className="flex flex-col gap-3">
            {modules.map((module) => {
              const isExpanded = expandedTaskId === module.id;
              const isActive = module.status === "current";
              return (
                <div
                  key={module.id}
                  className={cn(
                    "bg-card flex flex-col rounded-md border transition-all",
                    isActive && "border-primary",
                    module.isLocked ? "opacity-60" : "cursor-pointer",
                  )}
                  onClick={() => toggleTask(module.id, module.isLocked)}
                >
                  <div className="flex items-center justify-between gap-2 p-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-7 items-center justify-center rounded-md text-sm font-semibold transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {module.number}
                      </span>
                      <p className="line-clamp-1 font-medium max-sm:text-sm">
                        {module.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {module.status === "completed" && (
                        <CheckCircle2 className="size-5 shrink-0 text-green-500" />
                      )}
                      {module.status === "current" && (
                        <Play className="text-primary size-4 shrink-0" />
                      )}
                      {module.status === "upcoming" && !module.isLocked && (
                        <Circle className="text-muted-foreground size-5 shrink-0" />
                      )}
                      {module.isLocked && (
                        <Lock className="text-muted-foreground size-4 shrink-0" />
                      )}
                      <span className="text-muted-foreground text-sm font-medium whitespace-nowrap">
                        {module.tasksCount} tasks
                      </span>
                      {!module.isLocked && (
                        <ChevronDown
                          className={cn(
                            "text-muted-foreground size-4 shrink-0 transition-transform",
                            isExpanded && "rotate-180",
                          )}
                        />
                      )}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="text-muted-foreground border-t px-3 py-2 text-sm">
                      {module.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

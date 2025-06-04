import { ProjectAnalytics } from "@/features/projects/types";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AnalyticsCard } from "@/components/analytics-card";
import { DottedSeparator } from "@/components/dotted-separator";

export function Analytics({ analytics }: { analytics: ProjectAnalytics }) {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard title="Total tasks" value={analytics.taskCount} increaseValue={analytics.taskDifference} variant={analytics.taskDifference > 0 ? "UP" : "DOWN"} />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard title="Assigned tasks" value={analytics.assignedTaskCount} increaseValue={analytics.assignedTaskDifference} variant={analytics.assignedTaskDifference > 0 ? "UP" : "DOWN"} />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard title="Completed tasks" value={analytics.completedTaskCount} increaseValue={analytics.completedTaskDifference} variant={analytics.completedTaskDifference > 0 ? "UP" : "DOWN"} />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard title="Overdue tasks" value={analytics.overdueTaskCount} increaseValue={analytics.overdueTaskDifference} variant={analytics.overdueTaskDifference > 0 ? "UP" : "DOWN"} />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard title="Incomplete tasks" value={analytics.incompleteTaskCount} increaseValue={analytics.incompleteTaskDifference} variant={analytics.incompleteTaskDifference > 0 ? "UP" : "DOWN"} />
          <DottedSeparator direction="vertical" />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

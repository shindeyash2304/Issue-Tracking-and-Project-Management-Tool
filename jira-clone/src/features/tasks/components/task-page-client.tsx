"use client";

import { useTask } from "@/lib/tanstack-query/queries/use-task";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import TaskBreadcrumbs from "@/features/tasks/components/task-breadcrumbs";
import { DottedSeparator } from "@/components/dotted-separator";
import { TaskOverview } from "@/features/tasks/components/task-overview";
import { TaskDescription } from "@/features/tasks/components/task-description";

export function TaskPageClient({ taskId }: { taskId: string }) {
  const { data: task, isPending, isError, error } = useTask(taskId);

  if (isPending) {
    return <PageLoader />;
  }

  if (isError) {
    return <PageError message={error.message} />;
  }

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs task={task} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={task} />
        <TaskDescription task={task} />
      </div>
    </div>
  );
}
